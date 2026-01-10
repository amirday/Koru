/**
 * useNotification hook
 * React hook wrapper for notification service
 */

import { useState, useCallback, useEffect } from 'react'
import { notificationService } from '@/services'
import type { NotificationOptions, NotificationPermission } from '@/services'

interface UseNotificationReturn {
  /** Current permission status */
  permission: NotificationPermission
  /** Whether notifications are supported */
  isSupported: boolean
  /** Request notification permission */
  requestPermission: () => Promise<NotificationPermission>
  /** Show a notification */
  notify: (options: NotificationOptions) => Promise<boolean>
  /** Register fallback for when notifications are unavailable */
  onFallback: (callback: (options: NotificationOptions) => void) => void
}

/**
 * Hook for managing browser notifications
 * @returns Notification state and control functions
 */
export function useNotification(): UseNotificationReturn {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  )
  const [isSupported] = useState(() => notificationService.isSupported())

  // Update permission when it changes
  useEffect(() => {
    if (!isSupported) return

    // Poll permission status (browsers don't have a change event for this)
    const checkPermission = () => {
      const current = notificationService.getPermission()
      if (current !== permission) {
        setPermission(current)
      }
    }

    const interval = setInterval(checkPermission, 1000)
    return () => clearInterval(interval)
  }, [isSupported, permission])

  /**
   * Request notification permission from user
   */
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const result = await notificationService.requestPermission()
    setPermission(result)
    return result
  }, [])

  /**
   * Show a notification
   */
  const notify = useCallback(
    async (options: NotificationOptions): Promise<boolean> => {
      return await notificationService.notify(options)
    },
    []
  )

  /**
   * Register fallback callback
   */
  const onFallback = useCallback((callback: (options: NotificationOptions) => void) => {
    notificationService.onFallback(callback)
  }, [])

  return {
    permission,
    isSupported,
    requestPermission,
    notify,
    onFallback,
  }
}
