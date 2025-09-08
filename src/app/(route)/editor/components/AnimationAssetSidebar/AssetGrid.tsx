'use client'

import React from 'react'
import AssetCard, { AssetItem } from './AssetCard'
import { useEditorStore } from '../../store'

interface AssetGridProps {
  onAssetSelect?: (asset: AssetItem) => void
}

const AssetGrid: React.FC<AssetGridProps> = ({ onAssetSelect }) => {
  const { activeAssetTab, selectedAssetCategory, assetSearchQuery } =
    useEditorStore()

  // Mock data for glitch assets - 실제 구현에서는 API에서 가져오거나 다른 데이터 소스를 사용
  const mockGlitchAssets: AssetItem[] = [
    {
      id: 'ci-glitch',
      name: 'Caption with Intention 템플릿',
      category: '글리치',
      type: 'free',
      preview: {
        type: 'color',
        value: '#000000',
      },
      description: '간단한 CI 글리치 효과',
    },
    {
      id: 'colorful-gradient',
      name: '화려한 그라데이션 노랑',
      category: '배경',
      type: 'free',
      preview: {
        type: 'gradient',
        value: '#FFA500',
        secondary: '#FF6B6B',
      },
      description: '밝고 화려한 그라데이션 배경',
    },
    {
      id: 'text-glitch-1',
      name: '텍스트 글리치 효과 1',
      category: '글리치',
      type: 'premium',
      preview: {
        type: 'gradient',
        value: '#FF0080',
        secondary: '#00FF80',
      },
      description: 'RGB 분리 글리치 효과',
    },
    {
      id: 'rotation-effect',
      name: '회전 애니메이션',
      category: '트랜지션',
      type: 'free',
      preview: {
        type: 'gradient',
        value: '#4F46E5',
        secondary: '#7C3AED',
      },
      description: '부드러운 회전 트랜지션',
    },
    {
      id: 'sparkle-effect',
      name: '반짝이는 효과',
      category: '텍스트 효과',
      type: 'premium',
      preview: {
        type: 'gradient',
        value: '#FFD700',
        secondary: '#FFA500',
      },
      description: '반짝이는 파티클 효과',
      isUsed: true,
    },
    {
      id: 'typewriter-effect',
      name: '타이핑 효과',
      category: '텍스트 효과',
      type: 'my',
      preview: {
        type: 'color',
        value: '#22C55E',
      },
      description: '타이프라이터 애니메이션',
    },
  ]

  // Filter assets based on tab, category, and search query
  const filteredAssets = mockGlitchAssets.filter((asset) => {
    // Filter by tab
    if (
      activeAssetTab === 'free' &&
      asset.type !== 'free' &&
      asset.type !== 'premium'
    ) {
      return false
    }
    if (activeAssetTab === 'my' && asset.type !== 'my') {
      return false
    }

    // Filter by category
    if (
      selectedAssetCategory !== '전체 클립' &&
      asset.category !== selectedAssetCategory
    ) {
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
    console.log('Asset selected:', asset)
    onAssetSelect?.(asset)
  }

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-1 gap-3">
        {filteredAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onClick={handleAssetClick} />
        ))}
      </div>

      {filteredAssets.length === 0 && (
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
