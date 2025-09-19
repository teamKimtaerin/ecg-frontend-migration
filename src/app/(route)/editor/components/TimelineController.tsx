'use client'

import React from 'react'
import { useEditorStore } from '../store'

const TimelineController: React.FC = () => {
  const { videoUrl, clips } = useEditorStore()

  // 비디오 요소에 직접 접근하여 상태 가져오기
  const getVideoElement = (): HTMLVideoElement | null => {
    return document.querySelector('video')
  }

  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  // 비디오 상태 업데이트
  React.useEffect(() => {
    const video = getVideoElement()
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration || 0)
    const updatePlayState = () => setIsPlaying(!video.paused)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', updatePlayState)
    video.addEventListener('pause', updatePlayState)

    // 초기값 설정
    updateTime()
    updateDuration()
    updatePlayState()

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', updatePlayState)
      video.removeEventListener('pause', updatePlayState)
    }
  }, [videoUrl])

  const togglePlayPause = () => {
    const video = getVideoElement()
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const seekTo = (time: number) => {
    const video = getVideoElement()
    if (!video || time < 0 || time > duration) return
    
    video.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!videoUrl) {
    return null
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time Display */}
        <div className="text-sm text-gray-300 font-mono min-w-[80px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Timeline Progress Bar */}
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer timeline-slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%, #374151 100%)`
            }}
          />
          
          {/* Clip markers on timeline */}
          {clips.map((clip, index) => {
            if (!clip.startTime || !duration) return null
            const position = (clip.startTime / duration) * 100
            return (
              <div
                key={clip.id || index}
                className="absolute top-0 w-0.5 h-3 bg-yellow-400 pointer-events-none"
                style={{ left: `${position}%` }}
              />
            )
          })}
        </div>

        {/* Skip Buttons */}
        <button
          onClick={() => seekTo(currentTime - 5)}
          className="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title="5초 뒤로"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>

        <button
          onClick={() => seekTo(currentTime + 5)}
          className="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title="5초 앞으로"
        >
          <svg className="w-4 h-4 text-white scale-x-[-1]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TimelineController