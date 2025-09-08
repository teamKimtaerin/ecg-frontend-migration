import React, { useState, useRef, useEffect } from 'react'
import { LuX, LuPlus, LuTrash2 } from 'react-icons/lu'

interface SpeakerManagementSidebarProps {
  isOpen: boolean
  onClose: () => void
  speakers: string[]
  onAddSpeaker: (name: string) => void
  onRemoveSpeaker: (name: string) => void
  onRenameSpeaker: (oldName: string, newName: string) => void
}

export default function SpeakerManagementSidebar({
  isOpen,
  onClose,
  speakers,
  onAddSpeaker,
  onRemoveSpeaker,
  onRenameSpeaker,
}: SpeakerManagementSidebarProps) {
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingSpeaker && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingSpeaker])

  const handleAddSpeaker = () => {
    const nextSpeakerNumber = speakers.length + 1
    const newSpeakerName = `화자${nextSpeakerNumber}`
    onAddSpeaker(newSpeakerName)
  }

  const handleStartEdit = (speaker: string) => {
    setEditingSpeaker(speaker)
    setEditingName(speaker)
  }

  const handleSaveEdit = () => {
    const trimmedName = editingName.trim()
    if (!trimmedName || !editingSpeaker) return

    // 중복 체크 (자기 자신은 제외)
    if (trimmedName !== editingSpeaker && speakers.includes(trimmedName)) {
      alert('이미 존재하는 화자명입니다.')
      return
    }

    onRenameSpeaker(editingSpeaker, trimmedName)
    setEditingSpeaker(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingSpeaker(null)
    setEditingName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const getSpeakerColor = (index: number) => {
    const colors = [
      'bg-cyan-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-blue-500',
      'bg-red-500',
    ]
    return colors[index % colors.length]
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`
        fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">화자 관리</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Speaker List */}
          <div className="space-y-3 mb-6">
            {speakers.map((speaker, index) => (
              <div
                key={speaker}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg min-h-[52px]"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full flex-shrink-0 ${getSpeakerColor(index)}`}
                  />
                  {editingSpeaker === speaker ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSaveEdit}
                      className="flex-1 bg-transparent text-white font-medium border-b border-cyan-500 outline-none min-w-0 truncate"
                      style={{ maxWidth: 'calc(100% - 60px)' }}
                    />
                  ) : (
                    <span
                      className="text-white font-medium cursor-pointer hover:text-cyan-400 transition-colors flex-1 truncate overflow-hidden whitespace-nowrap"
                      onClick={() => handleStartEdit(speaker)}
                      style={{ maxWidth: 'calc(100% - 60px)' }}
                    >
                      {speaker}
                    </span>
                  )}
                </div>
                {editingSpeaker !== speaker && (
                  <button
                    onClick={() => onRemoveSpeaker(speaker)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                    title="삭제"
                  >
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {speakers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                등록된 화자가 없습니다
              </div>
            )}
          </div>

          {/* Add Speaker */}
          <button
            onClick={handleAddSpeaker}
            className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg
                      text-gray-400 hover:text-white hover:border-gray-500
                      transition-all flex items-center justify-center space-x-2"
          >
            <LuPlus className="w-5 h-5" />
            <span>화자 추가하기</span>
          </button>
        </div>
      </div>
    </>
  )
}
