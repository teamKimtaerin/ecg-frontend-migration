'use client'

import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useEditorStore } from '../../store'
import { AssetItem } from './AssetCard'

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

const UsedAssetsStrip: React.FC = () => {
  const { selectedGlitchAssets, setSelectedGlitchAssets } = useEditorStore()

  const [allAssets, setAllAssets] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(true)

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

        setAllAssets(transformedAssets)
      } catch (err) {
        console.error('Failed to fetch assets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  // Get used assets by filtering all assets with selected IDs
  const usedAssets = allAssets.filter((asset) =>
    selectedGlitchAssets.includes(asset.id)
  )

  const handleRemoveAsset = (assetId: string) => {
    setSelectedGlitchAssets(selectedGlitchAssets.filter((id) => id !== assetId))
  }

  if (loading) {
    return (
      <div className="px-4 pb-3">
        <h3 className="text-sm font-medium text-white mb-2">사용중 에셋</h3>
        <div className="text-xs text-slate-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-3">
      <h3 className="text-sm font-medium text-white mb-2">
        사용중 에셋 ({usedAssets.length}개)
      </h3>

      {usedAssets.length === 0 ? (
        <div className="text-xs text-slate-400 py-2">
          사용중인 에셋이 없습니다.
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {usedAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex-shrink-0 relative group bg-slate-700/50 rounded-lg overflow-hidden"
              style={{ width: '80px' }}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-slate-800/50 flex items-center justify-center overflow-hidden">
                <img
                  src={asset.preview.value}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Asset Name */}
              <div className="px-1 py-1">
                <p className="text-xs text-white truncate leading-tight">
                  {asset.name}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveAsset(asset.id)}
                className="absolute -top-1 -right-1 w-5 h-5 min-w-5 min-h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm aspect-square"
                aria-label={`${asset.name} 제거`}
              >
                <IoClose size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsedAssetsStrip
