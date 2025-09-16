'use client'

import React, { useEffect, useState } from 'react'
import { IoCheckmark, IoClose, IoRefresh, IoSettings } from 'react-icons/io5'
import { PluginParameterControls } from '../../../asset-store/components/PluginParameterControls'
import { loadPluginManifest } from '../../utils/pluginManifestLoader'
import type { PluginManifest } from '../../utils/pluginManifestLoader'
import { AssetSettings } from './types'

interface AssetControlPanelProps {
  assetName: string
  onClose: () => void
  onSettingsChange?: (settings: AssetSettings) => void
}

// Asset name to plugin key mapping
const ASSET_TO_PLUGIN_KEY: Record<string, string> = {
  'Rotation Text': 'rotation@2.0.0',
  'TypeWriter Effect': 'typewriter@2.0.0',
  'Elastic Bounce': 'elastic@2.0.0',
  'Glitch Effect': 'glitch@2.0.0',
  'Scale Pop': 'scalepop@2.0.0',
  'Fade In Stagger': 'fadein@2.0.0',
  'Slide Up': 'slideup@2.0.0',
  'Magnetic Pull': 'magnetic@2.0.0',
}

const AssetControlPanel: React.FC<AssetControlPanelProps> = ({
  assetName,
  onClose,
  onSettingsChange,
}) => {
  const [manifest, setManifest] = useState<PluginManifest | null>(null)
  const [parameters, setParameters] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)

  // Load plugin manifest and initialize parameters
  useEffect(() => {
    const loadManifest = async () => {
      const pluginKey = ASSET_TO_PLUGIN_KEY[assetName]
      if (!pluginKey) {
        console.warn(`No plugin key found for asset: ${assetName}`)
        setLoading(false)
        return
      }

      try {
        const loadedManifest = await loadPluginManifest(pluginKey)
        if (loadedManifest) {
          setManifest(loadedManifest)

          // Initialize parameters with default values
          const initialParams: Record<string, unknown> = {}
          if (loadedManifest.schema) {
            Object.entries(loadedManifest.schema).forEach(([key, property]) => {
              if (typeof property === 'object' && property !== null && 'default' in property) {
                initialParams[key] = property.default
              }
            })
          }
          setParameters(initialParams)
        }
      } catch (error) {
        console.error(`Failed to load manifest for ${pluginKey}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadManifest()
  }, [assetName])

  const handleParameterChange = (key: string, value: unknown) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    if (manifest?.schema) {
      const resetParams: Record<string, unknown> = {}
      Object.entries(manifest.schema).forEach(([key, property]) => {
        if (typeof property === 'object' && property !== null && 'default' in property) {
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
