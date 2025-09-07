'use client'

import { AssetCard } from '@/app/(route)/asset-store/components/AssetCard'
import { Modal } from '@/app/(route)/asset-store/components/AssetModal'
import { AssetSidebar } from '@/app/(route)/asset-store/components/AssetSidebar'
import { GSAPTextEditor } from '@/app/(route)/asset-store/components/GSAPTextEditor'
import { cn, TRANSITIONS } from '@/lib/utils'
import { AssetItem } from '@/types/asset-store'
import { useState } from 'react'

// 메인 페이지 컴포넌트
export default function AssetPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Vlog')
  const [activeFilter, setActiveFilter] = useState('All')

  // 카테고리 필터 버튼 목록
  const categoryFilters = [
    { id: 'All', label: 'All', count: 8 },
    { id: 'Animation', label: 'Animation', count: 3 },
    { id: 'Text Effect', label: 'Text', count: 1 },
    { id: 'Scroll', label: 'Scroll', count: 2 },
    { id: 'Interactive', label: 'Interactive', count: 2 },
  ]

  const [assets] = useState<AssetItem[]>([
    {
      id: '1',
      title: 'Rotation Text',
      category: 'Text Effect',
      rating: 5,
      downloads: 1243,
      likes: 892,
      thumbnail: '/asset-store/rotation-text-thumb.svg',
      isPro: false,
      configFile: '/asset-store/template1-rotation.json',
      isFavorite: true,
    },
    {
      id: '2',
      title: 'Fade In Animation',
      category: 'Animation',
      rating: 4,
      downloads: 856,
      likes: 654,
      thumbnail: '/asset-store/fade-in-thumb.svg',
      isPro: false,
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Scroll Trigger',
      category: 'Scroll',
      rating: 5,
      downloads: 2341,
      likes: 1456,
      thumbnail: '/asset-store/scroll-trigger-thumb.svg',
      isPro: true,
      isFavorite: true,
    },
    {
      id: '4',
      title: 'Morphing Shape',
      category: 'Animation',
      rating: 4,
      downloads: 967,
      likes: 723,
      thumbnail: '/asset-store/morphing-shape-thumb.svg',
      isPro: false,
      isFavorite: false,
    },
    {
      id: '5',
      title: 'Timeline Control',
      category: 'Interactive',
      rating: 5,
      downloads: 1589,
      likes: 1123,
      thumbnail: '/asset-store/timeline-control-thumb.svg',
      isPro: true,
      isFavorite: true,
    },
    {
      id: '6',
      title: 'Physics Motion',
      category: 'Physics',
      rating: 4,
      downloads: 734,
      likes: 567,
      thumbnail: '/asset-store/physics-motion-thumb.svg',
      isPro: false,
      isFavorite: false,
    },
    {
      id: '7',
      title: 'Observer Carousel',
      category: 'Observer',
      rating: 5,
      downloads: 1876,
      likes: 1234,
      thumbnail: '/asset-store/observer-carousel-thumb.svg',
      isPro: true,
      isFavorite: false,
    },
    {
      id: '8',
      title: 'Scroll Waves',
      category: 'Scroll',
      rating: 4,
      downloads: 1123,
      likes: 889,
      thumbnail: '/asset-store/scroll-waves-thumb.svg',
      isPro: false,
      isFavorite: true,
    },
  ])

  const handleCardClick = (asset: AssetItem) => {
    if (asset.id === '1') {
      setSelectedAsset(asset)
      setIsModalOpen(true)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleAddToCart = () => {
    console.log('아이템이 카트에 추가되었습니다:', selectedAsset?.title)
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      activeFilter === 'All' || asset.category === activeFilter
    return matchesSearch && matchesCategory
  })

  // 메인 컨테이너 클래스
  const mainContainerClasses = cn('min-h-screen', 'bg-gray-50', 'text-black')

  // 검색 입력 클래스
  const searchInputClasses = cn(
    'w-80',
    'px-4',
    'py-2.5',
    'bg-white',
    'border',
    'border-gray-200',
    'rounded-lg',
    'text-black',
    'placeholder-gray-400',
    'focus:outline-none',
    'focus:border-black',
    'focus:ring-1',
    'focus:ring-black',
    'shadow-sm',
    TRANSITIONS.colors
  )

  // 카테고리 버튼 클래스
  const getCategoryButtonClasses = (isActive: boolean) =>
    cn(
      'px-4',
      'py-2',
      'rounded-full',
      'text-sm',
      'font-medium',
      'border',
      'cursor-pointer',
      TRANSITIONS.colors,
      isActive
        ? ['bg-black', 'text-white', 'border-black']
        : [
            'bg-white',
            'text-gray-700',
            'border-gray-200',
            'hover:border-gray-300',
            'hover:bg-gray-50',
          ]
    )

  return (
    <div className={mainContainerClasses}>
      <div className="flex">
        <AssetSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Asset Store</h1>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search assets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={searchInputClasses}
              />
            </div>
          </div>

          {/* 카테고리 필터 버튼 */}
          <div className="flex items-center space-x-3 mb-8">
            {categoryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={getCategoryButtonClasses(activeFilter === filter.id)}
              >
                <span>{filter.label}</span>
                <span className="ml-1.5 text-xs opacity-70">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAsset?.title || ''}
        variant="large"
      >
        <GSAPTextEditor
          onAddToCart={handleAddToCart}
          configFile={selectedAsset?.configFile}
        />
      </Modal>
    </div>
  )
}
