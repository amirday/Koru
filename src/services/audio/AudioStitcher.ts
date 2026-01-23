/**
 * AudioStitcher - Combines audio segments and silence using Web Audio API
 * Provides stitching, silence generation, and duration measurement
 */

import { getAudioDuration, clamp } from './audio-utils'

/**
 * Audio segment for stitching
 */
export interface AudioSegment {
  /** Segment type */
  type: 'speech' | 'silence'
  /** Audio blob (for speech segments) */
  blob?: Blob
  /** Duration in milliseconds */
  durationMs: number
}

/**
 * Fade options for audio transitions
 */
export interface FadeOptions {
  /** Fade in duration in milliseconds */
  fadeInMs?: number
  /** Fade out duration in milliseconds */
  fadeOutMs?: number
}

/**
 * AudioStitcher - Combines audio segments using Web Audio API
 */
export class AudioStitcher {
  private sampleRate: number
  private numChannels: number
  private bitsPerSample: number

  constructor(options?: { sampleRate?: number; numChannels?: number }) {
    this.sampleRate = options?.sampleRate ?? 44100
    this.numChannels = options?.numChannels ?? 1
    this.bitsPerSample = 16
  }

  /**
   * Stitch audio segments together
   * @param segments Array of audio segments
   * @param targetDurationMs Optional target duration - pads with silence if needed
   * @param fadeOptions Optional fade in/out options
   * @returns Combined audio blob
   */
  async stitch(
    segments: AudioSegment[],
    targetDurationMs?: number,
    fadeOptions?: FadeOptions
  ): Promise<Blob> {
    if (segments.length === 0) {
      // Return empty silence if no segments
      return this.generateSilence(targetDurationMs ?? 1000)
    }

    // Create audio context
    const audioContext = new AudioContext({ sampleRate: this.sampleRate })

    try {
      // Decode all speech segments to AudioBuffers
      const decodedSegments: { type: 'speech' | 'silence'; buffer: AudioBuffer }[] = []

      for (const segment of segments) {
        if (segment.type === 'speech' && segment.blob) {
          const arrayBuffer = await segment.blob.arrayBuffer()
          const buffer = await audioContext.decodeAudioData(arrayBuffer)
          decodedSegments.push({ type: 'speech', buffer })
        } else {
          // Generate silence buffer
          const samples = Math.ceil((segment.durationMs / 1000) * this.sampleRate)
          const silenceBuffer = audioContext.createBuffer(
            this.numChannels,
            samples,
            this.sampleRate
          )
          decodedSegments.push({ type: 'silence', buffer: silenceBuffer })
        }
      }

      // Calculate total samples
      let totalSamples = decodedSegments.reduce(
        (sum, seg) => sum + seg.buffer.length,
        0
      )

      // If target duration specified, may need to add padding
      if (targetDurationMs) {
        const targetSamples = Math.ceil((targetDurationMs / 1000) * this.sampleRate)
        if (totalSamples < targetSamples) {
          // Add silence at the end
          const paddingSamples = targetSamples - totalSamples
          const paddingBuffer = audioContext.createBuffer(
            this.numChannels,
            paddingSamples,
            this.sampleRate
          )
          decodedSegments.push({ type: 'silence', buffer: paddingBuffer })
          totalSamples = targetSamples
        }
      }

      // Create output buffer
      const outputBuffer = audioContext.createBuffer(
        this.numChannels,
        totalSamples,
        this.sampleRate
      )

      // Copy all segments into output buffer
      let offset = 0
      for (const segment of decodedSegments) {
        for (let channel = 0; channel < this.numChannels; channel++) {
          const outputChannel = outputBuffer.getChannelData(channel)
          const sourceChannel = segment.buffer.getChannelData(
            Math.min(channel, segment.buffer.numberOfChannels - 1)
          )

          // Copy samples
          for (let i = 0; i < segment.buffer.length; i++) {
            if (offset + i < outputChannel.length) {
              outputChannel[offset + i] = sourceChannel[i] ?? 0
            }
          }
        }
        offset += segment.buffer.length
      }

      // Apply fade in/out if specified
      if (fadeOptions) {
        this.applyFade(outputBuffer, fadeOptions)
      }

      // Convert to WAV blob
      return this.audioBufferToWav(outputBuffer)
    } finally {
      await audioContext.close()
    }
  }

  /**
   * Get duration of an audio blob in seconds
   */
  async getDuration(blob: Blob): Promise<number> {
    return getAudioDuration(blob)
  }

  /**
   * Generate silence audio blob
   * @param durationMs Duration in milliseconds
   * @returns WAV blob containing silence
   */
  generateSilence(durationMs: number): Blob {
    const numSamples = Math.ceil((durationMs / 1000) * this.sampleRate)
    return this.createWavBlob(numSamples)
  }

