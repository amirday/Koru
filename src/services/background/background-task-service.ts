/**
 * Background task service
 * Manages async tasks that can run while user navigates the app
 */

import type { BackgroundTask, BackgroundTaskManager } from '@/types'
import { Timestamp } from '@/types'

class BackgroundTaskService implements BackgroundTaskManager {
  private tasks = new Map<string, BackgroundTask>()
  private controllers = new Map<string, AbortController>()

  /**
   * Create and run a background task
   */
  async run<T>(type: string, work: () => Promise<T>): Promise<string> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const controller = new AbortController()

    const task: BackgroundTask = {
      id: taskId,
      type,
      status: 'pending',
      progress: 0,
      createdAt: Timestamp.now(),
    }

    this.tasks.set(taskId, task)
    this.controllers.set(taskId, controller)

    // Run task in background (don't await)
    this.executeTask(taskId, work, controller.signal).catch((error) => {
      console.error(`[BackgroundTask] Task ${taskId} failed:`, error)
    })

    return taskId
  }

  /**
   * Get task by ID
   */
  async getTask(taskId: string): Promise<BackgroundTask | null> {
    return this.tasks.get(taskId) ?? null
  }

  /**
   * Cancel a running task
   */
  async cancel(taskId: string): Promise<void> {
    const controller = this.controllers.get(taskId)
    if (controller) {
      controller.abort()
      this.controllers.delete(taskId)
    }

    const task = this.tasks.get(taskId)
    if (task && task.status === 'running') {
      task.status = 'failed'
      task.error = 'Task cancelled by user'
      task.completedAt = Timestamp.now()
    }
  }

  /**
   * Execute task and update status
   */
  private async executeTask<T>(
    taskId: string,
    work: () => Promise<T>,
    signal: AbortSignal
  ): Promise<void> {
    const task = this.tasks.get(taskId)
    if (!task) return

    try {
      // Update to running
      task.status = 'running'
      task.progress = 0

      // Execute work
      await work()

      // Check if cancelled
      if (signal.aborted) {
        task.status = 'failed'
        task.error = 'Task cancelled'
      } else {
        task.status = 'completed'
        task.progress = 100
      }

      task.completedAt = Timestamp.now()
    } catch (error) {
      task.status = 'failed'
      task.error = error instanceof Error ? error.message : 'Unknown error'
      task.completedAt = Timestamp.now()
    } finally {
      this.controllers.delete(taskId)
    }
  }

  /**
   * Update task progress (can be called by work function)
   */
  updateProgress(taskId: string, progress: number): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.progress = Math.min(100, Math.max(0, progress))
    }
  }

  /**
   * Clear completed tasks older than specified time
   */
  clearOldTasks(olderThanMs: number = 60000): void {
    const now = Date.now()
    const oldTasks: string[] = []

    this.tasks.forEach((task, taskId) => {
      if (
        task.status === 'completed' ||
        task.status === 'failed'
      ) {
        const createdTime = Timestamp.parse(task.createdAt).getTime()
        if (now - createdTime > olderThanMs) {
          oldTasks.push(taskId)
        }
      }
    })

    oldTasks.forEach((taskId) => {
      this.tasks.delete(taskId)
      this.controllers.delete(taskId)
    })
  }
}

/**
 * Global background task service instance
 */
export const backgroundTaskService = new BackgroundTaskService()
