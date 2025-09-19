import type { StateCreator } from 'zustand'
import {
  type TextInsertionSlice,
  type InsertedText,
  type TextPosition,
  type TextStyle,
  DEFAULT_TEXT_STYLE,
  createInsertedText,
  isTextActiveAtTime,
} from '../../types/textInsertion'
import { ScenarioManager, type ScenarioUpdateListener } from '../../utils/ScenarioManager'
import type { RendererConfigV2 } from '@/app/shared/motiontext'

export type { TextInsertionSlice }

// Create a global ScenarioManager instance for the slice
let scenarioManager: ScenarioManager | null = null

export const createTextInsertionSlice: StateCreator<
  TextInsertionSlice,
  [],
  [],
  TextInsertionSlice
> = (set, get) => ({
  // Initial state
  insertedTexts: [],
  selectedTextId: null,
  defaultStyle: DEFAULT_TEXT_STYLE,
  clipboard: [],
  // Scenario management state
  currentScenario: null,
  isScenarioMode: false, // Start in individual mode for editing

  // Text creation at center
  addTextAtCenter: (currentTime: number) => {
    const newText: InsertedText = {
      id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      content: '텍스트를 입력하세요',
      position: { x: 50, y: 50 }, // Center position (50%, 50%)
      startTime: currentTime,
      endTime: currentTime + 3, // Default 3 seconds duration
      style: get().defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSelected: true, // Auto-select the new text
      isEditing: false,
    }

    set((state) => {
      const newInsertedTexts = [
        ...state.insertedTexts.map((text) => ({ ...text, isSelected: false })), // Deselect others
        newText, // Add new selected text
      ]
      
      // Update scenario manager if initialized (always sync)
      if (scenarioManager) {
        scenarioManager.updateInsertedText(newText)
      }
      
      return {
        ...state,
        insertedTexts: newInsertedTexts,
        selectedTextId: newText.id,
      }
    })
  },

  // Text CRUD operations
  addText: (textData) => {
    const newText: InsertedText = {
      ...textData,
      id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    set((state) => ({
      ...state,
      insertedTexts: [...state.insertedTexts, newText],
      selectedTextId: newText.id,
    }))
  },

  updateText: (id: string, updates: Partial<InsertedText>) => {
    set((state) => {
      const updatedTexts = state.insertedTexts.map((text) =>
        text.id === id ? { ...text, ...updates, updatedAt: Date.now() } : text
      )
      
      // Update scenario manager if initialized (always sync)
      if (scenarioManager) {
        const updatedText = updatedTexts.find(text => text.id === id)
        if (updatedText) {
          scenarioManager.updateInsertedText(updatedText)
        }
      }
      
      return {
        ...state,
        insertedTexts: updatedTexts,
      }
    })
  },

  deleteText: (id: string) => {
    set((state) => {
      // Update scenario manager if initialized (always sync)
      if (scenarioManager) {
        scenarioManager.removeInsertedText(id)
      }
      
      return {
        ...state,
        insertedTexts: state.insertedTexts.filter((text) => text.id !== id),
        selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
      }
    })
  },

  duplicateText: (id: string) => {
    const { insertedTexts } = get()
    const originalText = insertedTexts.find((text) => text.id === id)

    if (originalText) {
      const duplicatedText: InsertedText = {
        ...originalText,
        id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        position: {
          x: Math.min(95, originalText.position.x + 5),
          y: Math.min(95, originalText.position.y + 5),
        },
        startTime: originalText.startTime + 1,
        endTime: originalText.endTime + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isSelected: false,
        isEditing: false,
      }

      set((state) => ({
        ...state,
        insertedTexts: [...state.insertedTexts, duplicatedText],
        selectedTextId: duplicatedText.id,
      }))
    }
  },

  // Selection management
  selectText: (id: string | null) => {
    console.log('🔧 selectText called:', {
      id,
      currentSelectedId: get().selectedTextId,
      textsCount: get().insertedTexts.length,
    })

    set((state) => {
      const newState = {
        ...state,
        selectedTextId: id,
        // Don't auto-open panel when text is selected
        insertedTexts: state.insertedTexts.map((text) => ({
          ...text,
          isSelected: text.id === id,
        })),
      }

      console.log('✅ selectText state updated:', {
        newSelectedId: newState.selectedTextId,
        selectedTextObject: newState.insertedTexts.find(t => t.isSelected),
      })

      return newState
    })
  },

  clearSelection: () => {
    set((state) => ({
      ...state,
      selectedTextId: null,
      insertedTexts: state.insertedTexts.map((text) => ({
        ...text,
        isSelected: false,
      })),
    }))
  },

  // Style management
  updateDefaultStyle: (style: Partial<TextStyle>) => {
    set((state) => ({
      ...state,
      defaultStyle: { ...state.defaultStyle, ...style },
    }))
  },

  applyStyleToSelected: (style: Partial<TextStyle>) => {
    const { selectedTextId } = get()
    if (!selectedTextId) return

    set((state) => ({
      ...state,
      insertedTexts: state.insertedTexts.map((text) =>
        text.id === selectedTextId
          ? {
              ...text,
              style: { ...text.style, ...style },
              updatedAt: Date.now(),
            }
          : text
      ),
    }))
  },

  // Clipboard operations
  copyText: (id: string) => {
    const { insertedTexts } = get()
    const textToCopy = insertedTexts.find((text) => text.id === id)

    if (textToCopy) {
      set((state) => ({
        ...state,
        clipboard: [textToCopy],
      }))
    }
  },

  cutText: (id: string) => {
    const { copyText, deleteText } = get()
    copyText(id)
    deleteText(id)
  },

  pasteText: (position: TextPosition, currentTime: number) => {
    const { clipboard, addText } = get()

    if (clipboard.length > 0) {
      const textToPaste = clipboard[0]
      const pastedText = createInsertedText(
        textToPaste.content,
        position,
        currentTime,
        currentTime + (textToPaste.endTime - textToPaste.startTime),
        textToPaste.style,
        textToPaste.animation
      )

      addText(pastedText)
    }
  },

  // Batch operations
  deleteSelectedTexts: () => {
    const { selectedTextId, deleteText } = get()
    if (selectedTextId) {
      deleteText(selectedTextId)
    }
  },

  moveTexts: (ids: string[], deltaPosition: TextPosition) => {
    set((state) => ({
      ...state,
      insertedTexts: state.insertedTexts.map((text) =>
        ids.includes(text.id)
          ? {
              ...text,
              position: {
                x: Math.max(
                  0,
                  Math.min(100, text.position.x + deltaPosition.x)
                ),
                y: Math.max(
                  0,
                  Math.min(100, text.position.y + deltaPosition.y)
                ),
              },
              updatedAt: Date.now(),
            }
          : text
      ),
    }))
  },

  // Time management
  getActiveTexts: (currentTime: number) => {
    const { insertedTexts } = get()
    return insertedTexts.filter((text) => isTextActiveAtTime(text, currentTime))
  },

  updateTextTiming: (id: string, startTime: number, endTime: number) => {
    set((state) => {
      const updatedTexts = state.insertedTexts.map((text) =>
        text.id === id
          ? {
              ...text,
              startTime: Math.max(0, startTime),
              endTime: Math.max(startTime + 0.1, endTime),
              updatedAt: Date.now(),
            }
          : text
      )
      
      // Update scenario manager if initialized (always sync)
      if (scenarioManager) {
        const updatedText = updatedTexts.find(text => text.id === id)
        if (updatedText) {
          scenarioManager.updateInsertedText(updatedText)
        }
      }
      
      return {
        ...state,
        insertedTexts: updatedTexts,
      }
    })
  },

  // Scenario management methods
  initializeScenario: (clips = []) => {
    const { insertedTexts } = get()
    
    // Create new scenario manager if not exists
    if (!scenarioManager) {
      scenarioManager = new ScenarioManager({
        autoUpdate: true,
        includeInsertedTexts: true,
      })
    }
    
    // Initialize with current data
    const scenario = scenarioManager.initialize(clips, insertedTexts)
    
    // Set up listener to update store when scenario changes
    scenarioManager.addUpdateListener((updatedScenario: RendererConfigV2) => {
      set((state) => ({
        ...state,
        currentScenario: updatedScenario,
      }))
    })
    
    set((state) => ({
      ...state,
      currentScenario: scenario,
    }))
  },

  toggleScenarioMode: () => {
    set((state) => ({
      ...state,
      isScenarioMode: !state.isScenarioMode,
    }))
  },

  updateScenario: (scenario: RendererConfigV2) => {
    set((state) => ({
      ...state,
      currentScenario: scenario,
    }))
  },

  addScenarioUpdateListener: (listener: ScenarioUpdateListener) => {
    if (!scenarioManager) {
      throw new Error('ScenarioManager not initialized. Call initializeScenario() first.')
    }
    return scenarioManager.addUpdateListener(listener)
  },
})
