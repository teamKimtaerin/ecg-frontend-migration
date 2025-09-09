/**
 * Motion Text Renderer 시나리오 생성 유틸리티 (standalone)
 * - 외부 프로젝트에서도 그대로 복사/사용 가능하도록 내부 의존성 제거
 * - 플러그인 manifest.json을 기반으로 RendererConfig 생성
 */

// 최소 RendererConfig 타입 (시나리오 v1.3 하위셋)
export interface RendererConfig {
  version: '1.3'
  timebase: { unit: 'seconds' | 'tc'; fps?: number }
  stage: {
    baseAspect: '16:9' | '9:16' | 'auto'
    backgroundColor?: string
    safeArea?: { top?: number; bottom?: number; left?: number; right?: number }
  }
  behavior?: {
    preloadMs?: number
    resizeThrottleMs?: number
    snapToFrame?: boolean
  }
  tracks: Array<{
    id: string
    type: 'subtitle' | 'free'
    layer: number
    defaultStyle?: any
    safeArea?: { top?: number; bottom?: number; left?: number; right?: number }
  }>
  cues: Array<{
    id: string
    track: string
    hintTime?: { start?: number; end?: number }
    root: any
  }>
}

export interface PluginManifest {
  name: string
  version: string
  pluginApi: string
  targets: string[]
  capabilities?: string[]
  schema: Record<string, SchemaProperty>
}

export interface SchemaProperty {
  type: 'number' | 'string' | 'boolean' | 'select'
  label: string
  description: string
  default: unknown
  min?: number
  max?: number
  step?: number
  enum?: string[]
}

export interface PreviewSettings {
  text: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  pluginParams: Record<string, unknown>
  rotationDeg?: number
  fontSizeRel?: number
}

export type ManifestLoadMode = 'server' | 'local' | 'auto'

export interface ManifestLoadOptions {
  mode?: ManifestLoadMode // default 'auto'
  serverBase?: string // e.g., 'http://localhost:3300'
  localBase?: string // e.g., '/plugin-server/plugins/' or './plugin-server/plugins/'
  fetchImpl?: typeof fetch // optional custom fetch for SSR/tests
}

/**
 * 플러그인 manifest를 로드합니다
 */
export async function loadPluginManifest(
  pluginName: string,
  opts: ManifestLoadOptions = {}
): Promise<PluginManifest> {
  try {
    const key = pluginName.includes('@') ? pluginName : `${pluginName}@1.0.0`
    const mode: ManifestLoadMode = opts.mode ?? 'auto'
    const serverBase = (opts.serverBase ?? '').replace(/\/$/, '')
    const localBase = opts.localBase ?? ''
    const f =
      opts.fetchImpl ??
      (typeof fetch !== 'undefined' ? fetch.bind(window) : undefined)
    if (!f)
      throw new Error('No fetch implementation available in this environment')

    const tryUrls: string[] = []
    if (mode === 'server' || mode === 'auto') {
      if (serverBase)
        tryUrls.push(
          `${serverBase}/plugins/${encodeURIComponent(key)}/manifest.json`
        )
      if (serverBase) tryUrls.push(`${serverBase}/plugins/${key}/manifest.json`)
    }
    if (mode === 'local' || mode === 'auto') {
      if (localBase) {
        const base = localBase.endsWith('/') ? localBase : localBase + '/'
        tryUrls.push(`${base}${encodeURIComponent(key)}/manifest.json`)
        tryUrls.push(`${base}${key}/manifest.json`)
      }
      // Optional conventional absolute path
      tryUrls.push(`/plugin/${encodeURIComponent(key)}/manifest.json`)
      tryUrls.push(`/plugin/${key}/manifest.json`)
    }

    let lastErr: unknown = null
    for (const url of tryUrls) {
      try {
        const res = await f(url)
        if (!res || !res.ok) continue
        const ct = res.headers.get('content-type') || ''
        if (/json/i.test(ct)) return await res.json()
        try {
          return await res.json()
        } catch {
          continue
        }
      } catch (e) {
        lastErr = e
      }
    }
    throw new Error(
      `Failed to load manifest for ${pluginName}. Tried ${tryUrls.join(', ')}. Last error: ${String(lastErr)}`
    )
  } catch (error) {
    console.error(`Error loading manifest for ${pluginName}:`, error)
    throw error
  }
}

