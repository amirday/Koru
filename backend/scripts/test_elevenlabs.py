#!/usr/bin/env python3
"""
Test script for ElevenLabs TTS API
Run: python scripts/test_elevenlabs.py --key YOUR_API_KEY

Requires:
  pip install elevenlabs
"""

import os
import argparse
from elevenlabs.client import ElevenLabs
from elevenlabs import play, save

# Voice IDs from our voices.json
VOICES = {
    "sarah": "EXAVITQu4vr4xnSDxMaL",      # Soft and calm American female
    "daniel": "onwK4e9ZLuTAKqWW03F9",     # Warm British male
    "charlotte": "XB0fDUnXU5powFXDhCwa",  # Gentle and soothing female
    "lily": "pFZP5JQG7iQjIQuC4Bku",       # Peaceful British female
    "liam": "TX3LPaxmHKxFdv7VOQHJ",       # Calm American male
}

# Test text (meditation style)
DEFAULT_TEXT = """
Take a deep breath in.
Feel your chest expand as you welcome fresh energy into your body.
Now, slowly exhale, releasing any tension you've been holding.
"""

def test_tts(api_key: str, voice_name: str = "sarah", text: str = DEFAULT_TEXT, save_to_file: bool = False):
    """Test TTS with specified voice"""

    voice_id = VOICES.get(voice_name.lower())
    if not voice_id:
        print(f"Unknown voice: {voice_name}")
        print(f"Available voices: {', '.join(VOICES.keys())}")
        return

    print(f"Testing ElevenLabs TTS with voice: {voice_name} ({voice_id})")
    print(f"Text: {text[:50]}...")
    print("-" * 50)

    client = ElevenLabs(api_key=api_key)
    for i in range(5):
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        if save_to_file:
            filename = f"test_output_{voice_name}_{i}.mp3"
            save(audio, filename)
            print(f"Saved to: {filename}")
        else:
            print("Playing audio...")
            play(audio)

    print("Done!")

def main():
    parser = argparse.ArgumentParser(description="Test ElevenLabs TTS API")
    parser.add_argument("--key", "-k", help="ElevenLabs API key (or set ELEVENLABS_API_KEY env var)")
    parser.add_argument("--voice", "-v", default="sarah", help="Voice name (sarah, daniel, charlotte, lily, liam)")
    parser.add_argument("--save", "-s", action="store_true", help="Save to file instead of playing")
    parser.add_argument("--text", "-t", help="Custom text to synthesize")

    args = parser.parse_args()

    # Get API key from argument or environment (check both VITE_ and non-prefixed)
    api_key = args.key or os.getenv("ELEVENLABS_API_KEY") or os.getenv("VITE_ELEVENLABS_API_KEY")

    if not api_key:
        print("ERROR: No API key provided")
        print()
        print("Option 1: Pass via argument:")
        print("  python test_elevenlabs.py --key YOUR_API_KEY")
        print()
        print("Option 2: Set environment variable:")
        print("  export ELEVENLABS_API_KEY=your_key_here")
        print()
        print("Get your API key from: https://elevenlabs.io/api")
        exit(1)

    text = args.text or DEFAULT_TEXT
    test_tts(api_key=api_key, voice_name=args.voice, text=text, save_to_file=args.save)

if __name__ == "__main__":
    main()
