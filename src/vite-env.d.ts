/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * Extends ImportMetaEnv with custom VITE_* variables
 */

interface ImportMetaEnv {
  /** Backend API URL (Python FastAPI server) */
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
