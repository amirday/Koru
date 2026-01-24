/**
 * Route definitions for Koru app
 */

import { Navigate, RouteObject } from 'react-router-dom'
import { RequireOnboarding } from './RequireOnboarding'
import { AppLayout } from './AppLayout'
import { WelcomeScreen } from '@/screens/Onboarding/WelcomeScreen'
import { InitialGoalSetupScreen } from '@/screens/Onboarding/InitialGoalSetupScreen'
import { FeedScreen } from '@/screens/Feed'
import { RitualLibraryScreen, RitualEditorScreen } from '@/screens/Rituals'
import { SessionScreen, ReflectionScreen } from '@/screens/Session'
import { DashboardScreen, SessionDetailScreen } from '@/screens/Dashboard'
import { ProfileScreen } from '@/screens/Profile'
import {
  RitualGenerationScreen,
  GenerationProgressScreen,
  GenerationCompleteScreen,
} from '@/screens/Generation'

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

  // Fullscreen routes (require onboarding, no nav)
  {
    path: '/session/:id',
    element: (
      <RequireOnboarding>
        <SessionScreen />
      </RequireOnboarding>
    ),
  },
  {
    path: '/reflection/:sessionId',
    element: (
      <RequireOnboarding>
        <ReflectionScreen />
      </RequireOnboarding>
    ),
  },
  {
    path: '/generate/progress',
    element: (
      <RequireOnboarding>
        <GenerationProgressScreen />
      </RequireOnboarding>
    ),
  },
  {
    path: '/generate/complete/:id',
    element: (
      <RequireOnboarding>
        <GenerationCompleteScreen />
      </RequireOnboarding>
    ),
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
        element: <Navigate to="/feed" replace />,
      },
      {
        path: '/home',
        element: <Navigate to="/feed" replace />,
      },
      {
        path: '/feed',
        element: <FeedScreen />,
      },
      {
        path: '/generate',
        element: <RitualGenerationScreen />,
      },
      {
        path: '/rituals',
        element: <RitualLibraryScreen />,
      },
      {
        path: '/rituals/new',
        element: <RitualEditorScreen />,
      },
      {
        path: '/rituals/:id/edit',
        element: <RitualEditorScreen />,
      },
      {
        path: '/dashboard',
        element: <DashboardScreen />,
      },
      {
        path: '/session-detail/:sessionId',
        element: <SessionDetailScreen />,
      },
      {
        path: '/profile',
        element: <ProfileScreen />,
      },
    ],
  },

  // Catch-all: redirect to feed
  {
    path: '*',
    element: <Navigate to="/feed" replace />,
  },
]
