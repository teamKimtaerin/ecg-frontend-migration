/**
 * 미디어 상태 관리 슬라이스
 */

import { WaveformData } from '@/utils/audio/waveformExtractor'
import { log } from '@/utils/logger'
import { StateCreator } from 'zustand'

export interface MediaState {
  // Media information
  mediaId: string | null
  videoUrl: string | null
  currentBlobUrl: string | null // Track current blob URL for cleanup
  videoName: string | null
  videoType: string | null
  videoDuration: number | null
  videoThumbnail: string | null // 비디오 썸네일 URL
  videoMetadata: {
    width?: number
    height?: number
    frameRate?: number
    videoCodec?: string
    audioCodec?: string
  } | null
  isVideoLoading: boolean
  videoError: string | null

  // Audio waveform state
  audioBuffer: AudioBuffer | null
  globalWaveformData: WaveformData | null
  isWaveformLoading: boolean
  waveformError: string | null

  // Playback state
  currentTime: number
  isPlaying: boolean
  segmentStart: number | null
  segmentEnd: number | null
  isSegmentPlayback: boolean

  // Subtitle state
  showSubtitles: boolean
  subtitleSize: 'small' | 'medium' | 'large'
  subtitlePosition: 'top' | 'bottom'
}

export interface MediaActions {
  setMediaInfo: (info: Partial<MediaState>) => void
  clearMedia: () => void
  cleanupPreviousBlobUrl: () => void // New action for blob URL cleanup
  setVideoLoading: (loading: boolean) => void
  setVideoError: (error: string | null) => void

  // Audio waveform actions
  setAudioBuffer: (buffer: AudioBuffer | null) => void
  setGlobalWaveformData: (data: WaveformData | null) => void
  setWaveformLoading: (loading: boolean) => void
  setWaveformError: (error: string | null) => void
  clearWaveformData: () => void

  // Playback actions
  setCurrentTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  playSegment: (start: number, end: number) => void
  stopSegmentPlayback: () => void

  // Subtitle actions
  toggleSubtitles: () => void
  setSubtitleSize: (size: 'small' | 'medium' | 'large') => void
  setSubtitlePosition: (position: 'top' | 'bottom') => void
}

export type MediaSlice = MediaState & MediaActions

const initialState: MediaState = {
  mediaId: null,
  videoUrl: null,
  currentBlobUrl: null,
  videoName: null,
  videoType: null,
  videoDuration: null,
  videoThumbnail: null,
  videoMetadata: null,
  isVideoLoading: false,
  videoError: null,

  // Audio waveform state
  audioBuffer: null,
  globalWaveformData: null,
  isWaveformLoading: false,
  waveformError: null,

  // Playback state
  currentTime: 0,
  isPlaying: false,
  segmentStart: null,
  segmentEnd: null,
  isSegmentPlayback: false,

  // Subtitle state
  showSubtitles: true,
  subtitleSize: 'medium',
  subtitlePosition: 'bottom',
}

