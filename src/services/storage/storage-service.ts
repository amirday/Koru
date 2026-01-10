/**
 * Storage service singleton
 * Provides app-wide access to storage adapter
 */

import { LocalStorageAdapter } from './LocalStorageAdapter'
import type { StorageAdapter } from '@/types'

/**
 * Global storage instance
 * Can be swapped to IndexedDB or cloud storage later
 */
export const storageService: StorageAdapter = new LocalStorageAdapter()
