'use client'

import React from 'react'
import { LayerElement, ShapeContent } from '../../../types/layer'

interface ShapeLayerProps {
  layer: LayerElement
  isEditingMode: boolean
  onUpdate?: (changes: Partial<LayerElement>) => void
}

export default function ShapeLayer({ layer }: ShapeLayerProps) {
  const content = layer.content as ShapeContent

  const shapeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    stroke: layer.style.borderColor || '#ffffff',
    strokeWidth: content.strokeWidth,
    fill: content.filled
      ? layer.style.backgroundColor || 'transparent'
      : 'transparent',
  }

  const renderShape = () => {
    switch (content.shapeType) {
      case 'rectangle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              style={shapeStyle}
              rx={layer.style.borderRadius || 0}
            />
          </svg>
        )

      case 'circle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" style={shapeStyle} />
          </svg>
        )

      case 'triangle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon points="50,5 95,90 5,90" style={shapeStyle} />
          </svg>
        )

      case 'arrow':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon
              points="10,40 10,60 70,60 70,80 90,50 70,20 70,40"
              style={shapeStyle}
            />
          </svg>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderShape()}
    </div>
  )
}
