/**
 * useBackgroundTask hook
 * React hook wrapper for background task service
 */

import { useState, useCallback, useEffect } from 'react'
import { backgroundTaskService } from '@/services'
import type { BackgroundTask } from '@/types'

interface UseBackgroundTaskReturn {
  /** Current task (if any) */
  task: BackgroundTask | null
  /** Whether a task is running */
  isRunning: boolean
  /** Start a background task */
  runTask: <T>(type: string, work: () => Promise<T>) => Promise<string>
  /** Cancel running task */
  cancelTask: () => Promise<void>
}

/**
 * Hook for managing background tasks
 * @returns Task state and control functions
 */
export function useBackgroundTask(): UseBackgroundTaskReturn {
  const [task, setTask] = useState<BackgroundTask | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  /**
   * Poll task status
   */
  useEffect(() => {
    if (!taskId) return

    const pollInterval = setInterval(async () => {
      const currentTask = await backgroundTaskService.getTask(taskId)
      if (!currentTask) {
        setIsRunning(false)
        setTaskId(null)
        return
      }

      setTask(currentTask)

      if (currentTask.status === 'completed' || currentTask.status === 'failed') {
        setIsRunning(false)
        setTaskId(null)
        clearInterval(pollInterval)
      }
    }, 500)

    return () => clearInterval(pollInterval)
  }, [taskId])

  /**
   * Start a background task
   */
  const runTask = useCallback(async <T,>(type: string, work: () => Promise<T>): Promise<string> => {
    const id = await backgroundTaskService.run(type, work)
    setTaskId(id)
    setIsRunning(true)
    return id
  }, [])

  /**
   * Cancel running task
   */
  const cancelTask = useCallback(async () => {
    if (taskId) {
      await backgroundTaskService.cancel(taskId)
      setTaskId(null)
      setIsRunning(false)
      setTask(null)
    }
  }, [taskId])

  return {
    task,
    isRunning,
    runTask,
    cancelTask,
  }
}
