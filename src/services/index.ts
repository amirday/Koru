/**
 * Central export point for all services
 * Import from '@/services' to access service instances
 */

// Storage
export { storageService } from './storage/storage-service'
export { LocalStorageAdapter } from './storage/LocalStorageAdapter'

// AI
export { aiService } from './ai/ai-service'
export { MockAIProvider } from './ai/MockAIProvider'

// Background tasks
export { backgroundTaskService } from './background/background-task-service'

// Notifications
export { notificationService } from './notification/notification-service'
export type {
  NotificationOptions,
  NotificationPermission,
  NotificationService,
} from './notification/notification-service'
