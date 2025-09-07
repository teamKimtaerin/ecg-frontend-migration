'use client'

import { cn, TRANSITIONS, type BaseComponentProps } from '@/lib/utils'
import React from 'react'

// Asset 사이드바 Props 타입
interface AssetSidebarProps extends BaseComponentProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  categories?: string[]
}

// Asset 사이드바 컴포넌트
export const AssetSidebar: React.FC<AssetSidebarProps> = ({
  selectedCategory = 'Vlog',
  onCategoryChange,
  categories = ['Vlog', 'Festivals', 'Business'],
  className,
}) => {
  // 사이드바 클래스
  const sidebarClasses = cn(
    'w-48', // 폭 축소 (256px -> 192px)
    'bg-white', // 화이트 배경
    'border-r',
    'border-gray-100', // 미세한 보더
    'min-h-screen',
    'p-5',
    className
  )

  // 카테고리 버튼 클래스 생성 함수
  const getCategoryButtonClasses = (category: string) =>
    cn(
      'w-full',
      'text-left',
      'px-4',
      'py-2.5',
      'rounded-md', // 더 작은 라운딩
      'font-medium',
      'text-sm', // 더 작은 텍스트
      TRANSITIONS.colors,

      // 선택된 상태
      selectedCategory === category
        ? 'bg-black text-white' // 블랙 배경에 화이트 텍스트
        : 'text-gray-600 hover:bg-gray-50 hover:text-black' // 미니멀한 호버
    )

  return (
    <aside className={sidebarClasses}>
      <div className="mb-6">
        <h3 className="text-black text-base font-semibold mb-5 tracking-wide">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange?.(category)}
              className={getCategoryButtonClasses(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
