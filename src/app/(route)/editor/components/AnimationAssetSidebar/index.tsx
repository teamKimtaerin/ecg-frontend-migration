'use client'

import React, { useState } from 'react'
import { useEditorStore } from '../../store'
import {
  determineTargetWordId,
  getTargetWordDisplayName,
} from '../../utils/animationHelpers'

// Components
import SidebarHeader from './SidebarHeader'
import SearchBar from './SearchBar'
import UsedAssetsStrip from './UsedAssetsStrip'
import TabNavigation from './TabNavigation'
import AssetGrid from './AssetGrid'
import AssetControlPanel from './AssetControlPanel'
import { AssetItem } from './AssetCard'

interface AnimationAssetSidebarProps {
  className?: string
  onAssetSelect?: (asset: AssetItem) => void
  onClose?: () => void
}

const AnimationAssetSidebar: React.FC<AnimationAssetSidebarProps> = ({
  className,
  onAssetSelect,
  onClose,
}) => {
  const { assetSidebarWidth, selectedWordId } = useEditorStore()

  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null)
  const [expandedAssetName, setExpandedAssetName] = useState<string | null>(
    null
  )

  // Find selected word info
  const selectedWordInfo = React.useMemo(() => {
    if (!selectedWordId) return null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const store = useEditorStore.getState() as any
      const entry = store.getWordEntryById?.(selectedWordId)
      if (entry?.word) {
        return { word: entry.word, clipId: entry.clipId }
      }
    } catch {}
    return null
  }, [selectedWordId])

  const handleAssetSelect = (asset: AssetItem) => {
    console.log('Selected asset:', asset)

    // Check if the asset is already applied to determine the action
    const store = useEditorStore.getState()
    const targetWordId = determineTargetWordId(store)

    if (targetWordId) {
      const currentTracks = store.wordAnimationTracks.get(targetWordId) || []
      const isAlreadyApplied = currentTracks.find((t) => t.assetId === asset.id)

      if (isAlreadyApplied) {
        // Asset is already applied, open parameter panel
        setExpandedAssetId(asset.id)
        setExpandedAssetName(asset.name)
        console.log('Opening parameter panel for applied asset:', asset.name)
        return
      }
    }

    // Asset is not applied, normal selection callback
    onAssetSelect?.(asset)
  }

  const handleExpandedAssetChange = (
    assetId: string | null,
    assetName: string | null
  ) => {
    setExpandedAssetId(assetId)
    setExpandedAssetName(assetName)
  }

  const handleControlPanelClose = () => {
    setExpandedAssetId(null)
    setExpandedAssetName(null)
  }

  const handleSettingsChange = async (settings: Record<string, unknown>) => {
    console.log('Settings changed:', settings)

    const store = useEditorStore.getState()
    const wordId = determineTargetWordId(store)
    const assetId = expandedAssetId

    if (!wordId || !assetId) {
      throw new Error('애니메이션을 적용할 단어를 선택해주세요.')
    }

    // Apply settings to the animation track
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storeActions = store as any
      await storeActions.updateAnimationTrackParams?.(wordId, assetId, settings)

      // Note: refreshWordPluginChain is called automatically in updateAnimationTrackParams
      console.log(
        `Applied settings to word "${getTargetWordDisplayName(store)}"`
      )
    } catch (error) {
      console.error('Failed to apply animation settings:', error)
      throw error // Re-throw for UI error handling
    }
  }

  return (
    <div
      className={`relative flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full ${className || ''}`}
      style={{ width: assetSidebarWidth }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <SidebarHeader onClose={onClose} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Word Selection Indicator */}
        {selectedWordInfo && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
            <div className="text-xs text-blue-600">
              선택된 단어:{' '}
              <span className="font-medium text-blue-800">
                &ldquo;{selectedWordInfo.word.text}&rdquo;
              </span>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="pt-4">
          <SearchBar />

          {/* Used Assets Strip */}
          <UsedAssetsStrip onExpandedAssetChange={handleExpandedAssetChange} />

          {/* AssetControlPanel - Inline between UsedAssetsStrip and TabNavigation */}
          {expandedAssetId && expandedAssetName && (
            <div className="px-4 pb-2">
              <AssetControlPanel
                assetName={expandedAssetName}
                assetId={expandedAssetId}
                onClose={handleControlPanelClose}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          )}

          <TabNavigation />
        </div>

        {/* Asset Grid - Remove individual scroll */}
        <div className="px-4 pb-4">
          <AssetGrid onAssetSelect={handleAssetSelect} />
        </div>
      </div>
    </div>
  )
}

export default AnimationAssetSidebar
