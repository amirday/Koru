/**
 * Audio service exports
 */

export { AudioStitcher, audioStitcher } from './AudioStitcher'
export type { AudioSegment, FadeOptions } from './AudioStitcher'

export { AudioSequencer, audioSequencer } from './AudioSequencer'
export type { SegmentAudio, SequencerState, StateChangeCallback } from './AudioSequencer'

export { AudioCache, audioCache } from './AudioCache'
export type { AudioCacheEntry } from './AudioCache'

export {
  getAudioDuration,
  createAudioUrl,
  revokeAudioUrl,
  convertAudioFormat,
  isWebAudioSupported,
  estimateSpeechDuration,
  formatDuration,
  clamp,
} from './audio-utils'
