interface PluginManifest {
  name: string
  version: string
  type?: string
  pluginApi: string
  minRenderer: string
  entry: string
  targets: string[]
  capabilities?: string[]
  peer?: Record<string, string>
  preload?: string[]
  timeOffset?: [number, number] // [preOffset, postOffset]
  schema?: Record<string, unknown>
  icon?: string // Optional icon path relative to plugin directory
}

// Cache for loaded manifests
const manifestCache = new Map<string, PluginManifest>()

/**
 * Load and cache a plugin manifest from the plugin server
 * @param pluginKey - Plugin identifier like "elastic@2.0.0"
 * @returns Promise resolving to the manifest or null if not found
 */
export async function loadPluginManifest(pluginKey?: string): Promise<PluginManifest | null> {
  if (!pluginKey) return null

  // Check cache first
  if (manifestCache.has(pluginKey)) {
    return manifestCache.get(pluginKey)!
  }

  try {
    // Construct URL to plugin manifest
    const baseUrl = process.env.NEXT_PUBLIC_PLUGIN_SERVER_URL || 'http://localhost:8080'
    const manifestUrl = `${baseUrl}/plugins/${pluginKey}/manifest.json`

    const response = await fetch(manifestUrl)
    if (!response.ok) {
      console.warn(`Failed to load plugin manifest for ${pluginKey}: ${response.status}`)
      return null
    }

    const manifest: PluginManifest = await response.json()

    // Cache the manifest
    manifestCache.set(pluginKey, manifest)

    return manifest
  } catch (error) {
    console.warn(`Error loading plugin manifest for ${pluginKey}:`, error)
    return null
  }
}

/**
 * Get the timeOffset for a specific plugin
 * @param pluginKey - Plugin identifier
 * @returns timeOffset tuple [preOffset, postOffset] or [0, 0] if not found
 */
export async function getPluginTimeOffset(pluginKey?: string): Promise<[number, number]> {
  const manifest = await loadPluginManifest(pluginKey)
  return manifest?.timeOffset || [0, 0]
}

/**
 * Preload manifests for commonly used plugins
 */
export async function preloadCommonPluginManifests(): Promise<void> {
  const commonPlugins = [
    'elastic@2.0.0',
    'typewriter@2.0.0',
    'pulse@2.0.0',
    'fadein@2.0.0',
    'scalepop@2.0.0',
    'slideup@2.0.0',
    'rotation@2.0.0',
    'glitch@2.0.0',
    'magnetic@2.0.0',
    'flames@2.0.0',
    'glow@2.0.0'
  ]

  // Load manifests in parallel
  await Promise.allSettled(
    commonPlugins.map(pluginKey => loadPluginManifest(pluginKey))
  )
}

/**
 * Get the icon URL for a specific plugin
 * @param pluginKey - Plugin identifier
 * @returns Icon URL or null if not found
 */
export async function getPluginIconUrl(pluginKey?: string): Promise<string | null> {
  if (!pluginKey) return null

  const manifest = await loadPluginManifest(pluginKey)
  if (!manifest?.icon) return null

  const baseUrl = process.env.NEXT_PUBLIC_PLUGIN_SERVER_URL || 'http://localhost:8080'
  return `${baseUrl}/plugins/${pluginKey}/${manifest.icon}`
}

/**
 * Clear the manifest cache (useful for development/testing)
 */
export function clearManifestCache(): void {
  manifestCache.clear()
}