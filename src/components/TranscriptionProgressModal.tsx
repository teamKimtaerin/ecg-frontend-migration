'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranscriptionStore } from '@/lib/store/transcriptionStore'
import { useTranscriptionPolling } from '@/hooks/useTranscriptionPolling'
import ProgressBar from '@/components/ui/ProgressBar'
import { ChevronRightIcon } from '@/components/icons'
import { cn } from '@/utils'
import Image from 'next/image'

const TranscriptionProgressModal: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  const {
    jobId,
    isModalOpen,
    isCollapsed,
    progress,
    status,
    videoMetadata,
    analysisTimeUsed,
    error,
    toggleCollapse,
    closeModal,
  } = useTranscriptionStore()

  // Start polling when modal opens
  useTranscriptionPolling()

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Format analysis time message
  const getAnalysisMessage = (): string => {
    if (!videoMetadata) return '오디오를 분석하고 있습니다.'
    const minutes = Math.floor(videoMetadata.duration / 60)
    return `${minutes}분의 음성을 분석하고 있습니다.`
  }

  // Mount handling for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render if not mounted or not open
  if (!isMounted || !isModalOpen) return null

  // Modal container styles
  const containerClasses = cn(
    'fixed bottom-6 right-6 z-[9999]',
    'bg-gray-900 rounded-lg shadow-2xl',
    'transition-all duration-300 ease-out',
    'border border-gray-700',
    isCollapsed ? 'w-80' : 'w-[480px]'
  )

  const contentClasses = cn(
    'p-6',
    'transition-all duration-300',
    isCollapsed && 'p-4'
  )

  // Chevron rotation for collapse/expand
  const chevronClasses = cn(
    'transition-transform duration-200',
    isCollapsed ? 'rotate-90' : '-rotate-90'
  )

  // Status message based on current state
  const getStatusMessage = () => {
    if (error) return error
    if (status === 'completed') return '분석이 완료되었습니다!'
    if (status === 'failed') return '분석 중 오류가 발생했습니다.'
    if (status === 'idle' || jobId?.startsWith('connecting_'))
      return '서버에 연결 중입니다...'
    return '안녕하세요! 업체 저희를 응원하게 생각으로 애완 택시 사업하고 있어 별가족 사업 시간을 좋게 보냅니다.'
  }

  // Get progress message
  const getProgressMessage = () => {
    if (status === 'completed') return '완료'
    if (status === 'failed') return '실패'
    return `${progress}%`
  }

  const modalContent = (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Header with collapse button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {!isCollapsed && (
              <>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {getAnalysisMessage()}
                </h3>
                <p className="text-sm text-gray-400">{getStatusMessage()}</p>
              </>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="ml-4 p-1.5 rounded hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronRightIcon className={chevronClasses} size={20} />
          </button>
        </div>

        {/* Main content - hidden when collapsed */}
        {!isCollapsed && (
          <>
            {/* Analysis time used */}
            <div className="mb-4">
              <p className="text-sm text-gray-300">
                사용한 분석시간
                <span className="ml-2 font-semibold text-white">
                  {analysisTimeUsed}분
                </span>
              </p>
            </div>

            {/* Video thumbnail and info */}
            {videoMetadata && (
              <div className="mb-4 bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                {/* Video thumbnail placeholder */}
                {videoMetadata.thumbnailUrl ? (
                  <Image
                    src={videoMetadata.thumbnailUrl}
                    alt="Video thumbnail"
                    width={80}
                    height={56}
                    className="w-full h-full object-cover rounded"
                    style={{ width: '100%', height: '100%' }}
                    unoptimized
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {/* File info */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {videoMetadata.fileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDuration(videoMetadata.duration)} •{' '}
                    {(videoMetadata.fileSize / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            )}

            {/* Info message */}
            <div className="mb-4 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-gray-400">
                항풍꿍꽁 바고 곳을 기조오로 클몇을 나눌 수 있어요.
              </p>
            </div>
          </>
        )}

        {/* Progress bar - always visible */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar
              value={progress}
              variant="over-background"
              size="small"
              valueLabel={getProgressMessage()}
              className="w-full"
            />
          </div>

          {/* Close button when completed or failed */}
          {(status === 'completed' || status === 'failed') && (
            <button
              onClick={closeModal}
              className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors text-white"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default TranscriptionProgressModal
