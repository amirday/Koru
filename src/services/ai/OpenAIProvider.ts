/**
 * OpenAI Provider for ritual generation
 * Implements AIProvider interface using OpenAI's Chat Completions API
 *
 * ⚠️ SECURITY WARNING: API key is exposed in client bundle
 * This is acceptable for development only. Production should use a backend proxy.
 */

import type {
  AIProvider,
  AIGenerationOptions,
  AIGenerationProgress,
  AIClarifyingQuestion,
  Ritual,
  RitualTone,
} from '@/types'
import { GENERATION_STAGES } from '@/types'
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
  OpenAIErrorResponse,
  OpenAIServiceError,
} from '@/types/openai'
import { OPENAI_DEFAULTS } from '@/types/openai'
import { SYSTEM_PROMPT, buildUserPrompt, CLARIFYING_QUESTION_PROMPT, buildClarifyingCheckPrompt } from './prompts'
import { parseRitualResponse, transformToRitual, parseClarifyingResponse } from './parsers'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private model: string
  private temperature: number
  private maxTokens: number

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      console.warn('OpenAI API key not found. Set VITE_OPENAI_API_KEY in .env')
    }
    this.apiKey = apiKey || ''
    this.model = OPENAI_DEFAULTS.model
    this.temperature = OPENAI_DEFAULTS.temperature
    this.maxTokens = OPENAI_DEFAULTS.maxTokens
  }

  /**
   * Generate a ritual using OpenAI
   */
  async generateRitual(
    options: AIGenerationOptions,
    onProgress: (progress: AIGenerationProgress) => void
  ): Promise<Ritual> {
    // Stage 1: Clarifying
    this.reportProgress(onProgress, 'clarifying')

    // Stage 2: Structuring
    await this.delay(300) // Brief delay for UI feedback
    this.reportProgress(onProgress, 'structuring')

    // Stage 3: Writing - make the API call
    await this.delay(200)
    this.reportProgress(onProgress, 'writing')

    try {
      const response = await this.callOpenAI(options)
      const parsed = parseRitualResponse(response)
      const ritual = transformToRitual(parsed, options)

      // Stage 4: Complete
      this.reportProgress(onProgress, 'complete')

      return ritual
    } catch (error) {
      // Re-throw with user-friendly message
      const serviceError = this.parseError(error)
      throw new Error(serviceError.message)
    }
  }

  /**
   * Ask clarifying question (optional)
   * Returns null most of the time, occasionally asks for context
   */
  async askClarifyingQuestion(context: {
    instructions: string
    tone?: RitualTone
  }): Promise<AIClarifyingQuestion | null> {
    // Skip clarification for short/common intentions
    if (context.instructions.length < 15) {
      return null
    }

    try {
      const response = await this.callOpenAIRaw({
        model: this.model,
        messages: [
          { role: 'system', content: CLARIFYING_QUESTION_PROMPT },
          { role: 'user', content: buildClarifyingCheckPrompt(context) },
        ],
        temperature: 0.3, // Lower temp for consistent decisions
        max_tokens: 200,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content || ''
      const parsed = parseClarifyingResponse(content)

      if (parsed.needsClarification && parsed.questionText && parsed.options) {
        return {
          questionText: parsed.questionText,
          options: parsed.options,
          allowCustomInput: true,
        }
      }
    } catch (error) {
      // Log but don't fail - clarification is optional
      console.warn('Clarifying question check failed:', error)
    }

    return null
  }

  /**
   * Make the OpenAI API call for ritual generation
   */
  private async callOpenAI(options: AIGenerationOptions): Promise<string> {
    const userPrompt = buildUserPrompt({
      instructions: options.instructions,
      duration: options.duration,
      tone: options.tone,
      includeSilence: options.includeSilence,
      soundscape: options.soundscape,
      additionalPreferences: options.additionalPreferences,
    })

    const response = await this.callOpenAIRaw({
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Empty response from OpenAI')
    }

    return content
  }

  /**
   * Raw OpenAI API call with error handling
   */
  private async callOpenAIRaw(
    request: OpenAIChatCompletionRequest
  ): Promise<OpenAIChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({})) as OpenAIErrorResponse
      throw { status: response.status, body: errorBody }
    }

    return response.json() as Promise<OpenAIChatCompletionResponse>
  }

  /**
   * Parse API errors into user-friendly messages
   */
  private parseError(error: unknown): OpenAIServiceError {
    // Network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        type: 'network_error',
        message: 'Unable to connect. Please check your internet connection.',
        retryable: true,
      }
    }

    // API error with status code
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const apiError = error as { status: number; body?: OpenAIErrorResponse }
      const errorMessage = apiError.body?.error?.message || 'Unknown error'

      switch (apiError.status) {
        case 401:
          return {
            type: 'invalid_api_key',
            message: 'Invalid API key. Please check your OpenAI configuration.',
            retryable: false,
          }
        case 429:
          return {
            type: 'rate_limit',
            message: 'Rate limited. Please wait a moment and try again.',
            retryable: true,
            retryAfterMs: 5000,
          }
        case 500:
        case 502:
        case 503:
          return {
            type: 'service_unavailable',
            message: 'OpenAI service temporarily unavailable. Please try again.',
            retryable: true,
          }
        default:
          return {
            type: 'unknown',
            message: `API error: ${errorMessage}`,
            retryable: true,
          }
      }
    }

    // Parse error from our code
    if (error instanceof Error) {
      if (error.message.includes('Invalid JSON') || error.message.includes('missing required')) {
        return {
          type: 'parse_error',
          message: 'Failed to parse AI response. Please try again.',
          retryable: true,
        }
      }
      return {
        type: 'unknown',
        message: error.message,
        retryable: true,
      }
    }

    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
    }
  }

  /**
   * Report progress using generation stage config
   */
  private reportProgress(
    onProgress: (progress: AIGenerationProgress) => void,
    stage: AIGenerationProgress['stage']
  ): void {
    const stageConfig = GENERATION_STAGES.find((s) => s.stage === stage)
    if (stageConfig) {
      onProgress({
        stage: stageConfig.stage,
        progress: stageConfig.progress,
        message: stageConfig.message,
      })
    }
  }

  /**
   * Simple delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
