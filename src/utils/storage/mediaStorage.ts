/**
 * IndexedDB 기반 미디어 저장 시스템
 */

import { getTimestamp } from '@/utils/logger'

const DB_NAME = 'ECGMediaStorage'
const DB_VERSION = 3 // Version bump to fix missing stores
const MEDIA_STORE = 'media'
const PROJECT_MEDIA_STORE = 'projectMedia'
// New project data stores
const PROJECTS_STORE = 'projects'
const PROJECT_HISTORY_STORE = 'projectHistory'

export interface MediaFile {
  id: string
  projectId: string
  fileName: string
  fileType: string
  fileSize: number
  blob: Blob
  duration?: number
  videoCodec?: string
  audioCodec?: string
  videoSize?: string
  frameRate?: number
  createdAt: Date
  lastAccessed: Date
}

export interface ProjectMediaInfo {
  projectId: string
  mediaId: string
  mediaUrl?: string // Blob URL for current session
  fileName: string
  fileType: string
  fileSize: number
  duration?: number
  metadata?: {
    videoCodec?: string
    audioCodec?: string
    videoSize?: string
    frameRate?: number
  }
}

class MediaStorage {
  private db: IDBDatabase | null = null
  private blobUrls: Map<string, string> = new Map()
  private initializationPromise: Promise<void> | null = null
  private initializationAttempts = 0
  private maxInitializationAttempts = 3
  private isIndexedDBSupported = true

  /**
   * IndexedDB 초기화 (에러 처리 및 재시도 로직 포함)
   */
  async initialize(): Promise<void> {
    // 이미 초기화 중이라면 해당 Promise 반환
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    // IndexedDB 지원 여부 확인
    if (!('indexedDB' in window)) {
      console.warn(
        `[${getTimestamp()}] mediaStorage.ts IndexedDB not supported in this browser`
      )
      this.isIndexedDBSupported = false
      return Promise.resolve()
    }

    this.initializationPromise = this.performInitialization()
    return this.initializationPromise
  }

