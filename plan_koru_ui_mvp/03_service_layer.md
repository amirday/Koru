# Step 3: Service Layer

## Objective
Create abstraction layers for storage, AI, background tasks, and notifications.

## File Structure

```
src/services/
├── storage/
│   ├── StorageAdapter.interface.ts
│   ├── LocalStorageAdapter.ts
│   └── storage-service.ts
├── ai/
│   ├── AIProvider.interface.ts
│   ├── MockAIProvider.ts
│   └── ai-service.ts
├── background/
│   └── background-task-service.ts
└── notification/
    └── notification-service.ts
```

## Implementation Details

See the technical architecture plan for complete implementation of:
- **Storage Service**: localStorage adapter with namespacing
- **AI Service**: Mock provider with staged delays and pre-crafted rituals
- **Background Task Service**: Async task execution with notifications
- **Notification Service**: Web Notifications API + in-app toasts

## Key Features

1. **Storage**: Key-value operations with JSON serialization
2. **AI**: Pluggable provider pattern for easy swapping
3. **Background**: Non-blocking task execution with progress callbacks
4. **Notifications**: Browser permission management + fallback toasts

## Next Step

Proceed to **Step 4: Mock Data**
