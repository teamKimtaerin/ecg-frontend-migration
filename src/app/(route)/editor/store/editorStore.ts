import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ClipSlice, createClipSlice } from './slices/clipSlice'
import { SelectionSlice, createSelectionSlice } from './slices/selectionSlice'
import { UISlice, createUISlice } from './slices/uiSlice'
import { SaveSlice, createSaveSlice } from './slices/saveSlice'
import { MediaSlice, createMediaSlice } from './slices/mediaSlice'
import { LayerSlice, createLayerSlice } from './slices/layerSlice'

// Combine all slices into a single store type
export type EditorStore = ClipSlice &
  SelectionSlice &
  UISlice &
  SaveSlice &
  MediaSlice &
  LayerSlice

// Create the store with all slices
export const useEditorStore = create<EditorStore>()(
  devtools(
    (...a) => ({
      ...createClipSlice(...a),
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createSaveSlice(...a),
      ...createMediaSlice(...a),
      ...createLayerSlice(...a),
    }),
    {
      name: 'editor-store',
    }
  )
)
