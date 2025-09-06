'use client'

import React from 'react'
import { useEditorStore } from '../store'
import { SEMANTIC_COLORS } from '@/lib/utils/colors'

export default function DragOverlayContent() {
  const { activeId, clips, selectedClipIds } = useEditorStore()

  const activeClip = clips.find((c) => c.id === activeId)

  if (!activeClip) return null

  const isMultiple = selectedClipIds.size > 1 && selectedClipIds.has(activeId!)

  return (
    <div
      className={`rounded-lg p-4 shadow-2xl opacity-90 ${SEMANTIC_COLORS.neutral.background} ${SEMANTIC_COLORS.neutral.border} border-2`}
    >
      <div className={`text-sm font-semibold ${SEMANTIC_COLORS.neutral.text}`}>
        {isMultiple
          ? `Moving ${selectedClipIds.size} clips together`
          : activeClip.fullText}
      </div>
    </div>
  )
}
