/**
 * Animation Asset Helper Utilities
 * Centralized logic for animation parameter management
 */

import type { EditorStore } from '../store'

/**
 * Determines the target word ID for animation operations
 * Priority: expandedWordId > focusedWordId > single selected word
 */
export const determineTargetWordId = (store: EditorStore): string | null => {
  // 1. Expanded clip's focused word has highest priority (user is actively editing)
  if (store.expandedWordId) {
    return store.expandedWordId
  }

  // 2. Explicitly focused word
  if (store.focusedWordId) {
    return store.focusedWordId
  }

  // 3. Single selected word (not multi-selection)
  if (store.multiSelectedWordIds.size === 1) {
    return Array.from(store.multiSelectedWordIds)[0]
  }

  // 4. Fall back to selectedWordId for legacy compatibility
  if (store.selectedWordId && store.multiSelectedWordIds.size === 0) {
    return store.selectedWordId
  }

  return null
}

/**
 * Gets the display name for the current target word
 */
export const getTargetWordDisplayName = (store: EditorStore): string => {
  const wordId = determineTargetWordId(store)
  if (!wordId) return '선택된 단어 없음'

  // Find the word text from clips
  for (const clip of store.clips || []) {
    const word = clip.words.find((w) => w.id === wordId)
    if (word) {
      return `"${word.text}"`
    }
  }

  return '단어 정보 없음'
}

/**
 * Validates if a word can have animation operations performed on it
 */
export const canApplyAnimationToWord = (store: EditorStore, wordId?: string): boolean => {
  const targetWordId = wordId || determineTargetWordId(store)
  if (!targetWordId) return false

  // Check if word exists in clips
  for (const clip of store.clips || []) {
    const word = clip.words.find((w) => w.id === targetWordId)
    if (word) return true
  }

  return false
}

/**
 * Gets existing animation track parameters for a word and asset
 */
export const getExistingTrackParams = (
  store: EditorStore,
  wordId: string,
  assetId: string
): Record<string, unknown> => {
  const tracks = store.wordAnimationTracks?.get(wordId) || []
  const track = tracks.find((t) => t.assetId === assetId)
  return track?.params || {}
}

/**
 * Debounce utility for high-frequency parameter updates
 */
export const createParameterDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 200
): T => {
  let timeoutId: NodeJS.Timeout

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

/**
 * Creates a batched update function for multiple parameter changes
 */
export const createBatchUpdater = <T>(
  updateFn: (updates: T[]) => Promise<void>,
  batchDelay: number = 100
) => {
  let pendingUpdates: T[] = []
  let timeoutId: NodeJS.Timeout | null = null

  const flush = async () => {
    if (pendingUpdates.length === 0) return

    const updates = [...pendingUpdates]
    pendingUpdates = []
    timeoutId = null

    try {
      await updateFn(updates)
    } catch (error) {
      console.error('Batch update failed:', error)
      // Re-add failed updates for retry
      pendingUpdates.unshift(...updates)
    }
  }

  return {
    add: (update: T) => {
      pendingUpdates.push(update)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(flush, batchDelay)
    },

    flush: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        return flush()
      }
      return Promise.resolve()
    },

    clear: () => {
      pendingUpdates = []
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }
}