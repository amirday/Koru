/**
 * AI service singleton
 * Provides app-wide access to AI provider
 */

import { MockAIProvider } from './MockAIProvider'
import type { AIProvider } from '@/types'

/**
 * Global AI provider instance
 * Can be swapped to Claude API or OpenAI later
 */
export const aiService: AIProvider = new MockAIProvider()
