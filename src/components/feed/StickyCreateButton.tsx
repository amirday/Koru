/**
 * StickyCreateButton - Fixed bottom create button
 * Features: Positioned above tab bar, warm styling, call-to-action
 */

export interface StickyCreateButtonProps {
  /** Click handler */
  onClick: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Sticky create button that floats above the tab bar
 */
export function StickyCreateButton({
  onClick,
  className = '',
}: StickyCreateButtonProps) {
  return (
    <div
      className={`
        fixed left-0 right-0 bottom-20 z-30
        px-4 pb-2
        pointer-events-none
        ${className}
      `}
    >
      <div className="max-w-screen-sm mx-auto">
        <button
          onClick={onClick}
          className="
            pointer-events-auto
            w-full
            bg-white
            border-l-4 border-l-peach-500
            border border-warm-200
            rounded-xl
            shadow-lg
            px-4 py-3
            flex items-center gap-3
            transition-all duration-200
            hover:shadow-xl hover:scale-[1.01]
            active:scale-[0.99]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-500 focus-visible:ring-offset-2
          "
        >
          {/* Plus icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-peach-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-peach-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 text-left">
            <span className="font-serif font-semibold text-calm-900">
              Create your own ritual
            </span>
            <p className="text-sm text-calm-600">
              Personalized meditation just for you
            </p>
          </div>

          {/* Arrow */}
          <svg
            className="flex-shrink-0 w-5 h-5 text-calm-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
