/**
 * Local plugin loader for MotionText preview (Next.js runtime)
 * - Uses motiontext-renderer's official plugin registration API
 * - Dynamically imports `public/plugin/<name>/index.mjs`
 * - Registers plugins with registerExternalPlugin
 */

import type { RendererConfig } from './scenarioGenerator'
import {
  configurePluginSource,
  registerExternalPlugin,
} from 'motiontext-renderer'

export interface TLHandle {
  pause?: () => TLHandle
  progress?: (p: number) => TLHandle
  repeat?: (n: number) => TLHandle
  kill?: () => void
}
export type ProgressFn = (p: number) => void

export interface GsapLike {
  timeline?: (opts?: unknown) => TLHandle
  utils?: { random: (min: number, max: number) => number }
}

export interface PluginContext {
  gsap?: GsapLike
  assets?: { getUrl: (p: string) => string }
}

export interface PluginRuntime {
  name?: string
  version?: string
  init?: (
    el: HTMLElement,
    opts: Record<string, unknown>,
    ctx: PluginContext
  ) => void
  animate?: (
    el: HTMLElement,
    opts: Record<string, unknown>,
    ctx: PluginContext,
    duration: number
  ) => TLHandle | ProgressFn | void
  cleanup?: (el: HTMLElement) => void
}

export interface PluginRuntimeModule {
  default?: PluginRuntime
  // Optional channels API (not used in this preview fallback)
  evalChannels?: (
    spec: unknown,
    p: number,
    ctx: PluginContext
  ) => Record<string, unknown>
}

const cache = new Map<string, PluginRuntimeModule>()
const registeredPlugins = new Set<string>()

// List of available plugins in /public/plugin/
const LOCAL_PLUGINS = [
  'fadein@1.0.0',
  'elastic@1.0.0',
  'glitch@1.0.0',
  'magnetic@1.0.0',
  'rotation@1.0.0',
  'scalepop@1.0.0',
  'slideup@1.0.0',
  'typewriter@1.0.0',
]

/**
 * Configure plugin source for local mode
 */
export function configurePluginLoader() {
  console.log('[PluginLoader] Configuring plugin source for local mode')
  configurePluginSource({
    mode: 'local',
    localBase: '/plugin/',
  })
}

function resolveKey(name: string): string {
  return name.includes('@') ? name : `${name}@1.0.0`
}

export async function loadLocalPlugin(
  name: string
): Promise<PluginRuntimeModule> {
  if (!name) throw new Error('Plugin name is required')
  const key = resolveKey(name)
  if (cache.has(key)) return cache.get(key) as PluginRuntimeModule

  // Build absolute URL to `public/plugin/<name>/index.mjs`
  const url = new URL(
    `/plugin/${encodeURIComponent(key)}/index.mjs`,
    window.location.origin
  ).toString()
  // Instruct bundler to treat URL as external at runtime
  const mod: PluginRuntimeModule = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ url
  )
  cache.set(key, mod)

  // Register with motiontext-renderer using official API
  if (!registeredPlugins.has(key)) {
    try {
      // Load manifest to get version
      const manifestResponse = await fetch(
        `/plugin/${encodeURIComponent(key)}/manifest.json`
      )
      const manifest = manifestResponse.ok
        ? await manifestResponse.json()
        : { version: '1.0.0' }

      // Extract plugin name without version for registration
      const pluginNameWithoutVersion = key.split('@')[0]
      registerExternalPlugin({
        name: pluginNameWithoutVersion,
        version: manifest.version || '1.0.0',
        module: mod,
        baseUrl: `/plugin/${encodeURIComponent(key)}/`,
        manifest: manifest,
      })

      registeredPlugins.add(key)
      console.log(
        `[PluginLoader] Registered plugin with motiontext-renderer: ${key}@${manifest.version}`
      )
    } catch (error) {
      console.error(`[PluginLoader] Failed to register plugin ${key}:`, error)
    }
  }

  return mod
}

/**
 * Preload all available local plugins
 */
export async function preloadAllPlugins() {
  console.log('[PluginLoader] Preloading all local plugins...')

  for (const pluginName of LOCAL_PLUGINS) {
    try {
      await loadLocalPlugin(pluginName)
    } catch (error) {
      console.warn(`[PluginLoader] Failed to load plugin ${pluginName}:`, error)
    }
  }

  console.log('[PluginLoader] Plugin preloading complete')
}

/**
 * Extract plugin names from a scenario
 */
function extractPluginNames(scenario: RendererConfig): Set<string> {
  const pluginNames = new Set<string>()

  // Traverse all cues and extract plugin names
  scenario.cues?.forEach((cue) => {
    const traverse = (node: any): void => {
      // Check for plugin property (legacy)
      if (node?.plugin?.name) {
        pluginNames.add(node.plugin.name)
      }

      // Check for pluginChain (correct v1.3 format)
      if (Array.isArray(node?.pluginChain)) {
        node.pluginChain.forEach((p: any) => {
          if (p.name) pluginNames.add(p.name)
        })
      }

      // Recurse into children
      if (Array.isArray(node?.children)) {
        node.children.forEach(traverse)
      }
    }

    traverse(cue.root)
  })

  return pluginNames
}

/**
 * Preload plugins required by a scenario
 */
export async function preloadPluginsForScenario(scenario: RendererConfig) {
  console.log('[PluginLoader] Preloading plugins for scenario...')

  // Extract plugin names from scenario
  const requiredPlugins = extractPluginNames(scenario)
  console.log('[PluginLoader] Required plugins:', Array.from(requiredPlugins))

  // Load each required plugin
  for (const pluginName of requiredPlugins) {
    try {
      await loadLocalPlugin(pluginName)
    } catch (error) {
      console.warn(
        `[PluginLoader] Failed to load required plugin ${pluginName}:`,
        error
      )
    }
  }

  // Log available plugins
  if (typeof window !== 'undefined' && (window as any).__motionTextPlugins) {
    console.log(
      '[PluginLoader] Available plugins:',
      Object.keys((window as any).__motionTextPlugins)
    )
  }
}

let gsapCache: GsapLike | undefined

export function getGsap(): GsapLike | undefined {
  // Prefer global gsap if present, fallback to module import when available
  try {
    if (typeof window !== 'undefined') {
      const w = window as unknown as { gsap?: GsapLike }
      if (w.gsap) return w.gsap
    }
  } catch {
    /* noop */
  }
  return undefined
}

export async function ensureGsap(): Promise<GsapLike | undefined> {
  if (gsapCache) return gsapCache
  const g = getGsap()
  if (g) {
    gsapCache = g
    return g
  }
  try {
    const mod = (await import('gsap')) as unknown as { default?: GsapLike }
    const gs = mod && mod.default ? mod.default : undefined
    if (gs && typeof window !== 'undefined') {
      ;(window as unknown as { gsap?: GsapLike }).gsap = gs
    }
    gsapCache = gs
    return gs
  } catch {
    return undefined
  }
}
