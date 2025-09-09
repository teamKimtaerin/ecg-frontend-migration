'use client'

import React, { useState } from 'react'
import { LayerElement, TextContent } from '../../../types/layer'

interface TextLayerProps {
  layer: LayerElement
  isEditingMode: boolean
  onUpdate?: (changes: Partial<LayerElement>) => void
}

export default function TextLayer({
  layer,
  isEditingMode,
  onUpdate,
}: TextLayerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  const content = layer.content as TextContent

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems:
      content.verticalAlignment === 'top'
        ? 'flex-start'
        : content.verticalAlignment === 'bottom'
          ? 'flex-end'
          : 'center',
    justifyContent:
      content.alignment === 'left'
        ? 'flex-start'
        : content.alignment === 'right'
          ? 'flex-end'
          : 'center',

    fontSize: layer.style.fontSize || 16,
    fontFamily: layer.style.fontFamily || 'inherit',
    fontWeight: layer.style.fontWeight || 'normal',
    color: layer.style.color || '#ffffff',

    textAlign: content.alignment,
    lineHeight: 1.2,
    wordBreak: 'break-word',
    padding: '4px',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    resize: 'none',
  }

  const handleDoubleClick = () => {
    if (isEditingMode) {
      setIsEditing(true)
      setEditText(content.text)
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...content,
          text: editText,
        },
      })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditText(content.text)
    }
  }

  if (isEditing) {
    return (
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        style={textStyle}
        autoFocus
        className="bg-transparent border-2 border-blue-400 rounded"
      />
    )
  }

  return (
    <div
      style={textStyle}
      onDoubleClick={handleDoubleClick}
      className="cursor-text select-none"
    >
      {content.text}
    </div>
  )
}
