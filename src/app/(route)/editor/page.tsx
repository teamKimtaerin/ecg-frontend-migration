'use client'

import {
  DndContext,
  DragOverlay,
  closestCenter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import { useCallback, useEffect, useId, useState } from 'react'

// Store
import { useEditorStore } from './store'

// Storage & Managers
import { mediaStorage } from '@/utils/storage/mediaStorage'
import { projectStorage } from '@/utils/storage/projectStorage'
import { AutosaveManager } from '@/utils/managers/AutosaveManager'
import { projectInfoManager } from '@/utils/managers/ProjectInfoManager'
import { log } from '@/utils/logger'
import { loadTranscriptionData } from '@/utils/transcription/segmentConverter'

// Types
import { EditorTab } from './types'
import { ClipItem } from './components/ClipComponent/types'
import { LayerElement } from './types/layer'

// Hooks
import { useUploadModal } from '@/hooks/useUploadModal'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { useSelectionBox } from './hooks/useSelectionBox'
import { useUnsavedChanges } from './hooks/useUnsavedChanges'

// Components
import SelectionBox from '@/components/DragDrop/SelectionBox'
import NewUploadModal from '@/components/NewUploadModal'
import TutorialModal from '@/components/TutorialModal'
import ResizablePanelDivider from '@/components/ui/ResizablePanelDivider'
import Toolbars from './components/Toolbars'
import DragOverlayContent from './components/DragOverlayContent'
import EditorHeaderTabs from './components/EditorHeaderTabs'
import SubtitleEditList from './components/SubtitleEditList'
import VideoSection from './components/VideoSection'
import SpeakerManagementSidebar from './components/SpeakerManagementSidebar'

// Utils
import { EditorHistory } from '@/utils/editor/EditorHistory'
import { areClipsConsecutive } from '@/utils/editor/clipMerger'
import { MergeClipsCommand } from '@/utils/editor/commands/MergeClipsCommand'
import { SplitClipCommand } from '@/utils/editor/commands/SplitClipCommand'
import { DeleteClipCommand } from '@/utils/editor/commands/DeleteClipCommand'
import { RemoveSpeakerCommand } from '@/utils/editor/commands/RemoveSpeakerCommand'
import { ChangeSpeakerCommand } from '@/utils/editor/commands/ChangeSpeakerCommand'
import { BatchChangeSpeakerCommand } from '@/utils/editor/commands/BatchChangeSpeakerCommand'
import { CutClipsCommand } from '@/utils/editor/commands/CutClipsCommand'
import { CopyClipsCommand } from '@/utils/editor/commands/CopyClipsCommand'
import { PasteClipsCommand } from '@/utils/editor/commands/PasteClipsCommand'
import { showToast } from '@/utils/ui/toast'

export default function EditorPage() {
  // Store state for DnD and selection
  const {
    activeId,
    clips,
    setClips,
    selectedClipIds,
    setSelectedClipIds,
    clearSelection,
    updateClipWords,
    saveProject,
    activeClipId,
    setActiveClipId,
    videoPanelWidth,
    setVideoPanelWidth,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    markAsSaved,
  } = useEditorStore()

  // Local state
  const [activeTab, setActiveTab] = useState<EditorTab>('home')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  const [editorHistory] = useState(() => {
    const history = new EditorHistory()
    // Connect history to save state
    history.setOnChangeCallback((hasChanges) => {
      setHasUnsavedChanges(hasChanges)
    })
    return history
  })
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [isRecovering, setIsRecovering] = useState(true) // 초기값을 true로 설정
  const [scrollProgress, setScrollProgress] = useState(0) // 스크롤 진행도
  const [speakers, setSpeakers] = useState<string[]>([]) // Speaker 리스트 전역 관리
  const [isSpeakerManagementOpen, setIsSpeakerManagementOpen] = useState(false) // 화자 관리 사이드바 상태
  const [clipboard, setClipboard] = useState<ClipItem[]>([]) // 클립보드 상태
  const [skipAutoFocus, setSkipAutoFocus] = useState(false) // 자동 포커스 스킵 플래그
  // Get media and layer actions from store
  const {
    setMediaInfo,
    layers,
    isEditingMode,
    addLayer,
    selectLayer,
    updateLayer,
    setEditingMode,
  } = useEditorStore()

  // Track unsaved changes
  useUnsavedChanges(hasUnsavedChanges)

  // Session recovery and initialization
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        log('EditorPage.tsx', 'Initializing editor...')

        // Initialize AutosaveManager
        const autosaveManager = AutosaveManager.getInstance()

        // Load real.json data first (temporary for development)
        const transcriptionClips = await loadTranscriptionData('/real.json')
        if (transcriptionClips.length > 0) {
          log(
            'EditorPage.tsx',
            `Loaded ${transcriptionClips.length} clips from real.json`
          )
          setClips(transcriptionClips)

          // Extract unique speakers from clips and rename them with numbers
          const originalSpeakers = Array.from(
            new Set(transcriptionClips.map((clip) => clip.speaker))
          )

          // Create mapping for speaker names (original -> numbered)
          const speakerMapping: Record<string, string> = {}
          originalSpeakers.forEach((speaker, index) => {
            speakerMapping[speaker] = `화자${index + 1}`
          })

          // Update clips with new speaker names
          const updatedClips = transcriptionClips.map((clip) => ({
            ...clip,
            speaker: speakerMapping[clip.speaker] || clip.speaker,
          }))

          const numberedSpeakers = Object.values(speakerMapping)

          setClips(updatedClips)
          setSpeakers(numberedSpeakers)
        }

        // Check for project to recover
        const projectId = sessionStorage.getItem('currentProjectId')
        const mediaId = sessionStorage.getItem('currentMediaId')

        if (projectId || mediaId) {
          log(
            'EditorPage.tsx',
            `Found session data - projectId: ${projectId}, mediaId: ${mediaId}`
          )

          try {
            // Load project media info
            if (projectId) {
              const projectMediaInfo =
                await mediaStorage.loadProjectMedia(projectId)
              if (projectMediaInfo) {
                log(
                  'EditorPage.tsx',
                  `Loaded project media info: ${projectMediaInfo.fileName}`
                )

                // Set media info in store
                setMediaInfo({
                  mediaId: projectMediaInfo.mediaId,
                  videoName: projectMediaInfo.fileName,
                  videoType: projectMediaInfo.fileType,
                  videoDuration: projectMediaInfo.duration,
                  videoMetadata: projectMediaInfo.metadata,
                })

                // Notify ProjectInfoManager
                projectInfoManager.notifyFileOpen('browser', 'recovery', {
                  id: projectId,
                  name: projectMediaInfo.fileName.replace(/\.[^/.]+$/, ''), // Remove extension
                })

                // Set project in AutosaveManager
                autosaveManager.setProject(projectId, 'browser')
              }
            }

            // Load saved project data
            const savedProject = projectStorage.loadCurrentProject()
            if (
              savedProject &&
              savedProject.clips &&
              savedProject.clips.length > 0
            ) {
              log('EditorPage.tsx', `Recovered project: ${savedProject.name}`)
              setClips(savedProject.clips)

              // Restore media information if available
              if (savedProject.mediaId || savedProject.videoUrl) {
                setMediaInfo({
                  mediaId: savedProject.mediaId || null,
                  videoUrl: savedProject.videoUrl || null,
                  videoName: savedProject.videoName || null,
                  videoType: savedProject.videoType || null,
                  videoDuration: savedProject.videoDuration || null,
                  videoMetadata: savedProject.videoMetadata || null,
                })
              }

              // Set project in AutosaveManager
              autosaveManager.setProject(savedProject.id, 'browser')

              // Show recovery notification
              showToast('이전 세션이 복구되었습니다', 'success')
            }
          } catch (error) {
            console.error('Failed to recover session:', error)
            showToast('세션 복구에 실패했습니다', 'error')
          }
        } else {
          // No session to recover - check for autosaved project
          const currentProject = projectStorage.loadCurrentProject()
          if (
            currentProject &&
            currentProject.clips &&
            currentProject.clips.length > 0
          ) {
            log(
              'EditorPage.tsx',
              `Found autosaved project: ${currentProject.name}`
            )
            setClips(currentProject.clips)
            autosaveManager.setProject(currentProject.id, 'browser')
          } else {
            // New project
            const newProjectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            log('EditorPage.tsx', `Creating new project: ${newProjectId}`)
            autosaveManager.setProject(newProjectId, 'browser')
            projectInfoManager.notifyFileOpen('browser', 'newProject')
          }
        }

        // Clear session storage after recovery
        sessionStorage.removeItem('currentProjectId')
        sessionStorage.removeItem('currentMediaId')
      } finally {
        // Always set recovering to false
        setIsRecovering(false)
      }
    }

    initializeEditor()
  }, [setClips, setMediaInfo])

  // Generate stable ID for DndContext to prevent hydration mismatch
  const dndContextId = useId()

  // Upload modal hook
  const { isTranscriptionLoading, handleFileSelect } = useUploadModal()

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

  // Scroll progress handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    setScrollProgress(progress)
  }, [])

  // Panel resize handler
  const handlePanelResize = useCallback(
    (delta: number) => {
      const newWidth = videoPanelWidth + delta
      const minWidth = 300 // Minimum width
      const maxWidth = windowWidth / 2 // Maximum 50% of viewport

      // Constrain the width between min and max
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setVideoPanelWidth(constrainedWidth)

      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'editor-video-panel-width',
          constrainedWidth.toString()
        )
      }
    },
    [videoPanelWidth, windowWidth, setVideoPanelWidth]
  )

  // Edit handlers
  const handleWordEdit = (clipId: string, wordId: string, newText: string) => {
    updateClipWords(clipId, wordId, newText)
  }

  const handleSpeakerChange = (clipId: string, newSpeaker: string) => {
    // Use Command pattern for undo/redo support
    const command = new ChangeSpeakerCommand(
      clips,
      speakers,
      clipId,
      newSpeaker,
      setClips,
      setSpeakers
    )
    editorHistory.executeCommand(command)
  }

  const handleBatchSpeakerChange = (clipIds: string[], newSpeaker: string) => {
    // If only one clipId is passed, check if we should apply to all empty clips
    let targetClipIds = clipIds

    if (clipIds.length === 1) {
      // Check if the current clip is empty and find all empty clips
      const currentClip = clips.find((c) => c.id === clipIds[0])
      if (currentClip && !currentClip.speaker) {
        // Find all clips without speakers
        const emptyClipIds = clips
          .filter((clip) => !clip.speaker)
          .map((clip) => clip.id)

        // If there are multiple empty clips, we'll apply to all of them
        if (emptyClipIds.length > 1) {
          targetClipIds = emptyClipIds
        }
      }
    }

    // Use Command pattern for batch speaker change
    const command = new BatchChangeSpeakerCommand(
      clips,
      speakers,
      targetClipIds,
      newSpeaker,
      setClips,
      setSpeakers
    )
    editorHistory.executeCommand(command)
  }

  // 화자 관리 사이드바 핸들러들
  const handleOpenSpeakerManagement = () => {
    setIsSpeakerManagementOpen(true)
  }

  const handleCloseSpeakerManagement = () => {
    setIsSpeakerManagementOpen(false)
  }

  const handleAddSpeaker = (name: string) => {
    console.log('handleAddSpeaker called with:', name)
    console.log('Current speakers before adding:', speakers)

    // 최대 화자 수 제한 체크 (9명)
    if (speakers.length >= 9) {
      console.log('Maximum speaker limit reached (9), cannot add more')
      return
    }

    if (!speakers.includes(name)) {
      const newSpeakers = [...speakers, name]
      setSpeakers(newSpeakers)
      console.log('Speaker added successfully. New speakers:', newSpeakers)
    } else {
      console.log('Speaker already exists, skipping addition')
    }
  }

  const handleRemoveSpeaker = (name: string) => {
    // Use Command pattern for speaker removal
    const command = new RemoveSpeakerCommand(
      clips,
      speakers,
      name,
      setClips,
      setSpeakers
    )
    editorHistory.executeCommand(command)
  }

  const handleRenameSpeaker = (oldName: string, newName: string) => {
    // Update clips with the new speaker name
    const updatedClips = clips.map((clip) =>
      clip.speaker === oldName ? { ...clip, speaker: newName } : clip
    )

    // Update speakers list
    const updatedSpeakers = speakers.map((speaker) =>
      speaker === oldName ? newName : speaker
    )

    setClips(updatedClips)
    setSpeakers(updatedSpeakers)
  }

  // Layer handlers using store
  const handleAddLayer = useCallback(
    (newLayer: LayerElement) => {
      addLayer(newLayer)
      setHasUnsavedChanges(true)
    },
    [addLayer, setHasUnsavedChanges]
  )

  const handleLayerSelect = useCallback(
    (layerId: string) => {
      selectLayer(layerId)
      setEditingMode(true)
    },
    [selectLayer, setEditingMode]
  )

  const handleLayerUpdate = useCallback(
    (layerId: string, changes: Partial<LayerElement>) => {
      updateLayer(layerId, changes)
      setHasUnsavedChanges(true)
    },
    [updateLayer, setHasUnsavedChanges]
  )

  // Insert 탭일 때 편집 모드 자동 활성화
  useEffect(() => {
    setEditingMode(activeTab === 'insert')
  }, [activeTab, setEditingMode])

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
    // 체크된 클립이 있으면 모든 선택 해제, 없으면 포커스만 변경
    if (selectedClipIds.size > 0) {
      clearSelection()
      setActiveClipId(null) // 선택 해제 시 포커스도 해제
    } else {
      setActiveClipId(clipId)
    }
  }

  // 빈 공간 클릭 시 모든 선택 해제
  const handleEmptySpaceClick = () => {
    if (selectedClipIds.size > 0) {
      clearSelection()
      setActiveClipId(null)
    }
  }

  // Upload modal handler
  const wrappedHandleStartTranscription = async () => {
    try {
      // Close modal first
      setIsUploadModalOpen(false)

      // Create sample clips for demo purposes
      const sampleClips = [
        {
          id: 'clip-1',
          timeline: '00:00-00:05',
          speaker: '화자1',
          subtitle: '안녕하세요, 오늘은',
          fullText: '안녕하세요, 오늘은',
          duration: '5초',
          thumbnail: '/placeholder.jpg',
          words: [
            {
              id: 'word-1-1',
              text: '안녕하세요,',
              start: 0,
              end: 2,
              isEditable: true,
            },
            {
              id: 'word-1-2',
              text: '오늘은',
              start: 2.5,
              end: 5,
              isEditable: true,
            },
          ],
        },
        {
          id: 'clip-2',
          timeline: '00:05-00:10',
          speaker: '화자1',
          subtitle: '좋은 날씨네요',
          fullText: '좋은 날씨네요',
          duration: '5초',
          thumbnail: '/placeholder.jpg',
          words: [
            {
              id: 'word-2-1',
              text: '좋은',
              start: 5,
              end: 6.5,
              isEditable: true,
            },
            {
              id: 'word-2-2',
              text: '날씨네요',
              start: 7,
              end: 10,
              isEditable: true,
            },
          ],
        },
        {
          id: 'clip-3',
          timeline: '00:10-00:15',
          speaker: '화자2',
          subtitle: '네, 정말 좋네요',
          fullText: '네, 정말 좋네요',
          duration: '5초',
          thumbnail: '/placeholder.jpg',
          words: [
            {
              id: 'word-3-1',
              text: '네,',
              start: 10,
              end: 11,
              isEditable: true,
            },
            {
              id: 'word-3-2',
              text: '정말',
              start: 11.5,
              end: 13,
              isEditable: true,
            },
            {
              id: 'word-3-3',
              text: '좋네요',
              start: 13.5,
              end: 15,
              isEditable: true,
            },
          ],
        },
      ]

      // Set the clips in the store
      setClips(sampleClips)

      // Show success message
      console.log('Demo clips created successfully!')
    } catch (error) {
      console.error('Failed to create demo clips:', error)
      throw error
    }
  }

  // Merge clips handler
  const handleMergeClips = useCallback(() => {
    try {
      // Get selected clips from store
      const uniqueSelectedIds = Array.from(selectedClipIds)

      // 체크된 클립이 있으면 기존 로직 사용 (2개 이상 선택된 경우)
      if (uniqueSelectedIds.length >= 2) {
        // 2개 이상의 클립이 선택된 경우 - 기존 로직
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

        // 자동 포커스 스킵 설정 및 합쳐진 클립에 포커스
        setSkipAutoFocus(true)
        setTimeout(() => {
          // Command에서 합쳐진 클립의 ID 가져오기
          const mergedClipId = command.getMergedClipId()
          if (mergedClipId) {
            setActiveClipId(mergedClipId)
            console.log(
              'Merge completed, focused on merged clip:',
              mergedClipId
            )
          }
        }, 100) // 상태 업데이트 완료 대기
        return
      }

      // 체크된 클립이 0~1개인 경우: 포커스된 클립과 다음 클립을 합치기
      if (!activeClipId) {
        showToast('합칠 클립을 선택해주세요.')
        return
      }

      // 포커스된 클립의 인덱스 찾기
      const currentIndex = clips.findIndex((clip) => clip.id === activeClipId)
      if (currentIndex === -1) {
        showToast('포커스된 클립을 찾을 수 없습니다.')
        return
      }

      // 다음 클립이 있는지 확인
      if (currentIndex >= clips.length - 1) {
        showToast('다음 클립이 존재하지 않습니다.')
        return
      }

      // 포커스된 클립과 다음 클립을 합치기
      const nextClipId = clips[currentIndex + 1].id
      const clipsToMerge = [activeClipId, nextClipId]
      const command = new MergeClipsCommand(clips, [], clipsToMerge, setClips)

      editorHistory.executeCommand(command)
      clearSelection()

      // 자동 포커스 스킵 설정 및 합쳐진 클립에 포커스
      setSkipAutoFocus(true)
      setTimeout(() => {
        // Command에서 합쳐진 클립의 ID 가져오기
        const mergedClipId = command.getMergedClipId()
        if (mergedClipId) {
          setActiveClipId(mergedClipId)
          console.log(
            'Single merge completed, focused on merged clip:',
            mergedClipId
          )
        }
      }, 100) // 상태 업데이트 완료 대기
    } catch (error) {
      console.error('클립 합치기 오류:', error)
      showToast(
        error instanceof Error
          ? error.message
          : '클립 합치기 중 오류가 발생했습니다.'
      )
    }
  }, [
    clips,
    selectedClipIds,
    activeClipId,
    clearSelection,
    setClips,
    editorHistory,
    setActiveClipId,
  ])

  // Split clip handler
  const handleSplitClip = useCallback(() => {
    try {
      if (!activeClipId) {
        showToast('나눌 클립을 선택해주세요.')
        return
      }

      // 포커싱된 클립 찾기
      const targetClip = clips.find((clip) => clip.id === activeClipId)
      if (!targetClip) {
        showToast('선택된 클립을 찾을 수 없습니다.')
        return
      }

      // 단어가 2개 이상인지 확인
      if (targetClip.words.length <= 1) {
        showToast('클립을 나누려면 단어가 2개 이상이어야 합니다.')
        return
      }

      // 클립 나누기 실행 - Command 패턴 사용
      const command = new SplitClipCommand(clips, activeClipId, setClips)
      editorHistory.executeCommand(command)

      // 자동 포커스 스킵 설정 및 분할된 첫 번째 클립에 포커스
      setSkipAutoFocus(true)
      setTimeout(() => {
        // SplitClipCommand에서 반환받은 첫 번째 분할 클립 ID로 포커스 설정
        const firstSplitClipId = command.getFirstSplitClipId()
        if (firstSplitClipId) {
          setActiveClipId(firstSplitClipId)
          console.log(
            'Split completed, focused on first split clip:',
            firstSplitClipId
          )
        } else {
          console.log('Split completed, but could not get first split clip ID')
        }
      }, 100) // 상태 업데이트 완료 대기
    } catch (error) {
      console.error('클립 나누기 오류:', error)
      showToast(
        error instanceof Error
          ? error.message
          : '클립 나누기 중 오류가 발생했습니다.'
      )
    }
  }, [activeClipId, clips, setClips, editorHistory, setActiveClipId])

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (editorHistory.canUndo()) {
      editorHistory.undo()
    }
  }, [editorHistory])

  const handleRedo = useCallback(() => {
    if (editorHistory.canRedo()) {
      editorHistory.redo()
    }
  }, [editorHistory])

  // Delete clip handler
  const handleDeleteClip = useCallback(() => {
    try {
      if (!activeClipId) {
        showToast('삭제할 클립을 선택해주세요.')
        return
      }

      // 클립이 1개뿐이면 삭제 불가
      if (clips.length <= 1) {
        showToast('마지막 클립은 삭제할 수 없습니다.')
        return
      }

      // 삭제할 클립 찾기
      const targetClipIndex = clips.findIndex(
        (clip) => clip.id === activeClipId
      )
      if (targetClipIndex === -1) {
        showToast('삭제할 클립을 찾을 수 없습니다.')
        return
      }

      // 클립 삭제 실행 - Command 패턴 사용
      const command = new DeleteClipCommand(clips, activeClipId, setClips)
      editorHistory.executeCommand(command)

      // 자동 포커스 스킵 설정 및 적절한 클립에 포커스
      setSkipAutoFocus(true)

      // 삭제 후 포커스 이동: 다음 클립이 있으면 다음, 없으면 이전 클립
      let nextFocusIndex = targetClipIndex
      if (targetClipIndex >= clips.length - 1) {
        // 마지막 클립을 삭제한 경우, 이전 클립으로 포커스
        nextFocusIndex = Math.max(0, targetClipIndex - 1)
      }

      // 새로운 클립 목록에서 포커스할 클립 ID 찾기
      setTimeout(() => {
        const updatedClips = clips.filter((clip) => clip.id !== activeClipId)
        if (updatedClips.length > 0 && nextFocusIndex < updatedClips.length) {
          setActiveClipId(updatedClips[nextFocusIndex].id)
          console.log(
            'Delete completed, focused on clip at index:',
            nextFocusIndex
          )
        }
      }, 0)

      showToast('클립이 삭제되었습니다.', 'success')
    } catch (error) {
      console.error('클립 삭제 오류:', error)
      showToast(
        error instanceof Error
          ? error.message
          : '클립 삭제 중 오류가 발생했습니다.'
      )
    }
  }, [activeClipId, clips, setClips, editorHistory, setActiveClipId])

  // Cut clips handler
  const handleCutClips = useCallback(() => {
    try {
      const selectedIds = Array.from(selectedClipIds)

      if (selectedIds.length === 0) {
        showToast('잘라낼 클립을 선택해주세요.')
        return
      }

      // 잘라낼 클립들의 첫 번째 인덱스 저장 (포커스 이동용)
      const firstCutIndex = clips.findIndex((clip) =>
        selectedIds.includes(clip.id)
      )

      // Create and execute cut command
      const command = new CutClipsCommand(
        clips,
        selectedIds,
        setClips,
        setClipboard
      )

      editorHistory.executeCommand(command)
      clearSelection() // Clear selection after cutting

      // 자동 포커스 스킵 설정 및 적절한 클립에 포커스
      setSkipAutoFocus(true)
      setTimeout(() => {
        const remainingClips = clips.filter(
          (clip) => !selectedIds.includes(clip.id)
        )
        if (remainingClips.length > 0) {
          // 잘라낸 위치의 다음 클립에 포커스, 없으면 이전 클립
          let nextFocusIndex = firstCutIndex
          if (nextFocusIndex >= remainingClips.length) {
            nextFocusIndex = Math.max(0, remainingClips.length - 1)
          }
          setActiveClipId(remainingClips[nextFocusIndex].id)
          console.log(
            'Cut completed, focused on clip at index:',
            nextFocusIndex
          )
        }
      }, 0)

      showToast(`${selectedIds.length}개 클립을 잘라냈습니다.`, 'success')
    } catch (error) {
      console.error('클립 잘라내기 오류:', error)
      showToast('클립 잘라내기 중 오류가 발생했습니다.')
    }
  }, [
    clips,
    selectedClipIds,
    setClips,
    setClipboard,
    editorHistory,
    clearSelection,
    setActiveClipId,
  ])

  // Copy clips handler
  const handleCopyClips = useCallback(() => {
    try {
      const selectedIds = Array.from(selectedClipIds)

      if (selectedIds.length === 0) {
        showToast('복사할 클립을 선택해주세요.')
        return
      }

      // Create and execute copy command
      const command = new CopyClipsCommand(clips, selectedIds, setClipboard)

      command.execute() // Copy command doesn't need undo/redo
      showToast(`${selectedIds.length}개 클립을 복사했습니다.`, 'success')
    } catch (error) {
      console.error('클립 복사 오류:', error)
      showToast('클립 복사 중 오류가 발생했습니다.')
    }
  }, [clips, selectedClipIds, setClipboard])

  // Paste clips handler
  const handlePasteClips = useCallback(() => {
    try {
      if (clipboard.length === 0) {
        showToast('붙여넣을 클립이 없습니다.')
        return
      }

      // Create and execute paste command
      const command = new PasteClipsCommand(clips, clipboard, setClips)

      editorHistory.executeCommand(command)

      // 자동 포커스 스킵 설정 및 붙여넣은 마지막 클립에 포커스
      setSkipAutoFocus(true)
      setTimeout(() => {
        // 붙여넣은 클립들은 기존 클립들 뒤에 추가되므로
        // 마지막에 붙여넣은 클립에 포커스
        const newTotalClips = clips.length + clipboard.length
        if (newTotalClips > clips.length) {
          const lastPastedIndex = newTotalClips - 1
          // 실제로는 붙여넣은 클립들의 새 ID를 알아야 함
          console.log(
            'Paste completed, should focus on last pasted clip at index:',
            lastPastedIndex
          )
          // PasteClipsCommand에서 생성된 클립 ID들을 반환받아서 마지막 클립에 포커스해야 함
        }
      }, 0)

      showToast(`${clipboard.length}개 클립을 붙여넣었습니다.`, 'success')
    } catch (error) {
      console.error('클립 붙여넣기 오류:', error)
      showToast('클립 붙여넣기 중 오류가 발생했습니다.')
    }
  }, [clips, clipboard, setClips, editorHistory])

  // TODO : 자동 저장 기능 나중에 사용
  // 3초마다 자동 저장
  useEffect(() => {
    if (!clips.length) return

    const autoSave = () => {
      saveProject().catch((error) => {
        console.error('Auto-save failed:', error)
      })
    }

    const interval = setInterval(autoSave, 3000)
    return () => clearInterval(interval)
  }, [clips, saveProject])

  // clips 변경 시 AutosaveManager에 알림
  useEffect(() => {
    const autosaveManager = AutosaveManager.getInstance()
    if (clips.length > 0) {
      autosaveManager.incrementChangeCounter()
    }
  }, [clips])

  // 키보드 단축키 처리 (macOS Command + Windows/Linux Ctrl 지원)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const cmdOrCtrl = event.metaKey || event.ctrlKey

      // Command/Ctrl+Z (undo)
      if (cmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        handleUndo()
      }
      // Command/Ctrl+Shift+Z (redo)
      else if (cmdOrCtrl && event.shiftKey && event.key === 'Z') {
        event.preventDefault()
        handleRedo()
      }
      // Command/Ctrl+Y (redo - 대체 단축키)
      else if (cmdOrCtrl && event.key === 'y') {
        event.preventDefault()
        handleRedo()
      }
      // Command/Ctrl+S (save)
      else if (cmdOrCtrl && event.key === 's') {
        event.preventDefault()
        saveProject()
          .then(() => {
            editorHistory.markAsSaved()
            markAsSaved()
            showToast('프로젝트가 저장되었습니다.', 'success')
          })
          .catch((error) => {
            console.error('Save failed:', error)
            showToast('저장에 실패했습니다.')
          })
      }
      // Command/Ctrl+E (merge clips) - 윈도우에서는 Ctrl+E
      else if (cmdOrCtrl && event.key === 'e') {
        event.preventDefault()
        handleMergeClips()
      }
      // Command/Ctrl+X (cut clips) - 윈도우에서는 Ctrl+X, Mac에서는 Command+X
      else if (cmdOrCtrl && event.key === 'x') {
        event.preventDefault()
        if (selectedClipIds.size > 0) {
          handleCutClips()
        } else {
          handleDeleteClip() // 선택된 클립이 없으면 기존처럼 삭제
        }
      }
      // Command/Ctrl+C (copy clips)
      else if (cmdOrCtrl && event.key === 'c') {
        event.preventDefault()
        if (selectedClipIds.size > 0) {
          handleCopyClips()
        }
      }
      // Command/Ctrl+V (paste clips)
      else if (cmdOrCtrl && event.key === 'v') {
        event.preventDefault()
        if (clipboard.length > 0) {
          handlePasteClips()
        }
      }
      // Enter (split clip) - 포커싱된 클립 나누기
      else if (event.key === 'Enter' && !cmdOrCtrl) {
        event.preventDefault()
        handleSplitClip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    handleUndo,
    handleRedo,
    saveProject,
    handleMergeClips,
    handleSplitClip,
    handleDeleteClip,
    handleCutClips,
    handleCopyClips,
    handlePasteClips,
    selectedClipIds,
    clipboard,
    editorHistory,
    markAsSaved,
  ])

  // 에디터 진입 시 첫 번째 클립에 자동 포커스 및 패널 너비 복원
  useEffect(() => {
    if (clips.length > 0 && !activeClipId) {
      setActiveClipId(clips[0].id)
    }

    // Restore panel width from localStorage
    if (typeof window !== 'undefined') {
      const savedWidth = localStorage.getItem('editor-video-panel-width')
      if (savedWidth) {
        const width = parseInt(savedWidth, 10)
        if (!isNaN(width)) {
          setVideoPanelWidth(width)
        }
      }
    }
  }, [clips, activeClipId, setActiveClipId, setVideoPanelWidth])

  // 에디터 페이지 진입 시 튜토리얼 모달 표시 (첫 방문자용)
  useEffect(() => {
    // TODO: localStorage 대신 DB에서 사용자의 튜토리얼 완료 상태를 확인하도록 변경
    // - 사용자 인증 상태 확인 후 API 호출
    // - GET /api/user/tutorial-status 또는 사용자 프로필에서 튜토리얼 완료 여부 확인
    // - 로그인하지 않은 사용자의 경우 localStorage 사용 (임시)
    // - 튜토리얼 타입별 완료 상태 관리 (editor, upload, export 등)
    const hasSeenEditorTutorial = localStorage.getItem('hasSeenEditorTutorial')
    if (!hasSeenEditorTutorial && clips.length > 0) {
      setShowTutorialModal(true)
    }
  }, [clips])

  const handleTutorialClose = () => {
    // TODO: localStorage 대신 DB에 튜토리얼 완료 상태 저장하도록 변경
    // - POST /api/user/tutorial-status API 호출
    // - 사용자가 로그인된 경우 DB에 저장, 미로그인 시 localStorage 사용
    // - 튜토리얼 완료 날짜/시간, 완료 단계도 함께 저장
    setShowTutorialModal(false)
    localStorage.setItem('hasSeenEditorTutorial', 'true')
  }

  const handleTutorialComplete = () => {
    console.log('Editor tutorial completed!')
  }

  // Window resize handler to update max width constraint
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // Adjust video panel width if it exceeds new max
      const maxWidth = window.innerWidth / 2
      if (videoPanelWidth > maxWidth) {
        setVideoPanelWidth(maxWidth)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [videoPanelWidth, setVideoPanelWidth])

  // 클립이 변경되었을 때 포커스 유지/이동 로직
  useEffect(() => {
    if (clips.length === 0) {
      setActiveClipId(null)
      return
    }

    // 자동 포커스 스킵이 설정된 경우 리셋하고 건너뛰기
    if (skipAutoFocus) {
      setSkipAutoFocus(false)
      return
    }

    // 현재 포커싱된 클립이 없거나 존재하지 않으면 첫 번째 클립에 포커스
    if (!activeClipId || !clips.find((clip) => clip.id === activeClipId)) {
      setActiveClipId(clips[0].id)
    }
  }, [clips, activeClipId, setActiveClipId, skipAutoFocus])

  // 복구 중일 때 로딩 화면 표시
  if (isRecovering) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          <p className="text-gray-400">세션 복구 중...</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gray-900 text-white">
        <EditorHeaderTabs
          activeTab={activeTab}
          onTabChange={(tabId: string) => setActiveTab(tabId as EditorTab)}
        />

        <Toolbars
          activeTab={activeTab}
          clips={clips}
          selectedClipIds={selectedClipIds}
          activeClipId={activeClipId}
          canUndo={editorHistory.canUndo()}
          canRedo={editorHistory.canRedo()}
          onSelectionChange={setSelectedClipIds}
          onNewClick={() => setIsUploadModalOpen(true)}
          onMergeClips={handleMergeClips}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onCut={handleCutClips}
          onCopy={handleCopyClips}
          onPaste={handlePasteClips}
          onSplitClip={handleSplitClip}
          onAddLayer={handleAddLayer}
        />

        <div className="flex h-[calc(100vh-120px)] relative">
          <div className="sticky top-0 h-[calc(100vh-120px)]">
            <VideoSection
              width={videoPanelWidth}
              layers={layers}
              activeClipId={activeClipId}
              isEditingMode={isEditingMode}
              onLayerSelect={handleLayerSelect}
              onLayerUpdate={handleLayerUpdate}
            />
          </div>

          <ResizablePanelDivider
            orientation="vertical"
            onResize={handlePanelResize}
            className="z-10"
          />

          <div
            className="flex-1 flex justify-center relative overflow-y-auto custom-scrollbar"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onScroll={handleScroll}
            style={
              {
                '--scroll-progress': `${scrollProgress}%`,
              } as React.CSSProperties
            }
          >
            <SubtitleEditList
              clips={clips}
              selectedClipIds={selectedClipIds}
              activeClipId={activeClipId}
              speakers={speakers}
              onClipSelect={handleClipSelect}
              onClipCheck={handleClipCheck}
              onWordEdit={handleWordEdit}
              onSpeakerChange={handleSpeakerChange}
              onBatchSpeakerChange={handleBatchSpeakerChange}
              onOpenSpeakerManagement={handleOpenSpeakerManagement}
              onAddSpeaker={handleAddSpeaker}
              onRenameSpeaker={handleRenameSpeaker}
              onEmptySpaceClick={handleEmptySpaceClick}
            />

            <SelectionBox
              startX={selectionBox.startX}
              startY={selectionBox.startY}
              endX={selectionBox.endX}
              endY={selectionBox.endY}
              isSelecting={isSelecting}
            />
          </div>

          {/* Right sidebar - Speaker Management */}
          {isSpeakerManagementOpen && (
            <div className="sticky top-0 h-[calc(100vh-120px)]">
              <SpeakerManagementSidebar
                isOpen={isSpeakerManagementOpen}
                onClose={handleCloseSpeakerManagement}
                speakers={speakers}
                clips={clips}
                onAddSpeaker={handleAddSpeaker}
                onRemoveSpeaker={handleRemoveSpeaker}
                onRenameSpeaker={handleRenameSpeaker}
                onBatchSpeakerChange={handleBatchSpeakerChange}
              />
            </div>
          )}
        </div>

        <NewUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => !isTranscriptionLoading && setIsUploadModalOpen(false)}
          onFileSelect={(files: File[]) => {
            // Convert File[] to FileList for compatibility
            const fileList = new DataTransfer()
            files.forEach((file) => fileList.items.add(file))
            handleFileSelect(fileList.files)
          }}
          onStartTranscription={wrappedHandleStartTranscription}
          acceptedTypes={['audio/*', 'video/*']}
          maxFileSize={100 * 1024 * 1024} // 100MB
          multiple={true}
          isLoading={isTranscriptionLoading}
        />

        <TutorialModal
          isOpen={showTutorialModal}
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
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
