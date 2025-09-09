import React from 'react'
import {
  IoRefresh,
  IoDocument,
  IoChevronUp,
  IoFlash,
  IoArrowBack,
  IoEye,
  IoExpand,
  IoTrendingUp,
} from 'react-icons/io5'
import { Word } from '../../types'
import { useEditorStore } from '../../store'

interface ClipWordsProps {
  clipId: string
  words: Word[]
  onWordEdit: (clipId: string, wordId: string, newText: string) => void
}

// Asset icon mapping (same as UsedAssetsStrip.tsx)
const getAssetIcon = (assetName: string) => {
  const iconMap = {
    'Rotation Text': IoRefresh,
    'TypeWriter Effect': IoDocument,
    'Elastic Bounce': IoChevronUp,
    'Glitch Effect': IoFlash,
    'Magnetic Pull': IoArrowBack,
    'Fade In Stagger': IoEye,
    'Scale Pop': IoExpand,
    'Slide Up': IoTrendingUp,
  }
  return iconMap[assetName as keyof typeof iconMap] || null
}

export default function ClipWords({
  clipId,
  words,
  onWordEdit,
}: ClipWordsProps) {
  const {
    selectedWordId,
    setSelectedWordId,
    currentWordAssets,
    setCurrentWordAssets,
    selectedWordAssets,
    applyAssetsToWord,
  } = useEditorStore()
  const [allAssets, setAllAssets] = React.useState<
    Array<{ id: string; title: string }>
  >([])

  // Fetch assets database for asset names
  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/asset-store/assets-database.json')
        if (response.ok) {
          const data = await response.json()
          setAllAssets(data.assets)
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      }
    }
    fetchAssets()
  }, [])

  // Get asset name by ID
  const getAssetNameById = (id: string) => {
    const asset = allAssets.find((a) => a.id === id)
    return asset?.title || ''
  }

  const handleWordClick = (e: React.MouseEvent, word: Word) => {
    e.stopPropagation()

    // If word is already selected and has no current assets, trigger edit
    if (selectedWordId === word.id && currentWordAssets.length === 0) {
      onWordEdit(clipId, word.id, word.text)
    } else {
      // Select word and load its current assets
      setSelectedWordId(word.id)

      // Load existing assets for this word from selectedWordAssets or appliedAssets
      const wordAssets = selectedWordAssets[word.id] || word.appliedAssets || []
      setCurrentWordAssets(wordAssets)
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {words.map((word) => {
        const isSelected = selectedWordId === word.id
        const appliedAssets = word.appliedAssets || []

        return (
          <React.Fragment key={word.id}>
            <button
              className={`${
                isSelected
                  ? 'bg-[#4A5AF0] border border-[#6366F1]'
                  : 'bg-[#383842] border border-[#4D4D59] hover:border-[#9999A6]'
              } rounded px-2 py-1 text-sm text-[#F2F2F2] transition-colors`}
              onClick={(e) => handleWordClick(e, word)}
            >
              {word.text}
            </button>

            {/* Render asset icons after each word */}
            {appliedAssets.length > 0 && (
              <div className="flex gap-1 items-center">
                {appliedAssets.map((assetId: string) => {
                  const assetName = getAssetNameById(assetId)
                  const IconComponent = getAssetIcon(assetName)
                  return IconComponent ? (
                    <div
                      key={assetId}
                      className="w-3 h-3 bg-slate-600/50 rounded-sm flex items-center justify-center"
                      title={assetName}
                    >
                      <IconComponent size={10} className="text-slate-300" />
                    </div>
                  ) : null
                })}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
