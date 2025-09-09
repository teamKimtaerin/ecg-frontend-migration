'use client'

import React, { useState, useEffect } from 'react'
import AssetCard, { AssetItem } from './AssetCard'
import { useEditorStore } from '../../store'

interface AssetGridProps {
  onAssetSelect?: (asset: AssetItem) => void
}

interface AssetDatabaseItem {
  id: string
  title: string
  category: string
  description: string
  thumbnail: string
  isPro: boolean
}

interface AssetDatabase {
  assets: AssetDatabaseItem[]
}

const AssetGrid: React.FC<AssetGridProps> = ({ onAssetSelect }) => {
  const {
    activeAssetTab,
    assetSearchQuery,
    currentWordAssets,
    setCurrentWordAssets,
    selectedWordId,
    applyAssetsToWord,
    clips,
  } = useEditorStore()

  const [assets, setAssets] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch assets from JSON file
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        const response = await fetch('/asset-store/assets-database.json')
        if (!response.ok) {
          throw new Error('Failed to fetch assets')
        }
        const data: AssetDatabase = await response.json()

        // Transform JSON data to AssetItem format
        const transformedAssets: AssetItem[] = data.assets.map((asset) => ({
          id: asset.id,
          name: asset.title,
          category: asset.category,
          type: 'free' as const,
          preview: {
            type: 'image' as const,
            value: asset.thumbnail,
          },
          description: asset.description,
        }))

        setAssets(transformedAssets)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  // Filter assets based on tab, category, and search query
  const filteredAssets = assets.filter((asset) => {
    // Filter by tab based on usage status for current word
    const isUsedAsset = currentWordAssets.includes(asset.id)
    if (activeAssetTab === 'my' && !isUsedAsset) {
      return false
    }
    if (activeAssetTab === 'free' && isUsedAsset) {
      return false
    }

    // Filter by search query
    if (assetSearchQuery) {
      const query = assetSearchQuery.toLowerCase()
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleAssetClick = (asset: AssetItem) => {
    // 토글 로직: 이미 선택되어 있으면 제거, 없으면 추가
    const isCurrentlySelected = currentWordAssets.includes(asset.id)
    let newSelectedAssets: string[]

    if (isCurrentlySelected) {
      // 제거
      newSelectedAssets = currentWordAssets.filter((id) => id !== asset.id)
    } else {
      // 추가
      newSelectedAssets = [...currentWordAssets, asset.id]
    }

    // Update current word assets in UI state
    setCurrentWordAssets(newSelectedAssets)

    // If a word is selected, apply the asset changes to it
    if (selectedWordId) {
      // Find the clip containing the selected word
      const targetClip = clips.find((clip) =>
        clip.words.some((word) => word.id === selectedWordId)
      )

      if (targetClip) {
        applyAssetsToWord(targetClip.id, selectedWordId, newSelectedAssets)
      }
    }

    console.log(
      'Asset toggled:',
      asset.name,
      isCurrentlySelected ? 'removed' : 'added'
    )
    onAssetSelect?.(asset)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="px-4 pb-4">
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">에셋을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="px-4 pb-4">
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">
            에셋을 불러오는데 실패했습니다.
          </p>
          <p className="text-slate-400 text-xs mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={{
              ...asset,
              isUsed: currentWordAssets.includes(asset.id),
            }}
            onClick={handleAssetClick}
          />
        ))}
      </div>

      {!loading && !error && filteredAssets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">
            {assetSearchQuery
              ? '검색 결과가 없습니다.'
              : '사용 가능한 에셋이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default AssetGrid
