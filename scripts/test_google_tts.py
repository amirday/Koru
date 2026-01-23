#!/usr/bin/env python3
"""
Test script for Google Gemini TTS API
Run: python scripts/test_google_tts.py --key YOUR_API_KEY

Requires:
  pip install google-genai
"""

import os
import argparse
import wave
import struct
from google import genai
from google.genai import types

# Voice IDs from our voices.json (Google Gemini voices)
VOICES = {
    "aoede": "Aoede",      # Warm, gentle female voice
    "charon": "Charon",    # Deep, grounding male voice
}

# Test text (meditation style)
DEFAULT_TEXT = """
Take a deep breath in.
Feel your chest expand as you welcome fresh energy into your body.
Now, slowly exhale, releasing any tension you've been holding.
"""

def save_wav(audio_data: bytes, filename: str, sample_rate: int = 24000):
    """Save raw PCM audio data as WAV file"""
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_data)
    print(f"Saved to: {filename}")

def test_tts(api_key: str, voice_name: str = "aoede", text: str = DEFAULT_TEXT, save_to_file: bool = False):
    """Test TTS with specified voice"""

    voice_id = VOICES.get(voice_name.lower())
    if not voice_id:
        print(f"Unknown voice: {voice_name}")
        print(f"Available voices: {', '.join(VOICES.keys())}")
        return

    print(f"Testing Google Gemini TTS with voice: {voice_name} ({voice_id})")
    print(f"Text: {text[:50]}...")
    print("-" * 50)

    client = genai.Client(api_key=api_key)

    # Build meditation-style prompt
    prompt = f'[meditative, slow, hushed, gentle, low pitch]\n\n"{text}"'

    for i in range(5):
        print(f"Request {i+1}/5 STARTED...")

        response = client.models.generate_content(
            model="gemini-2.5-pro-preview-tts",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=1,
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_id
                        )
                    )
                )
            )
        )

        # Extract audio data
        audio_data = b""
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                audio_data += part.inline_data.data

        print(f"Request {i+1}/5 COMPLETED - {len(audio_data)} bytes")

        if save_to_file:
            filename = f"test_output_google_{voice_name}_{i}.wav"
            save_wav(audio_data, filename)
        else:
            print(f"Audio generated: {len(audio_data)} bytes (use --save to save to file)")

    print("Done!")

def main():
    parser = argparse.ArgumentParser(description="Test Google Gemini TTS API")
    parser.add_argument("--key", "-k", help="Google API key (or set GEMINI_API_KEY env var)")
    parser.add_argument("--voice", "-v", default="aoede", help="Voice name (aoede, charon)")
    parser.add_argument("--save", "-s", action="store_true", help="Save to file instead of playing")
    parser.add_argument("--text", "-t", help="Custom text to synthesize")

    args = parser.parse_args()

    # Get API key from argument or environment (check both VITE_ and non-prefixed)
    api_key = args.key or os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")

    if not api_key:
        print("ERROR: No API key provided")
        print()
        print("Option 1: Pass via argument:")
        print("  python test_google_tts.py --key YOUR_API_KEY")
        print()
        print("Option 2: Set environment variable:")
        print("  export GEMINI_API_KEY=your_key_here")
        print()
        print("Get your API key from: https://aistudio.google.com/apikey")
        exit(1)

    text = args.text or DEFAULT_TEXT
    test_tts(api_key=api_key, voice_name=args.voice, text=text, save_to_file=args.save)

if __name__ == "__main__":
    main()
