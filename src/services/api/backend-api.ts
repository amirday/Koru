/**
 * Backend API Service
 * All external API calls (AI, TTS, storage) go through the Python backend
 */

import type { Ritual, Voice, RitualTone } from '@/types'

// Backend API base URL - configure via environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

/**
 * API error class with structured error info
 */
export class BackendAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: string
  ) {
    super(message)
    this.name = 'BackendAPIError'
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new BackendAPIError(
      errorData.detail || `API request failed: ${response.statusText}`,
      response.status,
      errorData.detail
    )
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// ============================================
// Ritual Generation API
// ============================================

export interface GenerateRitualRequest {
  intention: string
  durationMinutes: number
  focusAreas?: string[]
  tone?: RitualTone
  includeSilence?: boolean
}

export interface GenerateRitualResponse {
  ritual: Ritual
}

/**
 * Generate a new ritual using AI
 */
export async function generateRitual(
  request: GenerateRitualRequest
): Promise<Ritual> {
  const response = await apiFetch<GenerateRitualResponse>(
    '/api/generate/ritual',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
  return response.ritual
}

// ============================================
// Rituals CRUD API
// ============================================

/**
 * Get all rituals
 */
export async function getRituals(): Promise<Ritual[]> {
  return apiFetch<Ritual[]>('/api/rituals')
}

/**
 * Get a single ritual by ID
 */
export async function getRitual(id: string): Promise<Ritual> {
  return apiFetch<Ritual>(`/api/rituals/${id}`)
}

/**
 * Create a new ritual
 */
export async function createRitual(ritual: Ritual): Promise<Ritual> {
  return apiFetch<Ritual>('/api/rituals', {
    method: 'POST',
    body: JSON.stringify(ritual),
  })
}

/**
 * Delete a ritual
 */
export async function deleteRitual(id: string): Promise<void> {
  await apiFetch<void>(`/api/rituals/${id}`, {
    method: 'DELETE',
  })
}

// ============================================
// TTS API
// ============================================

export interface SynthesizeRequest {
  text: string
  voiceId: string
  provider?: 'elevenlabs' | 'google'
  ritualId?: string
  segmentId?: string
  speed?: number
}

export interface SynthesizeResponse {
  audioUrl: string
  durationSeconds: number
}

/**
 * Synthesize text to speech
 * Returns a URL to the generated audio file on the backend
 */
export async function synthesizeSpeech(
  request: SynthesizeRequest
): Promise<SynthesizeResponse> {
  return apiFetch<SynthesizeResponse>('/api/tts/synthesize', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Get all available voices from the backend
 */
export async function getVoices(): Promise<Voice[]> {
  return apiFetch<Voice[]>('/api/tts/voices')
}

/**
 * Get audio file URL (constructs full URL for audio playback)
 */
export function getAudioUrl(path: string): string {
  // If already absolute URL, return as-is
  if (path.startsWith('http')) {
    return path
  }
  // Otherwise, prepend backend URL
  return `${API_BASE_URL}${path}`
}

// ============================================
// Health Check
// ============================================

export interface HealthStatus {
  status: string
  timestamp: string
}

/**
 * Check if backend is healthy
 */
export async function checkHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>('/health')
}

/**
 * Check if backend is available
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await checkHealth()
    return true
  } catch {
    return false
  }
}
