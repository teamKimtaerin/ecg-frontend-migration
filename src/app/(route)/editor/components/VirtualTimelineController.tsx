'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useEditorStore } from '../store'
import { getSpeakerColor } from '@/utils/editor/speakerColors'
import { VirtualPlayerController } from '@/utils/virtual-timeline/VirtualPlayerController'

interface ClipBlock {
  id: string
  startTime: number
  endTime: number
  duration: number
  speaker: string
  text: string
  color: string
}

interface VirtualTimelineControllerProps {
  virtualPlayerController?: VirtualPlayerController | null
}

const VirtualTimelineController: React.FC<VirtualTimelineControllerProps> = ({
  virtualPlayerController,
}) => {
  const { clips, videoUrl, activeClipId } = useEditorStore()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // 비디오 요소에서 현재 시간 가져오기
  const getVideoElement = (): HTMLVideoElement | null => {
    return document.querySelector('video')
  }

  // 클립 데이터를 타임라인 블록으로 변환 (Virtual Timeline 우선)
  const convertClipsToBlocks = useCallback((): ClipBlock[] => {
    // Virtual Timeline API가 private이므로 clips 데이터를 직접 사용
    // TODO: VirtualPlayerController에서 public API 제공되면 수정

    // Fallback: 기존 clips 데이터 사용
    return clips.map((clip) => {
      const startTime = clip.words.length > 0 ? clip.words[0].start : 0
      const endTime =
        clip.words.length > 0 ? clip.words[clip.words.length - 1].end : 0
      const duration = endTime - startTime

      return {
        id: clip.id,
        startTime,
        endTime,
        duration,
        speaker: clip.speaker,
        text: clip.fullText,
        color: getSpeakerColor(clip.speaker),
      }
    })
  }, [virtualPlayerController, clips])

  // 총 재생 시간 계산 (Virtual Timeline 우선)
  const calculateTotalDuration = useCallback((blocks: ClipBlock[]): number => {
    // Virtual Timeline API가 private이므로 clips 데이터를 직접 사용
    // Fallback: 클립들의 최대 endTime 사용
    if (blocks.length === 0) return 0
    return Math.max(...blocks.map((block) => block.endTime))
  }, [])

  // 시간을 픽셀 위치로 변환
  const timeToPixel = useCallback(
    (time: number): number => {
      const timelineWidth = 800 // 기본 타임라인 너비
      const pixelPerSecond = (timelineWidth * zoomLevel) / totalDuration
      return time * pixelPerSecond
    },
    [totalDuration, zoomLevel]
  )

  // 픽셀 위치를 시간으로 변환
  const pixelToTime = useCallback(
    (pixel: number): number => {
      const timelineWidth = 800
      const pixelPerSecond = (timelineWidth * zoomLevel) / totalDuration
      return pixel / pixelPerSecond
    },
    [totalDuration, zoomLevel]
  )

  // 시간 포맷팅 (mm:ss.f)
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const wholeSeconds = Math.floor(remainingSeconds)
    const fraction = Math.floor((remainingSeconds - wholeSeconds) * 10)
    return `${minutes.toString().padStart(2, '0')}:${wholeSeconds.toString().padStart(2, '0')}.${fraction}`
  }, [])

  // Virtual Timeline 또는 비디오 시간 업데이트 감지
  useEffect(() => {
    if (virtualPlayerController) {
      // Virtual Timeline 콜백 등록
      const timeUpdateCleanup = virtualPlayerController.onTimeUpdate(
        (virtualTime) => {
          setCurrentTime(virtualTime)
          setPlayheadPosition(timeToPixel(virtualTime))
        }
      )

      const playCleanup = virtualPlayerController.onPlay(() => {
        setIsPlaying(true)
      })

      const pauseCleanup = virtualPlayerController.onPause(() => {
        setIsPlaying(false)
      })

      const stopCleanup = virtualPlayerController.onStop(() => {
        setIsPlaying(false)
      })

      // 초기값 설정
      setCurrentTime(virtualPlayerController.getCurrentTime())
      // isPlaying 상태는 콜백에서만 업데이트 (private 속성이므로 직접 접근 불가)

      // Virtual Timeline의 총 duration 가져오기 (private API 사용 불가)
      // TODO: VirtualPlayerController에서 public API 제공되면 수정

      return () => {
        timeUpdateCleanup()
        playCleanup()
        pauseCleanup()
        stopCleanup()
      }
    } else {
      // Fallback: HTML5 비디오 이벤트 감지
      const video = getVideoElement()
      if (!video) return

      const updateTime = () => {
        setCurrentTime(video.currentTime)
        setPlayheadPosition(timeToPixel(video.currentTime))
      }

      const updateDuration = () => {
        const blocks = convertClipsToBlocks()
        const duration = calculateTotalDuration(blocks)
        setTotalDuration(duration)
      }

      const updatePlayState = () => {
        setIsPlaying(!video.paused)
      }

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
    }
  }, [
    virtualPlayerController,
    timeToPixel,
    convertClipsToBlocks,
    calculateTotalDuration,
  ])

  // 클립 데이터 변경시 재계산
  useEffect(() => {
    const blocks = convertClipsToBlocks()
    setTotalDuration(calculateTotalDuration(blocks))
  }, [clips, convertClipsToBlocks, calculateTotalDuration])

  // 타임라인 클릭으로 재생 위치 이동 (Virtual Timeline 사용)
  const handleTimelineClick = useCallback(
    async (event: React.MouseEvent) => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const clickX = event.clientX - rect.left - scrollPosition
      const clickTime = pixelToTime(clickX)
      const seekTime = Math.max(0, Math.min(clickTime, totalDuration))

      if (!virtualPlayerController) {
        // Fallback to HTML5 video
        const video = getVideoElement()
        if (video) {
          video.currentTime = seekTime
        }
        return
      }

      try {
        await virtualPlayerController.seek(seekTime)
      } catch (error) {
        console.error('Virtual Timeline seek failed:', error)
      }
    },
    [virtualPlayerController, pixelToTime, totalDuration, scrollPosition]
  )

  // 클립 블록 클릭으로 해당 클립 선택
  const handleClipClick = useCallback(
    (clipId: string, event: React.MouseEvent) => {
      event.stopPropagation() // 타임라인 클릭 방지

      const { setActiveClipId, clearSelection } = useEditorStore.getState()

      // 클립 선택
      clearSelection()
      setActiveClipId(clipId)
    },
    []
  )

  // 재생/일시정지 컨트롤 (Virtual Timeline 사용)
  const handlePlayPause = useCallback(async () => {
    if (!virtualPlayerController) {
      // Fallback to HTML5 video if Virtual Timeline not available
      const video = getVideoElement()
      if (!video) return

      if (isPlaying) {
        video.pause()
      } else {
        video.play().catch((error) => {
          console.error('Video play failed:', error)
        })
      }
      return
    }

    try {
      if (isPlaying) {
        await virtualPlayerController.pause()
      } else {
        await virtualPlayerController.play()
      }
    } catch (error) {
      console.error('Virtual Timeline play/pause failed:', error)
    }
  }, [virtualPlayerController, isPlaying])

  // 정지 버튼 (처음으로 이동 + 일시정지)
  const handleStop = useCallback(async () => {
    if (!virtualPlayerController) {
      // Fallback to HTML5 video
      const video = getVideoElement()
      if (!video) return

      video.pause()
      video.currentTime = 0
      return
    }

    try {
      await virtualPlayerController.pause()
      await virtualPlayerController.seek(0)
    } catch (error) {
      console.error('Virtual Timeline stop failed:', error)
    }
  }, [virtualPlayerController])

  // 줌 컨트롤
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 5))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 0.5))

  // 클립 블록 렌더링
  const renderClipBlocks = () => {
    const blocks = convertClipsToBlocks()

    return blocks.map((block) => {
      const leftPosition = timeToPixel(block.startTime)
      const width = timeToPixel(block.duration)
      const isActive = activeClipId === block.id

      return (
        <div
          key={block.id}
          className={`absolute top-0 h-full border-2 rounded cursor-pointer transition-all duration-200 ${
            isActive
              ? 'border-blue-500 shadow-md scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
          style={{
            left: `${leftPosition}px`,
            width: `${Math.max(width, 20)}px`, // 최소 너비 보장
            backgroundColor: isActive
              ? block.color + 'A0' // 활성 클립은 더 진한 색상
              : block.color + '80', // 80% 투명도
            borderColor: isActive ? '#3b82f6' : block.color,
          }}
          title={`${block.speaker}: ${block.text.substring(0, 50)}...`}
          onClick={(e) => handleClipClick(block.id, e)}
        >
          <div className="p-1 text-xs text-white truncate">
            <div className="font-semibold drop-shadow-sm">
              {block.speaker || '미지정'}
            </div>
            <div className="opacity-90 font-mono text-[10px] drop-shadow-sm">
              {formatTime(block.startTime)} - {formatTime(block.endTime)}
            </div>
          </div>

          {/* 클립 분할 마커 (가운데 점선) */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-300 opacity-0 hover:opacity-100 transition-opacity cursor-col-resize"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            title="클릭하여 분할"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: 클립 분할 로직 구현
              console.log(`Split clip ${block.id} at middle`)
            }}
          />
        </div>
      )
    })
  }

  // 시간 눈금자 렌더링
  const renderTimeRuler = () => {
    const marks = []
    const interval = totalDuration > 60 ? 10 : totalDuration > 30 ? 5 : 1 // 동적 간격

    for (let time = 0; time <= totalDuration; time += interval) {
      const position = timeToPixel(time)
      marks.push(
        <div
          key={time}
          className="absolute bottom-0 border-l border-gray-300"
          style={{ left: `${position}px`, height: '16px' }}
        >
          <span className="absolute top-0 text-xs text-gray-500 transform -translate-x-1/2 font-mono">
            {formatTime(time)}
          </span>
        </div>
      )
    }

    return marks
  }

  if (!videoUrl) {
    return null
  }

  const timelineWidth = Math.max(800 * zoomLevel, 800)

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">타임라인</span>

          {/* 재생 컨트롤 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePlayPause}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isPlaying
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleStop}
              className="p-1.5 bg-white border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
              title="정지"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>

          {/* 줌 컨트롤 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 text-xs bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
              title="축소"
            >
              −
            </button>
            <span className="text-xs text-gray-500 min-w-[35px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 text-xs bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
              title="확대"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 재생 상태 표시 */}
          <div
            className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          <div className="text-xs text-gray-500 font-mono">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        </div>
      </div>

      {/* 타임라인 영역 */}
      <div className="relative h-20 overflow-x-auto bg-white">
        <div
          ref={timelineRef}
          className="relative h-full cursor-pointer"
          style={{ width: `${timelineWidth}px` }}
          onClick={handleTimelineClick}
        >
          {/* 시간 눈금자 */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-50 border-b border-gray-200">
            {renderTimeRuler()}
          </div>

          {/* 클립 트랙 */}
          <div className="absolute top-4 left-0 w-full h-16 bg-white">
            {renderClipBlocks()}
          </div>

          {/* 재생헤드 */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20 drop-shadow-sm"
            style={{ left: `${playheadPosition}px` }}
          >
            <div
              className="absolute top-0 w-3 h-3 bg-red-500 transform -translate-x-1/2"
              style={{
                clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualTimelineController
