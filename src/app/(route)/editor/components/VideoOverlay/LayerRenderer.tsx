'use client'

import React from 'react'
import { LayerElement } from '../../types/layer'
import TextLayer from './layers/TextLayer'
import ShapeLayer from './layers/ShapeLayer'
import BlankWordLayer from './layers/BlankWordLayer'

interface LayerRendererProps {
  layer: LayerElement
  pixelPosition: {
    x: number
    y: number
    width: number
    height: number
  }
  isEditingMode: boolean
  onSelect?: () => void
  onUpdate?: (changes: Partial<LayerElement>) => void
}

export default function LayerRenderer({
  layer,
  pixelPosition,
  isEditingMode,
  onSelect,
  onUpdate,
}: LayerRendererProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: pixelPosition.x,
    top: pixelPosition.y,
    width: pixelPosition.width,
    height: pixelPosition.height,
    zIndex: layer.zIndex,
    opacity: layer.style.opacity || 1,
    pointerEvents: isEditingMode ? 'auto' : 'none',
    cursor: isEditingMode ? 'pointer' : 'default',

    // 기본 스타일 적용
    backgroundColor: layer.style.backgroundColor,
    border: layer.style.borderWidth
      ? `${layer.style.borderWidth}px solid ${layer.style.borderColor || '#000'}`
      : 'none',
    borderRadius: layer.style.borderRadius || 0,

    // 그림자 효과
    boxShadow: layer.style.shadowColor
      ? `${layer.style.shadowOffset?.x || 0}px ${layer.style.shadowOffset?.y || 0}px ${layer.style.shadowBlur || 0}px ${layer.style.shadowColor}`
      : 'none',
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isEditingMode && onSelect) {
      e.stopPropagation()
      onSelect()
    }
  }

  // 타입에 따른 레이어 렌더링
  const renderLayerContent = () => {
    switch (layer.type) {
      case 'text':
        return (
          <TextLayer
            layer={layer}
            isEditingMode={isEditingMode}
            onUpdate={onUpdate}
          />
        )
      case 'shape':
        return (
          <ShapeLayer
            layer={layer}
            isEditingMode={isEditingMode}
            onUpdate={onUpdate}
          />
        )
      case 'blank_word':
        return (
          <BlankWordLayer
            layer={layer}
            isEditingMode={isEditingMode}
            onUpdate={onUpdate}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      style={baseStyle}
      onClick={handleClick}
      className={`
        transition-all duration-200
        ${isEditingMode ? 'hover:ring-2 hover:ring-blue-400' : ''}
        ${layer.metadata.locked ? 'pointer-events-none' : ''}
      `}
    >
      {renderLayerContent()}

      {/* 편집 모드에서 선택 표시 */}
      {isEditingMode && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 hover:opacity-100 transition-opacity" />
      )}
    </div>
  )
}
