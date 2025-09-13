'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTranscriptionStore } from '@/lib/store/transcriptionStore'
import { API_CONFIG } from '@/config/api.config'
import { log } from '@/utils/logger'

interface JobStatus {
  status: 'queued' | 'started' | 'processing' | 'completed' | 'failed'
  progress: number
  current_message?: string
  message?: string
  error_message?: string
  results?: Record<string, unknown>
}

export const useTranscriptionPolling = () => {
  const {
    jobId,
    status,
    updateProgress,
    setError,
    setEstimatedTime,
    setResults,
    onCompleteCallback,
  } = useTranscriptionStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const currentIntervalRef = useRef(2000) // Start with 2 seconds
  const isPageVisibleRef = useRef(
    typeof document !== 'undefined' ? !document.hidden : true
  )

  // Page visibility handling
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Adjust polling interval based on progress
  const adjustInterval = useCallback((progress: number) => {
    if (progress < 10) {
      currentIntervalRef.current = 5000 // 5 seconds for initial stage
    } else if (progress < 50) {
      currentIntervalRef.current = 3000 // 3 seconds for middle stage
    } else if (progress < 80) {
      currentIntervalRef.current = 2000 // 2 seconds for later stage
    } else {
      currentIntervalRef.current = 1000 // 1 second for final stage
    }

    // Increase interval if page is not visible
    if (!isPageVisibleRef.current) {
      currentIntervalRef.current *= 3
    }
  }, [])

  // Fetch job status from API
  const fetchJobStatus = useCallback(
    async (jobId: string): Promise<JobStatus> => {
      const statusUrl = `${API_CONFIG.FASTAPI_BASE_URL}/api/v1/ml/job-status/${jobId}`
      console.log('Polling job status:', statusUrl)

      const response = await fetch(statusUrl, {
        headers: {
          // TODO: Add authorization header when auth is implemented
          // 'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch job status: ${response.statusText}`)
      }

      return await response.json()
    },
    []
  )

  // Main polling function
  const poll = useCallback(async () => {
    if (
      !jobId ||
      status === 'completed' ||
      status === 'failed' ||
      jobId.startsWith('connecting_')
    ) {
      return
    }

    try {
      const jobStatus = await fetchJobStatus(jobId)

      // Update progress (backend returns 0-100, not 0-1)
      const progressPercentage = Math.round(jobStatus.progress)
      updateProgress(progressPercentage)

      // Handle different statuses
      switch (jobStatus.status) {
        case 'completed':
          updateProgress(100, 'completed')
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          // ✅ Handle results processing
          log(
            'useTranscriptionPolling',
            'Transcription completed, processing results...'
          )

          try {
            if (jobStatus.results) {
              // Store results in transcription store
              setResults(jobStatus.results)

              // Process results if callback is set
              if (onCompleteCallback) {
                log(
                  'useTranscriptionPolling',
                  'Calling completion callback with results'
                )
                onCompleteCallback(jobStatus.results)
              } else {
                log(
                  'useTranscriptionPolling',
                  'No completion callback set, results stored in store'
                )
              }
            } else {
              log(
                'useTranscriptionPolling',
                'Warning: Completed status but no results found'
              )
              console.warn(
                'Transcription completed but no results found in response'
              )
            }
          } catch (error) {
            log('useTranscriptionPolling', `Error processing results: ${error}`)
            console.error('Error processing transcription results:', error)
            setError('결과 처리 중 오류가 발생했습니다.')
          }
          break

        case 'failed':
          setError(jobStatus.error_message || 'Transcription failed')
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          break

        case 'processing':
        case 'started':
        case 'queued':
          // Continue polling with adjusted interval
          adjustInterval(progressPercentage)
          retryCountRef.current = 0 // Reset retry count on success
          break
      }

      // Update estimated time if available
      if (jobStatus.current_message) {
        // Extract time from message if it contains time info
        const timeMatch = jobStatus.current_message.match(
          /(\d+)\s*(seconds?|minutes?)/i
        )
        if (timeMatch) {
          const value = parseInt(timeMatch[1])
          const unit = timeMatch[2].toLowerCase()
          const seconds = unit.includes('minute') ? value * 60 : value
          setEstimatedTime(seconds)
        }
      }
    } catch (error) {
      console.error('Polling error:', error)
      retryCountRef.current++

      // Stop polling after 3 retries
      if (retryCountRef.current >= 3) {
        setError('Failed to check transcription status. Please try again.')
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        // Exponential backoff for retries
        currentIntervalRef.current = Math.min(
          currentIntervalRef.current * Math.pow(2, retryCountRef.current),
          10000 // Max 10 seconds
        )
      }
    }
  }, [
    jobId,
    status,
    fetchJobStatus,
    updateProgress,
    setError,
    adjustInterval,
    setEstimatedTime,
    setResults,
    onCompleteCallback,
  ])

  // Start polling when jobId is set
  useEffect(() => {
    if (jobId && status === 'processing') {
      // Initial poll immediately
      poll()

      // Set up interval for subsequent polls
      intervalRef.current = setInterval(() => {
        poll()
      }, currentIntervalRef.current)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [jobId, status, poll])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return {
    isPolling: !!intervalRef.current,
    retryCount: retryCountRef.current,
  }
}
