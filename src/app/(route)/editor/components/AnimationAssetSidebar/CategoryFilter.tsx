'use client'

import React from 'react'
import Dropdown from '@/components/ui/Dropdown'
import { useEditorStore } from '../../store'

const CategoryFilter: React.FC = () => {
  const { selectedAssetCategory, setSelectedAssetCategory } = useEditorStore()

  const categoryOptions = [
    { value: '전체 클립', label: '전체 클립' },
    { value: '텍스트 효과', label: '텍스트 효과' },
    { value: '글리치', label: '글리치' },
    { value: '트랜지션', label: '트랜지션' },
    { value: '배경', label: '배경' },
  ]

  const handleCategoryChange = (value: string) => {
    setSelectedAssetCategory(value)
  }

  return (
    <div className="px-4 pb-3">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        적용 범위
      </label>
      <Dropdown
        value={selectedAssetCategory}
        options={categoryOptions}
        onChange={handleCategoryChange}
        placeholder="카테고리 선택"
        variant="toolbar"
        size="small"
      />
    </div>
  )
}

export default CategoryFilter
