/**
 * ReflectionCheckboxes - Multi-select observation checkboxes
 */

export interface ReflectionOption {
  id: string
  label: string
}

export interface ReflectionCheckboxesProps {
  /** Available options */
  options: ReflectionOption[]
  /** Selected option IDs */
  selected: string[]
  /** Selection change callback */
  onChange: (selected: string[]) => void
}

const defaultOptions: ReflectionOption[] = [
  { id: 'showed-up', label: 'I showed up despite resistance' },
  { id: 'busy-mind', label: 'My mind was busy' },
  { id: 'felt-calmer', label: 'I felt calmer' },
  { id: 'gained-clarity', label: 'I gained clarity' },
  { id: 'felt-gratitude', label: 'I felt gratitude' },
  { id: 'adjust-ritual', label: 'I want to adjust the ritual' },
]

/**
 * ReflectionCheckboxes - Multi-select checkboxes for post-session reflection
 */
export function ReflectionCheckboxes({
  options = defaultOptions,
  selected,
  onChange,
}: ReflectionCheckboxesProps) {
  const handleToggle = (optionId: string) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((id) => id !== optionId))
    } else {
      onChange([...selected, optionId])
    }
  }

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.id)

        return (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              isSelected
                ? 'border-peach-500 bg-peach-50'
                : 'border-calm-200 hover:border-calm-300 hover:bg-warm-50'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(option.id)}
              className="w-5 h-5 rounded border-calm-300 text-peach-500 focus:ring-peach-500 focus:ring-offset-2"
            />
            <span className={`text-sm ${isSelected ? 'text-calm-900 font-medium' : 'text-calm-700'}`}>
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export { defaultOptions as reflectionOptions }
