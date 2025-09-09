import { StateCreator } from 'zustand'
import { LayerElement } from '../../types/layer'

export interface LayerSlice {
  // Layer state
  layers: LayerElement[]
  selectedLayerId: string | null
  isEditingMode: boolean

  // Layer actions
  addLayer: (layer: LayerElement) => void
  updateLayer: (layerId: string, changes: Partial<LayerElement>) => void
  removeLayer: (layerId: string) => void
  duplicateLayer: (layerId: string) => void

  // Layer selection
  selectLayer: (layerId: string) => void
  clearLayerSelection: () => void

  // Layer editing mode
  setEditingMode: (isEditing: boolean) => void

  // Clip-specific layer management
  getLayersForClip: (clipId: string) => LayerElement[]
  removeLayersForClip: (clipId: string) => void
  updateLayerTimingForClip: (
    clipId: string,
    startOffset: number,
    duration: number
  ) => void

  // Layer export/import
  exportLayersForClip: (clipId: string) => LayerElement[]
  importLayersForClip: (clipId: string, layers: LayerElement[]) => void
  exportAllLayers: () => { [clipId: string]: LayerElement[] }
  importAllLayers: (layerData: { [clipId: string]: LayerElement[] }) => void
}

export const createLayerSlice: StateCreator<LayerSlice, [], [], LayerSlice> = (
  set,
  get
) => ({
  // Initial state
  layers: [],
  selectedLayerId: null,
  isEditingMode: false,

  // Layer actions
  addLayer: (layer) => {
    set((state) => ({
      layers: [...state.layers, layer],
    }))
  },

  updateLayer: (layerId, changes) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              ...changes,
              metadata: {
                ...layer.metadata,
                updatedAt: new Date().toISOString(),
              },
            }
          : layer
      ),
    }))
  },

  removeLayer: (layerId) => {
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== layerId),
      selectedLayerId:
        state.selectedLayerId === layerId ? null : state.selectedLayerId,
    }))
  },

  duplicateLayer: (layerId) => {
    const { layers } = get()
    const layerToDuplicate = layers.find((layer) => layer.id === layerId)

    if (layerToDuplicate) {
      const duplicatedLayer: LayerElement = {
        ...layerToDuplicate,
        id: `${layerToDuplicate.type}-${Date.now()}`,
        position: {
          x: layerToDuplicate.position.x + 0.05, // Slight offset
          y: layerToDuplicate.position.y + 0.05,
        },
        metadata: {
          ...layerToDuplicate.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }

      set((state) => ({
        layers: [...state.layers, duplicatedLayer],
        selectedLayerId: duplicatedLayer.id,
      }))
    }
  },

  // Layer selection
  selectLayer: (layerId) => {
    set({ selectedLayerId: layerId })
  },

  clearLayerSelection: () => {
    set({ selectedLayerId: null })
  },

  // Layer editing mode
  setEditingMode: (isEditing) => {
    set({ isEditingMode: isEditing })
  },

  // Clip-specific layer management
  getLayersForClip: (clipId) => {
    const { layers } = get()
    return layers.filter((layer) => layer.timing.clipId === clipId)
  },

  removeLayersForClip: (clipId) => {
    set((state) => ({
      layers: state.layers.filter((layer) => layer.timing.clipId !== clipId),
      selectedLayerId: state.layers.some(
        (layer) =>
          layer.id === state.selectedLayerId && layer.timing.clipId === clipId
      )
        ? null
        : state.selectedLayerId,
    }))
  },

  updateLayerTimingForClip: (clipId, startOffset, duration) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.timing.clipId === clipId
          ? {
              ...layer,
              timing: {
                ...layer.timing,
                startTime: Math.max(0, layer.timing.startTime + startOffset),
                endTime: Math.min(duration, layer.timing.endTime + startOffset),
              },
              metadata: {
                ...layer.metadata,
                updatedAt: new Date().toISOString(),
              },
            }
          : layer
      ),
    }))
  },

  // Layer export/import
  exportLayersForClip: (clipId) => {
    const { layers } = get()
    return layers.filter((layer) => layer.timing.clipId === clipId)
  },

  importLayersForClip: (clipId, layersToImport) => {
    // Remove existing layers for this clip
    const { removeLayersForClip } = get()
    removeLayersForClip(clipId)

    // Add imported layers with updated clip ID
    const updatedLayers = layersToImport.map((layer) => ({
      ...layer,
      id: `${layer.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate new unique ID
      timing: {
        ...layer.timing,
        clipId: clipId,
      },
      metadata: {
        ...layer.metadata,
        updatedAt: new Date().toISOString(),
      },
    }))

    set((state) => ({
      layers: [...state.layers, ...updatedLayers],
    }))
  },

  exportAllLayers: () => {
    const { layers } = get()
    const layersByClip: { [clipId: string]: LayerElement[] } = {}

    layers.forEach((layer) => {
      const clipId = layer.timing.clipId
      if (!layersByClip[clipId]) {
        layersByClip[clipId] = []
      }
      layersByClip[clipId].push(layer)
    })

    return layersByClip
  },

  importAllLayers: (layerData) => {
    const allLayers: LayerElement[] = []

    Object.entries(layerData).forEach(([clipId, layers]) => {
      const updatedLayers = layers.map((layer) => ({
        ...layer,
        id: `${layer.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timing: {
          ...layer.timing,
          clipId: clipId,
        },
        metadata: {
          ...layer.metadata,
          updatedAt: new Date().toISOString(),
        },
      }))
      allLayers.push(...updatedLayers)
    })

    set({
      layers: allLayers,
      selectedLayerId: null,
    })
  },
})
