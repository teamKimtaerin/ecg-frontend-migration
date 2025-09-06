import React from 'react'
import Dropdown from '@/components/ui/Dropdown'

interface ClipSpeakerProps {
  clipId: string
  speaker: string
  speakers: string[]
  onSpeakerChange?: (clipId: string, newSpeaker: string) => void
}

export default function ClipSpeaker({
  clipId,
  speaker,
  speakers,
  onSpeakerChange,
}: ClipSpeakerProps) {
  const handleChange = (value: string) => {
    if (!onSpeakerChange) return

    if (value === 'add_new') {
      const newSpeaker = prompt('새 Speaker 이름을 입력하세요:')
      if (newSpeaker && newSpeaker.trim()) {
        onSpeakerChange(clipId, newSpeaker.trim())
      }
    } else {
      onSpeakerChange(clipId, value)
    }
  }

  return (
    <Dropdown
      value={speaker}
      options={[
        ...speakers.map((s) => ({ value: s, label: s })),
        { value: 'add_new', label: '+ 새 Speaker 추가' },
      ]}
      size="small"
      className="text-sm flex-shrink-0"
      onChange={handleChange}
    />
  )
}