/**
 * manifest의 기본값으로부터 초기 파라미터를 생성합니다
 */
export function getDefaultParameters(
  manifest: PluginManifest
): Record<string, unknown> {
  const params: Record<string, unknown> = {}

  Object.entries(manifest.schema).forEach(([key, property]) => {
    params[key] = property.default
  })

  return params
}

/**
 * 미리보기용 RendererConfig를 생성합니다
 */
export function generatePreviewScenario(
  pluginName: string,
  settings: PreviewSettings,
  duration: number = 3
): RendererConfig {
  // 드래그 박스의 "중심"을 기준으로 0-1 범위로 정규화 (640x360 기준)
  // 그룹 자체의 anchor를 'cc'로 두고, position에는 중앙 좌표를 그대로 사용한다.
  const centerX = settings.position.x + settings.size.width / 2
  const centerY = settings.position.y + settings.size.height / 2
  const normalizedX = Math.max(0, Math.min(1, centerX / 640))
  const normalizedY = Math.max(0, Math.min(1, centerY / 360))
  const relW = Math.max(0, Math.min(1, settings.size.width / 640))
  const relH = Math.max(0, Math.min(1, settings.size.height / 360))

  return {
    version: '1.3',
    timebase: { unit: 'seconds' },
    stage: {
      baseAspect: '16:9',
      backgroundColor: 'transparent',
    },
    tracks: [
      {
        id: 'preview-track',
        type: 'free',
        layer: 1,
      },
    ],
    cues: [
      {
        id: 'preview-cue',
        track: 'preview-track',
        hintTime: { start: 0 },
        root: {
          e_type: 'group',
          layout: {
            // 그룹을 드래그 박스의 중심에 놓는다
            position: { x: normalizedX, y: normalizedY },
            // 그룹 배치 기준을 중앙으로 설정하여 애니메이션/텍스트 모두 박스 중심 기준
            anchor: 'cc',
            size: {
              width: relW,
              height: relH,
            },
          },
          children: [
            {
              e_type: 'text',
              text: settings.text,
              absStart: 0,
              absEnd: duration,
              // 텍스트 노드를 그룹 중앙에 고정하여 회전 시에도 드래그 박스 중심과 일치
              layout: {
                position: { x: 0.5, y: 0.5 },
                anchor: 'cc',
                // 텍스트 자체의 박스 크기를 콘텐츠 기준(auto)로 두고 중앙 정렬
                // 이렇게 해야 텍스트의 CC가 그룹의 CC와 정확히 일치함
                size: { width: 'auto', height: 'auto' },
                overflow: 'visible',
              },
              style: {
                fontSizeRel: settings.fontSizeRel || 0.06,
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                align: 'center',
                whiteSpace: 'nowrap',
              },
              pluginChain: [
                {
                  name: pluginName,
                  params: settings.pluginParams,
                },
              ],
            },
          ],
        },
      },
    ],
  } as RendererConfig
}

/**
 * 무한 루프 시나리오를 생성합니다
 */
