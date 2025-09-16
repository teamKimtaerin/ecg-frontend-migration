import { useRef } from 'react'
import React, { useCallback } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Word } from './types'
import ClipWord from './ClipWord'
import { useWordDragAndDrop } from '../../hooks/useWordDragAndDrop'
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
    selectedWordId,
    setSelectedWordId,
    currentWordAssets,
    setCurrentWordAssets,
    selectedWordAssets,
  } = useEditorStore()

  // Asset related state with icon support
  const [allAssets, setAllAssets] = React.useState<AssetDatabaseItem[]>([])

  // Setup drag and drop for words (from dev)
  const {
    sensors,
    handleWordDragStart,
    handleWordDragOver,
    handleWordDragEnd,
    handleWordDragCancel,
  } = useWordDragAndDrop(clipId)

  // Setup grouping functionality (from dev)
  const {
    containerRef,
    isDragging: isGroupDragging,
    handleMouseDown,
    handleKeyDown,
    groupedWordIds,
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
          const assetsWithIcons: AssetDatabaseItem[] = data.assets.map((asset: any) => ({
            id: asset.id,
            title: asset.title,
            iconName: asset.iconName,
          }))
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
    (wordId: string, isCenter: boolean) => {
      const word = words.find((w) => w.id === wordId)
      if (!word) return

      // Prevent rapid clicks from causing conflicts
      const now = Date.now()
      if (now - lastClickTimeRef.current < 50) {
        return
      }
      lastClickTimeRef.current = now

      // For single-click: always move focus to this word and open waveform
      const wordAssets = selectedWordAssets[wordId] || word.appliedAssets || []
      // Clear previous focus first to avoid modal state conflicts
      clearWordFocus()
      // Defer re-focus to ensure clear completes
      setTimeout(() => {
        setFocusedWord(clipId, wordId)
        setActiveClipId(clipId)
        setSelectedWordId(wordId)
        setCurrentWordAssets(wordAssets)
        // Open expanded waveform for the clicked word
        const store = useEditorStore.getState() as any
        store.expandClip?.(clipId, wordId)
      }, 0)
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleWordDragStart}
      onDragOver={handleWordDragOver}
      onDragEnd={handleWordDragEnd}
      onDragCancel={handleWordDragCancel}
    >
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

      {/* Drag overlay for better visual feedback (from dev) */}
      <DragOverlay>
        {draggedWord && (
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm shadow-lg opacity-90">
            {groupedWordIds.size > 1
              ? `${groupedWordIds.size} words`
              : draggedWord.text}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
