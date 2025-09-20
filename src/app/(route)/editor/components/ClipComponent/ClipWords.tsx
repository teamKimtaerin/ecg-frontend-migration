import { useRef } from 'react'
import React, { useCallback } from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
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

  // Create sortable items for DnD (only words, stickers are not draggable in subtitle context)
  const sortableItems = wordItems.map((item) => `${clipId}-${item.item.id}`)

  // For visual display, combine and sort by time (but keep semantic separation)
  const allItems = [...wordItems, ...stickerItems].sort(
    (a, b) => a.start - b.start
  )

  return (
    <SortableContext
      items={sortableItems}
      strategy={horizontalListSortingStrategy}
    >
      <div
        ref={containerRef}
        className="flex flex-wrap gap-1 relative cursor-pointer"
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
                  onStickerClick={(stickerId) =>
                    handleWordClick(stickerId, false)
                  } // Reuse word click handler
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
  )
}
