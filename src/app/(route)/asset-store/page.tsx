'use client'

import { AssetCard } from '@/app/(route)/asset-store/components/AssetCard'
import { Modal } from '@/app/(route)/asset-store/components/AssetModal'
import { AssetSidebar } from '@/app/(route)/asset-store/components/AssetSidebar'
import { GSAPTextEditor } from '@/app/(route)/asset-store/components/GSAPTextEditor'
import { cn, TRANSITIONS } from '@/lib/utils'
import { AssetItem } from '@/types/asset-store'
import { useState } from 'react'
import { LuSearch } from 'react-icons/lu'

// 메인 페이지 컴포넌트
export default function AssetPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Vlog')
  const [activeFilter, setActiveFilter] = useState('All')
  const [showFavorites, setShowFavorites] = useState(false)

  // 카테고리 필터 버튼 목록
  const categoryFilters = [
    { id: 'All', label: 'All', count: 8 },
    { id: 'Animation', label: 'Animation', count: 3 },
    { id: 'Text Effect', label: 'Text', count: 1 },
    { id: 'Scroll', label: 'Scroll', count: 2 },
    { id: 'Interactive', label: 'Interactive', count: 2 },
  ]

  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: '1',
      title: 'Rotation Text',
      category: 'Text Effect',
      rating: 5,
      downloads: 1243,
      likes: 892,
      thumbnail: '/asset-store/rotation-text-thumb.svg',
      isPro: false,
      configFile: '/plugin/rotation/config.json',
      isFavorite: true,
    },
    {
      id: '2',
      title: 'TypeWriter Effect',
      category: 'Text Effect',
      rating: 4,
      downloads: 856,
      likes: 654,
      thumbnail: '/asset-store/typewriter-thumb.svg',
      isPro: false,
      configFile: '/plugin/typewriter/config.json',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Elastic Bounce',
      category: 'Text Effect',
      rating: 5,
      downloads: 2341,
      likes: 1456,
      thumbnail: '/asset-store/elastic-bounce-thumb.svg',
      isPro: false,
      configFile: '/plugin/elastic/config.json',
      isFavorite: true,
    },
    {
      id: '4',
      title: 'Glitch Effect',
      category: 'Text Effect',
      rating: 4,
      downloads: 967,
      likes: 723,
      thumbnail: '/asset-store/glitch-thumb.svg',
      isPro: false,
      configFile: '/plugin/glitch/config.json',
      isFavorite: false,
    },
    {
      id: '5',
      title: 'Magnetic Pull',
      category: 'Text Effect',
      rating: 5,
      downloads: 1589,
      likes: 1123,
      thumbnail: '/asset-store/magnetic-pull-thumb.svg',
      isPro: false,
      configFile: '/plugin/magnetic/config.json',
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
    if (
      asset.id === '1' ||
      asset.id === '2' ||
      asset.id === '3' ||
      asset.id === '4' ||
      asset.id === '5'
    ) {
      setSelectedAsset(asset)
      setIsModalOpen(true)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleFavoriteClick = () => {
    setShowFavorites(!showFavorites)
    // 즐겨찾기 모드 활성화 시 다른 필터 초기화
    if (!showFavorites) {
      setActiveFilter('All')
    }
  }

  const handleUploadClick = () => {
    console.log('에셋 업로드 클릭됨')
  }

  const handleAddToCart = () => {
    console.log('아이템이 카트에 추가되었습니다:', selectedAsset?.title)
  }

  const handleLikeClick = (assetId: string) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === assetId
          ? { ...asset, likes: (asset.likes || 0) + 1 }
          : asset
      )
    )
  }

  const handleFavoriteToggle = (assetId: string) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === assetId
          ? { ...asset, isFavorite: !asset.isFavorite }
          : asset
      )
    )
  }

  // 즐겨찾기 개수 계산
  const favoriteCount = assets.filter((asset) => asset.isFavorite).length

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      activeFilter === 'All' || asset.category === activeFilter
    const matchesFavorites = !showFavorites || asset.isFavorite

    return matchesSearch && matchesCategory && matchesFavorites
  })

  // 메인 컨테이너 클래스
  const mainContainerClasses = cn('min-h-screen', 'bg-gray-50', 'text-black')

  // 검색 컨테이너 클래스
  const searchContainerClasses = cn('relative', 'w-80')

  // 검색 입력 클래스
  const searchInputClasses = cn(
    'w-full',
    'pl-4',
    'pr-12', // 오른쪽 패딩을 늘려서 아이콘 공간 확보
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

  // 검색 아이콘 클래스
  const searchIconClasses = cn(
    'absolute',
    'right-3',
    'top-1/2',
    'transform',
    '-translate-y-1/2',
    'text-gray-400',
    'pointer-events-none'
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
          favoriteCount={favoriteCount}
          onFavoriteClick={handleFavoriteClick}
          onUploadClick={handleUploadClick}
        />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Asset Store</h1>

            <div className="flex items-center space-x-4">
              <div className={searchContainerClasses}>
                <input
                  type="text"
                  placeholder="Search assets"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={searchInputClasses}
                />
                <LuSearch className={searchIconClasses} size={20} />
              </div>
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
                onLikeClick={handleLikeClick}
                onFavoriteToggle={handleFavoriteToggle}
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
