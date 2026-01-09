# Step 12: HomeScreen Assembly

## Objective
Combine all components into the complete Home screen.

## File to Create

- `src/screens/Home/HomeScreen.tsx`

## Layout Structure

```
<ScreenContainer>
  <Header greeting={greeting} streak={streak} />

  <GoalBox
    goal={goal}
    onUpdate={handleGoalUpdate}
  />

  <QuickStartsSection>
    <h2>Quick Starts</h2>
    <HorizontalCarousel>
      {quickStarts.map(ritual => (
        <QuickStartCard
          key={ritual.id}
          ritual={ritual}
          onTap={() => handleQuickStart(ritual)}
        />
      ))}
    </HorizontalCarousel>
  </QuickStartsSection>

  <GenerateSection>
    <GenerateButton
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
    />

    {isGenerating && (
      <GenerationProgress
        progress={generationProgress}
        onDismiss={handleDismissProgress}
      />
    )}
  </GenerateSection>

  {clarifyingQuestion && (
    <ClarifyingQuestionModal
      question={clarifyingQuestion}
      onAnswer={handleAnswerQuestion}
      onCancel={handleCancelQuestion}
    />
  )}
</ScreenContainer>
```

## State Management

**From AppContext:**
- goal
- updateGoal

**From RitualContext:**
- isGenerating
- generationProgress
- clarifyingQuestion
- startGeneration
- answerClarifyingQuestion

**Local State:**
- None (all managed in contexts)

## Handlers

### handleGoalUpdate
- Call AppContext.updateGoal
- Debounced to avoid excessive saves

### handleGenerate
- Get current preferences from AppContext
- Call RitualContext.startGeneration with options
- Progress updates handled automatically

### handleQuickStart
- Future: navigate to /session/:id
- For now: show toast "Session player coming soon"

### handleDismissProgress
- Toast: "Working in background..."
- Progress continues, UI hidden

### handleAnswerQuestion
- Call RitualContext.answerClarifyingQuestion
- Modal closes automatically

## Styling

- Vertical spacing: gap-6 between sections
- QuickStarts: horizontal scroll with snap
- Warm background throughout
- Safe area padding

## Next Step

Proceed to **Step 13: Generation Flow Implementation**
