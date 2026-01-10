/**
 * LocalStorage implementation of StorageAdapter
 * Provides async API over synchronous localStorage with JSON serialization
 */

import type { StorageAdapter } from '@/types'

export class LocalStorageAdapter implements StorageAdapter {
  private readonly namespace = 'koru:'

  /**
   * Get namespaced key
   */
  private getKey(key: string): string {
    return key.startsWith(this.namespace) ? key : `${this.namespace}${key}`
  }

  /**
   * Get value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const namespacedKey = this.getKey(key)
      const value = localStorage.getItem(namespacedKey)
      if (value === null) {
        return null
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error getting key "${key}":`, error)
      return null
    }
  }

  /**
   * Set value by key
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const namespacedKey = this.getKey(key)
      const serialized = JSON.stringify(value)
      localStorage.setItem(namespacedKey, serialized)
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error setting key "${key}":`, error)
      throw error
    }
  }

  /**
   * Remove value by key
   */
  async remove(key: string): Promise<void> {
    try {
      const namespacedKey = this.getKey(key)
      localStorage.removeItem(namespacedKey)
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error removing key "${key}":`, error)
      throw error
    }
  }

  /**
   * Clear all namespaced keys
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.keys()
      keys.forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('[LocalStorageAdapter] Error clearing storage:', error)
      throw error
    }
  }

  /**
   * Get all keys matching prefix
   */
  async keys(prefix?: string): Promise<string[]> {
    try {
      const searchPrefix = prefix
        ? this.getKey(prefix)
        : this.namespace

      const allKeys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(searchPrefix)) {
          allKeys.push(key)
        }
      }
      return allKeys
    } catch (error) {
      console.error('[LocalStorageAdapter] Error getting keys:', error)
      return []
    }
  }
}
