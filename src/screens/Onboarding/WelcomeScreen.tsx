/**
 * WelcomeScreen - Onboarding welcome screen
 * Features: warm gradient, headline, CTA buttons
 */

import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts'
import { Button } from '@/components/ui'

/**
 * First screen of onboarding flow
 */
export function WelcomeScreen() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()

  const handleStart = () => {
    navigate('/setup')
  }

  const handleSkip = async () => {
    await completeOnboarding()
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-gentle-yellow flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Brand */}
        <h1 className="text-5xl font-serif font-bold text-peach-500 mb-8">
          Koru
        </h1>

        {/* Headline */}
        <h2 className="text-4xl font-serif font-bold text-calm-900 mb-4 leading-tight">
          Build a ritual you'll actually repeat.
        </h2>

        {/* Subheading */}
        <p className="text-lg text-calm-700 font-sans mb-12">
          Goal-driven meditation that adapts to you.
        </p>

        {/* Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          fullWidth
          className="mb-4"
        >
          Start
        </Button>

        {/* Secondary CTA */}
        <button
          onClick={handleSkip}
          className="text-calm-600 hover:text-calm-900 transition-colors text-sm font-medium"
        >
          I already have a ritual
        </button>
      </div>
    </div>
  )
}
