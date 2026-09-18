import React, { useState, useEffect, useRef } from 'react';
import { Language, TranslationSegment, TranslationTone, LatencyBreakdown } from '../types';
import { getLanguage, getSamplePhrases } from '../data/languages';
import { speakText, stopSpeech, createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';
import { LatencyHUD } from './LatencyHUD';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCw,
  Trash2,
  Share2,
  Star,
  Copy,
  Check,
  Sparkles,
  ArrowUpDown,
  Play,
  CornerRightDown,
  Globe,
  Sliders
} from 'lucide-react';

interface TwoWayConversationViewProps {
  sourceLang: Language;
  targetLang: Language;
  onOpenSourceModal: () => void;
  onOpenTargetModal: () => void;
  onSwapLanguages: () => void;
  tone: TranslationTone;
  offlineMode: boolean;
  segments: TranslationSegment[];
  onAddSegment: (segment: TranslationSegment) => void;
  onClearSegments: () => void;
  onOpenExportModal: () => void;
}

export const TwoWayConversationView: React.FC<TwoWayConversationViewProps> = ({
  sourceLang,
  targetLang,
  onOpenSourceModal,
  onOpenTargetModal,
  onSwapLanguages,
  tone,
  offlineMode,
  segments,
  onAddSegment,
  onClearSegments,
  onOpenExportModal
}) => {
  const [activeSpeaker, setActiveSpeaker] = useState<'speaker_a' | 'speaker_b' | null>(null);
  const [interimText, setInterimText] = useState('');
  const [typedInputA, setTypedInputA] = useState('');
  const [typedInputB, setTypedInputB] = useState('');
  const [isFaceToFace, setIsFaceToFace] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [playingSegmentId, setPlayingSegmentId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [latestLatency, setLatestLatency] = useState<LatencyBreakdown | undefined>(undefined);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognizerRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [segments, interimText]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {}
      }
      stopSpeech();
    };
  }, []);

  // Perform translation request
  const performTranslation = async (
    text: string,
    speaker: 'speaker_a' | 'speaker_b'
  ) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    const fromLang = speaker === 'speaker_a' ? sourceLang.code : targetLang.code;
    const toLang = speaker === 'speaker_a' ? targetLang.code : sourceLang.code;
    const toSpeechCode = speaker === 'speaker_a' ? targetLang.speechCode : sourceLang.speechCode;

    const startTime = Date.now();

    try {
      let resultText = '';
      let romanization = '';
      let latencyData: any = null;

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceLang: fromLang,
            targetLang: toLang,
            tone
          })
        });

        if (response.ok) {
          const data = await response.json();
          resultText = data.translatedText || text;
          romanization = data.romanization || '';
          latencyData = data.latency;
          setLatestLatency(data.latency);
        } else {
          resultText = text;
        }
      } catch {
        resultText = text;
      }

      const newSegment: TranslationSegment = {
        id: `seg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        speaker,
        speakerName: speaker === 'speaker_a' ? `Speaker A (${sourceLang.name})` : `Speaker B (${targetLang.name})`,
        originalText: text,
        translatedText: resultText,
        sourceLang: fromLang,
        targetLang: toLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        tone,
        romanization,
        latencyMs: latencyData
      };

      onAddSegment(newSegment);

      // Auto play TTS in target language
      speakText(resultText, toSpeechCode, {
        onStart: () => setPlayingSegmentId(newSegment.id),
        onEnd: () => setPlayingSegmentId(null)
      });
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
      setInterimText('');
    }
  };

  // Start Voice Listening for a specific speaker
  const startListening = (speaker: 'speaker_a' | 'speaker_b') => {
    if (activeSpeaker === speaker) {
      stopListening();
      return;
    }

    stopListening();
    setActiveSpeaker(speaker);

    const activeLang = speaker === 'speaker_a' ? sourceLang : targetLang;

    const recognizer = createSpeechRecognizer(activeLang.speechCode, {
      onResult: (transcript, isFinal) => {
        setInterimText(transcript);
        if (isFinal) {
          stopListening();
          performTranslation(transcript, speaker);
        }
      },
      onError: (err) => {
        console.warn('Recognition error:', err);
        stopListening();
      },
      onEnd: () => {
        setActiveSpeaker(null);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        console.warn('Recognizer start error', e);
      }
    } else {
      // Fallback if browser speech recognition is unavailable in iframe
      const phrases = getSamplePhrases(activeLang.code);
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setInterimText(randomPhrase);
      setTimeout(() => {
        performTranslation(randomPhrase, speaker);
        setActiveSpeaker(null);
      }, 200);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {}
      recognizerRef.current = null;
    }
    setActiveSpeaker(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const triggerPresetDemo = (phraseA: string) => {
    performTranslation(phraseA, 'speaker_a');
  };

  return (
    <div id="two-way-conversation-view" className="flex flex-col h-full max-w-5xl mx-auto space-y-4">
      {/* Top Controls & Language Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Language Pair Selectors */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          {/* Speaker A Language Button */}
          <button
            id="speaker-a-lang-btn"
            onClick={onOpenSourceModal}
            className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{sourceLang.flag}</span>
              <div className="text-left">
                <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Speaker A</div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{sourceLang.name}</div>
              </div>
            </div>
          </button>

          {/* Swap Button */}
          <button
            id="swap-languages-btn"
            onClick={onSwapLanguages}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 transition-all hover:rotate-180 duration-300"
            title="Swap Languages"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* Speaker B Language Button */}
          <button
            id="speaker-b-lang-btn"
            onClick={onOpenTargetModal}
            className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{targetLang.flag}</span>
              <div className="text-left">
                <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Speaker B</div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{targetLang.name}</div>
              </div>
            </div>
          </button>
        </div>

        {/* View Options & Session Actions */}
        <div className="flex items-center gap-2">
          {/* Face to Face Mode Switcher */}
          <button
            id="toggle-face-to-face-btn"
            onClick={() => setIsFaceToFace(!isFaceToFace)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isFaceToFace
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Face-to-Face mode inverts Speaker B's half for two people facing each other across a table"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Face-to-Face Mode</span>
          </button>

          {/* Export Transcript */}
          <button
            id="export-conversation-btn"
            onClick={onOpenExportModal}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export PDF/Text</span>
          </button>

          {/* Clear Session */}
          {segments.length > 0 && (
            <button
              id="clear-conversation-btn"
              onClick={onClearSegments}
              className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Latency Diagnostics Bar */}
      <LatencyHUD latency={latestLatency} isStreaming={activeSpeaker !== null || isTranslating} />

      {/* Main Conversation Transcript Area */}
      <div
        id="conversation-transcript-container"
        className={`bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto flex-1 min-h-[380px] max-h-[560px] shadow-sm space-y-5 ${
          isFaceToFace ? 'divide-y divide-slate-100' : ''
        }`}
      >
        {segments.length === 0 && !interimText && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Mic className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Live 2-Way Speech Translation Ready</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tap either speaker's microphone below to speak naturally. Speech is transcribed and translated with neural voice synthesis in &le; 2 seconds.
              </p>
            </div>

            {/* Quick Test Starters */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-lg">
              <span className="text-xs text-slate-400 w-full block">Quick test prompts:</span>
              <button
                id="test-prompt-1"
                onClick={() => triggerPresetDemo("Hello, I would like to check in for my reservation under John.")}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-indigo-600" />
                "I would like to check in for my reservation..."
              </button>
              <button
                id="test-prompt-2"
                onClick={() => triggerPresetDemo("Excuse me, what is the best local dish to order here?")}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-indigo-600" />
                "What is the best local dish to order?"
              </button>
            </div>
          </div>
        )}

        {/* Rendered Transcript Segments */}
        {segments.map((seg) => {
          const isSpeakerA = seg.speaker === 'speaker_a';
          const langBadge = isSpeakerA ? sourceLang : targetLang;
          const isPlaying = playingSegmentId === seg.id;

          return (
            <div
              key={seg.id}
              id={`segment-${seg.id}`}
              className={`flex flex-col space-y-1.5 transition-all duration-300 ${
                isFaceToFace && !isSpeakerA ? 'rotate-180 my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200' : ''
              }`}
            >
              {/* Speaker Header */}
              <div className={`flex items-center gap-2 text-xs ${isSpeakerA ? 'justify-start' : 'justify-end'}`}>
                <span className="font-semibold text-slate-600 flex items-center gap-1.5 leading-none">
                  <span className="text-base">{langBadge.flag}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {isSpeakerA ? `Speaker A (${sourceLang.name})` : `Speaker B (${targetLang.name})`}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium leading-none">({seg.timestamp})</span>
                {seg.latencyMs && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium leading-none">
                    {seg.latencyMs.total}ms
                  </span>
                )}
              </div>

              {/* Message Bubble Card */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 transition-all ${
                  isSpeakerA
                    ? 'self-start bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm'
                    : 'self-end bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-indigo-200'
                }`}
              >
                {/* Original spoken text */}
                <div
                  className={`text-xs sm:text-sm font-normal mb-2 pb-2 border-b flex items-center gap-1.5 leading-relaxed tracking-normal ${
                    isSpeakerA
                      ? 'text-slate-600 border-slate-100 justify-start'
                      : 'text-indigo-100 border-indigo-500 justify-end'
                  }`}
                >
                  <span className="italic">"{seg.originalText}"</span>
                </div>

                {/* Translated output text */}
                <div
                  className={`text-sm sm:text-base font-semibold leading-relaxed tracking-tight ${
                    isSpeakerA ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  "{seg.translatedText}"
                </div>

                {/* Romanization guide */}
                {seg.romanization && (
                  <div
                    className={`mt-2.5 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 inline-block border leading-relaxed tracking-tight ${
                      isSpeakerA
                        ? 'text-indigo-800 bg-indigo-50 border-indigo-100'
                        : 'text-indigo-100 bg-indigo-700/80 border-indigo-500'
                    }`}
                  >
                    🗣 {seg.romanization}
                  </div>
                )}

                {/* Card Actions Footer */}
                <div
                  className={`mt-3 pt-2 flex items-center gap-2 ${
                    isSpeakerA
                      ? 'border-t border-slate-100 justify-start'
                      : 'border-t border-indigo-500 justify-end'
                  }`}
                >
                  {/* TTS Play Button */}
                  <button
                    id={`play-tts-${seg.id}`}
                    onClick={() => {
                      const speechCode = isSpeakerA ? targetLang.speechCode : sourceLang.speechCode;
                      speakText(seg.translatedText, speechCode, {
                        onStart: () => setPlayingSegmentId(seg.id),
                        onEnd: () => setPlayingSegmentId(null)
                      });
                    }}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors leading-none ${
                      isSpeakerA
                        ? isPlaying
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : isPlaying
                        ? 'bg-white text-indigo-700 animate-pulse'
                        : 'bg-indigo-700 hover:bg-indigo-800 text-white'
                    }`}
                    title="Play Audio Speech in Target Language"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Playing...' : 'Play'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    id={`copy-segment-${seg.id}`}
                    onClick={() => handleCopy(seg.translatedText, seg.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 font-semibold leading-none ${
                      isSpeakerA
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-indigo-700 hover:bg-indigo-800 text-white'
                    }`}
                    title="Copy Translation"
                  >
                    {copiedId === seg.id ? (
                      <>
                        <Check className={`w-3.5 h-3.5 ${isSpeakerA ? 'text-emerald-600' : 'text-emerald-300'}`} />
                        <span className={isSpeakerA ? 'text-emerald-600' : 'text-emerald-300'}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Interim Speech Card */}
        {interimText && (
          <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <span className="text-xs font-medium italic">
              Listening to {activeSpeaker === 'speaker_a' ? sourceLang.name : targetLang.name}: "{interimText}"
            </span>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Dual Push-to-Talk & Text Input Dual Cockpit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Speaker A Cockpit */}
        <div
          id="speaker-a-control-card"
          className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all ${
            activeSpeaker === 'speaker_a'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{sourceLang.flag}</span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Speaker A</span>
                <span className="text-sm font-semibold text-slate-900">{sourceLang.name}</span>
              </div>
            </div>
            {activeSpeaker === 'speaker_a' && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider animate-pulse">
                Recording
              </span>
            )}
          </div>

          {/* Typed input fallback */}
          <div className="relative mb-3">
            <input
              id="speaker-a-text-input"
              type="text"
              placeholder={`Type in ${sourceLang.name} or tap Mic...`}
              value={typedInputA}
              onChange={(e) => setTypedInputA(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedInputA.trim()) {
                  performTranslation(typedInputA, 'speaker_a');
                  setTypedInputA('');
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors pr-10"
            />
            {typedInputA && (
              <button
                id="speaker-a-send-btn"
                onClick={() => {
                  performTranslation(typedInputA, 'speaker_a');
                  setTypedInputA('');
                }}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                title="Send & Translate"
              >
                <CornerRightDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Main Big Mic Button */}
          <button
            id="speaker-a-mic-btn"
            onClick={() => startListening('speaker_a')}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-150 ${
              activeSpeaker === 'speaker_a'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 ring-4 ring-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
            }`}
          >
            {activeSpeaker === 'speaker_a' ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>Tap to Stop & Translate</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Speak {sourceLang.name}</span>
              </>
            )}
          </button>
        </div>

        {/* Speaker B Cockpit */}
        <div
          id="speaker-b-control-card"
          className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all ${
            isFaceToFace ? 'sm:rotate-180' : ''
          } ${
            activeSpeaker === 'speaker_b'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{targetLang.flag}</span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Speaker B</span>
                <span className="text-sm font-semibold text-slate-900">{targetLang.name}</span>
              </div>
            </div>
            {activeSpeaker === 'speaker_b' && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider animate-pulse">
                Recording
              </span>
            )}
          </div>

          {/* Typed input fallback */}
          <div className="relative mb-3">
            <input
              id="speaker-b-text-input"
              type="text"
              placeholder={`Type in ${targetLang.name} or tap Mic...`}
              value={typedInputB}
              onChange={(e) => setTypedInputB(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedInputB.trim()) {
                  performTranslation(typedInputB, 'speaker_b');
                  setTypedInputB('');
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors pr-10"
            />
            {typedInputB && (
              <button
                id="speaker-b-send-btn"
                onClick={() => {
                  performTranslation(typedInputB, 'speaker_b');
                  setTypedInputB('');
                }}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                title="Send & Translate"
              >
                <CornerRightDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Main Big Mic Button */}
          <button
            id="speaker-b-mic-btn"
            onClick={() => startListening('speaker_b')}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-150 ${
              activeSpeaker === 'speaker_b'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 ring-4 ring-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
            }`}
          >
            {activeSpeaker === 'speaker_b' ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>Tap to Stop & Translate</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Speak {targetLang.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
