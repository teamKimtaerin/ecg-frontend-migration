import { arrayMove } from '@/lib/utils/array'
import {
  projectStorage,
  defaultProjectSettings,
  generateProjectId,
} from '@/utils/storage/projectStorage'
import { AutosaveManager } from '@/utils/managers/AutosaveManager'
import { StateCreator } from 'zustand'
import { ClipItem } from '../../types'
import { ProjectData } from '../../types/project'
import { SaveSlice } from './saveSlice'
import { UISlice } from './uiSlice'
import { MediaSlice } from './mediaSlice'
import {
  insertedTextToSticker,
  findBestMatchingClip,
  insertStickerIntoClip,
  removeStickersFromClip,
  updateStickerFromInsertedText,
} from '../../utils/insertedTextToSticker'

export interface ClipSlice {
  clips: ClipItem[]
  originalClips: ClipItem[] // 원본 클립 데이터 저장 (메모리)
  deletedClipIds: Set<string>
  currentProject: ProjectData | null
  setClips: (clips: ClipItem[]) => void
  // Alias used by other slices; ensures indexes rebuild
  updateClips: (clips: ClipItem[]) => void
  setOriginalClips: (clips: ClipItem[]) => void // 원본 클립 설정
  restoreOriginalClips: () => void // 원본으로 복원
  saveOriginalClipsToStorage: () => Promise<void> // IndexedDB에 원본 클립 영구 저장
  loadOriginalClipsFromStorage: () => Promise<void> // IndexedDB에서 원본 클립 로드
  updateClipWords: (clipId: string, wordId: string, newText: string) => void

  applyAssetsToWord: (
    clipId: string,
    wordId: string,
    assetIds: string[]
  ) => void
  updateWordAnimationTracks: (
    clipId: string,
    wordId: string,
    tracks: Array<{
      assetId: string
      assetName: string
      pluginKey?: string
      params?: Record<string, unknown>
      timing: { start: number; end: number }
      intensity: { min: number; max: number }
      color?: 'blue' | 'green' | 'purple'
    }>
  ) => void
  reorderWordsInClip: (
    clipId: string,
    sourceWordId: string,
    targetWordId: string
  ) => void
  moveWordBetweenClips: (
    sourceClipId: string,
    targetClipId: string,
    wordId: string,
    targetPosition?: number
  ) => void
  reorderClips: (
    activeId: string,
    overId: string,
    selectedIds: Set<string>
  ) => void
  // Cut editing functions
  updateClipTiming: (
    clipId: string,
    newStartTime: number,
    newEndTime: number
  ) => void
  recalculateWordTimings: (
    clipId: string,
    oldStartTime: number,
    oldEndTime: number,
    newStartTime: number,
    newEndTime: number
  ) => void
  // Clip deletion management
  markClipAsDeleted: (clipId: string) => void
  restoreDeletedClip: (clipId: string) => void
  clearDeletedClips: () => void
  getActiveClips: () => ClipItem[]
  // Project management
  saveProject: (name?: string) => Promise<void>
  loadProject: (id: string) => Promise<void>
  createNewProject: (name?: string) => void
  setCurrentProject: (project: ProjectData) => void

  // Clip Sticker management
  insertStickersIntoClips: (
    insertedTexts: Array<{
      id: string
      content: string
      startTime: number
      endTime: number
      animation?: { plugin: string; parameters: Record<string, unknown> }
    }>
  ) => void
  removeStickersFromClips: () => void
  updateStickerInClips: (
    insertedTextId: string,
    updates: {
      content?: string
      startTime?: number
      endTime?: number
      animation?: { plugin: string; parameters: Record<string, unknown> }
    }
  ) => void
  removeSpecificSticker: (insertedTextId: string) => void

  // Sticker animation track management
  updateStickerAnimationTracks: (
    clipId: string,
    stickerId: string,
    tracks: Array<{
      assetId: string
      assetName: string
      pluginKey?: string
      params?: Record<string, unknown>
      timing: { start: number; end: number }
      intensity: { min: number; max: number }
      color?: 'blue' | 'green' | 'purple'
    }>
  ) => void
  applyStickerAsset: (
    clipId: string,
    stickerId: string,
    assetId: string,
    assetName: string,
    pluginKey?: string,
    params?: Record<string, unknown>
  ) => void
  removeStickerAsset: (clipId: string, stickerId: string, assetId: string) => void
}

export const createClipSlice: StateCreator<
  ClipSlice & SaveSlice & UISlice & MediaSlice,
  [],
  [],
  ClipSlice
