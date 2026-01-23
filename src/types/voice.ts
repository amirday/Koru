/**
 * Voice types for TTS integration
 * Defines voice metadata and user preferences
 */

/**
 * TTS provider types
 */
export type TTSProviderType = 'mock' | 'google' | 'elevenlabs'

/**
 * Voice metadata for TTS provider
 */
export interface Voice {
  /** Provider-specific voice ID */
  id: string
  /** Display name (e.g., "Sarah") */
  name: string
  /** Which TTS provider this voice belongs to */
  provider: TTSProviderType
  /** Short description */
  description: string
  /** Tags like ['calm', 'female', 'american'] */
  labels: string[]
  /** Local path to bundled sample audio */
  previewUrl: string
  /** What the preview audio says */
  previewText: string
}

/**
 * Voice manifest structure (loaded from /src/data/voices.json)
 */
export interface VoiceManifest {
  /** Available voices */
  voices: Voice[]
  /** Default voice ID to use if none selected */
  defaultVoiceId: string
  /** When the manifest was generated */
  generatedAt: string
}

/**
 * User's voice preferences
 */
export interface UserVoicePreferences {
  /** Currently selected voice ID */
  selectedVoiceId: string
  // Future: per-tone voice selection
  // gentleVoiceId?: string
  // neutralVoiceId?: string
  // coachVoiceId?: string
}

/**
 * TTS synthesis options
 */
export interface TTSOptions {
  /** Text to synthesize */
  text: string
  /** Voice ID to use (optional, uses default if not provided) */
  voiceId?: string
  /** Speech speed multiplier (optional, default 1.0) */
  speed?: number
}

/**
 * TTS synthesis result
 */
export interface TTSResult {
  /** Generated audio blob */
  audioBlob: Blob
  /** Actual duration of generated audio in seconds */
  durationSeconds: number
}

/**
 * TTS provider interface
 */
export interface TTSProvider {
  /** Synthesize text to speech */
  synthesize(options: TTSOptions): Promise<TTSResult>
  /** Get available voices */
  getVoices(): Promise<Voice[]>
  /** Get preview audio URL for a voice */
  getVoicePreview(voiceId: string): Promise<string>
  /** Check if provider is available */
  isAvailable(): Promise<boolean>
}
