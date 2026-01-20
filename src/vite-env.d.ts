/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * Extends ImportMetaEnv with custom VITE_* variables
 */

interface ImportMetaEnv {
  /** OpenAI API key for ritual generation */
  readonly VITE_OPENAI_API_KEY: string
  /** Set to 'true' to use OpenAI provider, otherwise uses mock */
  readonly VITE_USE_OPENAI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
