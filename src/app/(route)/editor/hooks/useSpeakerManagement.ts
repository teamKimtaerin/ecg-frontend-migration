import { useState } from 'react'

export function useSpeakerManagement(initialSpeakers: string[] = []) {
  const [speakers, setSpeakers] = useState(
    initialSpeakers.length > 0
      ? initialSpeakers
      : ['Speaker 1', 'Speaker 2', 'Speaker 3']
  )

  const addSpeaker = (newSpeaker: string) => {
    if (newSpeaker && !speakers.includes(newSpeaker)) {
      setSpeakers([...speakers, newSpeaker])
    }
  }

  return {
    speakers,
    addSpeaker,
  }
}
