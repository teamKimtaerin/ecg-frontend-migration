'use client'

import React from 'react'
import VideoPlayer from './VideoPlayer'
import { LayerElement } from '../types/layer'

interface VideoSectionProps {
  width?: number
  layers?: LayerElement[]
  activeClipId?: string | null
  isEditingMode?: boolean
  onLayerSelect?: (layerId: string) => void
  onLayerUpdate?: (layerId: string, changes: Partial<LayerElement>) => void
}

const VideoSection: React.FC<VideoSectionProps> = ({
  width = 300,
  layers = [],
  activeClipId = null,
  isEditingMode = false,
  onLayerSelect,
  onLayerUpdate,
}) => {
  return (
    <div
      className="bg-gray-900 p-4 flex-shrink-0 h-full flex flex-col"
      style={{ width: `${width}px` }}
    >
      <div
        className="bg-black rounded-lg mb-4 relative flex-shrink-0"
        style={{ aspectRatio: '16/9' }}
      >
        <VideoPlayer
          className="w-full h-full"
          layers={layers}
          activeClipId={activeClipId}
          isEditingMode={isEditingMode}
          onLayerSelect={onLayerSelect}
          onLayerUpdate={onLayerUpdate}
        />
      </div>

      {/* 추가 공간 - 향후 다른 컨트롤이나 정보를 위한 공간 */}
      <div className="flex-1">
        {/* 현재는 빈 공간, 필요에 따라 컨트롤이나 메타데이터 추가 가능 */}
      </div>
    </div>
  )
}

export default VideoSection
