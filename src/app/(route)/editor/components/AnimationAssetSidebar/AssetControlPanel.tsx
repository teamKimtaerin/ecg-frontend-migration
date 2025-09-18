'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { IoCheckmark, IoClose, IoRefresh, IoSettings } from 'react-icons/io5'
import { PluginParameterControls } from '../../../asset-store/components/PluginParameterControls'
import {
  loadPluginManifest,
  getDefaultParameters,
  type PluginManifest,
} from '@/app/(route)/asset-store/utils/scenarioGenerator'
import { useEditorStore } from '../../store'
import { AssetSettings } from './types'

interface AssetControlPanelProps {
  assetName: string
  assetId?: string
  onClose: () => void
  onSettingsChange?: (settings: AssetSettings) => void
}


const AssetControlPanel: React.FC<AssetControlPanelProps> = ({
  assetName,
  assetId,
  onClose,
  onSettingsChange,
}) => {
  const [manifest, setManifest] = useState<PluginManifest | null>(null)
  const [parameters, setParameters] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [fallbackPluginKey, setFallbackPluginKey] = useState<string | undefined>(
    undefined
  )

  // Pull current UI/track context from store to resolve pluginKey reliably
  const { expandedAssetId, focusedWordId, selectedWordId, wordAnimationTracks } =
    useEditorStore()

  const targetWordId = focusedWordId || selectedWordId || null

  // Resolve pluginKey from current word's animation tracks -> expanded asset
  const pluginKeyFromStore = useMemo(() => {
    if (!targetWordId) return undefined
    const targetAssetId = assetId || expandedAssetId
    if (!targetAssetId) return undefined
    const tracks = wordAnimationTracks.get(targetWordId) || []
    const track = tracks.find((t) => t.assetId === targetAssetId)
    return track?.pluginKey
  }, [targetWordId, assetId, expandedAssetId, wordAnimationTracks])

  // Try to resolve pluginKey from the assets database when store doesn't provide it
  useEffect(() => {
    const resolveFromDatabase = async () => {
      if (pluginKeyFromStore) return
      try {
        const res = await fetch('/asset-store/assets-database.json', {
          cache: 'no-cache',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) return
        const data = (await res.json()) as { assets?: Array<{ id: string; title: string; pluginKey?: string }> }
        const idToFind = assetId || expandedAssetId || ''
        const match = data.assets?.find(
          (a) => a.id === idToFind || a.title === assetName
        )
        if (match?.pluginKey) setFallbackPluginKey(match.pluginKey)
      } catch (e) {
        // Silent fallback; panel will show a message if unresolved
      }
    }
    resolveFromDatabase()
  }, [pluginKeyFromStore, expandedAssetId, assetId, assetName])

  // Load plugin manifest and initialize parameters
  useEffect(() => {
    const doLoad = async () => {
      setLoading(true)
      // Prefer store-derived pluginKey; fallback to assets DB
      let pluginKey = pluginKeyFromStore || fallbackPluginKey
      if (!pluginKey) {
        // Try resolving synchronously from the database here to avoid a two-pass failure
        try {
          const res = await fetch('/asset-store/assets-database.json', {
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
          })
          if (res.ok) {
            const data = (await res.json()) as {
              assets?: Array<{ id: string; title: string; pluginKey?: string }>
            }
            const idToFind = assetId || expandedAssetId || ''
            const match = data.assets?.find(
              (a) => a.id === idToFind || a.title === assetName
            )
            if (match?.pluginKey) {
              pluginKey = match.pluginKey
              setFallbackPluginKey(match.pluginKey)
              // Persist back into store if we have a target word + track
              const targetAssetId = assetId || expandedAssetId
              if (targetAssetId && targetWordId) {
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const store = useEditorStore.getState() as any
                  store.setAnimationTrackPluginKey?.(
                    targetWordId,
                    targetAssetId,
                    match.pluginKey
                  )
                } catch {}
              }
            }
          }
        } catch {
          // ignore and fall through to message below
        }
      }
      if (!pluginKey) {
        // Still no key; keep the panel visible with a friendly message
        console.warn(
          `No plugin key found for asset: ${assetName} (id=${expandedAssetId || assetId || 'n/a'}).`
        )
        setManifest(null)
        setParameters({})
        setLoading(false)
        return
      }

      try {
        const serverBase = (
          process.env.NEXT_PUBLIC_MOTIONTEXT_PLUGIN_ORIGIN ||
          'http://localhost:3300'
        ).replace(/\/$/, '')
        const loadedManifest = await loadPluginManifest(pluginKey, {
          mode: 'server',
          serverBase,
        })
        setManifest(loadedManifest)

        // Initialize parameters using shared helper (keeps parity with AssetModal)
        const initialParams = getDefaultParameters(loadedManifest)
        setParameters(initialParams)
      } catch (error) {
        console.error(`Failed to load manifest for ${pluginKey}:`, error)
      } finally {
        setLoading(false)
      }
    }

    doLoad()
    // Re-run when asset changes or store resolves a different pluginKey
  }, [assetName, pluginKeyFromStore, fallbackPluginKey, expandedAssetId, assetId])

  // If we found a fallback key but store lacked it, persist it back to store
  useEffect(() => {
    const targetAssetId = assetId || expandedAssetId
    if (!targetAssetId || !targetWordId) return
    if (fallbackPluginKey && !pluginKeyFromStore) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store = useEditorStore.getState() as any
        store.setAnimationTrackPluginKey?.(
          targetWordId,
          targetAssetId,
          fallbackPluginKey
        )
      } catch {
        // ignore
      }
    }
  }, [fallbackPluginKey, pluginKeyFromStore, assetId, expandedAssetId, targetWordId])

  const handleParameterChange = (key: string, value: unknown) => {
    setParameters((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    if (manifest?.schema) {
      const resetParams: Record<string, unknown> = {}
      Object.entries(manifest.schema).forEach(([key, property]) => {
        if (
          typeof property === 'object' &&
          property !== null &&
          'default' in property
        ) {
          resetParams[key] = property.default
        }
      })
      setParameters(resetParams)
    }
  }

  const handleApply = () => {
    onSettingsChange?.(parameters as AssetSettings)
  }

  return (
    <div className="bg-slate-800/90 rounded-lg border border-slate-600/40 p-4 mt-3 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IoSettings size={16} className="text-blue-400" />
          <h3 className="text-sm font-medium text-white">
            {assetName} 세부 조정
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-700/50 transition-colors"
        >
          <IoClose size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-slate-400">설정을 불러오는 중...</div>
          </div>
        ) : manifest ? (
          <PluginParameterControls
            manifest={manifest}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            className=""
          />
        ) : (
          <div className="pt-2 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 italic">
              플러그인 매니페스트를 찾을 수 없습니다: {assetName}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <IoRefresh size={12} />
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <IoCheckmark size={12} />
          적용
        </button>
      </div>
    </div>
  )
}

export default AssetControlPanel
