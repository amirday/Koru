/**
 * Router configuration and exports
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

/**
 * Configured browser router
 */
export const router = createBrowserRouter(routes)

/**
 * Router provider component
 */
export function Router() {
  return <RouterProvider router={router} />
}

// Re-export components for convenience
export { RequireOnboarding } from './RequireOnboarding'
export { AppLayout } from './AppLayout'
