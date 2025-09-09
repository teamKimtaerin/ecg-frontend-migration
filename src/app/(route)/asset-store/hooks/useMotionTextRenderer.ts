/**
 * Motion Text Renderer 통합 훅
 * 렌더러 인스턴스 관리, 시나리오 로딩, 무한 재생 등을 처리
 */

import { useRef, useCallback, useEffect, useState } from 'react'
import type { MotionTextRenderer as MTRuntime } from 'motiontext-renderer'
import type { RendererConfig } from '../utils/scenarioGenerator'
import {
  preloadPluginsForScenario,
  preloadAllPlugins,
  configurePluginLoader,
} from '../utils/pluginLoader'

interface MotionTextRendererHookOptions {
  autoPlay?: boolean
  loop?: boolean
  onError?: (error: Error) => void
  onStatusChange?: (status: string) => void
}

interface MotionTextRendererState {
  isLoading: boolean
  isPlaying: boolean
  currentTime: number
  duration: number
  error: string | null
  status: string
}

export function useMotionTextRenderer(
  options: MotionTextRendererHookOptions = {}
) {
  const { autoPlay = true, loop = true, onError, onStatusChange } = options

  // Refs
  const rendererRef = useRef<MTRuntime | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentConfigRef = useRef<RendererConfig | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  // Stable refs for options to avoid dependency issues
  const autoPlayRef = useRef(autoPlay)
  const loopRef = useRef(loop)
  const isPlayingRef = useRef(false)

  // State
  const [state, setState] = useState<MotionTextRendererState>({
    isLoading: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    error: null,
    status: 'idle',
  })

  // Update refs when options change
  useEffect(() => {
    autoPlayRef.current = autoPlay
    loopRef.current = loop
  }, [autoPlay, loop])

  // Update isPlayingRef when state changes
  useEffect(() => {
    isPlayingRef.current = state.isPlaying
  }, [state.isPlaying])

  /**
   * 상태 업데이트 헬퍼
   */
  const updateState = useCallback(
    (updates: Partial<MotionTextRendererState>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates }
        if (updates.status && onStatusChange) {
          onStatusChange(updates.status)
        }
        return newState
      })
    },
    [onStatusChange]
  )

  /**
   * 에러 처리 헬퍼
   */
  const handleError = useCallback(
    (error: Error) => {
      console.error('MotionTextRenderer Error:', error)
      updateState({
        error: error.message,
        isLoading: false,
        status: 'error',
      })
      if (onError) {
        onError(error)
      }
    },
    [onError, updateState]
  )

  /**
   * 렌더러 초기화
   */
  const initializeRenderer = useCallback(async () => {
    if (!containerRef.current) return

    try {
      updateState({ isLoading: true, status: 'initializing' })

      // Ensure GSAP is loaded globally first
      const gsap = await import('gsap')
      if (typeof window !== 'undefined' && gsap) {
        ;(window as any).gsap = gsap.default || gsap
        console.log('[useMotionTextRenderer] GSAP loaded and set globally')
      }

      // Configure plugin source for local mode
      configurePluginLoader()

      // Preload all plugins first
      await preloadAllPlugins()

      // Dynamic import로 MotionTextRenderer 로드
      const { MotionTextRenderer } = await import('motiontext-renderer')

      // 기존 렌더러 정리
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }

      // 새 렌더러 생성 및 비디오(더미) 연결: 사이즈/타이밍 바인딩 안정화
      rendererRef.current = new MotionTextRenderer(containerRef.current)
      if (videoRef.current) {
        rendererRef.current.attachMedia(videoRef.current)
      }
      console.log('[useMotionTextRenderer] Renderer created and media attached')

      updateState({
        isLoading: false,
        status: 'ready',
        error: null,
      })
    } catch (error) {
      handleError(error as Error)
    }
  }, [updateState, handleError])

  /**
   * 시나리오 로드 및 재생
   */
  const loadScenario = useCallback(
    async (config: RendererConfig, opts?: { silent?: boolean }) => {
      if (!rendererRef.current) {
        await initializeRenderer()
      }

      if (!rendererRef.current) {
        throw new Error('Failed to initialize renderer')
      }

      try {
        if (!opts?.silent) {
          updateState({
            isLoading: true,
            status: 'loading scenario',
            error: null,
          })
        }

        // 기존 루프 클리어
        if (loopTimeoutRef.current) {
          clearTimeout(loopTimeoutRef.current)
        }

        // Preload plugins for this scenario
        await preloadPluginsForScenario(config)

        // 시나리오 로드
        console.log(
          '[useMotionTextRenderer] Loading config:',
          JSON.stringify(config, null, 2)
        )
        await rendererRef.current.loadConfig(config)
        currentConfigRef.current = config
        console.log('[useMotionTextRenderer] Config loaded successfully')

        // Debug: Check renderer state and DOM
        console.log('[useMotionTextRenderer] Renderer state after load:', {
          hasRenderer: !!rendererRef.current,
          rendererMethods: rendererRef.current
            ? Object.getOwnPropertyNames(
                Object.getPrototypeOf(rendererRef.current)
              )
            : [],
          containerChildren: containerRef.current?.children.length || 0,
          containerHTML:
            containerRef.current?.innerHTML.slice(0, 200) || 'empty',
        })

        // Check if text elements are created in DOM
        setTimeout(() => {
          if (containerRef.current) {
            const textElements = containerRef.current.querySelectorAll(
              '[data-text], .text-element, text, span'
            )
            console.log(
              '[useMotionTextRenderer] Text elements found in DOM:',
              textElements.length
            )
            textElements.forEach((el, idx) => {
              console.log(
                `[useMotionTextRenderer] Text element ${idx}:`,
                el.textContent,
                el.className
              )
            })
          }
        }, 100)

        // 자동 재생
        if (autoPlayRef.current) {
          // Do not throw on media play failure
          try {
            await play()
          } catch {
            /* noop */
          }
        }

        updateState({
          isLoading: false,
          status: 'loaded',
          duration: config.cues?.[0]?.root?.absEnd || 3,
        })
      } catch (error) {
        handleError(error as Error)
      }
    },
    [initializeRenderer, updateState, handleError]
  )

  /**
   * 재생
   */
  const play = useCallback(async () => {
    if (!rendererRef.current) return

    try {
      console.log('[useMotionTextRenderer] Starting pure timer-based playback')

      // Start the renderer without video
      rendererRef.current.play()
      startTimeRef.current = performance.now()

      const duration = currentConfigRef.current?.cues?.[0]?.root?.absEnd || 3
      console.log('[useMotionTextRenderer] Animation duration:', duration)
      // Ensure the rAF loop sees playing=true immediately (avoid first-run race)
      isPlayingRef.current = true
      updateState({ isPlaying: true, status: 'playing', currentTime: 0 })

      // Start continuous time update loop
      let frameCount = 0
      const updateFrame = () => {
        if (!isPlayingRef.current || !rendererRef.current) {
          console.log(
            '[useMotionTextRenderer] Stopping update loop - not playing or no renderer'
          )
          return
        }

        const elapsed = (performance.now() - startTimeRef.current) / 1000
        const loopedTime = elapsed % duration
        frameCount++

        // Use seek() instead of update() - this is the proper API
        try {
          rendererRef.current.seek(loopedTime)
          updateState({ currentTime: loopedTime })

          // Frame logging removed to reduce console noise
        } catch (seekError) {
          console.warn('[useMotionTextRenderer] Seek error:', seekError)
        }

        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(updateFrame)
      }

      // Start the animation loop immediately
      animationFrameRef.current = requestAnimationFrame(updateFrame)
      console.log(
        '[useMotionTextRenderer] Started continuous seek-based update loop'
      )
    } catch (error) {
      console.error('[useMotionTextRenderer] Play error:', error)
      handleError(error as Error)
    }
  }, [updateState, handleError])

  /**
   * 일시정지
   */
  const pause = useCallback(() => {
    if (!rendererRef.current) return

    try {
      rendererRef.current.pause()
      // Immediately flip playing ref to stop the rAF loop on next tick
      isPlayingRef.current = false

      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      updateState({ isPlaying: false, status: 'paused' })
    } catch (error) {
      handleError(error as Error)
    }
  }, [updateState, handleError])

  /**
   * 재시작 (무한 루프용)
   */
  const restart = useCallback(() => {
    if (!rendererRef.current || !isPlayingRef.current) return

    try {
      // Reset the start time for seamless looping
      startTimeRef.current = performance.now()
      rendererRef.current.seek(0)
      updateState({ currentTime: 0 })
    } catch (error) {
      handleError(error as Error)
    }
  }, [updateState, handleError])

  // Removed setupLoop - looping is now handled directly in the animation frame

  // Removed video-based time update handler - using animation frame instead

  /**
   * 정리
   */
  const dispose = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.dispose()
      rendererRef.current = null
    }

    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    currentConfigRef.current = null
    updateState({
      isPlaying: false,
      status: 'disposed',
    })
  }, [updateState])

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      dispose()
    }
  }, [dispose])

  // Removed video event listener setup - no longer needed

  return {
    // Refs
    containerRef,
    videoRef,

    // State
    ...state,

    // Methods
    initializeRenderer,
    loadScenario,
    play,
    pause,
    restart,
    dispose,
  }
}
