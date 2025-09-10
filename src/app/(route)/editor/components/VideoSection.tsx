'use client'

import React, { useRef } from 'react'
import VideoPlayer from './VideoPlayer'
import EditorMotionTextOverlay from './EditorMotionTextOverlay'

interface VideoSectionProps {
  width?: number
}

const VideoSection: React.FC<VideoSectionProps> = ({ width = 300 }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="bg-gray-900 p-4 flex-shrink-0 h-full flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Video Player with Subtitles */}
      <div
        ref={videoContainerRef}
        className="bg-black rounded-lg mb-4 relative flex-shrink-0"
        style={{ aspectRatio: '16/9' }}
      >
        <VideoPlayer
          className="w-full h-full rounded-lg overflow-hidden"
        />
        {/* MotionText overlay (legacy HTML overlay removed) */}
        <EditorMotionTextOverlay videoContainerRef={videoContainerRef} />
      </div>

    </div>
  )
}

export default VideoSection