export function generateLoopedScenario(
  pluginName: string,
  settings: PreviewSettings,
  duration: number = 3
): RendererConfig {
  // 드래그 박스의 "중심"을 기준으로 0-1 범위로 정규화 (640x360 기준)
  const centerX = settings.position.x + settings.size.width / 2
  const centerY = settings.position.y + settings.size.height / 2
  const normalizedX = Math.max(0, Math.min(1, centerX / 640))
  const normalizedY = Math.max(0, Math.min(1, centerY / 360))
  const relW = Math.max(0, Math.min(1, settings.size.width / 640))
  const relH = Math.max(0, Math.min(1, settings.size.height / 360))

  // Simplified plugin chain - only the requested plugin
  const pluginChain = [
    {
      name: pluginName,
      params: settings.pluginParams,
      relStartPct: 0.0,
      relEndPct: 1.0,
    },
  ]

  const scenario = {
    version: '1.3',
    timebase: { unit: 'seconds' },
    stage: { baseAspect: '16:9' },
    tracks: [{ id: 'free', type: 'free', layer: 1 }],
    cues: [
      {
        id: 'preview-cue',
        track: 'free',
        root: {
          e_type: 'group',
          layout: {
            // 그룹을 중앙 기준(anchor: 'cc')으로 배치하여 박스 정중앙에서 시작
            position: { x: normalizedX, y: normalizedY },
            anchor: 'cc',
            size: { width: relW, height: relH },
            transform:
              settings.rotationDeg != null
                ? { rotate: { deg: settings.rotationDeg } }
                : undefined,
            transformOrigin: '50% 50%',
          },
          children: [
            {
              e_type: 'text',
              text: settings.text,
              absStart: 0,
              absEnd: duration,
              // 텍스트를 그룹 내 중앙(anchor: 'cc')에 배치
              layout: {
                position: { x: 0.5, y: 0.5 },
                anchor: 'cc',
                // 콘텐츠 크기 기반으로 중앙 정렬
                size: { width: 'auto', height: 'auto' },
                overflow: 'visible',
              },
              style: {
                fontSizeRel: settings.fontSizeRel || 0.07,
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                align: 'center',
                whiteSpace: 'nowrap',
              },
              pluginChain: pluginChain,
            },
          ],
        },
      },
    ],
  } as RendererConfig

  console.log(
    '[ScenarioGenerator] Generated scenario for plugin:',
    pluginName,
    'box TL:',
    `(${settings.position.x}, ${settings.position.y})`,
    'size:',
    `${settings.size.width}x${settings.size.height}`,
    'rotation:',
    `${settings.rotationDeg}°`
  )
  console.log(
    '[ScenarioGenerator][PosCompare] anchor=cc, transformOrigin=50% 50%'
  )
  console.log('[ScenarioGenerator][PosCompare] computedCenter(px)=', {
    x: centerX,
    y: centerY,
  })
  console.log('[ScenarioGenerator][PosCompare] normalizedCenter=', {
    x: normalizedX,
    y: normalizedY,
  })
  return scenario
}

/**
 * 파라미터 검증 및 정규화
 */
export function validateAndNormalizeParams(
  params: Record<string, unknown>,
  manifest: PluginManifest
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}

  Object.entries(manifest.schema).forEach(([key, property]) => {
    const value = params[key] ?? property.default

    // 타입별 검증 및 정규화
    switch (property.type) {
      case 'number':
        let numValue = Number(value as number)
        if (!Number.isFinite(numValue)) {
          const d =
            typeof property.default === 'number'
              ? property.default
              : Number(property.default as number)
          numValue = Number.isFinite(d) ? (d as number) : 0
        }
        if (property.min !== undefined) {
          numValue = Math.max(property.min, numValue)
        }
        if (property.max !== undefined) {
          numValue = Math.min(property.max, numValue)
        }
        normalized[key] = numValue
        break

      case 'boolean':
        normalized[key] = Boolean(value)
        break

      case 'select':
        {
          const v = String(value)
          const ok = property.enum?.includes(v)
          normalized[key] = ok ? v : String(property.default ?? '')
        }
        break

      case 'string':
      default:
        normalized[key] = String(value ?? property.default ?? '')
        break
    }
  })

  return normalized
}

/**
 * assets-database.json의 configFile을 manifest.json으로 변환
 */
export function convertConfigFileToManifest(configFile: string): string {
  // "/plugin/rotation/config.json" -> "/plugin/rotation/manifest.json"
  return configFile.replace('/config.json', '/manifest.json')
}
