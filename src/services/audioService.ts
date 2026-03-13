import * as Speech from 'expo-speech';

// Speaks the given text using the device's text-to-speech engine
export async function speak(text: string): Promise<void> {
  Speech.speak(text, {
    language: 'de-DE',
    rate: 0.9,
    pitch: 1.0,
  });
}

export function stop(): void {
  Speech.stop();
}

export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
