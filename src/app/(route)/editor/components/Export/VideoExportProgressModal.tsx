'use client'

import ProgressModal from '@/components/ui/ProgressModal'
import { generateVideoThumbnail } from '@/utils/video/videoThumbnail'
import { useEffect, useState } from 'react'
import { useEditorStore } from '../../store'

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
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('')
  const { videoThumbnail, videoUrl } = useEditorStore()

  // 썸네일 생성/설정
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 새로 생성한 썸네일 정리
      if (currentThumbnail && currentThumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(currentThumbnail)
        setCurrentThumbnail('')
      }
      return
    }

    console.log(
      '🔍 [VideoExportProgressModal] Export started - checking thumbnail status:',
      {
        hasVideoThumbnail: !!videoThumbnail,
        videoThumbnailValue: videoThumbnail,
        hasVideoUrl: !!videoUrl,
        videoUrlValue: videoUrl,
        videoUrlType: videoUrl
          ? videoUrl.startsWith('blob:')
            ? 'blob'
            : videoUrl.startsWith('http')
              ? 'http'
              : 'other'
          : 'none',
      }
    )

    // 1. 기존 썸네일이 유효하면 사용
    if (videoThumbnail && videoThumbnail.trim() !== '') {
      console.log('🖼️ Using existing thumbnail from store:', videoThumbnail)
      setCurrentThumbnail(videoThumbnail)
      return
    }

    // 2. 썸네일이 없거나 유효하지 않으면 새로 생성
    console.log('🎬 No valid thumbnail found, generating new one from video')

    const generateThumbnailFromVideo = async () => {
      if (!videoUrl) {
        console.log('⚠️ No video URL available for thumbnail generation')
        return
      }

      try {
        // videoUrl이 blob URL이면 직접 사용, 아니면 fetch해서 blob 생성
        let videoFile: File | null = null

        if (videoUrl.startsWith('blob:')) {
          // Blob URL에서 파일 생성
          console.log('📁 Fetching video from blob URL:', videoUrl)
          const response = await fetch(videoUrl)
          const blob = await response.blob()
          videoFile = new File([blob], 'video.mp4', { type: 'video/mp4' })
        } else if (videoUrl.startsWith('http')) {
          // HTTP URL에서 파일 생성 (CORS 허용되는 경우만)
          try {
            console.log('🌐 Fetching video from HTTP URL:', videoUrl)
            const response = await fetch(videoUrl)
            const blob = await response.blob()
            videoFile = new File([blob], 'video.mp4', { type: 'video/mp4' })
          } catch (fetchError) {
            console.log('❌ Failed to fetch from HTTP URL:', fetchError)
            return
          }
        }

        if (videoFile) {
          console.log('🎬 Generating thumbnail from video file')
          const thumbnailUrl = await generateVideoThumbnail(videoFile, {
            width: 384,
            height: 216,
            quality: 0.8,
          })

          if (thumbnailUrl) {
            console.log('✅ Thumbnail generated successfully:', thumbnailUrl)
            setCurrentThumbnail(thumbnailUrl)
          }
        }
      } catch (error) {
        console.error('❌ Failed to generate thumbnail for export:', error)
      }
    }

    generateThumbnailFromVideo()
  }, [isOpen, videoThumbnail, videoUrl])

  // 진행률 시뮬레이션
  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      return
    }

    const duration = 40000 // 40초간 진행 (실제 시간에 맞춤)
    const intervalTime = 100 // 100ms마다 업데이트 (더 천천히)
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

  // 40초부터 시작해서 진행률에 따라 카운트다운
  const remainingSeconds = Math.max(0, 40 - Math.floor(progress * 0.4)) // 100% 완료시 0초

  return (
    <ProgressModal
      isOpen={isOpen}
      onClose={onClose}
      type="export"
      status="processing"
      progress={progress}
      estimatedTimeRemaining={remainingSeconds}
      videoThumbnail={currentThumbnail || videoThumbnail || undefined}
      canCancel={true}
      closeOnBackdropClick={false}
      aria-label="내보내기 진행 상황"
    />
  )
}
