import React, { useState, useEffect, useRef } from 'react'

interface ClipTextProps {
  clipId: string
  fullText: string
  onFullTextEdit?: (clipId: string, newText: string) => void
}

export default function ClipText({ clipId, fullText, onFullTextEdit }: ClipTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(fullText)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(fullText)
  }, [fullText])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    if (onFullTextEdit) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (onFullTextEdit && inputValue.trim() !== fullText) {
      onFullTextEdit(clipId, inputValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setInputValue(fullText)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  if (isEditing) {
    return (
      <div className="p-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full text-sm text-black text-center bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    )
  }

  return (
    <div className="p-3">
      <div
        className="text-sm text-black text-center cursor-text hover:bg-gray-50 rounded px-2 py-1 transition-colors"
        onClick={handleClick}
      >
        {fullText}
      </div>
    </div>
  )
}
