# Koru Backend — Tiered Test Strategy

## Overview

Tests are organized into three tiers using pytest markers. Each tier adds requirements for external API keys.

| Tier | Marker | API keys needed | Purpose |
|------|--------|----------------|---------|
| **Offline** | `@pytest.mark.offline` | None | Runs in CI. All external APIs mocked. |
| **AI** | `@pytest.mark.ai` | `OPENAI_API_KEY` | Real text generation via OpenAI. |
| **Audio** | `@pytest.mark.audio` | `ELEVENLABS_API_KEY` and/or `GEMINI_API_KEY` | Real TTS audio synthesis. |

## Running Tests

```bash
# CI — no API keys needed
pytest -m offline -v

# With OpenAI key
pytest -m "offline or ai" -v

# All tiers (with all keys)
pytest -m "offline or ai or audio" -v

# Everything (skipif decorators still protect missing keys)
pytest -v
```

## Mock Injection

Services use module-level singletons (`_provider`, `_tts_service`). Test fixtures override them before tests and restore originals after:

```python
import app.services.openai_provider as openai_module
original = openai_module._provider
openai_module._provider = MockOpenAIProvider()
# ... run test ...
openai_module._provider = original
```

`TTSService` accepts providers via constructor DI — mock fixtures build a `TTSService(MockElevenLabs, MockGoogle, storage)` and assign it to the `_tts_service` singleton.

### Fixtures

| Fixture | What it does |
|---------|-------------|
| `client` | TestClient with isolated storage (existing) |
| `mock_openai_client` | TestClient with `MockOpenAIProvider` injected |
| `mock_tts_client` | TestClient with mock TTS providers injected |
| `mock_all_client` | TestClient with both OpenAI and TTS mocked |

All mock fixtures restore original singletons after each test.

## Test Files by Tier

### Offline (no keys)
- `tests/test_health.py` — health endpoints
- `tests/test_integration.py` — `TestErrorHandling`, `test_ritual_crud_flow`
- `app/api/tests/test_rituals.py` — CRUD endpoints
- `app/api/tests/test_generation.py` — `test_generate_validation`
- `app/api/tests/test_generation_mocked.py` — full generation flow with mocks
- `app/api/tests/test_tts.py` — voice listing, validation
- `app/api/tests/test_tts_mocked.py` — TTS synthesis with mocks, full flow
- `app/services/tests/test_storage.py` — storage operations
- `app/services/tests/test_openai.py` — availability, prompt building
- `app/services/tests/test_tts.py` — voice mapping, provider selection
- `app/services/tests/test_tts_mocked.py` — TTSService unit tests with mocks

### AI (requires OPENAI_API_KEY)
- `app/api/tests/test_generation.py` — `test_generate_ritual`, `test_generate_ritual_saved`, `test_generate_with_focus_areas`
- `app/services/tests/test_openai.py` — `test_generate_ritual_real_api`

### Audio (requires ELEVENLABS_API_KEY / GEMINI_API_KEY)
- `tests/test_integration.py` — `test_generate_and_synthesize_flow`, `test_multi_provider_tts`
- `app/api/tests/test_tts.py` — `test_synthesize_elevenlabs`, `test_synthesize_google`, `test_synthesize_with_ritual`
- `app/services/tests/test_tts.py` — `test_synthesize_real_api` (both providers), `test_synthesize_with_storage`

## Mock Providers

Located in `tests/mocks/`:

- **`MockOpenAIProvider`** — returns a deterministic 3-section ritual (intro/body/closing) with text and silence segments.
- **`MockElevenLabsTTSProvider`** — returns fake MP3 bytes with duration proportional to text length.
- **`MockGoogleTTSProvider`** — returns fake WAV bytes with duration proportional to text length.

## Adding New Tests

1. **Pick the right tier:** Use `offline` if you can mock the dependency. Use `ai` or `audio` only for integration tests that verify real API behavior.
2. **Add the marker:** Decorate the test class or function with `@pytest.mark.offline`, `@pytest.mark.ai`, or `@pytest.mark.audio`.
3. **Keep `skipif`:** If a test requires an API key, keep the `skipif` decorator alongside the tier marker. The marker controls which tests are *selected*; `skipif` controls which are *skipped* when keys are missing.
4. **Use fixtures:** For offline tests, use `mock_openai_client`, `mock_tts_client`, or `mock_all_client` fixtures.
5. **Add mocks if needed:** If a new external service is added, create a mock in `tests/mocks/` and add a fixture in `tests/conftest.py`.
