/**
 * useLocalStorage hook
 * Syncs React state with localStorage using JSON serialization
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for syncing state with localStorage
 * @param key - Storage key (will be prefixed with 'koru:')
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  const prefixedKey = key.startsWith('koru:') ? key : `koru:${key}`

  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.error(`[useLocalStorage] Error loading ${prefixedKey}:`, error)
      return defaultValue
    }
  })

  /**
   * Update both state and localStorage
   */
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        window.localStorage.setItem(prefixedKey, JSON.stringify(value))
      } catch (error) {
        console.error(`[useLocalStorage] Error saving ${prefixedKey}:`, error)
      }
    },
    [prefixedKey]
  )

  /**
   * Remove value from localStorage and reset to default
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(prefixedKey)
      setStoredValue(defaultValue)
    } catch (error) {
      console.error(`[useLocalStorage] Error removing ${prefixedKey}:`, error)
    }
  }, [prefixedKey, defaultValue])

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === prefixedKey && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T)
        } catch (error) {
          console.error(`[useLocalStorage] Error parsing storage event:`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [prefixedKey])

  return [storedValue, setValue, removeValue]
}
