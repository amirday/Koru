/**
 * TypeScript types for OpenAI API integration
 * Used for ritual generation via OpenAI's Chat Completions API
 */

// ====================
// OpenAI API Types
// ====================

/**
 * OpenAI Chat Completion message format
 */
export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * OpenAI Chat Completion request body
 */
export interface OpenAIChatCompletionRequest {
  model: string
  messages: OpenAIChatMessage[]
  temperature?: number
  max_tokens?: number
  response_format?: { type: 'json_object' }
}

/**
 * OpenAI Chat Completion response
 */
export interface OpenAIChatCompletionResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: 'stop' | 'length' | 'content_filter' | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ====================
// Expected Response Format
// ====================

/**
 * Raw section structure from OpenAI response
 * Before transformation to RitualSection
 */
export interface OpenAIRitualSectionResponse {
  type: 'intro' | 'body' | 'silence' | 'transition' | 'closing'
  durationSeconds: number
  guidanceText: string
}

/**
 * Expected JSON structure from OpenAI ritual generation
 */
export interface OpenAIRitualResponse {
  title: string
  sections: OpenAIRitualSectionResponse[]
  tags: string[]
}

// ====================
// Error Types
// ====================

/**
 * OpenAI API error response
 */
export interface OpenAIErrorResponse {
  error: {
    message: string
    type: string
    param?: string
    code?: string
  }
}

/**
 * Custom error types for better error handling
 */
export type OpenAIErrorType =
  | 'invalid_api_key'
  | 'rate_limit'
  | 'service_unavailable'
  | 'parse_error'
  | 'network_error'
  | 'unknown'

/**
 * Structured error for UI consumption
 */
export interface OpenAIServiceError {
  type: OpenAIErrorType
  message: string
  retryable: boolean
  retryAfterMs?: number
}

// ====================
// Configuration
// ====================

/**
 * OpenAI provider configuration
 */
export interface OpenAIConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

/**
 * Default configuration values
 */
export const OPENAI_DEFAULTS: Omit<OpenAIConfig, 'apiKey'> = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
} as const
