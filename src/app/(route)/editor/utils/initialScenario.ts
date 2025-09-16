import type { ClipItem } from '@/app/(route)/editor/types'
import type { RendererConfigV2 } from '@/app/shared/motiontext'
import { videoSegmentManager } from '@/utils/video/segmentManager'

export interface InitialScenarioOptions {
  position?: { x: number; y: number }
  anchor?: string
  fontSizeRel?: number
  baseAspect?: '16:9' | '9:16' | 'auto'
  wordAnimationTracks?: Map<string, any[]>  // Add animation tracks
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
  wordAnimationTracks?: Map<string, any[]>
): [number, number] {
  const words = Array.isArray(clip.words) ? clip.words : []
  if (words.length === 0) return [0, 0]

  // Start with word-based timing
  let domStart = Math.min(...words.map(w => w.start))
  let domEnd = Math.max(...words.map(w => w.end))

  // Adjust for animations if present
  if (wordAnimationTracks) {
    for (const word of words) {
      const tracks = wordAnimationTracks.get(word.id) || []

      for (const track of tracks) {
        if (track.timeOffset) {
          const [preOffset, postOffset] = track.timeOffset
          // preOffset is negative, extends start earlier
          domStart = Math.min(domStart, word.start + preOffset)
          // postOffset is positive, extends end later
          domEnd = Math.max(domEnd, word.end + postOffset)
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
    if (!Number.isFinite(adjClipStart) || !Number.isFinite(adjClipEnd)) return
    if (adjClipEnd <= adjClipStart) return

    const children: NonNullable<RendererConfigV2['cues'][number]['root']['children']> = []

    // Build word nodes (visible by default, ready for animations)
    words.forEach((w) => {
      const s = toAdjustedOrOriginalTime(w.start)
      const e = toAdjustedOrOriginalTime(w.end)
      if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return

      const nodeId = `word-${clip.id}_word_${children.length}` // Changed to match cwi_demo_full pattern
      const child: any = {
        id: nodeId,
        eType: 'text' as const,
        text: w.text,
        // Store utterance window at node-level baseTime per v2 spec
        baseTime: [s, e] as [number, number],
        // Remove layout and style from individual words - they inherit from parent
      }

      // Add plugin information from animation tracks or applied assets
      const animationTracks = wordAnimationTracks?.get(w.id)
      if (animationTracks && animationTracks.length > 0) {
        child.pluginChain = animationTracks.map((track: any) => ({
          name: track.pluginKey || track.assetName || track.assetId,
          // TODO: Add parameters from track.params if needed
        }))
      } else if (w.appliedAssets && w.appliedAssets.length > 0) {
        // Fallback to appliedAssets for backwards compatibility
        child.pluginChain = w.appliedAssets.map((assetId: string) => ({
          name: assetId,
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
    const [adjDomStart, adjDomEnd] = calculateAdjustedDomLifetime(clip, wordAnimationTracks)

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
        style: 'define.caption.boxStyle',
        children,
      },
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
        boxStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '8px 16px',
          borderRadius: '4px',
        },
        layout: {
          anchor: anchor,
          safeAreaClamp: true,
        },
        childrenLayout: {
          mode: 'flow',
          direction: 'horizontal',
          wrap: true,
          maxWidth: '100%',
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
          opacity: 1,
        },
      },
    ],
    cues,
  }

  return { config, index }
}
