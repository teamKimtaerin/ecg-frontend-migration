'use client'

import { FaTimes, FaSpinner } from 'react-icons/fa'
import React from 'react'

export interface UploadProgressModalProps {
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

export default function UploadProgressModal({
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
}: UploadProgressModalProps) {
  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return '파일을 업로드하고 있습니다'
      case 'processing':
        return '음성을 분석하고 있습니다'
      case 'completed':
        return '분석이 완료되었습니다'
      case 'failed':
        return '처리 중 오류가 발생했습니다'
      default:
        return '처리를 준비하고 있습니다'
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }

  const shouldShowCloseButton = status === 'completed' || status === 'failed'

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur effect */}
      {backdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-none z-[9998]" />
      )}

      {/* Right-side positioned modal matching VideoExportProgressModal */}
      <div
        className="!fixed !top-2 !right-0 !bottom-2 !w-[600px] !bg-white !rounded-l-xl !shadow-2xl !p-6 !overflow-y-auto !block"
        style={{ zIndex: 10000000 }}
        role="dialog"
        aria-label="업로드 진행 상황"
      >
        {/* Close button */}
        <button
          onClick={shouldShowCloseButton ? onClose : onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Header with icon and title */}
        <div className="flex items-center mb-8 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              {getStatusText()}
            </h2>
          </div>
        </div>

        {/* File Name with Spinner */}
        {fileName && (
          <div className="flex items-center gap-3 mb-6">
            {(status === 'uploading' || status === 'processing') && (
              <FaSpinner className="animate-spin text-blue-500" size={16} />
            )}
            <span className="text-gray-700 font-medium">{fileName}</span>
          </div>
        )}

        {/* Thumbnail Image */}
        <div className="mb-8">
          <div className="w-full h-[280px] bg-gray-100 rounded-lg overflow-hidden relative">
            <img
              src="/friends-thumbnail.png"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            {/* Overlay text */}
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-2 rounded">
              업로드를 처리하는 중입니다...
            </div>
          </div>
        </div>

        {/* Progress and time info */}
        <div className="flex items-center justify-between mb-3 text-base">
          <span className="text-blue-500 font-semibold">
            {Math.round(progress)}%
          </span>
          {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
            <span className="text-gray-500">
              남은 시간: {formatTime(estimatedTimeRemaining)}
            </span>
          )}
          {canCancel && !shouldShowCloseButton && (
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              취소
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {/* Action Buttons for Completed/Failed States */}
        {status === 'completed' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              에디터로 이동
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex justify-center mt-6 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </>
  )
}
