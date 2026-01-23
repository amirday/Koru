/**
 * AudioSequencer - Segment-based audio playback controller
 * Plays audio segments in sequence without stitching, enabling:
 * - Better memory efficiency (smaller per-segment blobs)
 * - Precise seeking to segment boundaries
 * - Easy background audio layering (future)
 * - Granular caching
 */

/**
 * Individual audio segment for sequenced playback
 */
export interface SegmentAudio {
  /** Unique segment identifier */
  segmentId: string
  /** Segment type: speech plays audio, silence waits */
  type: 'speech' | 'silence'
  /** Audio blob (only for speech segments) */
  audioBlob?: Blob
  /** Object URL for playback (created from blob) */
  audioUrl?: string
  /** Duration in milliseconds */
  durationMs: number
}

/**
 * Sequencer playback state
 */
export interface SequencerState {
  /** Current playback status */
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'completed'
  /** Index of the current segment being played */
  currentSegmentIndex: number
  /** Progress within current segment (0-1) */
  segmentProgress: number
  /** Overall progress across all segments (0-1) */
  totalProgress: number
  /** Elapsed time in milliseconds */
  elapsedMs: number
  /** Total duration of all segments in milliseconds */
  totalDurationMs: number
  /** Current segment being played */
  currentSegment: SegmentAudio | null
}

/**
 * Callback for state changes
 */
export type StateChangeCallback = (state: SequencerState) => void

/**
 * AudioSequencer - Plays segments in sequence
 */
export class AudioSequencer {
  private segments: SegmentAudio[] = []
  private currentIndex = 0
  private status: SequencerState['status'] = 'idle'
  private audioElement: HTMLAudioElement | null = null
  private silenceTimer: number | null = null
  private progressTimer: number | null = null
  private segmentStartTime = 0
  private pausedAt = 0
  private callbacks: Set<StateChangeCallback> = new Set()
  private objectUrls: string[] = []