  /**
   * Apply fade in/out to an AudioBuffer
   */
  private applyFade(buffer: AudioBuffer, options: FadeOptions): void {
    const fadeInSamples = Math.floor(
      ((options.fadeInMs ?? 0) / 1000) * this.sampleRate
    )
    const fadeOutSamples = Math.floor(
      ((options.fadeOutMs ?? 0) / 1000) * this.sampleRate
    )

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel)

      // Fade in
      for (let i = 0; i < fadeInSamples && i < data.length; i++) {
        const gain = i / fadeInSamples
        const currentValue = data[i]
        if (currentValue !== undefined) {
          data[i] = currentValue * gain
        }
      }

      // Fade out
      for (let i = 0; i < fadeOutSamples && i < data.length; i++) {
        const index = data.length - 1 - i
        const gain = i / fadeOutSamples
        const currentValue = data[index]
        if (currentValue !== undefined) {
          data[index] = currentValue * gain
        }
      }
    }
  }

  /**
   * Create WAV blob from sample count (silent audio)
   */
  private createWavBlob(numSamples: number): Blob {
    const dataSize = numSamples * this.numChannels * (this.bitsPerSample / 8)
    const headerSize = 44
    const fileSize = headerSize + dataSize

    const buffer = new ArrayBuffer(fileSize)
    const view = new DataView(buffer)

    let offset = 0

    // RIFF chunk descriptor
    this.writeString(view, offset, 'RIFF')
    offset += 4
    view.setUint32(offset, fileSize - 8, true)
    offset += 4
    this.writeString(view, offset, 'WAVE')
    offset += 4

    // fmt sub-chunk
    this.writeString(view, offset, 'fmt ')
    offset += 4
    view.setUint32(offset, 16, true) // Subchunk1Size for PCM
    offset += 4
    view.setUint16(offset, 1, true) // AudioFormat: PCM = 1
    offset += 2
    view.setUint16(offset, this.numChannels, true)
    offset += 2
    view.setUint32(offset, this.sampleRate, true)
    offset += 4
    view.setUint32(
      offset,
      this.sampleRate * this.numChannels * (this.bitsPerSample / 8),
      true
    )
    offset += 4
    view.setUint16(offset, this.numChannels * (this.bitsPerSample / 8), true)
    offset += 2
    view.setUint16(offset, this.bitsPerSample, true)
    offset += 2

    // data sub-chunk
    this.writeString(view, offset, 'data')
    offset += 4
    view.setUint32(offset, dataSize, true)
    // Audio data is already zero (silence)

    return new Blob([buffer], { type: 'audio/wav' })
  }

  /**
   * Convert AudioBuffer to WAV blob
   */
  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const numSamples = buffer.length
    const dataSize = numSamples * this.numChannels * (this.bitsPerSample / 8)
    const headerSize = 44
    const fileSize = headerSize + dataSize

    const arrayBuffer = new ArrayBuffer(fileSize)
    const view = new DataView(arrayBuffer)

    let offset = 0

    // RIFF chunk descriptor
    this.writeString(view, offset, 'RIFF')
    offset += 4
    view.setUint32(offset, fileSize - 8, true)
    offset += 4
    this.writeString(view, offset, 'WAVE')
    offset += 4

    // fmt sub-chunk
    this.writeString(view, offset, 'fmt ')
    offset += 4
    view.setUint32(offset, 16, true)
    offset += 4
    view.setUint16(offset, 1, true)
    offset += 2
    view.setUint16(offset, this.numChannels, true)
    offset += 2
    view.setUint32(offset, this.sampleRate, true)
    offset += 4
    view.setUint32(
      offset,
      this.sampleRate * this.numChannels * (this.bitsPerSample / 8),
      true
    )
    offset += 4
    view.setUint16(offset, this.numChannels * (this.bitsPerSample / 8), true)
    offset += 2
    view.setUint16(offset, this.bitsPerSample, true)
    offset += 2

    // data sub-chunk
    this.writeString(view, offset, 'data')
    offset += 4
    view.setUint32(offset, dataSize, true)
    offset += 4

    // Write audio data
    for (let i = 0; i < numSamples; i++) {
      for (let channel = 0; channel < this.numChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i] ?? 0
        // Clamp and convert to 16-bit integer
        const clampedSample = clamp(sample, -1, 1)
        const intSample = Math.round(clampedSample * 32767)
        view.setInt16(offset, intSample, true)
        offset += 2
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  /**
   * Helper to write string to DataView
   */
  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }
}

// Default instance
export const audioStitcher = new AudioStitcher()
