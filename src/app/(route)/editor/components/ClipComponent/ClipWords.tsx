import { useRef } from 'react'
import React, { useCallback } from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Word } from './types'
import ClipWord from './ClipWord'
import { useWordGrouping } from '../../hooks/useWordGrouping'
import { useEditorStore } from '../../store'
import { getAssetIcon } from '../../utils/assetIconMapper'

interface ClipWordsProps {
  clipId: string
  words: Word[]
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
  onWordEdit,
}: ClipWordsProps) {
  // Add ref for debouncing clicks
  const lastClickTimeRef = useRef(0)

  const {
    // From dev branch
    setFocusedWord,
    clearWordFocus,
    draggedWordId,
    setActiveClipId,
    // From feat/editor-asset-sidebar-clean branch
    setSelectedWordId,
    setCurrentWordAssets,
    selectedWordAssets,
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
    (wordId: string) => {
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
    },
    [
      clipId,
      words,
      setFocusedWord,
      clearWordFocus,
      setActiveClipId,
      setSelectedWordId,
      setCurrentWordAssets,
      selectedWordAssets,
    ]
  )

  // Create sortable items for DnD (from dev)
  const sortableItems = words.map((word) => `${clipId}-${word.id}`)

  // Find the dragged word for overlay (from dev)
  const draggedWord = words.find((w) => w.id === draggedWordId)

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
        {words.map((word) => {
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
        })}

        {/* Visual feedback for group selection (from dev) */}
        {isGroupDragging && (
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none rounded" />
        )}
      </div>
    </SortableContext>
  )
}
