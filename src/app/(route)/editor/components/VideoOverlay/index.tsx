'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  LayerElement,
  ResponsivePosition,
  ResponsiveSize,
} from '../../types/layer'
import LayerRenderer from './LayerRenderer'

interface VideoOverlayProps {
  layers: LayerElement[]
  currentTime: number
  activeClipId: string | null
  isEditingMode: boolean
  onLayerSelect?: (layerId: string) => void
  onLayerUpdate?: (layerId: string, changes: Partial<LayerElement>) => void
}

export default function VideoOverlay({
  layers,
  currentTime,
  activeClipId,
  isEditingMode,
  onLayerSelect,
  onLayerUpdate,
}: VideoOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [videoContainerSize, setVideoContainerSize] = useState({
    width: 0,
    height: 0,
  })

  // 비디오 컨테이너 크기 변화 감지
  useEffect(() => {
    // ResizeObserver 지원 확인
    if (typeof ResizeObserver === 'undefined') {
      console.warn('ResizeObserver is not supported in this browser')
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setVideoContainerSize({ width, height })
      }
    })

    if (overlayRef.current?.parentElement) {
      resizeObserver.observe(overlayRef.current.parentElement)
    }

    return () => resizeObserver.disconnect()
  }, [])

  // 현재 시간과 활성 클립에 기반하여 표시할 레이어들 필터링
  const visibleLayers = layers.filter((layer) => {
    // 활성 클립과 연결된 레이어만 표시
    if (!activeClipId || layer.timing.clipId !== activeClipId) {
      return false
    }

    // 레이어의 시간 범위 내에 있는지 확인
    const isInTimeRange =
      currentTime >= layer.timing.startTime &&
      currentTime <= layer.timing.endTime

    // 보이는 상태이고 시간 범위 내에 있는 레이어만 표시
    return layer.metadata.visible && isInTimeRange
  })

  // 정규화된 좌표를 실제 픽셀로 변환
  const convertToPixels = (
    position: ResponsivePosition,
    size: ResponsiveSize
  ) => ({
    x: position.x * videoContainerSize.width,
    y: position.y * videoContainerSize.height,
    width: size.width * videoContainerSize.width,
    height: size.height * videoContainerSize.height,
  })

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {visibleLayers
        .sort((a, b) => a.zIndex - b.zIndex) // z-index 순서로 정렬
        .map((layer) => {
          const pixelCoords = convertToPixels(layer.position, layer.size)

          return (
            <LayerRenderer
              key={layer.id}
              layer={layer}
              pixelPosition={pixelCoords}
              isEditingMode={isEditingMode}
              onSelect={() => onLayerSelect?.(layer.id)}
              onUpdate={(changes) => onLayerUpdate?.(layer.id, changes)}
            />
          )
        })}
    </div>
  )
}
