'use client'

import { useRouter } from 'next/navigation'
import { mediaStorage } from '@/utils/storage/mediaStorage'
import { projectInfoManager } from '@/utils/managers/ProjectInfoManager'
import { log } from '@/utils/logger'
import { useTranscriptionStore } from '@/lib/store/transcriptionStore'
import { API_CONFIG } from '@/config/api.config'

export interface TranscriptionData {
  files?: FileList
  url?: string
  language: string
  useDictionary: boolean
  autoSubmit: boolean
  method: 'file' | 'link'
}

export const useUploadModal = () => {
  const router = useRouter()
  const { startTranscription, setAnalysisTime } = useTranscriptionStore()

  const handleFileSelect = (files: FileList) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Selected files:',
        Array.from(files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      )
    }
    // Files are now stored in the modal state, modal stays open
  }

  const handleStartTranscription = async (
    data: TranscriptionData,
    onSuccess?: () => void,
    redirectToEditor = true
  ) => {
    const handleTranscriptionResponse = async (response: Response) => {
      if (response.ok) {
        const result = await response.json()
        log('useUploadModal.ts', `Backend response: ${JSON.stringify(result)}`)

        if (process.env.NODE_ENV === 'development') {
          console.log('Transcription started successfully: ', result)
        }

        // Update Progress Modal with real job ID from backend
        if (result.job_id) {
          // Update existing progress modal with real job ID
          const { updateProgress } = useTranscriptionStore.getState()
          useTranscriptionStore.setState({ jobId: result.job_id })
          updateProgress(5, 'processing') // Start with 5% progress

          // Set analysis time from backend response (if available)
          if (result.analysis_time_used) {
            setAnalysisTime(result.analysis_time_used)
          }

          log(
            'useUploadModal.ts',
            `Started transcription with job_id: ${result.job_id}`
          )
        } else {
          log('useUploadModal.ts', 'Warning: Backend response missing job_id')
        }

        onSuccess?.()
        if (redirectToEditor) {
          router.push('/editor')
        }
      } else {
        const errorText = await response.text()
        log(
          'useUploadModal.ts',
          `Backend error ${response.status}: ${errorText}`
        )
        throw new Error(`Backend error ${response.status}: ${errorText}`)
      }
    }

    // Helper function to get video duration
    const getVideoDuration = async (file: File): Promise<number> => {
      return new Promise((resolve) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          resolve(video.duration)
        }
        video.onerror = () => {
          resolve(0) // Default to 0 if can't get duration
        }
        video.src = URL.createObjectURL(file)
      })
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Starting transcription with data:', data)
      }

      // Show Progress Modal immediately with file info
      if (data.method === 'file' && data.files && data.files.length > 0) {
        const file = data.files[0]
        const duration = await getVideoDuration(file)

        // Start with temporary job ID for immediate UI feedback
        const tempJobId = `connecting_${Date.now()}`
        startTranscription(tempJobId, {
          fileName: file.name,
          duration: duration,
          fileSize: file.size,
          thumbnailUrl: undefined,
        })

        // Set mock analysis time initially
        setAnalysisTime(74)
      }

      let response: Response
      let projectId: string | null = null
      let mediaId: string | null = null
      let fileKey: string | null = null

      if (data.method === 'file' && data.files) {
        // Generate project ID
        projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Save video to IndexedDB
        const file = data.files[0] // Use first file for now
        log('useUploadModal.ts', `Saving video to IndexedDB: ${file.name}`)

        try {
          // Extract video metadata for project info only (don't save large file to IndexedDB)
          log('useUploadModal.ts', 'Extracting video metadata...')
          const metadata = await projectInfoManager.extractVideoMetadata(file)

          // Parse duration from string to number
          const durationNum = metadata.duration
            ? parseFloat(metadata.duration.replace(/[^0-9.]/g, ''))
            : undefined

          // Save only project metadata (not the video file itself)
          log('useUploadModal.ts', 'Saving minimal project metadata...')
          mediaId = 'media_' + Date.now() // Generate simple ID without storing file

          // Store minimal project info in sessionStorage instead of IndexedDB
          sessionStorage.setItem('currentProjectId', projectId)
          sessionStorage.setItem('currentMediaId', mediaId)
          sessionStorage.setItem('currentFileName', file.name)
          sessionStorage.setItem('currentFileSize', file.size.toString())
          sessionStorage.setItem(
            'currentDuration',
            durationNum?.toString() || '0'
          )

          log(
            'useUploadModal.ts',
            `Project metadata saved with mediaId: ${mediaId}`
          )
        } catch (error: unknown) {
          console.error('Failed to extract video metadata:', error)
          log('useUploadModal.ts', `Metadata Error: ${error}`)

          if (error instanceof Error) {
            log('useUploadModal.ts', `Metadata Error Message: ${error.message}`)
            log('useUploadModal.ts', `Metadata Error Stack: ${error.stack}`)
          }

          // 메타데이터 추출 실패해도 API 호출은 계속 진행
          log(
            'useUploadModal.ts',
            'Metadata extraction failed, but continuing with API calls...'
          )
          mediaId = 'media_fallback_' + Date.now()
        }

        log('useUploadModal.ts', 'Starting API calls...')

        // Step 1: Generate presigned URL for S3 upload
        try {
          const generateUrlEndpoint = `${API_CONFIG.FASTAPI_BASE_URL}/api/upload-video/generate-url`
          log(
            'useUploadModal.ts',
            `Getting presigned URL from: ${generateUrlEndpoint}`
          )

          log('useUploadModal.ts', 'About to call fetch for presigned URL...')
          const presignedResponse = await fetch(generateUrlEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              filetype: file.type || 'video/mp4',
            }),
          })
          log(
            'useUploadModal.ts',
            `Presigned URL response status: ${presignedResponse.status}`
          )

          if (!presignedResponse.ok) {
            const errorText = await presignedResponse.text()
            log('useUploadModal.ts', `Presigned URL error: ${errorText}`)
            throw new Error(`Failed to get presigned URL: ${errorText}`)
          }

          const presignedData = await presignedResponse.json()
          log(
            'useUploadModal.ts',
            `Presigned URL response: ${JSON.stringify(presignedData)}`
          )

          const { url: uploadUrl, fileKey: s3FileKey } = presignedData
          fileKey = s3FileKey
          log('useUploadModal.ts', `Got presigned URL, fileKey: ${fileKey}`)

          // Step 2: Upload file to S3
          log('useUploadModal.ts', 'About to upload file to S3...')
          const s3Response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type || 'video/mp4',
            },
          })
          log(
            'useUploadModal.ts',
            `S3 upload response status: ${s3Response.status}`
          )

          if (!s3Response.ok) {
            const s3ErrorText = await s3Response.text()
            log('useUploadModal.ts', `S3 upload error: ${s3ErrorText}`)
            throw new Error(`Failed to upload to S3: ${s3Response.statusText}`)
          }
          log('useUploadModal.ts', 'File uploaded to S3 successfully')
        } catch (s3Error: unknown) {
          log('useUploadModal.ts', `Step 1-2 failed: ${s3Error}`)
          console.error('Step 1-2 - Presigned URL or S3 Upload Error:', s3Error)
          throw s3Error
        }

        // Step 3: Request ML processing
        try {
          const processEndpoint = `${API_CONFIG.FASTAPI_BASE_URL}/api/v1/ml/process-video`
          log(
            'useUploadModal.ts',
            `Requesting ML processing: ${processEndpoint}`
          )

          const requestBody = {
            video_path: fileKey,
            enable_gpu: true,
            emotion_detection: true,
            language: data.language === 'Korean (South Korea)' ? 'ko' : 'auto',
            max_workers: 4,
          }
          log(
            'useUploadModal.ts',
            `ML processing request body: ${JSON.stringify(requestBody)}`
          )

          log('useUploadModal.ts', 'About to call ML processing API...')
          response = await fetch(processEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })
          log(
            'useUploadModal.ts',
            `ML processing response status: ${response.status}`
          )
        } catch (mlError: unknown) {
          log('useUploadModal.ts', `Step 3 failed: ${mlError}`)
          console.error('Step 3 - ML Processing Error:', mlError)
          throw mlError
        }
      } else if (data.method === 'link' && data.url) {
        // Send URL data as JSON
        const urlUploadUrl = `${API_CONFIG.FASTAPI_BASE_URL}/api/transcription/url`
        log('useUploadModal.ts', `Calling backend API for URL: ${urlUploadUrl}`)

        response = await fetch(urlUploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: data.url,
            language: data.language,
            useDictionary: data.useDictionary,
            autoSubmit: data.autoSubmit,
            method: data.method,
          }),
        })
      } else {
        return
      }

      // Store project ID in sessionStorage for editor page
      if (projectId) {
        sessionStorage.setItem('currentProjectId', projectId)
        if (mediaId) {
          sessionStorage.setItem('currentMediaId', mediaId)
        }
        log(
          'useUploadModal.ts',
          `Stored projectId: ${projectId}, mediaId: ${mediaId} in sessionStorage`
        )
      }

      await handleTranscriptionResponse(response)
    } catch (error: unknown) {
      console.error('Error starting transcription:', error)
      log('useUploadModal.ts', `Overall API Error: ${error}`)
      log('useUploadModal.ts', `Error type: ${typeof error}`)

      if (error instanceof Error) {
        log('useUploadModal.ts', `Error name: ${error.name}`)
        log('useUploadModal.ts', `Error message: ${error.message}`)
        log('useUploadModal.ts', `Error stack: ${error.stack}`)
      }

      // Check for CORS error
      let errorMessage = 'Failed to start transcription. Please try again.'

      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        errorMessage =
          'CORS 에러 또는 백엔드 서버 연결 실패. 백엔드 서버가 실행 중인지, CORS 설정이 올바른지 확인하세요.'
        console.error(
          'CORS/Network Error - 백엔드 .env 파일에 CORS_ORIGINS=http://localhost:3000 설정이 필요합니다.'
        )
      } else if (error instanceof Error) {
        errorMessage = `API 연결 실패: ${error.message}`
      }

      // Update store with error
      const { setError } = useTranscriptionStore.getState()
      setError(errorMessage)

      alert(errorMessage)
    }
  }

  return {
    handleFileSelect,
    handleStartTranscription,
  }
}
