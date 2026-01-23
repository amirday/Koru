/**
 * AudioCache - IndexedDB caching for generated audio
 * Caches audio blobs with cache invalidation based on content changes
 */

/**
 * Cache entry metadata
 */
export interface AudioCacheEntry {
  /** Cache key */
  key: string
  /** Audio blob */
  audioBlob: Blob
  /** Duration in seconds */
  durationSeconds: number
  /** When this entry was created */
  createdAt: string
  /** Hash of the content used to generate this audio (for invalidation) */
  contentHash: string
}

/**
 * AudioCache - Manages audio caching in IndexedDB
 */
export class AudioCache {
  private dbName: string
  private storeName: string
  private db: IDBDatabase | null = null

  constructor(options?: { dbName?: string; storeName?: string }) {
    this.dbName = options?.dbName ?? 'koru-audio-cache'
    this.storeName = options?.storeName ?? 'audio'
  }

  /**
   * Initialize the database
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => {
        reject(new Error('Failed to open audio cache database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }

  /**
   * Generate cache key for a ritual section
   */
  static getCacheKey(ritualId: string, sectionId: string): string {
    return `koru:audio:${ritualId}:${sectionId}`
  }

  /**
   * Generate content hash for cache invalidation
   * Simple hash based on text content
   */
  static hashContent(content: string): string {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }

  /**
   * Get cached audio entry
   * @param key Cache key
   * @param contentHash Optional content hash to validate against
   * @returns Cached entry if found and valid, null otherwise
   */
  async get(key: string, contentHash?: string): Promise<AudioCacheEntry | null> {
    try {
      const db = await this.initDB()

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.get(key)

        request.onerror = () => reject(new Error('Failed to get cached audio'))
        request.onsuccess = () => {
          const entry = request.result as AudioCacheEntry | undefined

          // Check if entry exists and content hash matches (if provided)
          if (entry && (!contentHash || entry.contentHash === contentHash)) {
            resolve(entry)
          } else {
            resolve(null)
          }
        }
      })
    } catch {
      console.warn('Failed to access audio cache')
      return null
    }
  }

  /**
   * Store audio in cache
   */
  async set(
    key: string,
    audioBlob: Blob,
    durationSeconds: number,
    contentHash: string
  ): Promise<void> {
    try {
      const db = await this.initDB()

      const entry: AudioCacheEntry = {
        key,
        audioBlob,
        durationSeconds,
        createdAt: new Date().toISOString(),
        contentHash,
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.put(entry)

        request.onerror = () => reject(new Error('Failed to cache audio'))
        request.onsuccess = () => resolve()
      })
    } catch {
      console.warn('Failed to cache audio')
    }
  }

  /**
   * Delete a cached entry
   */
  async delete(key: string): Promise<void> {
    try {
      const db = await this.initDB()

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(key)

        request.onerror = () => reject(new Error('Failed to delete cached audio'))
        request.onsuccess = () => resolve()
      })
    } catch {
      console.warn('Failed to delete cached audio')
    }
  }

  /**
   * Clear all cached audio
   */
  async clear(): Promise<void> {
    try {
      const db = await this.initDB()

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.clear()

        request.onerror = () => reject(new Error('Failed to clear audio cache'))
        request.onsuccess = () => resolve()
      })
    } catch {
      console.warn('Failed to clear audio cache')
    }
  }

  /**
   * Get all cache keys (for debugging)
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const db = await this.initDB()

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.getAllKeys()

        request.onerror = () => reject(new Error('Failed to get cache keys'))
        request.onsuccess = () => resolve(request.result as string[])
      })
    } catch {
      console.warn('Failed to get cache keys')
      return []
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Default singleton instance
export const audioCache = new AudioCache()
