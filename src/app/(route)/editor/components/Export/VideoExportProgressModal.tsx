'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

interface VideoExportProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export default function VideoExportProgressModal({
  isOpen,
  onClose,
  onComplete,
}: VideoExportProgressModalProps) {
  const [progress, setProgress] = useState(0)

  // 진행률 시뮬레이션
  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      return
    }

    const duration = 4000 // 4초간 진행
    const intervalTime = 50 // 50ms마다 업데이트
    const increment = 100 / (duration / intervalTime)

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(interval)
          // 100% 완료 시 잠시 후 완료 콜백 호출
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, intervalTime)

    return () => {
      clearInterval(interval)
    }
  }, [isOpen, onComplete])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // 가상의 남은 시간 계산 (진행률 기반)
  const remainingSeconds = Math.max(0, Math.floor((100 - progress) * 0.02)) // 0.02초 per %

  if (!isOpen) return null

  return (
    <div className="!fixed !bottom-4 !right-4 !w-[350px] !max-h-[calc(100vh-2rem)] !bg-white !rounded-xl !shadow-2xl !p-4 !overflow-y-auto !block" style={{ zIndex: 10000001 }}>
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FaTimes className="w-4 h-4" />
      </button>

      {/* 제목과 아이콘 */}
      <div className="flex items-center mb-4 pr-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
          </div>
          <h2 className="text-base font-medium text-gray-900">영상을 출력하고 있습니다</h2>
        </div>
      </div>

      {/* 썸네일 */}
      <div className="mb-4">
        <div className="w-full h-[120px] bg-gray-100 rounded-md overflow-hidden relative">
          <Image
            src="/friends-thumbnail.png"
            alt="Video thumbnail"
            width={350}
            height={120}
            className="w-full h-full object-cover"
            unoptimized
          />
          {/* 오버레이 텍스트 */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            비디오를 내보내는 중입니다...
          </div>
        </div>
      </div>

      {/* 진행률과 시간 */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-blue-500 font-semibold">{Math.round(progress)}%</span>
        <span className="text-gray-500">남은 시간: {formatTime(remainingSeconds)}</span>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          취소
        </button>
      </div>

      {/* 프로그레스바 */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}