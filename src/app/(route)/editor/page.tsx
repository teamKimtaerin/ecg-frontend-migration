'use client'

import {
  DndContext,
  DragOverlay,
  closestCenter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'

// Store
import { useEditorStore } from './store'

// Hooks
import { useUploadModal } from '@/hooks/useUploadModal'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { useSelectionBox } from './hooks/useSelectionBox'

// Components
import SelectionBox from '@/components/DragDrop/SelectionBox'
import UploadModal from '@/components/UploadModal'
import Toolbar from '@/components/ui/Toolbar'
import DragOverlayContent from './components/DragOverlayContent'
import EditorHeaderTabs from './components/EditorHeaderTabs'
import SubtitleEditList from './components/SubtitleEditList'
import VideoSection from './components/VideoSection'

// Utils
import { EditorHistory } from '@/utils/EditorHistory'
import { areClipsConsecutive } from '@/utils/clipMerger'
import { MergeClipsCommand } from '@/utils/commands/MergeClipsCommand'
import { showToast } from '@/utils/toast'

export default function EditorPage() {
  // Store state for DnD and selection
  const {
    activeId,
    clips,
    setClips,
    selectedClipIds,
    setSelectedClipIds,
    toggleClipSelection,
    clearSelection,
    updateClipWords,
  } = useEditorStore()

  // Local state
  const [activeTab, setActiveTab] = useState('home')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editorHistory] = useState(() => new EditorHistory())

  // Upload modal hook
  const { isTranscriptionLoading, handleFileSelect, handleStartTranscription } =
    useUploadModal()

  // DnD functionality
  const { sensors, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDrop()

  // Selection box functionality
  const {
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isSelecting,
    selectionBox,
  } = useSelectionBox()

  // Edit handlers
  const handleWordEdit = (clipId: string, wordId: string, newText: string) => {
    updateClipWords(clipId, wordId, newText)
  }

  const handleSpeakerChange = (clipId: string, newSpeaker: string) => {
    const updatedClips = clips.map((clip) =>
      clip.id === clipId ? { ...clip, speaker: newSpeaker } : clip
    )
    setClips(updatedClips)
  }

  const handleClipCheck = (clipId: string, checked: boolean) => {
    if (checked) {
      const newSet = new Set(selectedClipIds)
      newSet.add(clipId)
      setSelectedClipIds(newSet)
    } else {
      const newSet = new Set(selectedClipIds)
      newSet.delete(clipId)
      setSelectedClipIds(newSet)
    }
  }

  const handleClipSelect = (clipId: string) => {
    // Single click - select only this clip
    const newSet = new Set<string>()
    newSet.add(clipId)
    setSelectedClipIds(newSet)
  }

  // Upload modal handler
  const wrappedHandleStartTranscription = (
    data: Parameters<typeof handleStartTranscription>[0]
  ) => {
    return handleStartTranscription(
      data,
      () => setIsUploadModalOpen(false),
      false
    )
  }

  // Merge clips handler
  const handleMergeClips = () => {
    try {
      // Get selected clips from store
      const uniqueSelectedIds = Array.from(selectedClipIds)

      // 선택된 클립이 1개 이하인 경우
      if (uniqueSelectedIds.length <= 1) {
        const currentClipId = uniqueSelectedIds[0]
        if (!currentClipId) {
          showToast('합칠 클립을 선택해주세요.')
          return
        }

        // 현재 클립의 인덱스 찾기
        const currentIndex = clips.findIndex(
          (clip) => clip.id === currentClipId
        )
        if (currentIndex === -1) {
          showToast('선택된 클립을 찾을 수 없습니다.')
          return
        }

        // 다음 클립이 있는지 확인
        if (currentIndex >= clips.length - 1) {
          showToast('다음 클립이 존재하지 않습니다.')
          return
        }

        // 현재 클립과 다음 클립을 합치기 - Command 패턴 사용
        const nextClipId = clips[currentIndex + 1].id
        const clipsToMerge = [currentClipId, nextClipId]
        const command = new MergeClipsCommand(clips, [], clipsToMerge, setClips)

        editorHistory.executeCommand(command)
        clearSelection()
        showToast('클립이 성공적으로 합쳐졌습니다.', 'success')
        return
      }

      // 2개 이상의 클립이 선택된 경우
      if (!areClipsConsecutive(clips, uniqueSelectedIds)) {
        showToast(
          '선택된 클립들이 연속되어 있지 않습니다. 연속된 클립만 합칠 수 있습니다.'
        )
        return
      }

      // 클립 합치기 실행 - Command 패턴 사용
      const command = new MergeClipsCommand(
        clips,
        [],
        uniqueSelectedIds,
        setClips
      )

      editorHistory.executeCommand(command)
      clearSelection()
      showToast('클립이 성공적으로 합쳐졌습니다.', 'success')
    } catch (error) {
      console.error('클립 합치기 오류:', error)
      showToast(
        error instanceof Error
          ? error.message
          : '클립 합치기 중 오류가 발생했습니다.'
      )
    }
  }

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (editorHistory.canUndo()) {
      editorHistory.undo()
      showToast('작업이 되돌려졌습니다.', 'success')
    }
  }, [editorHistory])

  const handleRedo = useCallback(() => {
    if (editorHistory.canRedo()) {
      editorHistory.redo()
      showToast('작업이 다시 실행되었습니다.', 'success')
    }
  }, [editorHistory])

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Z (undo)
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        handleUndo()
      }
      // Ctrl+Shift+Z (redo)
      else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
        event.preventDefault()
        handleRedo()
      }
      // Ctrl+Y (redo - 대체 단축키)
      else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleUndo, handleRedo])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gray-900 text-white">
        <EditorHeaderTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <Toolbar
          activeTab={activeTab}
          onNewClick={() => setIsUploadModalOpen(true)}
          onMergeClips={handleMergeClips}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={editorHistory.canUndo()}
          canRedo={editorHistory.canRedo()}
        />

        <div className="flex h-[calc(100vh-120px)]">
          <VideoSection />

          <div
            className="flex-1 flex justify-center relative"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <SubtitleEditList
              clips={clips}
              selectedClipIds={selectedClipIds}
              onClipSelect={handleClipSelect}
              onClipCheck={handleClipCheck}
              onWordEdit={handleWordEdit}
              onSpeakerChange={handleSpeakerChange}
            />

            <SelectionBox
              startX={selectionBox.startX}
              startY={selectionBox.startY}
              endX={selectionBox.endX}
              endY={selectionBox.endY}
              isSelecting={isSelecting}
            />
          </div>
        </div>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => !isTranscriptionLoading && setIsUploadModalOpen(false)}
          onFileSelect={handleFileSelect}
          onStartTranscription={wrappedHandleStartTranscription}
          acceptedTypes={['audio/*', 'video/*']}
          maxFileSize={100 * 1024 * 1024} // 100MB
          multiple={true}
          isLoading={isTranscriptionLoading}
        />
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.3',
              },
            },
          }),
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeId && <DragOverlayContent />}
      </DragOverlay>
    </DndContext>
  )
}
