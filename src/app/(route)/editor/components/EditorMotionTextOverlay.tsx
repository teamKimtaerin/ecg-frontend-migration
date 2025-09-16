'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionTextRenderer } from '@/app/shared/motiontext'
import { useEditorStore } from '../store'
import { type RendererConfigV2 } from '@/app/shared/motiontext'
import { buildInitialScenarioFromClips } from '../utils/initialScenario'
import { buildScenarioFromReal, type RealJson } from '../utils/realToScenario'

interface EditorMotionTextOverlayProps {
  videoContainerRef: React.RefObject<HTMLDivElement | null>
  onScenarioUpdate?: (scenario: RendererConfigV2) => void
  scenarioOverride?: RendererConfigV2
}

/**
 * EditorMotionTextOverlay
 * - Mounts a MotionText renderer over the editor VideoPlayer
 * - Skeleton only: initializes renderer and attaches to the existing <video>
 * - Scenario loading is added in later milestones
 */
export default function EditorMotionTextOverlay({
  videoContainerRef,
  onScenarioUpdate,
  scenarioOverride,
}: EditorMotionTextOverlayProps) {
  const {
    containerRef,
    videoRef,
    renderer,
    initializeRenderer,
    loadScenario,
    seek,
    status,
    error,
  } = useMotionTextRenderer({ autoPlay: false, loop: false })

  // Editor store state
  const {
    clips,
    deletedClipIds,
    showSubtitles,
    subtitleSize,
    subtitlePosition,
    wordAnimationTracks,
  } = useEditorStore()

  // Internal state
  const isInitRef = useRef(false)
  const [usingExternalScenario, setUsingExternalScenario] = useState(false)
  const [isLoadingScenario, setIsLoadingScenario] = useState(false)

  // MotionTextController for automatic video-renderer synchronization
  const controllerRef = useRef<{ destroy: () => void } | null>(null)

  // Obtain the existing video element from the global video controller
  // Add retry mechanism for video element detection
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    const getVideoElement = () => {
      // Try to find video element from the container
      if (videoContainerRef?.current) {
        const video = videoContainerRef.current.querySelector('video')
        if (video) {
          return video
        }
      }

      // Fallback to global video player if available
      const vp = (
        window as unknown as {
          videoPlayer?: {
            getElement?: () => HTMLVideoElement | null
          }
        }
      ).videoPlayer
      return vp?.getElement ? vp.getElement() : null
    }

    // Initial attempt
    let el = getVideoElement()
    if (el) {
      setVideoEl(el)
      return
    }

    // Retry mechanism with polling
    const interval = setInterval(() => {
      el = getVideoElement()
      if (el) {
        setVideoEl(el)
        clearInterval(interval)
      }
    }, 100)

    // Cleanup after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [videoContainerRef])

  useEffect(() => {
    if (!videoRef || !containerRef) return
    if (videoEl) {
      // Attach existing video element to the hook before initialization
      ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current =
        videoEl
      if (!isInitRef.current) {
        isInitRef.current = true
        void initializeRenderer()
      }
    }
  }, [initializeRenderer, videoEl, videoRef, containerRef])

  // No manifest preload required for initial, animation-less scenario

  const buildScenarioFromClips = useCallback((): RendererConfigV2 => {
    const fontSizeRel =
      subtitleSize === 'small' ? 0.05 : subtitleSize === 'large' ? 0.09 : 0.07
    const position = { x: 0.5, y: subtitlePosition === 'top' ? 0.15 : 0.925 } // 7.5% from bottom
    const activeClips = clips.filter((c) => !deletedClipIds.has(c.id))
    const { config } = buildInitialScenarioFromClips(activeClips, {
      position,
      anchor: 'bc',
      fontSizeRel,
      baseAspect: '16:9',
      wordAnimationTracks,
    })
    return config
  }, [subtitlePosition, subtitleSize, clips, deletedClipIds, wordAnimationTracks])

  // Option A: Load external scenario.json when requested
  useEffect(() => {
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    )
    const useScenario =
      params.get('scenario') === '1' ||
      process.env.NEXT_PUBLIC_EDITOR_USE_SCENARIO === '1' ||
      process.env.NEXT_PUBLIC_EDITOR_USE_SCENARIO === 'true'

    if (!useScenario) return

    let cancelled = false
    const path =
      process.env.NEXT_PUBLIC_EDITOR_SCENARIO_PATH || '/scenario.json'

    const load = async () => {
      try {
        const res = await fetch(path)
        if (!res.ok) return
        const json = (await res.json()) as RendererConfigV2
        if (cancelled) return
        setUsingExternalScenario(true)
        await loadScenario(json)
        // Send scenario to parent for JSON editor
        if (onScenarioUpdate) {
          onScenarioUpdate(json)
        }
        // Controller will handle synchronization automatically
      } catch {
        // Ignore scenario loading errors
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [loadScenario, onScenarioUpdate]) // Removed videoEl and seek from dependencies to prevent re-runs

  // Handle scenario override from JSON editor
  useEffect(() => {
    if (scenarioOverride && renderer) {
      void loadScenario(scenarioOverride)
    }
  }, [scenarioOverride, renderer, loadScenario])

  // Option B: Convert real.json to scenario on the fly when requested
  useEffect(() => {
    if (usingExternalScenario || isLoadingScenario || scenarioOverride) return
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    )
    const useReal = params.get('scenario') === 'real'

    if (!useReal) return

    // Wait for video element to be available
    if (!videoEl) {
      return
    }

    setIsLoadingScenario(true)

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/real.json')
        if (!res.ok) {
          throw new Error(
            `Failed to fetch real.json: ${res.status} ${res.statusText}`
          )
        }
        const real = (await res.json()) as RealJson
        if (cancelled) return

        const cfg = buildScenarioFromReal(real)

        await loadScenario(cfg)

        // Send scenario to parent for JSON editor
        if (onScenarioUpdate) {
          onScenarioUpdate(cfg)
        }

        // Controller will handle synchronization automatically
        setUsingExternalScenario(true)
      } catch {
        // Ignore real.json loading errors
      } finally {
        setIsLoadingScenario(false)
      }
    }
    void load()
    return () => {
      cancelled = true
      setIsLoadingScenario(false)
    }
  }, [
    usingExternalScenario,
    isLoadingScenario,
    scenarioOverride,
    videoEl,
    loadScenario,
    seek,
    onScenarioUpdate,
  ])

  // Load a scenario for all visible clips (default path)
  useEffect(() => {
    if (usingExternalScenario || isLoadingScenario || scenarioOverride) return
    if (!showSubtitles) return
    // Prefer scenario slice if present; otherwise build and set once
    const store = useEditorStore.getState() as any
    const scenarioFromSlice = store.currentScenario as RendererConfigV2 | null
    let config: RendererConfigV2
    if (scenarioFromSlice) {
      config = scenarioFromSlice
    } else {
      // Build initial scenario and store it for incremental updates
      const fontSizeRel =
        subtitleSize === 'small' ? 0.05 : subtitleSize === 'large' ? 0.09 : 0.07
      const position = { x: 0.5, y: subtitlePosition === 'top' ? 0.15 : 0.925 } // 7.5% from bottom
      const activeClips = clips.filter((c) => !deletedClipIds.has(c.id))
      config = buildInitialScenarioFromClips(activeClips, {
        position,
        anchor: 'bc',
        fontSizeRel,
        baseAspect: '16:9',
        wordAnimationTracks,
      }).config
      store.buildInitialScenario?.(activeClips, {
        position,
        anchor: 'bc',
        fontSizeRel,
        baseAspect: '16:9',
        wordAnimationTracks,
      })
    }

    if (onScenarioUpdate) onScenarioUpdate(config)

    const t = setTimeout(() => {
      void loadScenario(config).catch(() => {})
    }, 120)
    return () => clearTimeout(t)
  }, [
    buildScenarioFromClips,
    showSubtitles,
    loadScenario,
    seek,
    usingExternalScenario,
    isLoadingScenario,
    onScenarioUpdate,
    scenarioOverride,
  ]) // Removed videoEl from dependencies

  // When scenario slice version changes, reload scenario (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsub = useEditorStore.subscribe(
      (s) => (s as any).scenarioVersion,
      (version) => {
        if (!version) return
        const cfg = (useEditorStore.getState() as any)
          .currentScenario as RendererConfigV2 | null
        if (!cfg) return
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          void loadScenario(cfg, { silent: true }).catch(() => {})
        }, 60)
      }
    )
    return () => {
      if (timer) clearTimeout(timer)
      try {
        unsub()
      } catch {}
    }
  }, [loadScenario])

  // Initialize MotionTextController when renderer and video are ready
  useEffect(() => {
    if (!videoEl || !renderer || !containerRef?.current) return

    // Only initialize controller once
    if (controllerRef.current) return

    let cancelled = false

    const initController = async () => {
      try {
        const { MotionTextController } = await import('motiontext-renderer')

        if (cancelled) return

        const controller = new MotionTextController(
          videoEl,
          renderer,
          videoContainerRef.current ||
            containerRef.current!.parentElement ||
            containerRef.current!,
          { captionsVisible: true }
        )
        controller.mount()
        controllerRef.current = controller
      } catch {
        // Ignore controller initialization errors
      }
    }

    void initController()

    return () => {
      cancelled = true
      if (controllerRef.current) {
        try {
          controllerRef.current.destroy()
          controllerRef.current = null
        } catch {
          // Ignore controller cleanup errors
        }
      }
    }
  }, [videoEl, renderer, containerRef, videoContainerRef])

  if (!showSubtitles) {
    return null
  }

  return (
    <div className="absolute inset-0" aria-label="motiontext-overlay">
      <div ref={containerRef} className="w-full h-full pointer-events-none" />
      {/* Lightweight debug status (non-interactive) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 right-2 text-[10px] text-white/70 bg-black/50 px-1 rounded">
          {status}
          {error ? ` · ${error}` : ''}
          {usingExternalScenario && ' · EXT'}
          {isLoadingScenario && ' · LOADING'}
          {!videoEl && ' · NO_VIDEO'}
        </div>
      )}
    </div>
  )
}
