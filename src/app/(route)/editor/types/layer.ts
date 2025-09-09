import { Word } from './index'

// 반응형 좌표계 (0.0 ~ 1.0 정규화된 값)
export interface ResponsivePosition {
  x: number // 0.0 = 좌측 끝, 1.0 = 우측 끝
  y: number // 0.0 = 상단, 1.0 = 하단
}

export interface ResponsiveSize {
  width: number // 비디오 너비 대비 비율 (0.0 ~ 1.0)
  height: number // 비디오 높이 대비 비율 (0.0 ~ 1.0)
}

// 빈 워드 타입 (기존 Word 확장)
export interface BlankWord extends Word {
  isBlank: true // 빈 워드 표시
  placeholder: string // 빈칸에 표시될 힌트
  userInput?: string // 사용자가 입력한 값
  isRequired: boolean // 필수 입력 여부
}

// 타입별 콘텐츠 정의
export interface TextContent {
  type: 'text'
  text: string
  alignment: 'left' | 'center' | 'right'
  verticalAlignment: 'top' | 'middle' | 'bottom'
}

export interface ShapeContent {
  type: 'shape'
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'arrow'
  strokeWidth: number
  filled: boolean
}

export interface BlankWordContent {
  type: 'blank_word'
  targetWordId: string // 클립 내 추가할 워드의 위치 참조
  placeholder: string // 빈칸 힌트
  isRequired: boolean // 필수 입력
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string // 정규식 패턴
  }
}

export type LayerContent = TextContent | ShapeContent | BlankWordContent

// 레이어 스타일
export interface LayerStyle {
  // 텍스트 스타일
  fontSize?: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold'
  color?: string

  // 배경/테두리
  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderRadius?: number

  // 투명도 및 그림자
  opacity?: number
  shadowColor?: string
  shadowBlur?: number
  shadowOffset?: { x: number; y: number }
}

// 메인 레이어 요소 인터페이스
export interface LayerElement {
  // 기본 정보
  id: string
  type: 'text' | 'shape' | 'blank_word'

  // 반응형 위치 및 크기 (정규화된 값 0.0~1.0)
  position: ResponsivePosition
  size: ResponsiveSize
  zIndex: number

  // 시간 정보 (클립 기준)
  timing: {
    clipId: string // 연결된 클립 ID
    startTime: number // 클립 시작점 대비 상대 시간 (초)
    endTime: number // 클립 끝점 대비 상대 시간 (초)
  }

  // 타입별 콘텐츠
  content: LayerContent

  // 스타일
  style: LayerStyle

  // 메타데이터
  metadata: {
    createdAt: string
    updatedAt: string
    locked: boolean // 편집 잠금
    visible: boolean // 표시/숨김
  }
}

// 확장된 클립 아이템 (빈 워드 지원)
export interface EnhancedClipItem {
  id: string
  timeline: string
  speaker: string
  subtitle: string
  fullText: string
  duration: string
  thumbnail: string
  words: (Word | BlankWord)[] // 기존 워드 + 빈 워드
  hasBlankWords: boolean // 빈 워드 포함 여부
}

// 프로젝트 내보내기 구조
export interface EditorProject {
  // 메타데이터
  projectInfo: {
    id: string
    name: string
    version: string
    createdAt: string
    updatedAt: string
    exportedAt?: string
  }

  // 비디오 정보
  videoMetadata: {
    filename: string
    duration: number // 전체 길이 (초)
    width: number // 원본 해상도
    height: number
    fps: number
    format: string
  }

  // 클립 데이터 (기존 + 빈 워드 확장)
  clips: EnhancedClipItem[]

  // 삽입된 레이어 요소들
  layers: LayerElement[]

  // 내보내기 설정
  exportSettings: {
    outputFormat: 'json' | 'srt' | 'ass' | 'vtt'
    includeTimestamps: boolean
    includeBlankWords: boolean
    blankWordFormat: 'placeholder' | 'empty' | 'underscore'
  }
}

// 빈 워드 데이터 내보내기용
export interface BlankWordData {
  clipId: string
  wordId: string
  placeholder: string
  userInput?: string
  isRequired: boolean
  timestamp: number
}

// 레이어 상태 관리
export interface LayerState {
  layers: LayerElement[]
  selectedLayerIds: Set<string>
  activeLayerId: string | null

  // 편집 모드
  isEditingMode: boolean
  dragMode: 'move' | 'resize' | null

  // 히스토리 관리 (undo/redo)
  history: LayerElement[][]
  historyIndex: number
}

// 레이어 액션 타입들
export type LayerAction =
  | { type: 'ADD_LAYER'; payload: LayerElement }
  | {
      type: 'UPDATE_LAYER'
      payload: { id: string; changes: Partial<LayerElement> }
    }
  | { type: 'DELETE_LAYER'; payload: string }
  | { type: 'SELECT_LAYER'; payload: string }
  | {
      type: 'MOVE_LAYER'
      payload: { id: string; position: ResponsivePosition }
    }
  | { type: 'RESIZE_LAYER'; payload: { id: string; size: ResponsiveSize } }
  | { type: 'SET_EDITING_MODE'; payload: boolean }
  | { type: 'CLEAR_SELECTION' }
