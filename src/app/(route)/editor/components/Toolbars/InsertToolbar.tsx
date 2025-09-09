'use client'

import ToolbarButton from './shared/ToolbarButton'
import { LayerElement } from '../../types/layer'

interface InsertToolbarProps {
  selectedClipIds: Set<string>
  canUndo: boolean
  canRedo: boolean
  activeClipId?: string | null
  onUndo: () => void
  onRedo: () => void
  onCut?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onAddLayer?: (layer: LayerElement) => void
}

export default function InsertToolbar({
  activeClipId,
  onAddLayer,
}: InsertToolbarProps) {
  const isDisabled = !activeClipId || !onAddLayer

  return (
    <>
      {/* 텍스트 */}
      <ToolbarButton
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 7h16M4 12h8m-8 5h12"
            />
          </svg>
        }
        label="텍스트"
        disabled={isDisabled}
        onClick={() => {
          if (!activeClipId || !onAddLayer) {
            console.log(
              'Cannot add text layer: activeClipId or onAddLayer is missing',
              { activeClipId, onAddLayer }
            )
            return
          }

          const newTextLayer: LayerElement = {
            id: `text-${Date.now()}`,
            type: 'text',
            position: { x: 0.3, y: 0.3 }, // 비디오 중앙 근처
            size: { width: 0.4, height: 0.1 },
            zIndex: 1,
            timing: {
              clipId: activeClipId,
              startTime: 0,
              endTime: 5, // 기본 5초 지속
            },
            content: {
              type: 'text',
              text: '새 텍스트',
              alignment: 'center',
              verticalAlignment: 'middle',
            },
            style: {
              fontSize: 24,
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'normal',
            },
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              locked: false,
              visible: true,
            },
          }

          onAddLayer(newTextLayer)
        }}
      />

      {/* 도형 */}
      <ToolbarButton
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
          </svg>
        }
        label="도형"
        disabled={isDisabled}
        onClick={() => {
          if (!activeClipId || !onAddLayer) return

          const newShapeLayer: LayerElement = {
            id: `shape-${Date.now()}`,
            type: 'shape',
            position: { x: 0.4, y: 0.4 },
            size: { width: 0.2, height: 0.2 },
            zIndex: 1,
            timing: {
              clipId: activeClipId,
              startTime: 0,
              endTime: 5,
            },
            content: {
              type: 'shape',
              shapeType: 'rectangle',
              strokeWidth: 2,
              filled: false,
            },
            style: {
              borderColor: '#ffffff',
              backgroundColor: 'transparent',
            },
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              locked: false,
              visible: true,
            },
          }

          onAddLayer(newShapeLayer)
        }}
      />

      {/* 빈 워드 */}
      <ToolbarButton
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
        label="빈 워드"
        disabled={isDisabled}
        onClick={() => {
          if (!activeClipId || !onAddLayer) return

          const newBlankWordLayer: LayerElement = {
            id: `blank-word-${Date.now()}`,
            type: 'blank_word',
            position: { x: 0.25, y: 0.6 },
            size: { width: 0.5, height: 0.08 },
            zIndex: 1,
            timing: {
              clipId: activeClipId,
              startTime: 0,
              endTime: 5,
            },
            content: {
              type: 'blank_word',
              targetWordId: '', // 실제로는 클립의 특정 워드 위치를 참조
              placeholder: '빈칸을 채워주세요',
              isRequired: true,
              validation: {
                minLength: 1,
                maxLength: 20,
              },
            },
            style: {
              fontSize: 18,
              color: '#ffff00',
              borderColor: '#ffff00',
              borderRadius: 4,
            },
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              locked: false,
              visible: true,
            },
          }

          onAddLayer(newBlankWordLayer)
        }}
      />
    </>
  )
}