> = (set, get) => ({
  clips: [], // 초기 더미 데이터 제거
  originalClips: [], // 원본 클립 데이터
  deletedClipIds: new Set<string>(),
  currentProject: null,

  setClips: (clips) => {
    set({ clips })
    // Rebuild indexes after any clip replacement
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  updateClips: (clips) => {
    // Keep behavior consistent with setClips
    try {
      const stateBefore = get()
      if (stateBefore.clips === clips) return
    } catch {}
    set({ clips })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  setOriginalClips: (clips) => set({ originalClips: clips }),

  restoreOriginalClips: () => {
    const { originalClips } = get()
    if (originalClips.length > 0) {
      set({ clips: [...originalClips] })
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyGet = get() as any
        anyGet.rebuildIndexesFromClips?.()
      } catch {}
    }
  },

  saveOriginalClipsToStorage: async () => {
    const { currentProject, originalClips } = get()
    if (currentProject?.id && originalClips.length > 0) {
      try {
        const { projectStorage } = await import(
          '@/utils/storage/projectStorage'
        )
        await projectStorage.saveOriginalClips(currentProject.id, originalClips)
        console.log('Original clips saved to IndexedDB')
      } catch (error) {
        console.error('Failed to save original clips to storage:', error)
      }
    }
  },

  loadOriginalClipsFromStorage: async () => {
    const { currentProject } = get()
    if (currentProject?.id) {
      try {
        const { projectStorage } = await import(
          '@/utils/storage/projectStorage'
        )
        const storedOriginalClips = await projectStorage.loadOriginalClips(
          currentProject.id
        )
        if (storedOriginalClips && storedOriginalClips.length > 0) {
          set({ originalClips: storedOriginalClips as ClipItem[] })
          console.log('Original clips loaded from IndexedDB')
        }
      } catch (error) {
        console.error('Failed to load original clips from storage:', error)
      }
    }
  },

  // Clip deletion management
  markClipAsDeleted: (clipId) => {
    set((state) => {
      const newDeletedIds = new Set(state.deletedClipIds)
      newDeletedIds.add(clipId)
      return { deletedClipIds: newDeletedIds }
    })
  },

  restoreDeletedClip: (clipId) => {
    set((state) => {
      const newDeletedIds = new Set(state.deletedClipIds)
      newDeletedIds.delete(clipId)
      return { deletedClipIds: newDeletedIds }
    })
  },

  clearDeletedClips: () => {
    set({ deletedClipIds: new Set<string>() })
  },

  getActiveClips: () => {
    const state = get()
    return state.clips.filter((clip) => !state.deletedClipIds.has(clip.id))
  },

  updateClipWords: (clipId, wordId, newText) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              words: clip.words.map((word) =>
                word.id === wordId ? { ...word, text: newText } : word
              ),
              fullText: clip.words
                .map((word) => (word.id === wordId ? newText : word.text))
                .join(' '),
            }
          : clip
      ),
    }))
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  applyAssetsToWord: (clipId, wordId, assetIds) => {
    set((state) => {
      const updatedState = {
        clips: state.clips.map((clip) =>
          clip.id === clipId
            ? {
                ...clip,
                words: clip.words.map((word) =>
                  word.id === wordId
                    ? { ...word, appliedAssets: assetIds }
                    : word
                ),
              }
            : clip
        ),
      }

      // Update UI state for word assets tracking
      const currentState = get() as ClipSlice & SaveSlice & UISlice
      if (currentState.updateWordAssets) {
        currentState.updateWordAssets(wordId, assetIds)
      }

      return updatedState
    })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  updateWordAnimationTracks: (clipId, wordId, tracks) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              words: clip.words.map((word) =>
                word.id === wordId ? { ...word, animationTracks: tracks } : word
              ),
            }
          : clip
      ),
    }))
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  reorderWordsInClip: (clipId, sourceWordId, targetWordId) => {
    set((state) => ({
      clips: state.clips.map((clip) => {
        if (clip.id !== clipId) return clip

        const words = [...clip.words]
        const sourceIndex = words.findIndex((w) => w.id === sourceWordId)
        const targetIndex = words.findIndex((w) => w.id === targetWordId)

        if (sourceIndex === -1 || targetIndex === -1) return clip

        // Remove source word
        const [movedWord] = words.splice(sourceIndex, 1)

        // Insert at target position
        const insertIndex =
          sourceIndex < targetIndex ? targetIndex : targetIndex
        words.splice(insertIndex, 0, movedWord)

        // Rebuild fullText and subtitle from reordered words
        const fullText = words.map((w) => w.text).join(' ')
        const subtitle = fullText // Or apply any subtitle-specific formatting

        return {
          ...clip,
          words,
          fullText,
          subtitle,
        }
      }),
    }))
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  moveWordBetweenClips: (
    sourceClipId,
    targetClipId,
    wordId,
    targetPosition
  ) => {
    set((state) => {
      const sourceClipIndex = state.clips.findIndex(
        (clip) => clip.id === sourceClipId
      )
      const targetClipIndex = state.clips.findIndex(
        (clip) => clip.id === targetClipId
      )

      if (sourceClipIndex === -1 || targetClipIndex === -1) return state

      const sourceClip = state.clips[sourceClipIndex]
      const targetClip = state.clips[targetClipIndex]

      const wordIndex = sourceClip.words.findIndex((word) => word.id === wordId)
      if (wordIndex === -1) return state

      // Remove word from source clip
      const wordToMove = sourceClip.words[wordIndex]
      const updatedSourceWords = sourceClip.words.filter(
        (word) => word.id !== wordId
      )

      // Add word to target clip at specified position
      const updatedTargetWords = [...targetClip.words]
      const insertPosition =
        targetPosition !== undefined
          ? targetPosition
          : updatedTargetWords.length
      updatedTargetWords.splice(insertPosition, 0, wordToMove)

      // Update both clips
      const updatedClips = [...state.clips]
      updatedClips[sourceClipIndex] = {
        ...sourceClip,
        words: updatedSourceWords,
        fullText: updatedSourceWords.map((w) => w.text).join(' '),
        subtitle: updatedSourceWords.map((w) => w.text).join(' '),
      }
      updatedClips[targetClipIndex] = {
        ...targetClip,
        words: updatedTargetWords,
        fullText: updatedTargetWords.map((w) => w.text).join(' '),
        subtitle: updatedTargetWords.map((w) => w.text).join(' '),
      }

      return { clips: updatedClips }
    })
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyGet = get() as any
      anyGet.rebuildIndexesFromClips?.()
    } catch {}
  },

  reorderClips: (activeId, overId, selectedIds) => {
    const _fullState = get()

    set((state) => {
      const { clips } = state
      const oldIndex = clips.findIndex((item) => item.id === activeId)
      const newIndex = clips.findIndex((item) => item.id === overId)

      // If multiple items are selected, move them as a group
      let newClips: ClipItem[]
      if (selectedIds.size > 1 && selectedIds.has(activeId)) {
        // Get selected items in their current order
        const selectedItems = clips.filter((item) => selectedIds.has(item.id))
        const unselectedItems = clips.filter(
          (item) => !selectedIds.has(item.id)
        )

        // Find where to insert the group
        let insertIndex = 0

        // If dropping on an unselected item, insert before or after it
        if (!selectedIds.has(overId)) {
          const overIndexInUnselected = unselectedItems.findIndex(
            (item) => item.id === overId
          )

          // Determine if we should insert before or after the target
          // If dragging down (oldIndex < newIndex), insert after
          // If dragging up (oldIndex > newIndex), insert before
          if (oldIndex < newIndex) {
            insertIndex = overIndexInUnselected + 1
          } else {
            insertIndex = overIndexInUnselected
          }
        } else {
          // If dropping on a selected item, find its position in the original array
          // and maintain relative position
          const overIndex = clips.findIndex((item) => item.id === overId)
          const _selectedIndexes = clips
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => selectedIds.has(item.id))
            .map(({ index }) => index)

          // Find the position in unselected items array
          const unselectedBeforeOver = clips
            .slice(0, overIndex)
            .filter((item) => !selectedIds.has(item.id)).length

          insertIndex = unselectedBeforeOver
        }

        // Create new array with items in correct positions
        newClips = [
          ...unselectedItems.slice(0, insertIndex),
          ...selectedItems,
          ...unselectedItems.slice(insertIndex),
        ]
      } else {
        // Single item drag
        newClips = arrayMove(clips, oldIndex, newIndex)
      }

      return { clips: newClips }
    })

    // After state is updated, synchronize timeline clips if in sequential mode
    const updatedState = get()
    if (
      'timeline' in updatedState &&
      (updatedState as Record<string, { isSequentialMode?: boolean }>).timeline
        ?.isSequentialMode
    ) {
      const newOrder = updatedState.clips.map((clip) => clip.id)
      const timelineState = updatedState as Record<string, unknown>
      if (typeof timelineState.reorderTimelineClips === 'function') {
        timelineState.reorderTimelineClips(newOrder)
      }
    }
  },

  // Cut editing functions
  updateClipTiming: (clipId, newStartTime, newEndTime) => {
    // 기존 클립 정보 가져오기
    const state = get()
    const clip = state.clips.find((c) => c.id === clipId)
    if (!clip) return

    // 기존 시간 파싱
    const timeToSeconds = (timeStr: string): number => {
      const parts = timeStr.split(':')
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10) || 0
        const seconds = parseFloat(parts[1]) || 0
        return minutes * 60 + seconds
      }
      return 0
    }

    const timeRange = clip.timeline.split(' → ')
    const oldStartTime = timeToSeconds(timeRange[0])
    const oldEndTime = timeToSeconds(timeRange[1])

    // Word 타이밍 먼저 재계산
    get().recalculateWordTimings(
      clipId,
      oldStartTime,
      oldEndTime,
      newStartTime,
      newEndTime
    )

    // 클립 정보 업데이트
    set((state) => {
      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId)
      if (clipIndex === -1) return state

      // timeline 문자열 업데이트
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toFixed(1).padStart(4, '0')}`
      }

      const newTimeline = `${formatTime(newStartTime)} → ${formatTime(newEndTime)}`
      const newDuration = `${(newEndTime - newStartTime).toFixed(1)}초`

      const updatedClips = [...state.clips]
      updatedClips[clipIndex] = {
        ...updatedClips[clipIndex],
        timeline: newTimeline,
        duration: newDuration,
      }

      return { clips: updatedClips }
    })

    // 시퀀셜 타임라인 재계산 (클립 타이밍 변경 시)
    const updatedState = get()
    if (
      'timeline' in updatedState &&
      (updatedState as Record<string, { isSequentialMode?: boolean }>).timeline
        ?.isSequentialMode
    ) {
      console.log(
        '[clipSlice] Calling recalculateSequentialTimeline after clip timing update'
      )
      const timelineState = updatedState as Record<string, unknown>
      if (typeof timelineState.recalculateSequentialTimeline === 'function') {
        timelineState.recalculateSequentialTimeline()
      }
    }
  },

  recalculateWordTimings: (
    clipId,
    oldStartTime,
    oldEndTime,
    newStartTime,
    newEndTime
  ) => {
    set((state) => {
      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId)
      if (clipIndex === -1) return state

      const clip = state.clips[clipIndex]
      const oldDuration = oldEndTime - oldStartTime
      const newDuration = newEndTime - newStartTime

      if (oldDuration <= 0 || newDuration <= 0) return state

      // 각 word의 시간을 비례적으로 조정
      const updatedWords = clip.words.map((word) => {
        // 원래 word의 상대적 위치 계산 (0-1 범위)
        const relativeStart = (word.start - oldStartTime) / oldDuration
        const relativeEnd = (word.end - oldStartTime) / oldDuration

        // 새로운 절대 시간 계산
        const newWordStart = newStartTime + relativeStart * newDuration
        const newWordEnd = newStartTime + relativeEnd * newDuration

        return {
          ...word,
          start: Math.max(
            newStartTime,
            Math.min(newWordEnd - 0.1, newWordStart)
          ), // 경계 검사
          end: Math.min(newEndTime, Math.max(newWordStart + 0.1, newWordEnd)), // 경계 검사
        }
      })

      const updatedClips = [...state.clips]
      updatedClips[clipIndex] = {
        ...clip,
        words: updatedWords,
      }

      return { clips: updatedClips }
    })
  },

  // Project management methods
  saveProject: async (name?: string) => {
    const state = get()
    let project = state.currentProject

    if (!project) {
      // Create new project if none exists
      project = {
        id: generateProjectId(),
        name: name || '새 프로젝트',
        clips: state.clips,
        settings: defaultProjectSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Include media information from MediaSlice
        mediaId: state.mediaId || undefined,
        videoUrl: state.videoUrl || undefined,
        videoName: state.videoName || undefined,
        videoType: state.videoType || undefined,
        videoDuration: state.videoDuration || undefined,
        videoMetadata: state.videoMetadata || undefined,
      }
    } else {
      // Update existing project
      project = {
        ...project,
        name: name || project.name,
        clips: state.clips,
        updatedAt: new Date(),
        // Update media information from MediaSlice
        mediaId: state.mediaId || project.mediaId,
        videoUrl: state.videoUrl || project.videoUrl,
        videoName: state.videoName || project.videoName,
        videoType: state.videoType || project.videoType,
        videoDuration: state.videoDuration || project.videoDuration,
        videoMetadata: state.videoMetadata || project.videoMetadata,
      }
    }

    // 로컬에 저장
    await projectStorage.saveProject(project)

    // 현재 프로젝트 상태 저장 (세션 복구용)
    projectStorage.saveCurrentProject(project)

    set({ currentProject: project })

    // AutosaveManager 동기화
    const autosaveManager = AutosaveManager.getInstance()
    autosaveManager.setProject(project.id, 'browser')

    // Mark as saved in save state
    const currentState = get() as ClipSlice & SaveSlice
    if (currentState.markAsSaved) {
      currentState.markAsSaved()
    }
  },

  loadProject: async (id: string) => {
    const project = await projectStorage.loadProject(id)
    if (project) {
      const state = get()

      set({
        clips: project.clips,
        currentProject: project,
      })

      // Restore media information to MediaSlice if available
      if (state.setMediaInfo && (project.mediaId || project.videoUrl)) {
        state.setMediaInfo({
          mediaId: project.mediaId || null,
          videoUrl: project.videoUrl || null,
          videoName: project.videoName || null,
          videoType: project.videoType || null,
          videoDuration: project.videoDuration || null,
          videoMetadata: project.videoMetadata || null,
        })
      }
    }
  },

  createNewProject: (name?: string) => {
    const project: ProjectData = {
      id: generateProjectId(),
      name: name || '새 프로젝트',
      clips: [],
      settings: defaultProjectSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set({
      clips: [],
      currentProject: project,
    })
  },

  setCurrentProject: (project: ProjectData) => {
    set({ currentProject: project })
  },

  // Clip Sticker management - SIMPLIFIED to prevent infinite loops
  insertStickersIntoClips: (insertedTexts) => {
    console.log('🔇 insertStickersIntoClips called but skipped to prevent infinite loops')
    // This method is disabled to prevent circular dependencies
    // Stickers are now managed through the scenario generation process
    return
  },

  removeStickersFromClips: () => {
    const { clips } = get()

    const updatedClips = clips.map(removeStickersFromClip)
    set({ clips: updatedClips })
  },

  updateStickerInClips: (insertedTextId, updates) => {
    console.log('🔇 updateStickerInClips called but skipped to prevent infinite loops')
    // This method is disabled to prevent circular dependencies
    // Stickers are now updated through the scenario generation process
    return
  },

  removeSpecificSticker: (insertedTextId) => {
    console.log('🔇 removeSpecificSticker called but skipped to prevent infinite loops')
    // This method is disabled to prevent circular dependencies
    // Stickers are now managed through the scenario generation process
    return
  },

  // Sticker animation track management methods
  updateStickerAnimationTracks: (clipId, stickerId, tracks) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              stickers: (clip.stickers || []).map((sticker) =>
                sticker.id === stickerId
                  ? { ...sticker, animationTracks: tracks }
                  : sticker
              ),
            }
          : clip
      ),
    }))
  },

  applyStickerAsset: (clipId, stickerId, assetId, assetName, pluginKey, params) => {
    const { clips } = get()
    const clip = clips.find((c) => c.id === clipId)
    if (!clip) return

    const sticker = clip.stickers?.find((s) => s.id === stickerId)
    if (!sticker) return

    // Create new animation track
    const newTrack = {
      assetId,
      assetName,
      pluginKey,
      params: params || {},
      timing: {
        start: sticker.start,
        end: sticker.end,
      },
      intensity: { min: 0.5, max: 1.0 },
      color: 'purple' as const,
    }

    // Add or replace animation track
    const currentTracks = sticker.animationTracks || []
    const existingTrackIndex = currentTracks.findIndex(
      (track) => track.assetId === assetId
    )

    let updatedTracks
    if (existingTrackIndex !== -1) {
      // Replace existing track
      updatedTracks = [...currentTracks]
      updatedTracks[existingTrackIndex] = newTrack
    } else {
      // Add new track
      updatedTracks = [...currentTracks, newTrack]
    }

    // Update sticker animation tracks
    set((state) => ({
      clips: state.clips.map((c) =>
        c.id === clipId
          ? {
              ...c,
              stickers: (c.stickers || []).map((s) =>
                s.id === stickerId
                  ? { ...s, animationTracks: updatedTracks }
                  : s
              ),
            }
          : c
      ),
    }))
  },

  removeStickerAsset: (clipId, stickerId, assetId) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              stickers: (clip.stickers || []).map((sticker) =>
                sticker.id === stickerId
                  ? {
                      ...sticker,
                      animationTracks: (sticker.animationTracks || []).filter(
                        (track) => track.assetId !== assetId
                      ),
                    }
                  : sticker
              ),
            }
          : clip
      ),
    }))
  },
})
