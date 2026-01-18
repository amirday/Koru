/**
 * PromptTab - Edit master prompt and view generated preview
 */

import { Button, Input } from '@/components/ui'

export interface PromptTabProps {
  /** Master prompt text */
  prompt: string
  /** Generated preview text (read-only) */
  generatedPreview?: string
  /** Update prompt callback */
  onPromptChange: (prompt: string) => void
  /** Regenerate from prompt callback */
  onRegenerate?: () => void
  /** Whether regeneration is in progress */
  isRegenerating?: boolean
}

/**
 * PromptTab - Edit the master prompt
 */
export function PromptTab({
  prompt,
  generatedPreview,
  onPromptChange,
  onRegenerate,
  isRegenerating = false,
}: PromptTabProps) {
  return (
    <div className="space-y-6">
      {/* Master prompt */}
      <div>
        <h3 className="text-sm font-semibold text-calm-800 mb-2">Master Prompt</h3>
        <p className="text-sm text-calm-600 mb-3">
          This prompt describes what you want from this ritual. The AI uses it to generate guidance text.
        </p>
        <Input
          type="textarea"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe what you want this ritual to help you achieve..."
          autoResize
          maxRows={8}
        />
      </div>

      {/* Regenerate button */}
      {onRegenerate && (
        <Button
          variant="secondary"
          onClick={onRegenerate}
          loading={isRegenerating}
          disabled={isRegenerating || !prompt.trim()}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate from Prompt'}
        </Button>
      )}

      {/* Generated preview */}
      {generatedPreview && (
        <div>
          <h3 className="text-sm font-semibold text-calm-800 mb-2">Generated Preview</h3>
          <p className="text-sm text-calm-600 mb-3">
            This is a preview of what the AI generated based on your prompt.
          </p>
          <div className="bg-warm-50 rounded-lg border border-calm-200 p-4">
            <p className="text-sm text-calm-700 whitespace-pre-wrap leading-relaxed">
              {generatedPreview}
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-peach-50 rounded-lg p-4 border border-peach-200">
        <h4 className="text-sm font-semibold text-peach-800 mb-2">Tips for better prompts</h4>
        <ul className="text-sm text-peach-700 space-y-1">
          <li>• Be specific about your goal (e.g., "reduce anxiety before presentations")</li>
          <li>• Mention preferred techniques (breathing, visualization, body scan)</li>
          <li>• Include context (time of day, how you're feeling)</li>
          <li>• Specify tone preferences (gentle encouragement, direct coaching)</li>
        </ul>
      </div>
    </div>
  )
}
