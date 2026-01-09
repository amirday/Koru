# Step 13: Generation Flow Implementation

## Objective
Complete the end-to-end ritual generation flow in RitualContext.

## Updates to RitualContext

### startGeneration Action

```typescript
const startGeneration = async (options: AIGenerationOptions) => {
  // Validate
  if (!options.goal || options.goal.trim().length < 3) {
    toast.error('Please set a goal first');
    return;
  }

  // Generate task ID
  const taskId = `generation-${Date.now()}`;

  // Update state
  dispatch({ type: 'START_GENERATION', payload: { taskId } });

  // Request notification permission (first time only)
  await requestNotificationPermission();

  // Start background task
  await backgroundTaskService.startTask(
    taskId,
    async () => {
      // Progress callback
      const onProgress = (progress: AIGenerationProgress) => {
        dispatch({ type: 'UPDATE_PROGRESS', payload: progress });

        // Simulate clarifying question after first stage
        if (progress.stage === 'clarifying' && progress.progress === 25) {
          const question = await aiService.askClarifyingQuestion(options);
          if (question) {
            dispatch({ type: 'SET_CLARIFYING_QUESTION', payload: question });
            // Pause generation until answered
            return new Promise(resolve => {
              // Store resolve in ref to continue later
              clarifyingQuestionResolveRef.current = resolve;
            });
          }
        }
      };

      // Generate ritual
      const ritual = await aiService.generateRitual(options, onProgress);
      return ritual;
    },
    (ritual: Ritual) => {
      // On complete
      dispatch({ type: 'GENERATION_COMPLETE', payload: ritual });
      storageService.saveRitual(ritual);

      // Show notification
      notificationService.show({
        title: 'Your ritual is ready!',
        body: ritual.title,
        onClick: () => navigate(`/rituals/${ritual.id}`),
      });

      // In-app toast
      toast.success('Ritual created!');
    }
  );
};
```

### answerClarifyingQuestion Action

```typescript
const answerClarifyingQuestion = (answer: string) => {
  dispatch({ type: 'CLEAR_CLARIFYING_QUESTION' });

  // Continue generation with answer
  if (clarifyingQuestionResolveRef.current) {
    clarifyingQuestionResolveRef.current(answer);
    clarifyingQuestionResolveRef.current = null;
  }
};
```

## Background Task Behavior

- User can navigate away during generation
- Progress stored in context
- Notification shown when complete (if user not on page)
- Toast always shown
- Click notification navigates to ritual

## Error Handling

- Network errors: show retry button
- Validation errors: show error message
- Timeout (30s): show warning with continue/cancel options

## Next Step

Proceed to **Step 14: PWA Configuration**
