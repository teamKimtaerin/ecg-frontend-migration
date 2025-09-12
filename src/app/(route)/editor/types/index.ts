// Clip related types
export interface Word {
  id: string
  text: string
  start: number
  end: number
  isEditable: boolean
  confidence?: number
  appliedAssets?: string[]
  // Audio metadata from ML server (for animations)
  volume_db?: number // Volume level in decibels (-60 to 0)
  pitch_hz?: number // Pitch frequency in Hz (50 to 500)
}

export interface ClipItem {
  id: string
  timeline: string
  speaker: string
  subtitle: string
  fullText: string
  duration: string
  thumbnail: string
  words: Word[]
}

// UI related types
export type EditorTab =
  | 'home'
  | 'edit'
  | 'subtitle'
  | 'format'
  | 'insert'
  | 'template'
  | 'effect'

export interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

// Component Props types
export interface ClipStyleState {
  isSelected: boolean
  isChecked: boolean
  isMultiSelected: boolean
  isHovered: boolean
  isDragging?: boolean
}

export interface EditorHeaderTabsProps {
  activeTab: EditorTab
  onTabChange: (tabId: EditorTab) => void
}

export interface ToolbarProps {
  activeTab: EditorTab
}

export interface ClipTableProps {
  clips: ClipItem[]
  selectedClipIds: Set<string>
  onClipSelect: (clipId: string, multiSelect: boolean) => void
  onWordEdit: (clipId: string, wordId: string, newText: string) => void
  onClipsReorder: (newClips: ClipItem[]) => void
}

// Initial data
export const INITIAL_CLIPS: ClipItem[] = []

// Constants
export const DRAG_ACTIVATION_DISTANCE = 8

export const EDITOR_TABS: EditorTab[] = [
  'home',
  'edit',
  'format',
  'insert',
  'template',
]
