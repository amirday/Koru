/**
 * RequireOnboarding - Navigation guard
 * Redirects to /welcome if onboarding is not complete
 */

import { Navigate } from 'react-router-dom'
import { useApp } from '@/contexts'

export interface RequireOnboardingProps {
  children: React.ReactNode
}

/**
 * Navigation guard that requires onboarding to be complete
 */
export function RequireOnboarding({ children }: RequireOnboardingProps) {
  const { hasCompletedOnboarding, isLoading } = useApp()

  // Wait for context to load
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <p className="text-calm-700 font-sans">Loading...</p>
      </div>
    )
  }

  // Redirect to welcome if onboarding not complete
  if (!hasCompletedOnboarding) {
    return <Navigate to="/welcome" replace />
  }

  // Render protected content
  return <>{children}</>
}
