/**
 * BottomTabBar component - Layout primitive
 * Features: 4 tabs with icons, active state, safe area inset
 */

import React from 'react'
import type { TabRoute } from '@/types'

export interface BottomTabBarProps {
  /** Currently active tab */
  activeTab: TabRoute
  /** Tab click handler */
  onTabClick: (tab: TabRoute) => void
  /** Whether to show the tab bar (default: true) */
  show?: boolean
}

// Simple SVG icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

interface TabConfig {
  route: TabRoute
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: TabConfig[] = [
  { route: 'feed', label: 'Feed', icon: HomeIcon },
  { route: 'rituals', label: 'Rituals', icon: BookIcon },
  { route: 'dashboard', label: 'Dashboard', icon: ChartIcon },
  { route: 'profile', label: 'Profile', icon: UserIcon },
]

/**
 * Bottom navigation tab bar with 4 tabs
 */
export function BottomTabBar({
  activeTab,
  onTabClick,
  show = true,
}: BottomTabBarProps) {
  if (!show) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-warm-50 border-t border-calm-200 safe-bottom z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-sm mx-auto flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.route

          return (
            <button
              key={tab.route}
              onClick={() => onTabClick(tab.route)}
              className={`
                flex flex-col items-center justify-center
                py-2 px-3 flex-1 min-w-0
                transition-colors duration-200
                ${isActive ? 'text-peach-500' : 'text-calm-500 hover:text-calm-700'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium truncate">
                {tab.label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-peach-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
