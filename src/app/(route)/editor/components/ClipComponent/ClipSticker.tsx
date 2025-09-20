import React, { useRef, useCallback, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sticker } from '../../types'
import { useEditorStore } from '../../store'

interface ClipStickerProps {
  sticker: Sticker
  clipId: string
  onStickerClick: (stickerId: string) => void
}

export default function ClipSticker({
  sticker,
  clipId,
  onStickerClick,
}: ClipStickerProps) {
  const stickerRef = useRef<HTMLDivElement>(null)
  const [lastClickTime, setLastClickTime] = useState(0)

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
    id: sticker.id,
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
          (text: any) =>
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

  // Determine visual state classes
  const getStickerClasses = () => {
    const classes = [
      'relative',
      'inline-block',
      'px-3',
      'py-2',
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

    if (isBeingDragged) {
      classes.push('opacity-50', 'cursor-grabbing')
    } else if (isDraggable) {
      classes.push('cursor-grab')
    }

    return classes.join(' ')
  }

  // Drag handlers
  const dragListeners = isDraggable
    ? {
        ...listeners,
        onMouseDown: (e: React.MouseEvent) => {
          if (isDraggable && listeners?.onMouseDown) {
            listeners.onMouseDown(e as React.MouseEvent<HTMLElement>)
          }
        },
      }
    : {}

  return (
    <div
      ref={(node) => {
        stickerRef.current = node
        setNodeRef(node)
      }}
      className={getStickerClasses()}
      style={style}
      onClick={handleClick}
      data-sticker-id={sticker.id}
      data-clip-id={clipId}
      title={`📝 삽입 텍스트: ${sticker.text} (${sticker.start.toFixed(2)}s - ${sticker.end.toFixed(2)}s)`}
      {...attributes}
      {...dragListeners}
    >
      {/* Display 'T' icon for text stickers */}
      <span className="text-lg font-bold">T</span>

      {/* Small indicator showing it's a sticker */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
    </div>
  )
}
