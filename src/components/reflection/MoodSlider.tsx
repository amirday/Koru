/**
 * MoodSlider - Before/after mood rating slider
 */

export interface MoodSliderProps {
  /** Label for the slider */
  label: string
  /** Current value (1-5) */
  value: number
  /** Value change callback */
  onChange: (value: number) => void
}

const moodLabels = ['😔', '😕', '😐', '🙂', '😊']
const moodDescriptions = ['Low', '', 'Neutral', '', 'Great']

/**
 * MoodSlider - 1-5 mood rating with emoji indicators
 */
export function MoodSlider({ label, value, onChange }: MoodSliderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-calm-700 mb-3">
        {label}
      </label>

      {/* Value display */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-3xl">{moodLabels[value - 1]}</span>
        <span className="text-sm text-calm-600">{moodDescriptions[value - 1]}</span>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-calm-200 rounded-full appearance-none cursor-pointer slider-peach"
          style={{
            background: `linear-gradient(to right, #FF9A54 0%, #FF9A54 ${(value - 1) * 25}%, #E5E5E5 ${(value - 1) * 25}%, #E5E5E5 100%)`,
          }}
        />

        {/* Tick marks */}
        <div className="flex justify-between mt-1 px-1">
          {[1, 2, 3, 4, 5].map((tick) => (
            <button
              key={tick}
              onClick={() => onChange(tick)}
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors ${
                value === tick
                  ? 'bg-peach-500 text-white'
                  : 'bg-calm-100 text-calm-600 hover:bg-calm-200'
              }`}
            >
              {tick}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .slider-peach::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF9A54;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .slider-peach::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF9A54;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}
