import type { ClipItem } from '@/app/(route)/editor/types'
import type { RendererConfigV2 } from '@/app/shared/motiontext'
import { videoSegmentManager } from '@/utils/video/segmentManager'

export interface InitialScenarioOptions {
  position?: { x: number; y: number }
  anchor?: string
  fontSizeRel?: number
  baseAspect?: '16:9' | '9:16' | 'auto'
  wordAnimationTracks?: Map<string, any[]> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface NodeIndexEntry {
  cueIndex: number
  // path from cues[cueIndex].root to the node; children indexes
  path: number[]
}

export interface InitialScenarioResult {
  config: RendererConfigV2
  index: Record<string, NodeIndexEntry>
}

function toAdjustedOrOriginalTime(sec: number): number {
  const mapped = videoSegmentManager.mapToAdjustedTime(sec)
  return mapped == null || Number.isNaN(mapped) ? sec : mapped
}

/**
 * Calculate adjusted domLifetime based on word baseTime and animation timeOffsets
 */
function calculateAdjustedDomLifetime(
  clip: ClipItem,
  wordAnimationTracks?: Map<string, any[]> // eslint-disable-line @typescript-eslint/no-explicit-any
): [number, number] {
  const words = Array.isArray(clip.words) ? clip.words : []
  if (words.length === 0) return [0, 0]

  // Start with word-based timing
  let domStart = Math.min(...words.map((w) => w.start))
  let domEnd = Math.max(...words.map((w) => w.end))

  // Adjust for animations if present
  if (wordAnimationTracks) {
    for (const word of words) {
      const tracks = wordAnimationTracks.get(word.id) || []

      for (const track of tracks) {
        if (track.timing) {
          // Use timing field which has converted absolute values (not percentage strings)
          domStart = Math.min(domStart, track.timing.start)
          domEnd = Math.max(domEnd, track.timing.end)
        }
      }
    }
  }

  // Apply segment time mapping
  const adjDomStart = toAdjustedOrOriginalTime(domStart)
  const adjDomEnd = toAdjustedOrOriginalTime(domEnd)

  return [adjDomStart, adjDomEnd]
}

export function buildInitialScenarioFromClips(
  clips: ClipItem[],
  opts: InitialScenarioOptions = {}
): InitialScenarioResult {
  const position = opts.position ?? { x: 0.5, y: 0.925 } // 7.5% from bottom
  const anchor = opts.anchor ?? 'bc'
  const wordAnimationTracks = opts.wordAnimationTracks
  const fontSizeRel = opts.fontSizeRel ?? 0.07 // Changed from 0.05 to 0.07 to match cwi_demo_full
  const baseAspect = opts.baseAspect ?? '16:9'

  // Debug: Log wordAnimationTracks info
  if (process.env.NODE_ENV === 'development') {
    console.log('buildInitialScenarioFromClips - wordAnimationTracks:', {
      exists: !!wordAnimationTracks,
      size: wordAnimationTracks?.size || 0,
      keys: wordAnimationTracks ? Array.from(wordAnimationTracks.keys()) : []
    })
  }

  const cues: RendererConfigV2['cues'] = []
  const index: Record<string, NodeIndexEntry> = {}

  clips.forEach((clip) => {
    // Compute clip start/end from words for robustness
    const words = Array.isArray(clip.words) ? clip.words : []
    if (words.length === 0) return

    const clipStart = Math.min(...words.map((w) => w.start))
    const clipEnd = Math.max(...words.map((w) => w.end))
    const adjClipStart = toAdjustedOrOriginalTime(clipStart)
    const adjClipEnd = toAdjustedOrOriginalTime(clipEnd)

    // Debug: Log clip timing details
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Clip ${clip.id} timing:`, {
        clipId: clip.id,
        clipStart,
        clipEnd,
        adjClipStart,
        adjClipEnd,
        wordsCount: words.length,
        wordTimings: words.map(w => ({
          id: w.id,
          text: w.text,
          start: w.start,
          end: w.end
        }))
      })
    }

    if (!Number.isFinite(adjClipStart) || !Number.isFinite(adjClipEnd)) return
    if (adjClipEnd <= adjClipStart) return

    const children: NonNullable<
      RendererConfigV2['cues'][number]['root']['children']
    > = []

    // Build word nodes (visible by default, ready for animations)
    words.forEach((w) => {
      const s = toAdjustedOrOriginalTime(w.start)
      const e = toAdjustedOrOriginalTime(w.end)
      if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return

      const nodeId = `word-${w.id}` // Use actual word.id for consistent nodeIndex mapping
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child: any = {
        id: nodeId,
        eType: 'text' as const,
        text: w.text,
        // Store utterance window at node-level baseTime per v2 spec
        baseTime: [s, e] as [number, number],
        // Remove layout and style from individual words - they inherit from parent
      }

      // Add plugin information from animation tracks
      const animationTracks = wordAnimationTracks?.get(w.id)

      // Debug: Log word ID and animation tracks lookup
      if (process.env.NODE_ENV === 'development') {
        if (animationTracks && animationTracks.length > 0) {
          console.log(`Plugin found for word ID '${w.id}':`, animationTracks.length, 'tracks')
        }
      }

      if (animationTracks && animationTracks.length > 0) {
        child.pluginChain = animationTracks
          .filter((track) => track.pluginKey) // Only include tracks with valid pluginKey
          .map((track) => ({
            name: track.pluginKey,
            params: track.params || {},
            ...(track.timeOffset && {
              timeOffset: track.timeOffset,
            }),
          }))
      }
      // record index path; children will push later so we know path length
      const childIdx = children.length
      index[nodeId] = { cueIndex: cues.length, path: [childIdx] }
      children.push(child)
    })

    if (children.length === 0) return

    const cueId = `cue-${clip.id}`
    const groupId = `clip-${clip.id}`

    // Calculate adjusted domLifetime based on animation timeOffsets
    const [adjDomStart, adjDomEnd] = calculateAdjustedDomLifetime(
      clip,
      wordAnimationTracks
    )

    const cue = {
      id: cueId,
      track: 'caption',
      domLifetime: [adjDomStart, adjDomEnd] as [number, number],
      root: {
        id: groupId,
        eType: 'group' as const,
        displayTime: [adjClipStart, adjClipEnd] as [number, number],
        layout: {
          anchor: 'define.caption.layout.anchor',
          position: 'define.caption.position',
          safeAreaClamp: 'define.caption.layout.safeAreaClamp',
          childrenLayout: 'define.caption.childrenLayout', // Reference to define
        },
        // Remove style - will inherit from track defaultStyle
        children,
      },
    }

    // Debug: Log cue timing
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎬 Cue ${cueId} created:`, {
        cueId,
        domLifetime: [adjDomStart, adjDomEnd],
        displayTime: [adjClipStart, adjClipEnd],
        childrenCount: children.length,
        text: children.map(c => c.text).join(' ')
      })
    }

    cues.push(cue)
  })

  const config: RendererConfigV2 = {
    version: '2.0',
    pluginApiVersion: '3.0',
    timebase: { unit: 'seconds' },
    stage: { baseAspect },
    define: {
      caption: {
        position: position, // Use the calculated position (default: { x: 0.5, y: 0.925 })
        layout: {
          anchor: anchor,
          safeAreaClamp: true,
        },
        childrenLayout: {
          mode: 'flow',
          direction: 'horizontal',
          wrap: true, // 강제 줄바꿈 방지 - 자동 줄바꿈 로직이 미리 처리
          maxWidth: '90%',
          gap: 0.005, // Small gap between words
          align: 'center',
          justify: 'center',
        },
      },
    },
    tracks: [
      {
        id: 'caption',
        type: 'subtitle',
        layer: 1,
        defaultStyle: {
          fontSizeRel: fontSizeRel,
          fontFamily: 'Arial, sans-serif',
          color: '#ffffff',
          align: 'center',
        },
        defaultBoxStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '4px 8px',
          borderRadius: '4px',
          opacity: 1,
        },
        defaultConstraints: {
          safeArea: {
            top: 0.025,
            bottom: 0.075,
            left: 0.05,
            right: 0.05,
          },
        },
      },
    ],
    cues,
  }

  return { config, index }
}
