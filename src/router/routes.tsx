/**
 * Route definitions for Koru app
 */

import { Navigate, RouteObject } from 'react-router-dom'
import { RequireOnboarding } from './RequireOnboarding'
import { AppLayout } from './AppLayout'
import { WelcomeScreen } from '@/screens/Onboarding/WelcomeScreen'
import { InitialGoalSetupScreen } from '@/screens/Onboarding/InitialGoalSetupScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { PlaceholderScreen } from '@/screens/PlaceholderScreen'

/**
 * App route configuration
 */
export const routes: RouteObject[] = [
  // Onboarding routes (no guard)
  {
    path: '/welcome',
    element: <WelcomeScreen />,
  },
  {
    path: '/setup',
    element: <InitialGoalSetupScreen />,
  },

  // Main app routes (require onboarding)
  {
    element: (
      <RequireOnboarding>
        <AppLayout />
      </RequireOnboarding>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/home',
        element: <HomeScreen />,
      },
      {
        path: '/rituals',
        element: (
          <PlaceholderScreen
            title="Rituals"
            phase="2"
            description="Browse and manage your meditation ritual library"
          />
        ),
      },
      {
        path: '/dashboard',
        element: (
          <PlaceholderScreen
            title="Dashboard"
            phase="2"
            description="Track your meditation practice and insights"
          />
        ),
      },
      {
        path: '/profile',
        element: (
          <PlaceholderScreen
            title="Profile"
            phase="2"
            description="Manage your preferences and settings"
          />
        ),
      },
    ],
  },

  // Catch-all: redirect to home
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]
