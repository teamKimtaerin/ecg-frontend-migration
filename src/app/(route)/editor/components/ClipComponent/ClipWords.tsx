import React from 'react'
import { Word } from './types'

interface ClipWordsProps {
  clipId: string
  words: Word[]
  onWordEdit: (clipId: string, wordId: string, newText: string) => void
}

export default function ClipWords({
  clipId,
  words,
  onWordEdit,
}: ClipWordsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {words.map((word) => (
        <button
          key={word.id}
          className="bg-white border border-gray-300 hover:border-gray-400 rounded px-2 py-1 text-sm text-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onWordEdit(clipId, word.id, word.text)
          }}
        >
          {word.text}
        </button>
      ))}
    </div>
  )
}
