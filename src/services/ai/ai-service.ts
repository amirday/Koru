/**
 * AI service singleton
 *
 * NOTE: AI generation now goes through the Python backend.
 * This service is kept for backward compatibility and mock provider support.
 * Use generateRitual from '@/services/api' for direct backend calls.
 */

import { MockAIProvider } from './MockAIProvider'
import type { AIProvider } from '@/types'

/**
 * Create AI provider
 * Always uses mock since real AI is handled by backend
 */
function createAIProvider(): AIProvider {
  console.log('[AI Service] Using Mock provider (real AI goes through backend)')
  return new MockAIProvider()
}

/**
 * Global AI provider instance
 * @deprecated Use backend API directly via '@/services/api' for real AI generation
 */
export const aiService: AIProvider = createAIProvider()