  /**
   * Load segments for playback
   * Creates Object URLs for audio blobs
   */
  load(segments: SegmentAudio[]): void {
    // Stop current playback without clearing callbacks
    this.stop()

    // Revoke previous object URLs
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url)
    }
    this.objectUrls = []

    // Map segments and create object URLs for speech segments
    this.segments = segments.map((segment) => {
      if (segment.type === 'speech' && segment.audioBlob && !segment.audioUrl) {
        const url = URL.createObjectURL(segment.audioBlob)
        this.objectUrls.push(url)
        return { ...segment, audioUrl: url }
      }
      return segment
    })

    this.currentIndex = 0
    this.status = 'idle'
    this.pausedAt = 0
    this.emitState()
  }

  /**
   * Start or resume playback
   */
  play(): void {
    if (this.segments.length === 0) return

    if (this.status === 'paused') {
      this.resume()
      return
    }

    if (this.status === 'completed') {
      // Restart from beginning
      this.currentIndex = 0
      this.pausedAt = 0
    }

    this.status = 'playing'
    this.playCurrentSegment()
    this.startProgressTimer()
    this.emitState()
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.status !== 'playing') return

    this.status = 'paused'

    // Pause audio if playing
    if (this.audioElement) {
      this.pausedAt = this.audioElement.currentTime * 1000
      this.audioElement.pause()
    }

    // Clear silence timer if waiting
    if (this.silenceTimer !== null) {
      clearTimeout(this.silenceTimer)
      const segment = this.segments[this.currentIndex]
      if (segment) {
        const elapsed = performance.now() - this.segmentStartTime
        this.pausedAt = elapsed
      }
      this.silenceTimer = null
    }

    this.stopProgressTimer()
    this.emitState()
  }

  /**
   * Resume from paused state
   */
  private resume(): void {
    if (this.status !== 'paused') return

    this.status = 'playing'
    const segment = this.segments[this.currentIndex]

    if (segment?.type === 'speech' && this.audioElement) {
      // Resume audio playback
      this.audioElement.play().catch(console.error)
    } else if (segment?.type === 'silence') {
      // Resume silence timer with remaining duration
      const remainingMs = segment.durationMs - this.pausedAt
      this.segmentStartTime = performance.now() - this.pausedAt
      this.silenceTimer = window.setTimeout(() => {
        this.onSegmentComplete()
      }, remainingMs)
    }

    this.startProgressTimer()
    this.emitState()
  }

  /**
   * Stop playback completely
   */
  stop(): void {
    this.status = 'idle'
    this.currentIndex = 0
    this.pausedAt = 0

    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }

    if (this.silenceTimer !== null) {
      clearTimeout(this.silenceTimer)
      this.silenceTimer = null
    }

    this.stopProgressTimer()
    this.emitState()
  }

  /**
   * Seek to a specific segment by index
   */
  seekToSegment(index: number): void {
    if (index < 0 || index >= this.segments.length) return

    const wasPlaying = this.status === 'playing'

    // Stop current playback
    if (this.audioElement) {
      this.audioElement.pause()
    }
    if (this.silenceTimer !== null) {
      clearTimeout(this.silenceTimer)
      this.silenceTimer = null
    }

    this.currentIndex = index
    this.pausedAt = 0

    if (wasPlaying) {
      this.playCurrentSegment()
    }

    this.emitState()
  }

  /**
   * Seek to a specific time in milliseconds
   */
  seekToTime(targetMs: number): void {
    let accumulatedMs = 0

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i]
      if (!segment) continue

      if (accumulatedMs + segment.durationMs > targetMs) {
        // Found the segment containing this time
        const offsetWithinSegment = targetMs - accumulatedMs
        this.seekToSegmentWithOffset(i, offsetWithinSegment)
        return
      }

      accumulatedMs += segment.durationMs
    }

    // Target time is beyond total duration - seek to end
    if (this.segments.length > 0) {
      this.seekToSegment(this.segments.length - 1)
    }
  }

  /**
   * Get current state
   */
  getState(): SequencerState {
    const segment = this.segments[this.currentIndex] ?? null
    const totalDurationMs = this.getTotalDuration()
    const elapsedMs = this.getElapsedMs()

    let segmentProgress = 0
    if (segment) {
      if (this.status === 'playing' || this.status === 'paused') {
        if (segment.type === 'speech' && this.audioElement) {
          segmentProgress = this.audioElement.currentTime / (segment.durationMs / 1000)
        } else if (segment.type === 'silence') {
          const elapsed =
            this.status === 'paused'
              ? this.pausedAt
              : performance.now() - this.segmentStartTime
          segmentProgress = elapsed / segment.durationMs
        }
      }
    }

    return {
      status: this.status,
      currentSegmentIndex: this.currentIndex,
      segmentProgress: Math.min(1, Math.max(0, segmentProgress)),
      totalProgress: totalDurationMs > 0 ? elapsedMs / totalDurationMs : 0,
      elapsedMs,
      totalDurationMs,
      currentSegment: segment,
    }
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: StateChangeCallback): () => void {
    this.callbacks.add(callback)
    return () => {
      this.callbacks.delete(callback)
    }
  }

  /**
   * Clean up resources (revoke Object URLs)
   */
  dispose(): void {
    this.stop()

    // Revoke all object URLs
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url)
    }
    this.objectUrls = []

    // Clean up audio element
    if (this.audioElement) {
      this.audioElement.src = ''
      this.audioElement = null
    }

    this.segments = []
    this.callbacks.clear()
  }

  /**
   * Get total duration of all segments
   */
  getTotalDuration(): number {
    return this.segments.reduce((sum, s) => sum + s.durationMs, 0)
  }

  /**
   * Get total elapsed time in milliseconds
   */
  private getElapsedMs(): number {
    let elapsed = 0

    // Add up completed segments
    for (let i = 0; i < this.currentIndex; i++) {
      const segment = this.segments[i]
      if (segment) {
        elapsed += segment.durationMs
      }
    }

    // Add current segment progress
    const currentSegment = this.segments[this.currentIndex]
    if (currentSegment && (this.status === 'playing' || this.status === 'paused')) {
      if (currentSegment.type === 'speech' && this.audioElement) {
        elapsed += this.audioElement.currentTime * 1000
      } else if (currentSegment.type === 'silence') {
        if (this.status === 'paused') {
          elapsed += this.pausedAt
        } else {
          elapsed += performance.now() - this.segmentStartTime
        }
      }
    }

    return elapsed
  }

  /**
   * Play the current segment
   */
  private playCurrentSegment(): void {
    const segment = this.segments[this.currentIndex]
    if (!segment) {
      this.onAllSegmentsComplete()
      return
    }

    this.segmentStartTime = performance.now()

    if (segment.type === 'speech' && segment.audioUrl) {
      this.playSpeechSegment(segment)
    } else if (segment.type === 'silence') {
      this.playSilenceSegment(segment)
    } else {
      // Unknown segment type, skip to next
      this.onSegmentComplete()
    }
  }

  /**
   * Play a speech segment using HTMLAudioElement
   */
  private playSpeechSegment(segment: SegmentAudio): void {
    if (!segment.audioUrl) {
      this.onSegmentComplete()
      return
    }

    // Create or reuse audio element
    if (!this.audioElement) {
      this.audioElement = new Audio()
    }

    this.audioElement.src = segment.audioUrl
    this.audioElement.currentTime = this.pausedAt / 1000

    this.audioElement.onended = () => {
      this.onSegmentComplete()
    }

    this.audioElement.onerror = () => {
      console.error('Audio playback error for segment:', segment.segmentId)
      this.onSegmentComplete()
    }

    this.audioElement.play().catch((err) => {
      console.error('Failed to play audio:', err)
      this.onSegmentComplete()
    })

    this.pausedAt = 0
  }

  /**
   * Handle silence segment (wait without audio)
   */
  private playSilenceSegment(segment: SegmentAudio): void {
    const remainingMs = segment.durationMs - this.pausedAt
    this.segmentStartTime = performance.now() - this.pausedAt

    this.silenceTimer = window.setTimeout(() => {
      this.silenceTimer = null
      this.onSegmentComplete()
    }, remainingMs)

    this.pausedAt = 0
  }

  /**
   * Handle segment completion
   */
  private onSegmentComplete(): void {
    if (this.status !== 'playing') return

    this.currentIndex++
    this.pausedAt = 0
    this.emitState()

    if (this.currentIndex < this.segments.length) {
      this.playCurrentSegment()
    } else {
      this.onAllSegmentsComplete()
    }
  }

  /**
   * Handle completion of all segments
   */
  private onAllSegmentsComplete(): void {
    this.status = 'completed'
    this.stopProgressTimer()
    this.emitState()
  }

  /**
   * Seek to a segment with an offset within that segment
   */
  private seekToSegmentWithOffset(index: number, offsetMs: number): void {
    const wasPlaying = this.status === 'playing'

    // Stop current playback
    if (this.audioElement) {
      this.audioElement.pause()
    }
    if (this.silenceTimer !== null) {
      clearTimeout(this.silenceTimer)
      this.silenceTimer = null
    }

    this.currentIndex = index
    this.pausedAt = offsetMs

    if (wasPlaying) {
      this.playCurrentSegment()
    }

    this.emitState()
  }

  /**
   * Emit state to all listeners
   */
  private emitState(): void {
    const state = this.getState()
    for (const callback of this.callbacks) {
      try {
        callback(state)
      } catch (err) {
        console.error('State callback error:', err)
      }
    }
  }

  /**
   * Start progress timer for smooth UI updates
   */
  private startProgressTimer(): void {
    this.stopProgressTimer()
    this.progressTimer = window.setInterval(() => {
      this.emitState()
    }, 100) // Update every 100ms for smooth progress
  }

  /**
   * Stop progress timer
   */
  private stopProgressTimer(): void {
    if (this.progressTimer !== null) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
  }
}

// Default instance
export const audioSequencer = new AudioSequencer()
