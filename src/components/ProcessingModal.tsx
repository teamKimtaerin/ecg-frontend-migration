'use client'

import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons'

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
}

const STAGE_MESSAGES = {
  file_validation: '파일 검증 중...',
  audio_extraction: '오디오 추출 중...',
  whisper_transcription: '음성 인식 중...',
  speaker_diarization: '화자 분리 중...',
  post_processing: '후처리 중...',
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
}: ProcessingModalProps) {
  console.log('[ProcessingModal] Render - isOpen:', isOpen, 'status:', status, 'progress:', progress)

  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null) // React 19 호환성을 위한 ref
  const [initialized, setInitialized] = useState(false)

  // 초기 위치를 화면 중앙으로 설정
  useEffect(() => {
    if (!initialized && isOpen && typeof window !== 'undefined') {
      const modalWidth = 420
      const modalHeight = 300

      const centerX = (window.innerWidth - modalWidth) / 2
      const centerY = (window.innerHeight - modalHeight) / 2

      setPosition({ x: centerX, y: centerY })
      setInitialized(true)

      console.log('[ProcessingModal] Centered at:', { x: centerX, y: centerY })
    }
  }, [isOpen, initialized])

  if (!isOpen || status === 'select') return null

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
        return '처리 중'
    }
  }

  const getStatusEmoji = () => {
    switch (status) {
      case 'uploading':
        return '📤'
      case 'processing':
        return '🎬'
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '⏳'
    }
  }

  const formatTime = (seconds?: number) => {
    if (!seconds || seconds <= 0) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)

    if (mins > 0) {
      return `약 ${mins}분 ${secs > 0 ? `${secs}초` : ''}`
    }
    return `약 ${secs}초`
  }

  const getCurrentStageMessage = () => {
    if (!currentStage) return null
    return (
      STAGE_MESSAGES[currentStage as keyof typeof STAGE_MESSAGES] ||
      currentStage
    )
  }

  // 조건부 렌더링 - isOpen이 false면 아무것도 렌더링하지 않음
  if (!isOpen) {
    console.log('[ProcessingModal] Not rendering - isOpen is false')
    return null
  }

  console.log('[ProcessingModal] Rendering modal with Draggable at:', position)

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onDrag={(_, data) => {
        setPosition({ x: data.x, y: data.y })
      }}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        data-testid="processing-modal"
        className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200/50"
        style={{
          width: isMinimized ? '320px' : '420px',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* 헤더 - 드래그 가능 영역 */}
        <div className="drag-handle flex items-center justify-between px-5 py-3.5 bg-gradient-to-b from-gray-50 to-white rounded-t-xl cursor-move select-none border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getStatusEmoji()}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">
                {getStatusText()}
              </span>
              {isMinimized &&
                estimatedTimeRemaining !== undefined &&
                estimatedTimeRemaining > 0 && (
                  <span className="text-xs text-gray-500">
                    {formatTime(estimatedTimeRemaining)}
                  </span>
                )}
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title={isMinimized ? '확장' : '최소화'}
          >
            {isMinimized ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* 본문 */}
        <div className={`${isMinimized ? 'px-5 py-3' : 'p-5'}`}>
          {/* 파일명 - 확장 모드에만 표시 */}
          {!isMinimized && fileName && (
            <div className="flex items-center gap-2.5 mb-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📁</span>
              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                {fileName}
              </span>
            </div>
          )}

          {/* 처리 단계 - 확장 모드에만 표시 */}
          {!isMinimized && currentStage && getCurrentStageMessage() && (
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                처리 단계
              </span>
              <p className="text-sm text-gray-700 font-medium mt-1">
                {getCurrentStageMessage()}
              </p>
            </div>
          )}

          {/* 프로그레스 바 - 항상 표시 */}
          <div className={isMinimized ? '' : 'mb-4'}>
            <div className="relative">
              {/* 배경 트랙 */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                {/* 진행률 바 */}
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{
                    width: `${Math.min(100, Math.max(0, progress))}%`,
                    background:
                      status === 'failed'
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                        : status === 'completed'
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  }}
                >
                  {/* 애니메이션 효과 */}
                  {status === 'processing' && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 진행률 텍스트 */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(progress)}%
              </span>
              {!isMinimized &&
                estimatedTimeRemaining !== undefined &&
                estimatedTimeRemaining > 0 && (
                  <span className="text-xs text-gray-500">
                    {formatTime(estimatedTimeRemaining)} 남음
                  </span>
                )}
            </div>
          </div>

          {/* 상태 메시지 - 확장 모드에만 표시 */}
          {!isMinimized && status === 'completed' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-700 font-medium">
                🎉 처리가 완료되었습니다!
              </p>
              <p className="text-xs text-green-600 mt-1">
                에디터로 이동하여 편집을 시작하세요.
              </p>
            </div>
          )}

          {!isMinimized && status === 'failed' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700 font-medium">
                처리 중 오류가 발생했습니다.
              </p>
              <p className="text-xs text-red-600 mt-1">다시 시도해 주세요.</p>
            </div>
          )}

          {/* 버튼 영역 - 확장 모드에만 표시 */}
          {!isMinimized && (
            <div className="flex justify-end gap-2 mt-4">
              {status === 'failed' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  닫기
                </button>
              )}
              {status === 'completed' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                >
                  에디터로 이동
                </button>
              )}
              {canCancel &&
                status !== 'completed' &&
                status !== 'failed' &&
                onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </Draggable>
  )
}
