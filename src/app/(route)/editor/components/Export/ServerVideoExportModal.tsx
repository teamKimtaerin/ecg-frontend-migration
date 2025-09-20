'use client'

import { buildScenarioFromClips } from '@/app/(route)/editor/utils/scenarioBuilder'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ProgressBar from '@/components/ui/ProgressBar'
import { useEffect, useState } from 'react'
import { FaDownload, FaRocket } from 'react-icons/fa'
import { useServerVideoExport } from '../../hooks/useServerVideoExport'
import { useEditorStore } from '../../store'
import VideoExportProgressModal from './VideoExportProgressModal'

interface ServerVideoExportModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
}

export default function ServerVideoExportModal({
  isOpen,
  onClose,
  videoUrl: propVideoUrl,
}: ServerVideoExportModalProps) {
  const { clips, videoUrl: storeVideoUrl, videoName } = useEditorStore()
  const {
    isExporting,
    progress,
    estimatedTime,
    timeRemaining,
    status,
    error,
    downloadUrl,
    selectedFileHandle,
    startExport,
    cancelExport,
    downloadFile,
    reset,
  } = useServerVideoExport()

  const [phase, setPhase] = useState<
    'ready' | 'exporting' | 'completed' | 'error'
  >('ready')
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)

  // 비디오 URL 결정 (props > store)
  const videoUrl = propVideoUrl || storeVideoUrl

  useEffect(() => {
    if (isOpen) {
      setPhase('ready')
      setIsProgressModalOpen(false)
      reset()
    }
  }, [isOpen, reset])

  useEffect(() => {
    if (status === 'completed' && downloadUrl) {
      setPhase('completed')
    } else if (status === 'failed' || error) {
      setPhase('error')
    } else if (isExporting) {
      setPhase('exporting')
    }
  }, [status, downloadUrl, error, isExporting])

  const handleStartExport = async () => {
    if (!videoUrl) {
      console.error('🚨 비디오 URL이 없습니다')
      return
    }

    if (!clips || clips.length === 0) {
      console.error('🚨 자막 데이터가 없습니다')
      return
    }

    // 진행률 모달 열기
    setIsProgressModalOpen(true)

    try {
      setPhase('exporting')

      // 🔍 시나리오 생성 및 검증
      const scenario = buildScenarioFromClips(clips)
      console.log('🔍 Generated scenario debug:', {
        version: scenario.version,
        tracks: scenario.tracks.length,
        cues: scenario.cues.length,
        validCues: scenario.cues.filter((c) => c.hintTime?.start !== undefined)
          .length,
        firstCue: scenario.cues[0],
      })

      if (scenario.cues.length === 0) {
        throw new Error(
          '유효한 자막이 없습니다. 자막을 추가한 후 다시 시도해주세요.'
        )
      }

      // 파일명 생성
      const baseName = videoName?.replace(/\.[^/.]+$/, '') || 'video'
      const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const fileName = `${baseName}_GPU_${timestamp}.mp4`

      // GPU 렌더링 시작 (저장 위치 선택 포함)
      await startExport(
        videoUrl,
        scenario,
        {
          width: 1920,
          height: 1080,
          fps: 30,
          quality: 90,
          format: 'mp4',
        },
        fileName
      )
    } catch (error) {
      console.error('🚨 Export failed:', error)
      setIsProgressModalOpen(false)
      // 저장 위치 선택 취소인 경우 원래 상태로 돌아감
      if (error instanceof Error && error.message.includes('취소')) {
        setPhase('ready')
      } else {
        setPhase('error')
      }
    }
  }

  const handleDownload = async () => {
    if (downloadUrl) {
      // 파일명 제안: 비디오 이름이 있으면 사용, 없으면 프로젝트명 또는 기본값 사용
      const baseName = videoName?.replace(/\.[^/.]+$/, '') || 'video'
      const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const filename = `${baseName}_GPU_${timestamp}.mp4`

      await downloadFile(downloadUrl, filename)
    }
  }

  const handleProgressModalClose = () => {
    setIsProgressModalOpen(false)
    setPhase('ready')
  }

  const handleProgressModalComplete = () => {
    setIsProgressModalOpen(false)
    setPhase('completed')
  }

  // 🧪 테스트용: 진행률 모달 직접 열기 (개발환경 전용)
  const handleTestProgressModal = () => {
    setIsProgressModalOpen(true)
  }

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '계산 중...'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }

  const getProgressText = (): string => {
    switch (status) {
      case 'queued':
        return '렌더링 대기 중...'
      case 'processing':
        return `처리 중... ${progress}%`
      case 'completed':
        return '렌더링 완료!'
      case 'failed':
        return '렌더링 실패'
      default:
        return '준비 중...'
    }
  }

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={!isExporting}
      isblind={false}
      aria-label="동영상 내보내기"
    >
      <div className="p-6">
        {/* 준비 단계 */}
        {phase === 'ready' && (
          <div className="space-y-6">
            {/* 모달 제목 */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">동영상 내보내기</h2>
            </div>

            {/* 대상 클립 섹션 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">대상 클립</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="targetClip"
                      value="all"
                      defaultChecked
                      className="sr-only"
                    />
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-900">모든 씬, 모든 클립</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer opacity-50">
                  <div className="relative">
                    <input
                      type="radio"
                      name="targetClip"
                      value="current"
                      disabled
                      className="sr-only"
                    />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                  </div>
                  <span className="text-sm text-gray-400">현재 씬, 모든 클립</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer opacity-50">
                  <div className="relative">
                    <input
                      type="radio"
                      name="targetClip"
                      value="selected"
                      disabled
                      className="sr-only"
                    />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                  </div>
                  <span className="text-sm text-gray-400">선택된 클립 (없음)</span>
                </label>
              </div>
            </div>

            {/* 해상도 섹션 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">해상도</h3>
              <div className="relative">
                <select className="w-full px-3 py-2.5 text-sm border text-gray-900 border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <option value="원본 (640 x 360)" className="text-gray-900">원본 (640 x 360)</option>
                  <option value="HD (1280 x 720)" disabled className="text-gray-400">HD (1280 x 720)</option>
                  <option value="Full HD (1920 x 1080)" disabled className="text-gray-400">Full HD (1920 x 1080)</option>
                  <option value="4K (3840 x 2160)" disabled className="text-gray-400">4K (3840 x 2160)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 버튼 섹션 */}
            <div className="space-y-3 pt-4">
              {/* 개발환경 전용 테스트 버튼 */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleTestProgressModal}
                  className="w-full px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors duration-200 border-2 border-purple-300"
                >
                  🧪 진행률 모달 테스트
                </button>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleStartExport}
                  className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  내보내기
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 렌더링 진행 중 */}
        {phase === 'exporting' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="animate-spin">
                  <FaRocket className="text-blue-600 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getProgressText()}
              </h3>
              {estimatedTime && (
                <p className="text-sm text-gray-600">
                  예상 완료 시간: {formatTime(estimatedTime)}
                </p>
              )}
              {timeRemaining !== null && timeRemaining > 0 && (
                <p className="text-sm text-gray-600">
                  남은 시간: {formatTime(timeRemaining)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>진행률</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                💡 브라우저를 닫아도 서버에서 렌더링이 계속됩니다. 나중에 다시
                확인하실 수 있습니다.
              </p>
            </div>

            {isExporting && (
              <Button
                onClick={cancelExport}
                variant="secondary"
                size="medium"
                className="w-full"
              >
                취소
              </Button>
            )}
          </div>
        )}

        {/* 완료 */}
        {phase === 'completed' && downloadUrl && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                렌더링 완료! 🎉
              </h3>
              <p className="text-sm text-gray-600">
                {selectedFileHandle
                  ? '선택한 위치에 자동으로 저장되었습니다'
                  : '고품질 영상이 준비되었습니다'}
              </p>
            </div>

            <div className="space-y-2">
              {!selectedFileHandle && (
                <Button
                  onClick={handleDownload}
                  variant="primary"
                  size="large"
                  className="w-full"
                >
                  <FaDownload className="mr-2" />
                  다운로드
                </Button>
              )}

              {selectedFileHandle && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="medium"
                  className="w-full"
                >
                  <FaDownload className="mr-2" />
                  다른 위치에 저장
                </Button>
              )}

              <Button
                onClick={onClose}
                variant="secondary"
                size="medium"
                className="w-full"
              >
                닫기
              </Button>
            </div>
          </div>
        )}

        {/* 오류 */}
        {phase === 'error' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                렌더링 실패
              </h3>
              {error && (
                <div className="text-left bg-red-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800 font-medium mb-2">
                    오류 메시지:
                  </p>
                  <p className="text-sm text-red-700 whitespace-pre-wrap">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* 디버깅 정보 표시 */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <p className="font-medium mb-1">📊 디버깅 정보:</p>
              <p>• 비디오 URL: {videoUrl ? '✅ 있음' : '❌ 없음'}</p>
              <p>• 자막 개수: {clips?.length || 0}개</p>
              <p>
                • 유효한 자막:{' '}
                {clips?.filter((c) => c.fullText?.trim() || c.subtitle?.trim())
                  .length || 0}
                개
              </p>
              <p>• 환경: {process.env.NODE_ENV}</p>
              <p className="text-xs text-gray-500 mt-2">
                💡 개발자 도구 Console 탭에서 자세한 오류 정보를 확인하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleStartExport}
                variant="primary"
                size="medium"
                className="w-full"
              >
                다시 시도
              </Button>
              <Button
                onClick={onClose}
                variant="secondary"
                size="medium"
                className="w-full"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 영상 출력 진행률 모달 */}
      <VideoExportProgressModal
        isOpen={isProgressModalOpen}
        onClose={handleProgressModalClose}
        onComplete={handleProgressModalComplete}
      />
    </Modal>
  )
}
