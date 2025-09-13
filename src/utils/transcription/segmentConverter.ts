import { ClipItem, Word } from '@/app/(route)/editor/types'

// ML Server result segment 타입 정의
interface MLServerSegment {
  start_time: number
  end_time: number
  speaker: {
    speaker_id: string
    confidence?: number
  }
  text: string
  words: Array<{
    word: string
    start: number
    end: number
    confidence?: number
    volume_db?: number // Audio level for animations
    pitch_hz?: number // Pitch frequency for animations
  }>
}

// Legacy real.json segment 타입 정의 (호환성 유지)
interface LegacySegment {
  start_time: number
  end_time: number
  duration: number
  speaker: {
    speaker_id: string
    confidence: number
  }
  emotion?: {
    emotion: string
    confidence: number
  }
  text: string
  words: Array<{
    word: string
    start: number
    end: number
    confidence: number
  }>
}

// 통합 Segment 타입 (두 형식 모두 지원)
type Segment = MLServerSegment | LegacySegment

export interface Metadata {
  filename: string
  duration: number
  sample_rate: number
  processed_at: string
  processing_time: number
  total_segments: number
  unique_speakers: number
  dominant_emotion: string
  avg_confidence: number
  processing_mode: string
  config: MetadataConfig
  subtitle_optimization: boolean
}

export interface MetadataConfig {
  enable_gpu: boolean
  segment_length: number
  language: string
  unified_model: string
  emotion_model: string
}

// 초를 MM:SS 형식으로 변환
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Segment를 ClipItem으로 변환
export function convertSegmentToClip(
  segment: Segment,
  index: number
): ClipItem {
  const clipId = `clip_${index + 1}_${Date.now()}`

  // words 변환 - ensure text is properly preserved and include audio metadata
  const words: Word[] = segment.words.map((word, wordIndex) => ({
    id: `${clipId}_word_${wordIndex}`,
    text: word.word.trim(), // Trim any whitespace
    start: word.start,
    end: word.end,
    isEditable: true,
    confidence: word.confidence,
    // Include audio metadata for animations (ML server format)
    volume_db: 'volume_db' in word ? word.volume_db : undefined,
    pitch_hz: 'pitch_hz' in word ? word.pitch_hz : undefined,
  }))

  // Ensure text is properly decoded and preserved
  const text = segment.text || words.map((w) => w.text).join(' ')

  // Calculate duration - handle both ML server and legacy formats
  const duration =
    'duration' in segment
      ? segment.duration
      : segment.end_time - segment.start_time

  return {
    id: clipId,
    timeline: formatTime(segment.start_time),
    speaker: segment.speaker.speaker_id, // Keep original speaker ID for now
    subtitle: text,
    fullText: text,
    duration: `${duration.toFixed(1)}초`,
    thumbnail: '/placeholder-thumb.jpg',
    words,
  }
}

// 전체 segments 배열을 clips 배열로 변환
export function convertSegmentsToClips(segments: Segment[]): ClipItem[] {
  return segments.map((segment, index) => convertSegmentToClip(segment, index))
}

// ML Server 결과 데이터 구조
export interface MLServerResult {
  job_id: string
  status: string
  progress: number
  result: {
    metadata: {
      filename: string
      duration: number
      total_segments: number
      unique_speakers: number
    }
    segments: MLServerSegment[]
  }
}

// Legacy real.json 전체 데이터 구조
export interface TranscriptionData {
  metadata?: Metadata
  speakers?: Record<string, undefined>
  segments: LegacySegment[]
}

// ML Server segments만 추출하는 헬퍼 함수
export function extractSegmentsFromMLResult(
  result: MLServerResult
): MLServerSegment[] {
  return result.result.segments
}

// 화자 목록 추출 함수
export function extractSpeakersFromSegments(
  segments: (MLServerSegment | LegacySegment)[]
): string[] {
  const speakerSet = new Set<string>()
  segments.forEach((segment) => {
    speakerSet.add(segment.speaker.speaker_id)
  })
  return Array.from(speakerSet).sort()
}

// real.json 데이터를 파싱하고 clips로 변환
export async function loadTranscriptionData(url: string): Promise<ClipItem[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Failed to load transcription data: ${response.statusText}`
      )
    }

    const data: TranscriptionData = await response.json()

    if (!data.segments || !Array.isArray(data.segments)) {
      console.warn('No segments found in transcription data')
      return []
    }

    const clips = convertSegmentsToClips(data.segments)
    return clips
  } catch (error) {
    console.error('Error loading transcription data:', error)
    return []
  }
}
