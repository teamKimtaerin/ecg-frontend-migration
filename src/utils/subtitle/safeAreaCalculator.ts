import type { RendererConfigV2 } from '@/app/shared/motiontext'

export interface SafeAreaConfig {
  videoWidth: number
  videoHeight: number
  scenario?: RendererConfigV2 // 시나리오에서 safe area 설정 가져오기
}

/**
 * 시나리오의 safeAreaClamp 설정을 기반으로 최대 너비 계산
 * - safeAreaClamp: true이면 렌더러가 자동으로 safe area 적용
 * - maxWidth: '100%'는 safe area 내에서 100%를 의미
 */
export function calculateMaxSubtitleWidth(config: SafeAreaConfig): number {
  const { videoWidth, scenario } = config

  // 시나리오에서 safeAreaClamp 설정 확인
  const captionDefine = scenario?.define?.caption as Record<string, unknown> | undefined
  const layoutSettings = captionDefine?.layout as Record<string, unknown> | undefined
  const safeAreaClamp = layoutSettings?.safeAreaClamp ?? true

  if (!safeAreaClamp) {
    // Safe area가 비활성화된 경우 전체 너비 사용
    return videoWidth
  }

  // 자동 줄바꿈을 위한 safe area: 비디오 너비의 85% (좌우 7.5%씩 여백)
  // 실제 렌더러보다 보수적으로 계산하여 텍스트가 가장자리에 너무 가깝지 않도록 함
  const RENDERER_SAFE_AREA_RATIO = 0.85
  return Math.floor(videoWidth * RENDERER_SAFE_AREA_RATIO)
}

/**
 * fontSizeRel과 시나리오 설정을 기반으로 최대 너비 계산
 */
export function calculateMaxWidthForFontSize(
  fontSizeRel: number,
  videoWidth: number,
  videoHeight: number,
  scenario?: RendererConfigV2
): number {
  // 시나리오 기반 safe area 계산
  const maxWidth = calculateMaxSubtitleWidth({
    videoWidth,
    videoHeight,
    scenario,
  })

  // 폰트 크기에 따른 추가 여백 고려 (선택적)
  // 큰 폰트일수록 가독성을 위해 좌우 여백 추가
  const fontSizeAdjustment = fontSizeRel > 0.08 ? 0.95 : 1.0

  return Math.floor(maxWidth * fontSizeAdjustment)
}

/**
 * 시나리오에서 현재 폰트 설정 추출
 */
export function extractFontSettingsFromScenario(scenario: RendererConfigV2): {
  fontFamily: string
  fontSizeRel: number
} {
  // caption 트랙에서 기본 스타일 가져오기
  const captionTrack = scenario.tracks?.find(
    track => track.id === 'caption' || track.type === 'subtitle'
  )

  const defaultStyle = captionTrack?.defaultStyle as Record<string, unknown> | undefined

  return {
    fontFamily: (defaultStyle?.fontFamily as string) ?? 'Arial, sans-serif',
    fontSizeRel: (defaultStyle?.fontSizeRel as number) ?? 0.07,
  }
}

/**
 * 시나리오에서 비디오 해상도 추정
 */
export function estimateVideoResolutionFromScenario(scenario: RendererConfigV2): {
  videoWidth: number
  videoHeight: number
} {
  const baseAspect = scenario.stage?.baseAspect ?? '16:9'

  switch (baseAspect) {
    case '16:9':
      return { videoWidth: 1920, videoHeight: 1080 }
    case '9:16':
      return { videoWidth: 1080, videoHeight: 1920 }
    default:
      return { videoWidth: 1920, videoHeight: 1080 }
  }
}