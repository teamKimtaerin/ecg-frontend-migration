import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProgressTask {
  id: number
  filename: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  completedAt?: string
  type: 'upload' | 'export'
  currentStage?: string
  estimatedTimeRemaining?: number
  isTimeout?: boolean
}

interface ProgressStore {
  tasks: ProgressTask[]

  // Task management
  addTask: (task: Omit<ProgressTask, 'id'>) => number
  updateTask: (id: number, updates: Partial<ProgressTask>) => void
  removeTask: (id: number) => void
  clearCompletedTasks: () => void
  cleanupStaleTasks: () => void

  // Task queries
  getTasksByType: (type: 'upload' | 'export') => ProgressTask[]
  getActiveUploadTasks: () => ProgressTask[]
  getActiveExportTasks: () => ProgressTask[]
  getAllActiveTasks: () => ProgressTask[]
  getCompletedTasks: () => ProgressTask[]
  getTask: (id: number) => ProgressTask | undefined
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        const id = Date.now() + Math.random()
        const newTask: ProgressTask = { ...task, id }
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))
        return id
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  // Auto-set completedAt when status changes to completed or failed
                  completedAt:
                    (updates.status === 'completed' || updates.status === 'failed') && !task.completedAt
                      ? new Date().toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : task.completedAt
                }
              : task
          )
        }))
      },

      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }))
      },

      clearCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) =>
            task.status !== 'completed' && task.status !== 'failed'
          )
        }))
      },

      cleanupStaleTasks: () => {
        const now = Date.now()
        const maxAge = 24 * 60 * 60 * 1000 // 24시간

        set((state) => ({
          tasks: state.tasks.filter((task) => {
            // 완료/실패한 작업은 항상 유지
            if (task.status === 'completed' || task.status === 'failed') {
              return true
            }

            // 진행 중 작업은 24시간 이내만 유지
            if (task.status === 'uploading' || task.status === 'processing') {
              return (now - task.id) < maxAge
            }

            return true
          })
        }))
      },

      getTasksByType: (type) => {
        return get().tasks.filter((task) => task.type === type)
      },

      getActiveUploadTasks: () => {
        return get().tasks.filter((task) =>
          task.type === 'upload' &&
          (task.status === 'uploading' || task.status === 'processing')
        )
      },

      getActiveExportTasks: () => {
        return get().tasks.filter((task) =>
          task.type === 'export' &&
          (task.status === 'uploading' || task.status === 'processing')
        )
      },

      getAllActiveTasks: () => {
        return get().tasks.filter((task) =>
          task.status === 'uploading' || task.status === 'processing'
        )
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) =>
          task.status === 'completed' || task.status === 'failed'
        )
      },

      getTask: (id) => {
        return get().tasks.find((task) => task.id === id)
      },

      // 2분 이상 진행 중인 작업을 완료로 처리
      expireOldTasks: () => {
        const now = Date.now()
        const timeout = 2 * 60 * 1000 // 2분 (120초)

        set((state) => ({
          tasks: state.tasks.map((task) => {
            // 진행 중 작업이고 2분 이상 경과한 경우
            if (
              (task.status === 'uploading' || task.status === 'processing') &&
              (now - task.id) > timeout
            ) {
              return {
                ...task,
                status: 'failed' as const,
                progress: 100,
                isTimeout: true,
                completedAt: task.completedAt || new Date().toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }
            }
            return task
          })
        }))
      }
    }),
    {
      name: 'ecg-progress-store',
      // Persist completed/failed tasks permanently, and active tasks for 24 hours
      partialize: (state) => {
        const now = Date.now()
        const maxAge = 24 * 60 * 60 * 1000 // 24시간

        return {
          tasks: state.tasks.filter((task) => {
            // 완료/실패한 작업은 항상 유지
            if (task.status === 'completed' || task.status === 'failed') {
              return true
            }

            // 진행 중 작업은 24시간 이내만 유지 (오래된 stale 작업 방지)
            if (task.status === 'uploading' || task.status === 'processing') {
              return (now - task.id) < maxAge
            }

            return false
          })
        }
      },
      // 스토어 복원 후 오래된 작업 자동 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.cleanupStaleTasks()
        }
      }
    }
  )
)