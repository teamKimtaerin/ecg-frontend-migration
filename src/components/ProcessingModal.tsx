'use client'

import React from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import {
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa'

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
  const getStatusColor = (): 'default' | 'over-background' => {
    switch (status) {
      case 'uploading':
        return 'default'
      case 'processing':
        return 'default'
      case 'completed':
        return 'default'
      case 'failed':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return '업로드 중...'
      case 'processing':
        return 'ML 처리 중...'
      case 'completed':
        return '처리 완료!'
      case 'failed':
        return '처리 실패'
      default:
        return '대기 중...'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <FaSpinner className="animate-spin text-blue-500" size={24} />
      case 'completed':
        return <FaCheckCircle className="text-green-500" size={24} />
      case 'failed':
        return <FaExclamationCircle className="text-red-500" size={24} />
      default:
        return null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentStageMessage = () => {
    if (!currentStage) return null
    return (
      STAGE_MESSAGES[currentStage as keyof typeof STAGE_MESSAGES] ||
      currentStage
    )
  }

  const shouldShowCloseButton = status === 'completed' || status === 'failed'
  const shouldShowCancelButton =
    canCancel && (status === 'uploading' || status === 'processing')

  return (
    <Modal
      isOpen={isOpen}
      onClose={shouldShowCloseButton ? onClose : () => {}}
      closeOnBackdropClick={shouldShowCloseButton}
      closeOnEsc={shouldShowCloseButton}
      className="w-[480px] max-w-[90vw]"
      aria-label="처리 진행 상황"
    >
      <div className="p-8">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            {getStatusIcon()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {getStatusText()}
          </h2>
          {fileName && (
            <p className="text-sm text-gray-600 truncate" title={fileName}>
              {fileName}
            </p>
          )}
        </div>

        {/* 진행률 */}
        <div className="mb-6">
          <ProgressBar
            value={progress}
            variant={getStatusColor()}
            size="large"
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{progress}% 완료</span>
            {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
              <span>남은 시간: {formatTime(estimatedTimeRemaining)}</span>
            )}
          </div>
        </div>

        {/* 현재 단계 */}
        {status === 'processing' && getCurrentStageMessage() && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaSpinner
                className="animate-spin text-blue-500 mr-3"
                size={16}
              />
              <span className="text-sm text-blue-700">
                {getCurrentStageMessage()}
              </span>
            </div>
          </div>
        )}

        {/* 완료 메시지 */}
        {status === 'completed' && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-green-700 mb-2">
                ✅ 음성 인식이 완료되었습니다!
              </p>
              <p className="text-sm text-green-600">
                에디터로 이동하여 편집을 시작하세요.
              </p>
            </div>
          </div>
        )}

        {/* 실패 메시지 */}
        {status === 'failed' && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-red-700 mb-2">
                ❌ 처리 중 오류가 발생했습니다.
              </p>
              <p className="text-sm text-red-600">다시 시도해 주세요.</p>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex justify-end space-x-3">
          {shouldShowCancelButton && onCancel && (
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex items-center"
            >
              <FaTimes className="mr-2" size={14} />
              취소
            </Button>
          )}

          {shouldShowCloseButton && (
            <Button
              variant={status === 'completed' ? 'primary' : 'secondary'}
              onClick={onClose}
            >
              {status === 'completed' ? '에디터로 이동' : '닫기'}
            </Button>
          )}
        </div>

        {/* 처리 단계 설명 (업로드 중일 때) */}
        {status === 'uploading' && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              파일을 안전하게 업로드하고 있습니다...
            </p>
          </div>
        )}

        {/* 처리 단계 설명 (ML 처리 중일 때) */}
        {status === 'processing' && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              AI가 음성을 분석하여 자막을 생성하고 있습니다.
              <br />이 과정은 몇 분 소요될 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
