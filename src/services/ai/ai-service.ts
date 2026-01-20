/**
 * AI service singleton
 * Provides app-wide access to AI provider
 *
 * Provider selection:
 * - Set VITE_USE_OPENAI=true in .env to use OpenAI
 * - Set VITE_USE_OPENAI=false (or omit) to use mock provider
 */

import { MockAIProvider } from './MockAIProvider'
import { OpenAIProvider } from './OpenAIProvider'
import type { AIProvider } from '@/types'

/**
 * Determine which AI provider to use based on environment
 */
function createAIProvider(): AIProvider {
  const useOpenAI = import.meta.env.VITE_USE_OPENAI === 'true'

  if (useOpenAI) {
    console.log('[AI Service] Using OpenAI provider')
    return new OpenAIProvider()
  }

  console.log('[AI Service] Using Mock provider')
  return new MockAIProvider()
}

/**
 * Global AI provider instance
 * Configured via VITE_USE_OPENAI environment variable
 */
export const aiService: AIProvider = createAIProvider()
