import type { StateCreator } from 'zustand'
import type { RendererConfigV2 } from '@/app/shared/motiontext'
import { buildInitialScenarioFromClips, type NodeIndexEntry } from '../../utils/initialScenario'
import { videoSegmentManager } from '@/utils/video/segmentManager'
import { computeTimeOffsetSeconds } from '@/app/shared/motiontext'

export interface ScenarioSlice {
  currentScenario: RendererConfigV2 | null
  nodeIndex: Record<string, NodeIndexEntry>
  scenarioVersion: number

  // Build initial scenario from clips
  buildInitialScenario: (
    clips: import('../../types').ClipItem[],
    opts?: Parameters<typeof buildInitialScenarioFromClips>[1]
  ) => RendererConfigV2

  // Update hooks (per word)
  updateWordBaseTime: (wordId: string, startAbsSec: number, endAbsSec: number) => void
  refreshWordPluginChain: (wordId: string) => void

  // Set scenario from arbitrary JSON (editor apply)
  setScenarioFromJson: (config: RendererConfigV2) => void
}

export const createScenarioSlice: StateCreator<ScenarioSlice> = (set, get) => ({
  currentScenario: null,
  nodeIndex: {},
  scenarioVersion: 0,

  buildInitialScenario: (clips, opts) => {
    const { config, index } = buildInitialScenarioFromClips(clips, opts)
    set({ currentScenario: config, nodeIndex: index, scenarioVersion: (get().scenarioVersion || 0) + 1 })
    return config
  },

  updateWordBaseTime: (wordId, startAbsSec, endAbsSec) => {
    let { currentScenario, nodeIndex } = get()
    if (!currentScenario) {
      // Lazily build a scenario so baseTime updates can apply even if overlay hasn't initialized
      try {
        const anyGet = get() as unknown as {
          clips?: import('../../types').ClipItem[]
          deletedClipIds?: Set<string>
          buildInitialScenario?: ScenarioSlice['buildInitialScenario']
        }
        const clipsAll = anyGet.clips || []
        const deleted = anyGet.deletedClipIds || new Set<string>()
        const activeClips = clipsAll.filter((c) => !deleted.has(c.id))
        anyGet.buildInitialScenario?.(activeClips)
        // Refresh local refs
        currentScenario = get().currentScenario
        nodeIndex = get().nodeIndex
      } catch {
        // If we cannot build, skip
      }
    }
    if (!currentScenario) return
    const entry = nodeIndex[`word-${wordId}`]
    if (!entry) return
    const cue = currentScenario.cues[entry.cueIndex]
    const childIdx = entry.path[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node: any = cue?.root?.children?.[childIdx]
    if (!node) return
    const sAdj = videoSegmentManager.mapToAdjustedTime(startAbsSec) ?? startAbsSec
    const eAdj = videoSegmentManager.mapToAdjustedTime(endAbsSec) ?? endAbsSec
    node.baseTime = [Number(sAdj), Number(eAdj)]
    // When baseTime changes, offsets must be recomputed for tracks
    get().refreshWordPluginChain(wordId)
  },

  refreshWordPluginChain: (wordId) => {
    const state = get() as ScenarioSlice & {
      wordAnimationTracks: Map<string, Array<{ assetId: string; assetName: string; pluginKey?: string; params?: Record<string, unknown>; timing: { start: number; end: number } }>>
    }
    let { currentScenario, nodeIndex, wordAnimationTracks } = state
    if (!currentScenario) {
      // Lazily build initial scenario if missing so pluginChain updates don't get dropped
      try {
        const anyGet = get() as unknown as {
          clips?: import('../../types').ClipItem[]
          deletedClipIds?: Set<string>
          buildInitialScenario?: ScenarioSlice['buildInitialScenario']
        }
        const clipsAll = anyGet.clips || []
        const deleted = anyGet.deletedClipIds || new Set<string>()
        const activeClips = clipsAll.filter((c) => !deleted.has(c.id))
        anyGet.buildInitialScenario?.(activeClips)
        currentScenario = get().currentScenario
        nodeIndex = get().nodeIndex
      } catch {
        // If building fails, we cannot proceed
      }
    }
    if (!currentScenario) return
    const entry = nodeIndex[`word-${wordId}`]
    if (!entry) return
    const cue = currentScenario.cues[entry.cueIndex]
    const childIdx = entry.path[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node: any = cue?.root?.children?.[childIdx]
    if (!node) return
    const baseTime: [number, number] = node.baseTime || cue.root.displayTime || [0, 0]
    const tracks = wordAnimationTracks?.get(wordId) || []
    const pluginChain = tracks.map((t) => {
      const name = (t.pluginKey || t.assetName || '').split('@')[0] || t.assetName
      const startAdj = videoSegmentManager.mapToAdjustedTime(t.timing.start) ?? t.timing.start
      const endAdj = videoSegmentManager.mapToAdjustedTime(t.timing.end) ?? t.timing.end
      const { timeOffset } = computeTimeOffsetSeconds(baseTime, startAdj, endAdj)
      return {
        name,
        params: t.params || {},
        baseTime,
        timeOffset, // seconds relative to baseTime[0]
      }
    })
    node.pluginChain = pluginChain
    // Make word node visible if it has any animations
    node.style = {
      ...(node.style || {}),
      opacity: pluginChain.length > 0 ? 1 : node.style?.opacity ?? 0,
    }
    set({ currentScenario: { ...currentScenario }, scenarioVersion: (get().scenarioVersion || 0) + 1 })
  },

  setScenarioFromJson: (config) => {
    // Rebuild a minimal index for children by id under each cue root
    const index: Record<string, NodeIndexEntry> = {}
    config.cues?.forEach((cue, cueIndex) => {
      const children = (cue as any)?.root?.children as Array<any> | undefined
      if (Array.isArray(children)) {
        children.forEach((child, childIdx) => {
          if (child && typeof child.id === 'string') {
            index[child.id] = { cueIndex, path: [childIdx] }
          }
        })
      }
    })
    set({ currentScenario: config, nodeIndex: index, scenarioVersion: (get().scenarioVersion || 0) + 1 })
  },
})
