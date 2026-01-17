/**
 * AppLayout - Main app layout with bottom navigation
 * Features: Outlet for routes, BottomTabBar, conditional nav visibility
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BottomTabBar } from '@/components/layout'
import type { TabRoute } from '@/types'

/**
 * Main app layout with bottom navigation
 */
export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab from current route
  const getActiveTab = (): TabRoute => {
    const path = location.pathname
    if (path.startsWith('/home')) return 'home'
    if (path.startsWith('/rituals')) return 'rituals'
    if (path.startsWith('/dashboard')) return 'dashboard'
    if (path.startsWith('/profile')) return 'profile'
    return 'home' // default
  }

  // Determine if bottom nav should be visible
  const shouldShowBottomNav = (): boolean => {
    const path = location.pathname
    // Hide on fullscreen routes (session, reflection)
    if (path.includes('/session/') || path.includes('/reflection/')) {
      return false
    }
    // Show on main app routes
    return ['/home', '/rituals', '/dashboard', '/profile'].some((route) =>
      path.startsWith(route)
    )
  }

  const activeTab = getActiveTab()
  const showBottomNav = shouldShowBottomNav()

  const handleTabClick = (tab: TabRoute) => {
    navigate(`/${tab}`)
  }

  return (
    <>
      {/* Main content area */}
      <Outlet />

      {/* Bottom navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabClick={handleTabClick}
        show={showBottomNav}
      />
    </>
  )
}
