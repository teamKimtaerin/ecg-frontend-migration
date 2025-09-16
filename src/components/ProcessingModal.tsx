'use client'

import React, { useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

export interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  onCancel?: () => void
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'select'
  progress: number
  currentStage?: string
  estimatedTimeRemaining?: number
  fileName?: string
  canCancel?: boolean
  backdrop?: boolean
}

const STAGE_MESSAGES = {
  file_validation: '파일 검증 중',
  audio_extraction: '오디오 추출 중',
  whisper_transcription: '음성 인식 중',
  speaker_diarization: '화자 분리 중',
  post_processing: '후처리 중',
} as const

export default function ProcessingModal({
  isOpen,
  onClose,
  onCancel,
  status,
  progress,
  currentStage,
  estimatedTimeRemaining,
  fileName,
  canCancel = true,
  backdrop = true,
}: ProcessingModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const dragStartRef = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    // 텍스트 선택 등 기본 동작 방지
    e.preventDefault()
    setDragging(true)

    // 현재 마우스 위치에서 모달의 현재 위치를 뺀 값을 저장
    // 이렇게 해야 모달의 어느 곳을 클릭해도 그 위치를 기준으로 이동합니다.
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return

    const newX = e.clientX - dragStartRef.current.x
    const newY = e.clientY - dragStartRef.current.y
    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  // 모달 바깥으로 마우스가 나가도 드래그가 풀리도록 이벤트 추가
  const handleMouseLeave = () => {
    if (dragging) {
      setDragging(false)
    }
  }
  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return '업로드 중'
      case 'processing':
        return '처리 중'
      case 'completed':
        return '완료!'
      case 'failed':
        return '오류 발생'
      default:
        return '준비 중'
    }
  }

  const getStatusEmoji = () => {
    switch (status) {
      case 'uploading':
        return '📤'
      case 'processing':
        return '⚙️'
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '⏳'
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }

  const getCurrentStageMessage = () => {
    if (!currentStage) return null
    return (
      STAGE_MESSAGES[currentStage as keyof typeof STAGE_MESSAGES] ||
      currentStage
    )
  }

  const getGradientColor = () => {
    switch (status) {
      case 'uploading':
        return 'from-blue-500 to-cyan-500'
      case 'processing':
        return 'from-purple-500 to-pink-500'
      case 'completed':
        return 'from-green-500 to-emerald-500'
      case 'failed':
        return 'from-red-500 to-rose-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getProgressBarColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-gradient-to-r from-blue-400 to-cyan-400'
      case 'processing':
        return 'bg-gradient-to-r from-purple-400 to-pink-400'
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-emerald-400'
      case 'failed':
        return 'bg-gradient-to-r from-red-400 to-rose-400'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const shouldShowCloseButton = status === 'completed' || status === 'failed'

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur effect - clickable background */}
      {backdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-none z-[9998]" />
      )}

      {/* Draggable Modal */}
      <div
        className="fixed w-[500px] max-w-[90vw] shadow-2xl rounded-xl overflow-hidden pointer-events-auto z-[9999]"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        role="dialog"
        aria-label="처리 진행 상황"
      >
        {/* 그라디언트 헤더 */}
        <div
          className={`bg-gradient-to-r ${getGradientColor()} p-6 rounded-t-xl cursor-grab`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">
                {getStatusEmoji()}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getStatusText()}
                </h2>
                {getCurrentStageMessage() && (
                  <p className="text-sm text-white/90 mt-1">
                    {getCurrentStageMessage()}
                  </p>
                )}
              </div>
            </div>
            {shouldShowCloseButton && (
              <button
                onClick={onClose}
                onMouseDown={(e) => e.stopPropagation()}
                className="text-white/80 hover:text-white transition-colors p-1 pointer-events-auto"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 bg-white rounded-b-xl">
          {/* 파일명 */}
          {fileName && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 truncate">
                📁 {fileName}
              </p>
            </div>
          )}

          {/* 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out rounded-full relative overflow-hidden`}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                >
                  {/* 애니메이션 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* 예상 시간 */}
          {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-500">
                예상 남은 시간:{' '}
                <span className="font-medium text-gray-700">
                  {formatTime(estimatedTimeRemaining)}
                </span>
              </p>
            </div>
          )}

          {/* 상태별 메시지 */}
          {status === 'uploading' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                파일을 안전하게 업로드하고 있습니다...
              </p>
            </div>
          )}

          {status === 'processing' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <p className="text-sm text-purple-700">
                  AI가 콘텐츠를 분석하고 있습니다
                </p>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                파일 크기에 따라 시간이 소요될 수 있습니다
              </p>
            </div>
          )}

          {status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-green-700">
                🎉 처리가 완료되었습니다!
              </p>
              <p className="text-xs text-green-600 mt-1">
                이제 편집을 시작할 수 있습니다
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-red-700">
                처리 중 문제가 발생했습니다
              </p>
              <p className="text-xs text-red-600 mt-1">
                다시 시도하거나 지원팀에 문의해주세요
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3">
            {canCancel && !shouldShowCloseButton && onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
            )}

            {status === 'completed' && (
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                에디터로 이동 →
              </button>
            )}

            {status === 'failed' && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-lg transition-all"
              >
                닫기
              </button>
            )}
          </div>
        </div>

        {/* 애니메이션을 위한 스타일 */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </>
  )
}
