/**
 * Notification service
 * Handles browser notifications with permission management
 */

export type NotificationPermission = 'granted' | 'denied' | 'default'

export interface NotificationOptions {
  /** Notification title */
  title: string
  /** Notification body */
  body: string
  /** Icon URL (optional) */
  icon?: string
  /** Tag for replacing notifications (optional) */
  tag?: string
  /** Silent notification (no sound) */
  silent?: boolean
}

export interface NotificationService {
  /** Check if notifications are supported */
  isSupported(): boolean
  /** Get current permission status */
  getPermission(): NotificationPermission
  /** Request notification permission */
  requestPermission(): Promise<NotificationPermission>
  /** Show a notification (requests permission if needed) */
  notify(options: NotificationOptions): Promise<boolean>
  /** Register callback for when notifications are not available */
  onFallback(callback: (options: NotificationOptions) => void): void
}

class BrowserNotificationService implements NotificationService {
  private fallbackCallback?: (options: NotificationOptions) => void

  /**
   * Check if browser supports notifications
   */
  isSupported(): boolean {
    return 'Notification' in window
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied'
    }
    return Notification.permission as NotificationPermission
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('[NotificationService] Notifications not supported')
      return 'denied'
    }

    try {
      const permission = await Notification.requestPermission()
      return permission as NotificationPermission
    } catch (error) {
      console.error('[NotificationService] Permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Show a notification
   * If permission not granted, calls fallback callback
   */
  async notify(options: NotificationOptions): Promise<boolean> {
    if (!this.isSupported()) {
      this.triggerFallback(options)
      return false
    }

    let permission = this.getPermission()

    // Request permission if default
    if (permission === 'default') {
      permission = await this.requestPermission()
    }

    // Check permission granted
    if (permission !== 'granted') {
      this.triggerFallback(options)
      return false
    }

    try {
      // Create notification
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        tag: options.tag,
        silent: options.silent ?? false,
        requireInteraction: false,
      })

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return true
    } catch (error) {
      console.error('[NotificationService] Failed to show notification:', error)
      this.triggerFallback(options)
      return false
    }
  }

  /**
   * Register fallback callback for when notifications unavailable
   */
  onFallback(callback: (options: NotificationOptions) => void): void {
    this.fallbackCallback = callback
  }

  /**
   * Trigger fallback callback
   */
  private triggerFallback(options: NotificationOptions): void {
    if (this.fallbackCallback) {
      this.fallbackCallback(options)
    } else {
      console.log('[NotificationService] Fallback:', options.title, '-', options.body)
    }
  }
}

/**
 * Global notification service instance
 */
export const notificationService = new BrowserNotificationService()
