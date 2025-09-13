'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface VideoMetadata {
  fileName: string
  duration: number // in seconds
  thumbnailUrl?: string
  fileSize: number
}

export interface TranscriptionState {
  // Job tracking
  jobId: string | null
  status: 'idle' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  error: string | null

  // Video/file info
  videoMetadata: VideoMetadata | null

  // Analysis info
  analysisTimeUsed: number // in minutes
  estimatedTotalTime: number | null // in seconds

  // Results handling
  results: unknown | null // Store ML server results
  onCompleteCallback: ((results: unknown) => void) | null

  // UI state
  isModalOpen: boolean
  isCollapsed: boolean

  // Actions
  startTranscription: (jobId: string, metadata: VideoMetadata) => void
  updateProgress: (
    progress: number,
    status?: TranscriptionState['status']
  ) => void
  setAnalysisTime: (minutes: number) => void
  setEstimatedTime: (seconds: number) => void
  setError: (error: string | null) => void
  toggleCollapse: () => void
  openModal: () => void
  closeModal: () => void
  reset: () => void

  // Results handling actions
  setResults: (results: unknown) => void
  onComplete: (callback: (results: unknown) => void) => void
  clearResults: () => void
}

const initialState = {
  jobId: null,
  status: 'idle' as const,
  progress: 0,
  error: null,
  videoMetadata: null,
  analysisTimeUsed: 0,
  estimatedTotalTime: null,
  results: null,
  onCompleteCallback: null,
  isModalOpen: false,
  isCollapsed: false,
}

export const useTranscriptionStore = create<TranscriptionState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        startTranscription: (jobId, metadata) =>
          set((state) => ({
            ...state,
            jobId,
            videoMetadata: metadata,
            status: 'processing',
            progress: 0,
            error: null,
            isModalOpen: true,
            isCollapsed: false,
          })),

        updateProgress: (progress, status) =>
          set((state) => ({
            ...state,
            progress,
            ...(status && { status }),
          })),

        setAnalysisTime: (minutes) =>
          set((state) => ({
            ...state,
            analysisTimeUsed: minutes,
          })),

        setEstimatedTime: (seconds) =>
          set((state) => ({
            ...state,
            estimatedTotalTime: seconds,
          })),

        setError: (error) =>
          set((state) => ({
            ...state,
            error,
            status: error ? 'failed' : state.status,
          })),

        toggleCollapse: () =>
          set((state) => ({
            ...state,
            isCollapsed: !state.isCollapsed,
          })),

        openModal: () =>
          set((state) => ({
            ...state,
            isModalOpen: true,
          })),

        closeModal: () =>
          set((state) => ({
            ...state,
            isModalOpen: false,
          })),

        reset: () => set(initialState),

        // Results handling actions
        setResults: (results) =>
          set((state) => ({
            ...state,
            results,
          })),

        onComplete: (callback) =>
          set((state) => ({
            ...state,
            onCompleteCallback: callback,
          })),

        clearResults: () =>
          set((state) => ({
            ...state,
            results: null,
            onCompleteCallback: null,
          })),
      }),
      {
        name: 'transcription-storage',
        partialize: (state) => ({
          jobId: state.jobId,
          status: state.status,
          progress: state.progress,
          videoMetadata: state.videoMetadata,
          analysisTimeUsed: state.analysisTimeUsed,
          // Note: results and callbacks are not persisted
        }),
      }
    )
  )
)
