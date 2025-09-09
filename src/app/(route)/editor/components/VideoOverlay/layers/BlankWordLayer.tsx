'use client'

import React, { useState } from 'react'
import { LayerElement, BlankWordContent } from '../../../types/layer'

interface BlankWordLayerProps {
  layer: LayerElement
  isEditingMode: boolean
  onUpdate?: (changes: Partial<LayerElement>) => void
}

export default function BlankWordLayer({
  layer,
  isEditingMode,
  onUpdate,
}: BlankWordLayerProps) {
  const [userInput, setUserInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const content = layer.content as BlankWordContent

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize: layer.style.fontSize || 16,
    fontFamily: layer.style.fontFamily || 'inherit',
    fontWeight: layer.style.fontWeight || 'normal',
    color: layer.style.color || '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: `2px ${content.isRequired ? 'solid' : 'dashed'} ${layer.style.borderColor || '#ffff00'}`,
    borderRadius: layer.style.borderRadius || 4,
    padding: '4px 8px',
    textAlign: 'center',
    outline: 'none',
  }

  const placeholderStyle: React.CSSProperties = {
    ...inputStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
    color: '#ffff00',
    cursor: 'text',
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)

    // 실시간으로 업데이트하거나 onBlur에서 업데이트
    if (onUpdate) {
      onUpdate({
        content: {
          ...content,
          // 여기서는 실제 클립의 빈 워드를 업데이트해야 함
        },
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  const isValid =
    !content.validation ||
    ((!content.validation.minLength ||
      userInput.length >= content.validation.minLength) &&
      (!content.validation.maxLength ||
        userInput.length <= content.validation.maxLength) &&
      (!content.validation.pattern ||
        new RegExp(content.validation.pattern).test(userInput)))

  const showPlaceholder = !userInput && !isFocused

  if (showPlaceholder && !isEditingMode) {
    return <div style={placeholderStyle}>[{content.placeholder}]</div>
  }

  return (
    <input
      type="text"
      value={userInput}
      onChange={handleInputChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      placeholder={content.placeholder}
      disabled={!isEditingMode && layer.metadata.locked}
      style={{
        ...inputStyle,
        borderColor: !isValid
          ? '#ff0000'
          : layer.style.borderColor || '#ffff00',
        backgroundColor: showPlaceholder
          ? 'rgba(255, 255, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.7)',
      }}
      className={`
        transition-all duration-200
        ${!isValid ? 'animate-pulse' : ''}
        ${content.isRequired && !userInput ? 'ring-2 ring-red-400' : ''}
      `}
    />
  )
}
