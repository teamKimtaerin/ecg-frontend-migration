'use client'

import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ClipComponent, { ClipItem } from './ClipComponent'

interface SubtitleEditListProps {
  clips: ClipItem[]
  selectedClipIds: Set<string>
  onClipSelect: (clipId: string) => void
  onClipCheck?: (clipId: string, checked: boolean) => void
  onWordEdit: (clipId: string, wordId: string, newText: string) => void
  onSpeakerChange?: (clipId: string, newSpeaker: string) => void
}

export default function SubtitleEditList({
  clips,
  selectedClipIds,
  onClipSelect,
  onClipCheck,
  onWordEdit,
  onSpeakerChange,
}: SubtitleEditListProps) {
  return (
    <div className="w-[800px] bg-gray-900 p-4">
      <SortableContext
        items={clips.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {clips.map((clip) => (
            <ClipComponent
              key={clip.id}
              clip={clip}
              isSelected={false} // Single selection not used anymore
              isChecked={selectedClipIds.has(clip.id)}
              isMultiSelected={selectedClipIds.has(clip.id)}
              enableDragAndDrop={true}
              onSelect={onClipSelect}
              onCheck={onClipCheck}
              onWordEdit={onWordEdit}
              onSpeakerChange={onSpeakerChange}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
