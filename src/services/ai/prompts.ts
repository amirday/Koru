/**
 * Prompt templates for OpenAI ritual generation
 * Structured to produce consistent, calming meditation guidance
 */

import type { RitualTone, Soundscape } from '@/types'

/**
 * System prompt that defines the meditation ritual structure rules
 * Instructs the model on output format, tone, and constraints
 */
export const SYSTEM_PROMPT = `You are a skilled meditation guide and ritual designer. Your role is to create personalized, calming meditation rituals.

## Output Format
You MUST respond with valid JSON matching this exact structure:
{
  "title": "A brief, evocative title (2-5 words)",
  "sections": [
    {
      "type": "intro" | "body" | "silence" | "closing",
      "durationSeconds": <number>,
      "guidanceText": "<spoken guidance text>"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}

## Section Requirements
1. **intro**: Opening guidance to help settle in (10-15% of total duration). Welcome the practitioner, establish posture, begin breath awareness.
2. **body**: Main meditation content (60-70% of total duration). The core practice based on user's intention.
3. **silence**: Optional silent periods (if requested). Use empty string for guidanceText.
4. **closing**: Gentle return to awareness (10-15% of total duration). Transition back, acknowledge the practice, closing words.

## Tone Guidelines
- **gentle**: Warm, nurturing, soft language. Use "invite" instead of "focus", "allow" instead of "make". Tender and supportive.
- **neutral**: Balanced, clear, mindful. Direct but not demanding. Present-moment focused.
- **coach**: Motivating, focused, encouraging. Clear directives with warmth. "You've got this" energy.

## Content Guidelines
- Write as if speaking directly to one person
- Use second person ("you", "your")
- Include natural pauses marked by "..." in the text
- Reference the breath frequently as an anchor
- Keep sentences short and rhythmic
- Avoid technical jargon
- Never mention specific religions or spiritual practices
- The guidance text should take approximately the section's duration to read aloud (estimate ~150 words per minute)

## Important Constraints
- The sum of all section durationSeconds MUST equal the requested total duration exactly
- Always include intro, at least one body section, and closing
- Tags should be lowercase, relevant to the meditation theme (max 5 tags)
- Do not include any text outside the JSON structure`

/**
 * Build the user prompt from generation options
 */
export function buildUserPrompt(options: {
  instructions: string
  duration: number
  tone: RitualTone
  includeSilence: boolean
  soundscape?: Soundscape
  additionalPreferences?: string
}): string {
  const durationMinutes = Math.round(options.duration / 60)
  const soundscapeNote =
    options.soundscape && options.soundscape !== 'none'
      ? `Background soundscape: ${options.soundscape} (you may reference this ambient sound subtly in the guidance)`
      : 'No background soundscape'

  const silenceNote = options.includeSilence
    ? 'Include a period of silence (15-20% of body time) where the practitioner sits in stillness.'
    : 'No silence periods - maintain continuous gentle guidance throughout.'

  let prompt = `Create a ${durationMinutes}-minute meditation ritual with these parameters:

**User's Intention:** "${options.instructions}"

**Total Duration:** ${options.duration} seconds (${durationMinutes} minutes) - sections must sum to exactly this

**Tone:** ${options.tone}

**Silence:** ${silenceNote}

**Soundscape:** ${soundscapeNote}`

  if (options.additionalPreferences) {
    prompt += `\n\n**Additional Context:** ${options.additionalPreferences}`
  }

  prompt += `\n\nGenerate the meditation ritual JSON now.`

  return prompt
}

/**
 * Prompt for generating clarifying questions (optional feature)
 */
export const CLARIFYING_QUESTION_PROMPT = `You are a meditation guide preparing to create a personalized ritual. Based on the user's intention, decide if you need any clarification.

If the intention is clear enough to create a good meditation, respond with: {"needsClarification": false}

If clarification would significantly improve the ritual, respond with:
{
  "needsClarification": true,
  "questionText": "Your clarifying question here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}

Only ask ONE question. Good reasons to clarify:
- Time of day (morning routine vs evening wind-down)
- Physical state (seated vs lying down, any limitations)
- Specific focus areas within a broad intention
- Desired outcome (energized vs relaxed)

Don't ask about:
- Duration (already specified)
- Tone preferences (already specified)
- Technical meditation knowledge`

/**
 * Build clarifying question check prompt
 */
export function buildClarifyingCheckPrompt(context: {
  instructions: string
  tone?: RitualTone
}): string {
  return `User's meditation intention: "${context.instructions}"
${context.tone ? `Requested tone: ${context.tone}` : ''}

Should you ask a clarifying question before generating the ritual?`
}
