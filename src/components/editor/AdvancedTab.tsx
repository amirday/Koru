/**
 * AdvancedTab - Advanced ritual settings
 */

import type { Ritual } from '@/types'
import { Button, useToast } from '@/components/ui'

export interface AdvancedTabProps {
  /** Current ritual data */
  ritual: Ritual
  /** Language setting */
  language?: 'en' | 'he'
  /** Update language callback */
  onLanguageChange?: (language: 'en' | 'he') => void
}

/**
 * AdvancedTab - Advanced settings and export
 */
export function AdvancedTab({
  ritual,
  language = 'en',
  onLanguageChange,
}: AdvancedTabProps) {
  const toast = useToast()

  const handleExport = () => {
    try {
      const exportData = {
        ...ritual,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ritual.title.toLowerCase().replace(/\s+/g, '-')}-ritual.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.showToast('success', 'Ritual exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.showToast('error', 'Failed to export ritual')
    }
  }

  return (
    <div className="space-y-8">
      {/* Language */}
      <div>
        <h3 className="text-sm font-semibold text-calm-800 mb-2">Language</h3>
        <p className="text-sm text-calm-600 mb-3">
          Select the language for ritual guidance text.
        </p>
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value as 'en' | 'he')}
          disabled={!onLanguageChange}
          className="w-full px-4 py-2.5 text-base rounded-lg border border-calm-300 bg-white text-calm-900 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-peach-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="en">English</option>
          <option value="he" disabled>Hebrew (Coming soon)</option>
        </select>
      </div>

      {/* Export */}
      <div>
        <h3 className="text-sm font-semibold text-calm-800 mb-2">Export Ritual</h3>
        <p className="text-sm text-calm-600 mb-3">
          Download this ritual as a JSON file. You can use this to backup your rituals or share them.
        </p>
        <Button
          variant="secondary"
          onClick={handleExport}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export as JSON
        </Button>
      </div>

      {/* Safety Info */}
      <div className="bg-warm-50 rounded-lg p-4 border border-calm-200">
        <h3 className="text-sm font-semibold text-calm-800 mb-2">Safety Guidelines</h3>
        <ul className="text-sm text-calm-700 space-y-1">
          <li>• Rituals are designed for general wellness, not medical treatment</li>
          <li>• If you experience discomfort, stop and consult a professional</li>
          <li>• Generated content is AI-assisted and should be reviewed</li>
          <li>• Personal data is stored locally on your device</li>
        </ul>
      </div>

      {/* Ritual metadata */}
      <div>
        <h3 className="text-sm font-semibold text-calm-800 mb-2">Ritual Information</h3>
        <div className="bg-warm-50 rounded-lg p-4 border border-calm-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-calm-600">Created</span>
            <span className="text-calm-900">
              {new Date(ritual.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-calm-600">Last Modified</span>
            <span className="text-calm-900">
              {new Date(ritual.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-calm-600">ID</span>
            <span className="text-calm-900 font-mono text-xs">{ritual.id}</span>
          </div>
          {ritual.statistics && (
            <div className="flex justify-between text-sm">
              <span className="text-calm-600">Times Used</span>
              <span className="text-calm-900">{ritual.statistics.usageCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
