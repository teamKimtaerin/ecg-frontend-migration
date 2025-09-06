'use client'

import React, { useState } from 'react'
import { ClipComponentProps } from './types'
import ClipTimeline from './ClipTimeline'
import ClipCheckbox from './ClipCheckbox'
import ClipSpeaker from './ClipSpeaker'
import ClipWords from './ClipWords'
import ClipText from './ClipText'
import { useClipDragAndDrop } from './hooks/useClipDragAndDrop'
import { useClipStyles } from './hooks/useClipStyles'
import { useSpeakerManagement } from './hooks/useSpeakerManagement'

export default function ClipComponent({
  clip,
  isSelected,
  isChecked = false,
  isMultiSelected = false,
  enableDragAndDrop = false,
  onSelect,
  onCheck,
  onWordEdit,
  onSpeakerChange,
}: ClipComponentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { speakers } = useSpeakerManagement()
  const { dragProps, isDragging } = useClipDragAndDrop(
    clip.id,
    enableDragAndDrop
  )
  const { containerClassName, sidebarClassName, contentClassName } =
    useClipStyles({
      isSelected,
      isChecked,
      isMultiSelected,
      isHovered,
      isDragging,
    })

  return (
    <div
      {...dragProps}
      className={`sortable-clip ${containerClassName}`}
      data-clip-id={clip.id}
      onClick={() => onSelect(clip.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {/* Left sidebar */}
        <div className={sidebarClassName}>
          <ClipTimeline timeline={clip.timeline} />
          <ClipCheckbox
            clipId={clip.id}
            isChecked={isChecked || isMultiSelected}
            onCheck={onCheck}
          />
        </div>

        {/* Right content */}
        <div className={contentClassName}>
          {/* Upper section */}
          <div className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center flex-1 pl-4">
                <ClipSpeaker
                  clipId={clip.id}
                  speaker={clip.speaker}
                  speakers={speakers}
                  onSpeakerChange={onSpeakerChange}
                />
                <div className="w-12" />
                <ClipWords
                  clipId={clip.id}
                  words={clip.words}
                  onWordEdit={onWordEdit}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-400" />

          {/* Lower section */}
          <ClipText fullText={clip.fullText} />
        </div>
      </div>
    </div>
  )
}

// Re-export types for convenience
export type { ClipItem, ClipComponentProps } from './types'
