import React, { useRef, useCallback, useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sticker, Word } from '../../types'
import { useEditorStore } from '../../store'
import { useStickerResize } from '../../hooks/useStickerResize'
import TooltipPortal from './TooltipPortal'

interface ClipStickerProps {
  sticker: Sticker
  clipId: string
  clipWords: Word[]
  onStickerClick: (stickerId: string) => void
  onStickerDelete?: (stickerId: string) => void
}

export default function ClipSticker({
  sticker,
  clipId,
  clipWords,
  onStickerClick,
  onStickerDelete,
}: ClipStickerProps) {
  const stickerRef = useRef<HTMLDivElement>(null)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

  const {
    multiSelectedWordIds,
    canDragWord,
    playingWordId,
    playingClipId,
    setStickerFocus,
    selectedStickerId,
    focusedStickerId,
    // Get textInsertion methods to select corresponding InsertedText
    insertedTexts,
    selectText,
  } = useEditorStore()

  // Find corresponding inserted text for this sticker
  const correspondingText = insertedTexts?.find(
    (text: { id: string }) => text.id === sticker.originalInsertedTextId
  )

  // Setup resize functionality
  const {
    isResizing,
    previewEndTime,
    handleResizeStart,
    getDuration,
  } = useStickerResize({
    sticker,
    correspondingText,
    clipWords,
  })

  const isFocused = focusedStickerId === sticker.id
  const isSelected = selectedStickerId === sticker.id
  const isMultiSelected = multiSelectedWordIds.has(sticker.id) // Keep for compatibility
  const isDraggable = canDragWord(sticker.id) // Keep for compatibility
  const isPlaying = playingWordId === sticker.id
  const isInPlayingClip = playingClipId === clipId
  const isOtherClipPlaying = playingClipId !== null && playingClipId !== clipId

  // Setup drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({
    id: `${clipId}-${sticker.id}`,
    data: {
      type: 'sticker',
      sticker,
      clipId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Handle click events
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      const currentTime = Date.now()
      const timeDiff = currentTime - lastClickTime
      const isDoubleClick = timeDiff < 300

      if (isDoubleClick) {
        // Double click - no special action for stickers (they're just visual indicators)
        return
      }

      // Single click - focus sticker, activate sidebar, and seek to sticker time
      setStickerFocus(clipId, sticker.id)

      // Find and select corresponding InsertedText
      if (insertedTexts && selectText) {
        const matchingInsertedText = insertedTexts.find(
          (text: { content: string; startTime: number; endTime: number; id: string }) =>
            text.content === sticker.text &&
            Math.abs(text.startTime - sticker.start) < 0.1 && // Allow small time difference
            Math.abs(text.endTime - sticker.end) < 0.1
        )

        if (matchingInsertedText) {
          selectText(matchingInsertedText.id)
          console.log(
            '🎯 Selected corresponding InsertedText:',
            matchingInsertedText.id,
            matchingInsertedText.content
          )
        }
      }

      const videoPlayer = (
        window as {
          videoPlayer?: {
            seekTo: (time: number) => void
            pauseAutoWordSelection?: () => void
          }
        }
      ).videoPlayer
      if (videoPlayer) {
        videoPlayer.seekTo(sticker.start)
        if (videoPlayer.pauseAutoWordSelection) {
          videoPlayer.pauseAutoWordSelection()
        }
      }

      onStickerClick(sticker.id)
      setLastClickTime(currentTime)
    },
    [
      sticker.id,
      sticker.start,
      sticker.end,
      sticker.text,
      clipId,
      onStickerClick,
      lastClickTime,
      setStickerFocus,
      insertedTexts,
      selectText,
    ]
  )

  // Unified mouse down handler (resize, click, or position drag)
  const handleUnifiedMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const isRightEdge = clickX > rect.width - 5 // Right 5px area for resize

      if (isRightEdge && correspondingText) {
        // Right edge - start resize drag
        e.stopPropagation()
        handleResizeStart(e)
      } else {
        // Check if this is a position drag or click
        const timeSinceLastClick = Date.now() - lastClickTime
        const isDragIntent = e.type === 'mousedown' && !isResizing
        
        if (isDragIntent && isDraggable && listeners?.onMouseDown) {
          // Position drag - use sortable drag
          listeners.onMouseDown(e as React.MouseEvent<HTMLElement>)
        } else {
          // Regular click
          handleClick(e)
        }
      }
    },
    [correspondingText, handleResizeStart, handleClick, lastClickTime, isResizing, isDraggable, listeners]
  )

  // Handle delete button click
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      
      if (onStickerDelete) {
        onStickerDelete(sticker.id)
      }
    },
    [onStickerDelete, sticker.id]
  )

  // Handle keyboard shortcuts for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if this sticker is selected and focused
      if (isFocused && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        e.stopPropagation()
        
        if (onStickerDelete) {
          onStickerDelete(sticker.id)
        }
      }
    }

    if (isFocused) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFocused, onStickerDelete, sticker.id])

  // Calculate tooltip position when resizing starts with dynamic adjustment
  useEffect(() => {
    if (isResizing && stickerRef.current) {
      const rect = stickerRef.current.getBoundingClientRect()
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      
      // Tooltip dimensions (approximate)
      const tooltipWidth = 140
      const tooltipHeight = 60
      
      // Calculate initial position (above and centered)
      let x = rect.left + scrollX + rect.width / 2
      let y = rect.top + scrollY - 10
      
      // Adjust for screen boundaries
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX,
        scrollY
      }
      
      // Check horizontal boundaries
      if (x - tooltipWidth / 2 < viewport.scrollX + 10) {
        // Too far left, align to left edge with padding
        x = viewport.scrollX + tooltipWidth / 2 + 10
      } else if (x + tooltipWidth / 2 > viewport.scrollX + viewport.width - 10) {
        // Too far right, align to right edge with padding
        x = viewport.scrollX + viewport.width - tooltipWidth / 2 - 10
      }
      
      // Check vertical boundaries
      if (y - tooltipHeight < viewport.scrollY + 10) {
        // Too close to top, show below the sticker instead
        y = rect.bottom + scrollY + 10
      }
      
      setTooltipPosition({ x, y })
    } else {
      setTooltipPosition(null)
    }
  }, [isResizing])

  // Determine visual state classes
  const getStickerClasses = () => {
    const classes = [
      'relative',
      'inline-block',
      'px-2',
      'py-1',
      'text-sm',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'cursor-pointer',
      'select-none',
      'min-w-[40px]',
      'text-center',
      'font-bold',
    ]

    if (isPlaying) {
      // Currently playing sticker - highlighted with animated gradient
      classes.push(
        'bg-gradient-to-r',
        'from-purple-400',
        'via-purple-500',
        'to-purple-600',
        'text-white',
        'shadow-md',
        'ring-2',
        'ring-purple-300',
        'ring-opacity-50',
        'transform',
        'scale-105',
        'transition-all',
        'duration-300',
        'animate-pulse'
      )
    } else if (isFocused || isSelected) {
      classes.push(
        'bg-purple-700',
        'text-white',
        'ring-2',
        'ring-purple-300',
        'shadow-lg'
      )
    } else if (isMultiSelected) {
      classes.push('bg-purple-500', 'text-white', 'shadow-md')
    } else {
      // Default sticker styling - purple theme to distinguish from words
      classes.push(
        'bg-purple-100',
        'border-2',
        'border-purple-400',
        'hover:border-purple-600',
        'hover:bg-purple-200',
        'text-purple-800',
        'shadow-sm'
      )

      // Dim stickers when other clips are playing
      if (isOtherClipPlaying) {
        classes.push('opacity-40')
      } else if (isInPlayingClip && !isPlaying) {
        classes.push('opacity-70')
      }
    }

    if (isResizing) {
      classes.push(
        'ring-2', 
        'ring-purple-300', 
        'cursor-ew-resize',
        'bg-purple-600',
        'text-white',
        'shadow-lg',
        'border-2',
        'border-purple-400',
        'transform',
        'scale-105'
      )
    } else if (isBeingDragged) {
      classes.push('opacity-50', 'cursor-grabbing')
    } else if (isDraggable) {
      classes.push('cursor-grab')
    }

    return classes.join(' ')
  }

  // Clean attributes without mouse events (we handle them manually)
  const cleanAttributes = isDraggable
    ? {
        ...attributes,
        // Remove onMouseDown from listeners to prevent conflicts
      }
    : attributes

  return (
    <div
      ref={(node) => {
        stickerRef.current = node
        setNodeRef(node)
      }}
      className={getStickerClasses()}
      style={style}
      data-sticker-id={sticker.id}
      data-clip-id={clipId}
      title={`📝 삽입 텍스트: ${sticker.text} (${getDuration().toFixed(1)}s)`}
      {...cleanAttributes}
      onMouseDown={handleUnifiedMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const isRightEdge = mouseX > rect.width - 5
        e.currentTarget.style.cursor = isRightEdge && correspondingText ? 'ew-resize' : 'pointer'
      }}
    >
      {/* Display 'T' icon for text stickers */}
      <span className="text-lg font-bold">T</span>

      {/* Right edge resize handle (visible only on hover) */}
      {correspondingText && (
        <div 
          className={`absolute right-0 top-0 w-1 h-full transition-all duration-200 ${
            isResizing 
              ? 'bg-purple-400 opacity-100 w-2' 
              : 'hover:bg-purple-300 opacity-0 hover:opacity-50'
          }`}
          style={{ cursor: 'ew-resize' }}
        />
      )}

      {/* Resize drag area indicator */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-lg pointer-events-none animate-pulse" />
      )}

      {/* Portal-based resize preview indicator */}
      <TooltipPortal isVisible={isResizing && previewEndTime !== null && tooltipPosition !== null}>
        {tooltipPosition && (
          <div 
            className="fixed bg-purple-900/90 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-purple-400 pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 10000
            }}
          >
            <div className="text-center">
              <div className="font-bold">{getDuration().toFixed(1)}s</div>
              <div className="text-xs opacity-80">드래그하여 시간 조절</div>
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-900/90"></div>
          </div>
        )}
      </TooltipPortal>

      {/* Delete button (visible on hover) */}
      {isHovered && onStickerDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-lg hover:scale-110 z-10"
          title="삭제"
        >
          ×
        </button>
      )}

      {/* Small indicator showing it's a sticker */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
    </div>
  )
}