export const createMediaSlice: StateCreator<MediaSlice> = (set) => ({
  ...initialState,

  setMediaInfo: (info) => {
    set((state) => {
      // 새 썸네일이 있고 기존 썸네일과 다르면 기존 썸네일 정리
      if (
        info.videoThumbnail &&
        state.videoThumbnail &&
        state.videoThumbnail !== info.videoThumbnail &&
        state.videoThumbnail.startsWith('blob:')
      ) {
        try {
          URL.revokeObjectURL(state.videoThumbnail)
          log(
            'mediaSlice.ts',
            'Revoked old thumbnail blob URL:',
            state.videoThumbnail
          )
        } catch (error) {
          log(
            'mediaSlice.ts',
            'Failed to revoke old thumbnail blob URL:',
            error
          )
        }
      }

      // 새 비디오 URL이 있고 기존 비디오 URL과 다르면 기존 URL 정리
      if (
        info.videoUrl &&
        state.videoUrl &&
        state.videoUrl !== info.videoUrl &&
        state.videoUrl.startsWith('blob:')
      ) {
        try {
          URL.revokeObjectURL(state.videoUrl)
          log('mediaSlice.ts', 'Revoked old video blob URL:', state.videoUrl)
        } catch (error) {
          log('mediaSlice.ts', 'Failed to revoke old video blob URL:', error)
        }
      }

      log('mediaSlice.ts', 'Media info updated', info)

      // If we're setting a new videoUrl and it's a blob URL, track it for cleanup
      const updates = { ...info }
      if (info.videoUrl && info.videoUrl.startsWith('blob:')) {
        updates.currentBlobUrl = info.videoUrl
        log('mediaSlice.ts', `🎬 Tracking new blob URL: ${info.videoUrl}`)
        console.log(
          '[VIDEO REPLACEMENT DEBUG] Store updated with new blob URL:',
          {
            previousVideoUrl: state.videoUrl,
            previousBlobUrl: state.currentBlobUrl,
            newVideoUrl: info.videoUrl,
            newBlobUrl: info.videoUrl,
            isReplacement: state.videoUrl !== null,
            timestamp: new Date().toISOString(),
          }
        )
      }

      return {
        ...state,
        ...updates,
      }
    })
  },

  clearMedia: () => {
    set((state) => {
      // 기존 썸네일이 blob URL이면 메모리 정리
      if (state.videoThumbnail && state.videoThumbnail.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(state.videoThumbnail)
          log(
            'mediaSlice.ts',
            'Revoked thumbnail blob URL:',
            state.videoThumbnail
          )
        } catch (error) {
          log('mediaSlice.ts', 'Failed to revoke thumbnail blob URL:', error)
        }
      }

      // 기존 비디오 URL이 blob URL이면 메모리 정리
      if (state.videoUrl && state.videoUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(state.videoUrl)
          log('mediaSlice.ts', 'Revoked video blob URL:', state.videoUrl)
        } catch (error) {
          log('mediaSlice.ts', 'Failed to revoke video blob URL:', error)
        }
      }

      log('mediaSlice.ts', 'Media cleared')

      // Cleanup current blob URL before clearing
      if (state.currentBlobUrl) {
        log(
          'mediaSlice.ts',
          `🧹 Revoking blob URL during clearMedia: ${state.currentBlobUrl}`
        )
        try {
          URL.revokeObjectURL(state.currentBlobUrl)
        } catch (error) {
          log('mediaSlice.ts', 'Failed to revoke blob URL:', error)
        }
      }

      // Clear waveform data
      log('mediaSlice.ts', 'Clearing waveform data')

      return initialState
    })
  },

  cleanupPreviousBlobUrl: () => {
    set((state) => {
      if (state.currentBlobUrl) {
        log(
          'mediaSlice.ts',
          `🧹 Manually revoking previous blob URL: ${state.currentBlobUrl}`
        )
        try {
          URL.revokeObjectURL(state.currentBlobUrl)
        } catch (error) {
          log('mediaSlice.ts', 'Failed to revoke previous blob URL:', error)
        }

        return {
          ...state,
          currentBlobUrl: null,
        }
      }
      return state
    })
  },

  setVideoLoading: (loading) => {
    set({ isVideoLoading: loading })
  },

  setVideoError: (error) => {
    if (error) {
      log('mediaSlice.ts', `Video error: ${error}`)
    }
    set({ videoError: error })
  },

  // Audio waveform actions
  setAudioBuffer: (buffer) => {
    set({ audioBuffer: buffer })
    log('mediaSlice.ts', `Audio buffer ${buffer ? 'set' : 'cleared'}`)
  },

  setGlobalWaveformData: (data) => {
    set({ globalWaveformData: data })
    if (data) {
      log(
        'mediaSlice.ts',
        `Waveform data set: ${data.peaks.length} peaks, ${data.duration.toFixed(2)}s duration`
      )
    } else {
      log('mediaSlice.ts', 'Waveform data cleared')
    }
  },

  setWaveformLoading: (loading) => {
    set({ isWaveformLoading: loading })
    log('mediaSlice.ts', `Waveform loading: ${loading}`)
  },

  setWaveformError: (error) => {
    if (error) {
      log('mediaSlice.ts', `Waveform error: ${error}`)
    }
    set({ waveformError: error })
  },

  clearWaveformData: () => {
    set({
      audioBuffer: null,
      globalWaveformData: null,
      isWaveformLoading: false,
      waveformError: null,
    })
    log('mediaSlice.ts', 'All waveform data cleared')
  },

  // Playback actions
  setCurrentTime: (time) => {
    set({ currentTime: time })
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing })
  },

  playSegment: (start, end) => {
    set({
      segmentStart: start,
      segmentEnd: end,
      isSegmentPlayback: true,
      isPlaying: true,
      currentTime: start,
    })
    log('mediaSlice.ts', `Playing segment from ${start} to ${end}`)
  },

  stopSegmentPlayback: () => {
    set({
      isSegmentPlayback: false,
      isPlaying: false,
      segmentStart: null,
      segmentEnd: null,
    })
    log('mediaSlice.ts', 'Segment playback stopped')
  },

  // Subtitle actions
  toggleSubtitles: () => {
    set((state) => ({ showSubtitles: !state.showSubtitles }))
  },

  setSubtitleSize: (size) => {
    set({ subtitleSize: size })
  },

  setSubtitlePosition: (position) => {
    set({ subtitlePosition: position })
  },
})
