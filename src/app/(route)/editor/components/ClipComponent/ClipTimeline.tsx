import React from 'react'

interface ClipTimelineProps {
  timeline: string
}

export default function ClipTimeline({ timeline }: ClipTimelineProps) {
  return (
    <div className="absolute top-2 left-0 right-0 flex justify-center">
      <span className="text-base text-gray-600 font-mono font-bold">
        {timeline}
      </span>
    </div>
  )
}