  private async performInitialization(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.initializationAttempts++
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      const timeoutId = setTimeout(() => {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts IndexedDB initialization timeout (attempt ${this.initializationAttempts})`
        )
        reject(new Error('IndexedDB initialization timeout'))
      }, 10000) // 10초 타임아웃

      request.onerror = () => {
        clearTimeout(timeoutId)
        const error = request.error?.message || 'Unknown IndexedDB error'
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Failed to open IndexedDB (attempt ${this.initializationAttempts}): ${error}`
        )

        if (this.initializationAttempts < this.maxInitializationAttempts) {
          console.log(
            `[${getTimestamp()}] mediaStorage.ts Retrying IndexedDB initialization in 2 seconds...`
          )
          setTimeout(() => {
            this.initializationPromise = null
            this.performInitialization().then(resolve).catch(reject)
          }, 2000)
        } else {
          this.isIndexedDBSupported = false
          console.error(
            `[${getTimestamp()}] mediaStorage.ts IndexedDB initialization failed after ${this.maxInitializationAttempts} attempts. Falling back to memory storage.`
          )
          reject(
            new Error(
              `IndexedDB initialization failed after ${this.maxInitializationAttempts} attempts`
            )
          )
        }
      }

      request.onsuccess = () => {
        clearTimeout(timeoutId)
        this.db = request.result

        // 데이터베이스 에러 핸들러 등록
        this.db.onerror = (event) => {
          console.error(
            `[${getTimestamp()}] mediaStorage.ts IndexedDB database error:`,
            event
          )
        }

        // 버전 변경 처리
        this.db.onversionchange = () => {
          console.warn(
            `[${getTimestamp()}] mediaStorage.ts IndexedDB version change detected. Closing connection.`
          )
          this.db?.close()
          this.db = null
          this.initializationPromise = null
        }

        console.log(
          `[${getTimestamp()}] mediaStorage.ts IndexedDB initialized successfully (attempt ${this.initializationAttempts})`
        )
        this.initializationAttempts = 0 // Reset attempts on success
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 미디어 파일 저장소
        if (!db.objectStoreNames.contains(MEDIA_STORE)) {
          const mediaStore = db.createObjectStore(MEDIA_STORE, {
            keyPath: 'id',
          })
          mediaStore.createIndex('projectId', 'projectId', { unique: false })
          mediaStore.createIndex('fileName', 'fileName', { unique: false })
        }

        // 프로젝트-미디어 연결 정보 저장소
        if (!db.objectStoreNames.contains(PROJECT_MEDIA_STORE)) {
          db.createObjectStore(PROJECT_MEDIA_STORE, {
            keyPath: 'projectId',
          })
        }

        // 프로젝트 데이터 저장소
        if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
          const projectsStore = db.createObjectStore(PROJECTS_STORE, {
            keyPath: 'id',
          })
          projectsStore.createIndex('name', 'name', { unique: false })
          projectsStore.createIndex('updatedAt', 'updatedAt', { unique: false })
          projectsStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // 프로젝트 히스토리 저장소 (undo/redo)
        if (!db.objectStoreNames.contains(PROJECT_HISTORY_STORE)) {
          const historyStore = db.createObjectStore(PROJECT_HISTORY_STORE, {
            keyPath: ['projectId', 'timestamp'],
          })
          historyStore.createIndex('projectId', 'projectId', { unique: false })
          historyStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        console.log(
          `[${getTimestamp()}] mediaStorage.ts Database schema created/updated`
        )
      }
    })
  }

  /**
   * IndexedDB 지원 여부 확인
   */
  private isIndexedDBAvailable(): boolean {
    return this.isIndexedDBSupported && this.db !== null
  }

  /**
   * 비디오 파일 저장 (폴백 지원)
   */
  async saveMedia(
    projectId: string,
    file: File,
    metadata?: Partial<MediaFile>
  ): Promise<string> {
    try {
      if (!this.db && this.isIndexedDBSupported) {
        await this.initialize()
      }
    } catch (error) {
      console.warn(
        `[${getTimestamp()}] mediaStorage.ts IndexedDB initialization failed, using fallback storage`
      )
    }

    // IndexedDB가 사용 불가능한 경우 폴백 방식
    if (!this.isIndexedDBAvailable()) {
      return this.saveFallback(projectId, file, metadata)
    }

    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

    const mediaFile: MediaFile = {
      id: mediaId,
      projectId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      blob: file,
      createdAt: new Date(),
      lastAccessed: new Date(),
      ...metadata,
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([MEDIA_STORE], 'readwrite')
        const store = transaction.objectStore(MEDIA_STORE)
        const request = store.add(mediaFile)

        request.onsuccess = () => {
          console.log(
            `[${getTimestamp()}] mediaStorage.ts Media saved: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
          )
          resolve(mediaId)
        }

        request.onerror = () => {
          const error = request.error?.message || 'Unknown error'
          console.error(
            `[${getTimestamp()}] mediaStorage.ts Failed to save media: ${error}`
          )
          reject(new Error(`Failed to save media: ${error}`))
        }

        transaction.onerror = () => {
          const error = transaction.error?.message || 'Transaction failed'
          console.error(
            `[${getTimestamp()}] mediaStorage.ts Transaction error while saving media: ${error}`
          )
          reject(new Error(`Transaction error: ${error}`))
        }
      } catch (error) {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Exception while saving media:`,
          error
        )
        reject(error)
      }
    })
  }

  /**
   * 폴백 저장 방식 (sessionStorage + Blob URL)
   */
  private async saveFallback(
    projectId: string,
    file: File,
    metadata?: Partial<MediaFile>
  ): Promise<string> {
    const mediaId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

    try {
      // Blob URL 생성 및 캐싱
      const blobUrl = URL.createObjectURL(file)
      this.blobUrls.set(mediaId, blobUrl)

      // 메타데이터만 sessionStorage에 저장
      const mediaInfo = {
        id: mediaId,
        projectId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        ...metadata,
      }

      sessionStorage.setItem(`media_${mediaId}`, JSON.stringify(mediaInfo))

      console.log(
        `[${getTimestamp()}] mediaStorage.ts Media saved to fallback storage: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      )

      return mediaId
    } catch (error) {
      console.error(
        `[${getTimestamp()}] mediaStorage.ts Failed to save media to fallback storage:`,
        error
      )
      throw error
    }
  }

  /**
   * 폴백 로드 방식
   */
  private async loadFallback(mediaId: string): Promise<MediaFile | null> {
    try {
      const mediaInfoStr = sessionStorage.getItem(`media_${mediaId}`)
      if (!mediaInfoStr) return null

      const mediaInfo = JSON.parse(mediaInfoStr)

      // Blob URL이 이미 있는 경우
      if (this.blobUrls.has(mediaId)) {
        return {
          ...mediaInfo,
          blob: null, // 실제 Blob은 Blob URL로 대체
          createdAt: new Date(mediaInfo.createdAt),
          lastAccessed: new Date(mediaInfo.lastAccessed),
        }
      }

      return null
    } catch (error) {
      console.error(
        `[${getTimestamp()}] mediaStorage.ts Failed to load media from fallback storage:`,
        error
      )
      return null
    }
  }

  /**
   * 비디오 파일 로드 (폴백 지원)
   */
  async loadMedia(mediaId: string): Promise<MediaFile | null> {
    try {
      if (!this.db && this.isIndexedDBSupported) {
        await this.initialize()
      }
    } catch (error) {
      console.warn(
        `[${getTimestamp()}] mediaStorage.ts IndexedDB initialization failed, using fallback storage`
      )
    }

    // IndexedDB가 사용 불가능한 경우 폴백 방식
    if (!this.isIndexedDBAvailable()) {
      return this.loadFallback(mediaId)
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([MEDIA_STORE], 'readonly')
        const store = transaction.objectStore(MEDIA_STORE)
        const request = store.get(mediaId)

        request.onsuccess = () => {
          const media = request.result
          if (media) {
            // Update last accessed time (fire and forget)
            this.updateLastAccessed(mediaId).catch((error) => {
              console.warn(
                `[${getTimestamp()}] mediaStorage.ts Failed to update last accessed time:`,
                error
              )
            })
            console.log(
              `[${getTimestamp()}] mediaStorage.ts Media loaded: ${media.fileName}`
            )
            resolve(media)
          } else {
            resolve(null)
          }
        }

        request.onerror = () => {
          const error = request.error?.message || 'Unknown error'
          console.error(
            `[${getTimestamp()}] mediaStorage.ts Failed to load media: ${error}`
          )
          reject(new Error(`Failed to load media: ${error}`))
        }

        transaction.onerror = () => {
          const error = transaction.error?.message || 'Transaction failed'
          console.error(
            `[${getTimestamp()}] mediaStorage.ts Transaction error while loading media: ${error}`
          )
          reject(new Error(`Transaction error: ${error}`))
        }
      } catch (error) {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Exception while loading media:`,
          error
        )
        reject(error)
      }
    })
  }

  /**
   * 프로젝트의 미디어 정보 저장
   */
  async saveProjectMedia(projectMediaInfo: ProjectMediaInfo): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [PROJECT_MEDIA_STORE],
        'readwrite'
      )
      const store = transaction.objectStore(PROJECT_MEDIA_STORE)
      const request = store.put(projectMediaInfo)

      request.onsuccess = () => {
        console.log(
          `[${getTimestamp()}] mediaStorage.ts Project media info saved for: ${projectMediaInfo.projectId}`
        )
        resolve()
      }

      request.onerror = () => {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Failed to save project media info`
        )
        reject(new Error('Failed to save project media info'))
      }
    })
  }

  /**
   * 프로젝트의 미디어 정보 로드
   */
  async loadProjectMedia(projectId: string): Promise<ProjectMediaInfo | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [PROJECT_MEDIA_STORE],
        'readonly'
      )
      const store = transaction.objectStore(PROJECT_MEDIA_STORE)
      const request = store.get(projectId)

      request.onsuccess = () => {
        const projectMedia = request.result
        if (projectMedia) {
          console.log(
            `[${getTimestamp()}] mediaStorage.ts Project media info loaded for: ${projectId}`
          )
        }
        resolve(projectMedia || null)
      }

      request.onerror = () => {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Failed to load project media info`
        )
        reject(new Error('Failed to load project media info'))
      }
    })
  }

  /**
   * Blob URL 생성 및 캐싱
   */
  async createBlobUrl(mediaId: string): Promise<string | null> {
    // 이미 생성된 URL이 있으면 반환
    if (this.blobUrls.has(mediaId)) {
      return this.blobUrls.get(mediaId)!
    }

    const media = await this.loadMedia(mediaId)
    if (!media) return null

    const blobUrl = URL.createObjectURL(media.blob)
    this.blobUrls.set(mediaId, blobUrl)

    console.log(
      `[${getTimestamp()}] mediaStorage.ts Blob URL created for: ${media.fileName}`
    )

    return blobUrl
  }

  /**
   * Blob URL 해제
   */
  revokeBlobUrl(mediaId: string): void {
    const url = this.blobUrls.get(mediaId)
    if (url) {
      URL.revokeObjectURL(url)
      this.blobUrls.delete(mediaId)
      console.log(
        `[${getTimestamp()}] mediaStorage.ts Blob URL revoked for media: ${mediaId}`
      )
    }
  }

  /**
   * 모든 Blob URL 해제
   */
  revokeAllBlobUrls(): void {
    this.blobUrls.forEach((url, mediaId) => {
      URL.revokeObjectURL(url)
      console.log(
        `[${getTimestamp()}] mediaStorage.ts Blob URL revoked for media: ${mediaId}`
      )
    })
    this.blobUrls.clear()
  }

  /**
   * 마지막 접근 시간 업데이트
   */
  private async updateLastAccessed(mediaId: string): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction([MEDIA_STORE], 'readwrite')
    const store = transaction.objectStore(MEDIA_STORE)
    const request = store.get(mediaId)

    request.onsuccess = () => {
      const media = request.result
      if (media) {
        media.lastAccessed = new Date()
        store.put(media)
      }
    }
  }

  /**
   * 프로젝트의 모든 미디어 삭제
   */
  async deleteProjectMedia(projectId: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [MEDIA_STORE, PROJECT_MEDIA_STORE],
        'readwrite'
      )

      // Delete all media files for the project
      const mediaStore = transaction.objectStore(MEDIA_STORE)
      const index = mediaStore.index('projectId')
      const request = index.openCursor(IDBKeyRange.only(projectId))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const mediaId = cursor.value.id
          // Revoke blob URL if exists
          this.revokeBlobUrl(mediaId)
          cursor.delete()
          cursor.continue()
        }
      }

      // Delete project media info
      const projectMediaStore = transaction.objectStore(PROJECT_MEDIA_STORE)
      projectMediaStore.delete(projectId)

      transaction.oncomplete = () => {
        console.log(
          `[${getTimestamp()}] mediaStorage.ts All media deleted for project: ${projectId}`
        )
        resolve()
      }

      transaction.onerror = () => {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Failed to delete project media`
        )
        reject(new Error('Failed to delete project media'))
      }
    })
  }

  /**
   * 저장 용량 정보 가져오기
   */
  async getStorageInfo(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    }
    return { used: 0, quota: 0 }
  }

  /**
   * 오래된 미디어 정리 (30일 이상 접근하지 않은 파일)
   */
  async cleanupOldMedia(daysOld: number = 30): Promise<void> {
    if (!this.db) await this.initialize()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MEDIA_STORE], 'readwrite')
      const store = transaction.objectStore(MEDIA_STORE)
      const request = store.openCursor()

      let deletedCount = 0

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const media = cursor.value as MediaFile
          if (media.lastAccessed < cutoffDate) {
            this.revokeBlobUrl(media.id)
            cursor.delete()
            deletedCount++
          }
          cursor.continue()
        }
      }

      transaction.oncomplete = () => {
        console.log(
          `[${getTimestamp()}] mediaStorage.ts Cleanup completed. Deleted ${deletedCount} old media files`
        )
        resolve()
      }

      transaction.onerror = () => {
        console.error(
          `[${getTimestamp()}] mediaStorage.ts Failed to cleanup old media`
        )
        reject(new Error('Failed to cleanup old media'))
      }
    })
  }
}

// Singleton instance
export const mediaStorage = new MediaStorage()

// Cleanup blob URLs when page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    mediaStorage.revokeAllBlobUrls()
  })
}
