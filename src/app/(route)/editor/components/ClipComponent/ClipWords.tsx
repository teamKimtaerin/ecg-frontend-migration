import { useRef } from 'react'
import React, { useCallback } from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DragEndEvent, DndContext } from '@dnd-kit/core'
import { Word, Sticker } from '../../types'
import ClipWord from './ClipWord'
import ClipSticker from './ClipSticker'
import { useWordGrouping } from '../../hooks/useWordGrouping'
import { useEditorStore } from '../../store'
import { getAssetIcon } from '../../utils/assetIconMapper'

interface ClipWordsProps {
  clipId: string
  words: Word[]
  stickers: Sticker[]
  onWordEdit: (clipId: string, wordId: string, newText: string) => void
  onStickerDeleteRequest?: (stickerId: string, stickerText: string) => void
}

// Asset database interface
interface AssetDatabaseItem {
  id: string
  title: string
  iconName?: string
}

export default function ClipWords({
  clipId,
  words,
  stickers,
  onWordEdit,
  onStickerDeleteRequest,
}: ClipWordsProps) {
  // Add ref for debouncing clicks
  const lastClickTimeRef = useRef(0)

  const {
    // From dev branch
    setFocusedWord,
    // clearWordFocus, // Currently unused
    // draggedWordId, // Currently unused
    setActiveClipId,
    // From feat/editor-asset-sidebar-clean branch
    setSelectedWordId,
    setCurrentWordAssets,
    selectedWordAssets,
    expandClip,
    // For sticker position updates
    insertedTexts,
    updateText,
  } = useEditorStore()

  // Asset related state with icon support
  const [allAssets, setAllAssets] = React.useState<AssetDatabaseItem[]>([])

  // Setup grouping functionality (from dev)
  const {
    containerRef,
    isDragging: isGroupDragging,
    handleMouseDown,
    handleKeyDown,
  } = useWordGrouping({
    clipId,
    onGroupChange: () => {
      // Optional: Handle group change
    },
  })

  // Fetch assets database for asset names and icons
  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/asset-store/assets-database.json')
        if (response.ok) {
          const data = await response.json()
          // Map to include only needed fields for performance
          const assetsWithIcons: AssetDatabaseItem[] = data.assets.map(
            (asset: Record<string, unknown>) => ({
              id: asset.id,
              title: asset.title,
              iconName: asset.iconName,
            })
          )
          setAllAssets(assetsWithIcons)
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      }
    }
    fetchAssets()
  }, [])

  // Get asset name by ID (from feat/editor-asset-sidebar-clean)
  const getAssetNameById = (id: string) => {
    const asset = allAssets.find((a) => a.id === id)
    return asset?.title || ''
  }

  // Keep words and stickers separate but visually sorted by time
  const wordItems = words.map((word) => ({
    type: 'word' as const,
    item: word,
    start: word.start,
  }))
  const stickerItems = stickers.map((sticker) => ({
    type: 'sticker' as const,
    item: sticker,
    start: sticker.start,
  }))

  // Create sortable items for DnD (include both words and stickers)
  const sortableItems = [...wordItems, ...stickerItems].map((item) => `${clipId}-${item.item.id}`)

  // For visual display, combine and sort by time (but keep semantic separation)
  const allItems = [...wordItems, ...stickerItems].sort(
    (a, b) => a.start - b.start
  )

  // Calculate new start time based on sticker position in word list
  const calculateStickerStartTime = (newIndex: number) => {
    if (newIndex === 0) {
      // First position: use clip start time (first word's start time)
      return words.length > 0 ? words[0].start : 0
    } else if (newIndex >= allItems.length - 1) {
      // Last position: use last word's start time
      const lastWord = words[words.length - 1]
      return lastWord ? lastWord.start : 0
    } else {
      // Middle position: use the start time of the word at the same index
      const itemAtIndex = allItems[newIndex - 1]
      if (itemAtIndex && itemAtIndex.type === 'word') {
        return itemAtIndex.start
      } else {
        // If previous item is also a sticker, find the nearest word before it
        for (let i = newIndex - 1; i >= 0; i--) {
          const item = allItems[i]
          if (item.type === 'word') {
            return item.start
          }
        }
        // Fallback to clip start time
        return words.length > 0 ? words[0].start : 0
      }
    }
  }

  // Handle drag end for stickers
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      
      if (!over || !active) return

      // Extract item ID from the sortable ID format
      const activeId = active.id.toString().replace(`${clipId}-`, '')
      const overId = over.id.toString().replace(`${clipId}-`, '')

      // Find if the dragged item is a sticker
      const draggedSticker = stickers.find(s => s.id === activeId)
      
      if (!draggedSticker) return // Only handle sticker drags

      // Find the new index in the sorted allItems array
      const oldIndex = allItems.findIndex(item => item.item.id === activeId)
      const newIndex = allItems.findIndex(item => item.item.id === overId)

      if (oldIndex === newIndex) return // No position change

      // Calculate new start time based on position
      const newStartTime = calculateStickerStartTime(newIndex)
      
      // Find corresponding inserted text
      const correspondingText = insertedTexts?.find(
        (text: { id: string }) => text.id === draggedSticker.originalInsertedTextId
      )

      if (correspondingText && updateText) {
        // Maintain current duration or default to 3 seconds
        const currentDuration = correspondingText.endTime - correspondingText.startTime
        const duration = currentDuration > 0 ? currentDuration : 3
        const newEndTime = newStartTime + duration

        updateText(correspondingText.id, {
          startTime: newStartTime,
          endTime: newEndTime
        })

        console.log(`🎯 Updated sticker position: ${draggedSticker.text} -> ${newStartTime.toFixed(2)}s (duration: ${duration.toFixed(1)}s)`)
      }
    },
    [clipId, stickers, allItems, words, insertedTexts, updateText]
  )

  // Handle sticker deletion request (delegate to parent)
  const handleStickerDeleteRequest = useCallback(
    (stickerId: string) => {
      const sticker = stickers.find(s => s.id === stickerId)
      if (!sticker || !onStickerDeleteRequest) return

      onStickerDeleteRequest(stickerId, sticker.text)
    },
    [stickers, onStickerDeleteRequest]
  )

  // Combined word click handler (merging both functionalities)
  const handleWordClick = useCallback(
    (wordId: string, _isCenter: boolean) => {
      const word = words.find((w) => w.id === wordId)
      if (!word) return

      // Prevent rapid clicks from causing conflicts
      const now = Date.now()
      if (now - lastClickTimeRef.current < 50) {
        return
      }
      lastClickTimeRef.current = now

      // Seek video player to word start time
      const videoPlayer = (
        window as {
          videoPlayer?: {
            seekTo: (time: number) => void
            pauseAutoWordSelection?: () => void
          }
        }
      ).videoPlayer
      if (videoPlayer) {
        videoPlayer.seekTo(word.start)
        // Pause auto word selection for a few seconds when user manually selects a word
        if (videoPlayer.pauseAutoWordSelection) {
          videoPlayer.pauseAutoWordSelection()
        }
      }

      // Focus on clicked word (center click logic handled by ClipWord component)
      const wordAssets = selectedWordAssets[wordId] || word.appliedAssets || []
      setFocusedWord(clipId, wordId)
      setActiveClipId(clipId)
      setSelectedWordId(wordId)
      setCurrentWordAssets(wordAssets)
      // Expand clip to show waveform editor on single click
      expandClip(clipId, wordId)
    },
    [
      clipId,
      words,
      setFocusedWord,
      setActiveClipId,
      setSelectedWordId,
      setCurrentWordAssets,
      selectedWordAssets,
      expandClip,
    ]
  )

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={sortableItems}
        strategy={horizontalListSortingStrategy}
      >
        <div
          ref={containerRef}
          className="flex flex-wrap gap-1 relative cursor-pointer items-start"
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
        {allItems.map((combinedItem) => {
          if (combinedItem.type === 'word') {
            const word = combinedItem.item as Word
            const appliedAssets = word.appliedAssets || []

            return (
              <React.Fragment key={word.id}>
                <ClipWord
                  word={word}
                  clipId={clipId}
                  onWordClick={handleWordClick}
                  onWordEdit={onWordEdit}
                />

                {/* Render asset icons after each word */}
                {appliedAssets.length > 0 && (
                  <div className="flex gap-1 items-center">
                    {appliedAssets.map((assetId: string) => {
                      const IconComponent = getAssetIcon(assetId, allAssets)
                      const assetName = getAssetNameById(assetId)
                      return IconComponent ? (
                        <div
                          key={assetId}
                          className="w-3 h-3 bg-slate-600/50 rounded-sm flex items-center justify-center"
                          title={assetName}
                        >
                          <IconComponent size={10} className="text-slate-300" />
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </React.Fragment>
            )
          } else {
            // Render sticker
            const sticker = combinedItem.item as Sticker
            const appliedAssets = sticker.appliedAssets || []

            return (
              <React.Fragment key={sticker.id}>
                <ClipSticker
                  sticker={sticker}
                  clipId={clipId}
                  clipWords={words}
                  onStickerClick={(stickerId) =>
                    handleWordClick(stickerId, false)
                  } // Reuse word click handler
                  onStickerDelete={handleStickerDeleteRequest}
                />

                {/* Render asset icons after each sticker */}
                {appliedAssets.length > 0 && (
                  <div className="flex gap-1 items-center">
                    {appliedAssets.map((assetId: string) => {
                      const IconComponent = getAssetIcon(assetId, allAssets)
                      const assetName = getAssetNameById(assetId)
                      return IconComponent ? (
                        <div
                          key={assetId}
                          className="w-3 h-3 bg-slate-600/50 rounded-sm flex items-center justify-center"
                          title={assetName}
                        >
                          <IconComponent size={10} className="text-slate-300" />
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </React.Fragment>
            )
          }
        })}

        {/* Visual feedback for group selection (from dev) */}
        {isGroupDragging && (
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none rounded" />
        )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
