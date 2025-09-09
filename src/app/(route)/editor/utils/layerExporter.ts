import { LayerElement } from '../types/layer'

export interface ExportedLayerData {
  version: string
  exportedAt: string
  clipId: string
  clipTimeline?: string
  layers: LayerElement[]
}

export interface ExportedProjectLayers {
  version: string
  exportedAt: string
  projectName?: string
  clips: {
    [clipId: string]: {
      timeline?: string
      layers: LayerElement[]
    }
  }
}

/**
 * Layer export/import utility functions
 */
export class LayerExporter {
  private static VERSION = '1.0.0'

  /**
   * Export layers for a specific clip to JSON
   */
  static exportClipLayers(
    clipId: string,
    layers: LayerElement[],
    clipTimeline?: string
  ): string {
    const clipLayers = layers.filter((layer) => layer.timing.clipId === clipId)

    const exportData: ExportedLayerData = {
      version: this.VERSION,
      exportedAt: new Date().toISOString(),
      clipId,
      clipTimeline,
      layers: clipLayers,
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Export all layers organized by clip to JSON
   */
  static exportAllLayers(
    layers: LayerElement[],
    clips?: Array<{ id: string; timeline?: string }>,
    projectName?: string
  ): string {
    const layersByClip: { [clipId: string]: LayerElement[] } = {}

    // Group layers by clip
    layers.forEach((layer) => {
      const clipId = layer.timing.clipId
      if (!layersByClip[clipId]) {
        layersByClip[clipId] = []
      }
      layersByClip[clipId].push(layer)
    })

    // Build export data with clip information
    const clipsData: ExportedProjectLayers['clips'] = {}
    Object.entries(layersByClip).forEach(([clipId, clipLayers]) => {
      const clip = clips?.find((c) => c.id === clipId)
      clipsData[clipId] = {
        timeline: clip?.timeline,
        layers: clipLayers,
      }
    })

    const exportData: ExportedProjectLayers = {
      version: this.VERSION,
      exportedAt: new Date().toISOString(),
      projectName,
      clips: clipsData,
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Import layers from JSON string
   */
  static importLayers(jsonData: string): {
    success: boolean
    data?: ExportedLayerData | ExportedProjectLayers
    error?: string
  } {
    try {
      const parsed = JSON.parse(jsonData)

      // Validate basic structure
      if (!parsed.version || !parsed.exportedAt) {
        return {
          success: false,
          error:
            'Invalid layer data format - missing version or export timestamp',
        }
      }

      // Check if it's a single clip export or full project export
      if ('clipId' in parsed && 'layers' in parsed) {
        // Single clip export
        if (!Array.isArray(parsed.layers)) {
          return {
            success: false,
            error: 'Invalid layer data format - layers must be an array',
          }
        }
        return { success: true, data: parsed as ExportedLayerData }
      } else if ('clips' in parsed) {
        // Full project export
        if (typeof parsed.clips !== 'object') {
          return {
            success: false,
            error: 'Invalid layer data format - clips must be an object',
          }
        }
        return { success: true, data: parsed as ExportedProjectLayers }
      }

      return {
        success: false,
        error: 'Invalid layer data format - unrecognized structure',
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Download JSON data as a file
   */
  static downloadAsFile(jsonData: string, filename: string) {
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the blob URL
    URL.revokeObjectURL(url)
  }

  /**
   * Generate filename for layer export
   */
  static generateFilename(
    type: 'clip' | 'project',
    identifier?: string
  ): string {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace(/[:\-]/g, '')
      .replace('T', '_')

    if (type === 'clip' && identifier) {
      return `clip_layers_${identifier}_${timestamp}.json`
    } else if (type === 'project') {
      const projectName = identifier || 'project'
      return `${projectName}_layers_${timestamp}.json`
    } else {
      return `layers_export_${timestamp}.json`
    }
  }

  /**
   * Validate layer element structure
   */
  static validateLayerElement(layer: unknown): layer is LayerElement {
    if (typeof layer !== 'object' || layer === null) {
      return false
    }

    const l = layer as Record<string, unknown>

    return (
      typeof l.id === 'string' &&
      ['text', 'shape', 'blank_word'].includes(l.type as string) &&
      typeof l.position === 'object' &&
      l.position !== null &&
      typeof (l.position as Record<string, unknown>).x === 'number' &&
      typeof (l.position as Record<string, unknown>).y === 'number' &&
      typeof l.size === 'object' &&
      l.size !== null &&
      typeof (l.size as Record<string, unknown>).width === 'number' &&
      typeof (l.size as Record<string, unknown>).height === 'number' &&
      typeof l.timing === 'object' &&
      l.timing !== null &&
      typeof (l.timing as Record<string, unknown>).clipId === 'string' &&
      typeof (l.timing as Record<string, unknown>).startTime === 'number' &&
      typeof (l.timing as Record<string, unknown>).endTime === 'number' &&
      typeof l.content === 'object' &&
      l.content !== null &&
      typeof l.style === 'object' &&
      l.style !== null &&
      typeof l.metadata === 'object' &&
      l.metadata !== null
    )
  }
}
