// Web Speech API and Audio helpers for LinguaLive

// Text-to-Speech playback helper
export function speakText(
  text: string,
  langCode: string,
  options: {
    rate?: number;
    pitch?: number;
    voiceGender?: 'female' | 'male' | 'neutral';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device');
    options.onError?.('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || text.trim().length === 0) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.lang = langCode;

  // Attempt to select the best native voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang.replace('_', '-').startsWith(langCode));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    options.onEnd?.();
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
}

// Stop any active speech
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Check speech recognition support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

// Factory for SpeechRecognition
export function createSpeechRecognizer(
  langSpeechCode: string,
  callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: any) => void;
    onEnd: () => void;
  }
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = langSpeechCode || 'en-US';

    recognizer.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        callbacks.onResult(final.trim(), true);
      } else if (interim) {
        callbacks.onResult(interim.trim(), false);
      }
    };

    recognizer.onerror = (event: any) => {
      // Ignore routine 'no-speech' or 'aborted'
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        callbacks.onError(event.error);
      }
    };

    recognizer.onend = () => {
      callbacks.onEnd();
    };

    return recognizer;
  } catch (err) {
    console.error('Failed to initialize speech recognition', err);
    return null;
  }
}
