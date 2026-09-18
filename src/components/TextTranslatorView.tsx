import React, { useState, useEffect, useRef } from 'react';
import { Language, TranslationTone, LatencyBreakdown } from '../types';
import { QUICK_TRAVEL_PHRASES } from '../data/languages';
import { speakText, stopSpeech } from '../utils/speech';
import { LatencyHUD } from './LatencyHUD';
import {
  ArrowUpDown,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Trash2,
  CornerRightDown,
  Info,
  Globe,
  Layers,
  Zap,
  Bookmark,
  Share2
} from 'lucide-react';

interface TextTranslatorViewProps {
  sourceLang: Language;
  targetLang: Language;
  onOpenSourceModal: () => void;
  onOpenTargetModal: () => void;
  onSwapLanguages: () => void;
  tone: TranslationTone;
  onSelectTone: (tone: TranslationTone) => void;
  offlineMode: boolean;
}

export const TextTranslatorView: React.FC<TextTranslatorViewProps> = ({
  sourceLang,
  targetLang,
  onOpenSourceModal,
  onOpenTargetModal,
  onSwapLanguages,
  tone,
  onSelectTone,
  offlineMode
}) => {
  const [inputText, setInputText] = useState('Where is the best authentic local restaurant in this district?');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLangCode, setDetectedLangCode] = useState<string | null>(null);
  const [romanization, setRomanization] = useState<string>('');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [formalityNote, setFormalityNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [latency, setLatency] = useState<LatencyBreakdown | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Trigger translation when text, tone, or languages change with responsive debounce
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastTranslatedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      setRomanization('');
      setAlternatives([]);
      setFormalityNote('');
      return;
    }

    const currentKey = `${sourceLang.code}:${targetLang.code}:${tone}:${inputText.trim()}`;
    if (currentKey === lastTranslatedKeyRef.current && translatedText) {
      return;
    }

    const timer = setTimeout(() => {
      translateCurrentText(inputText);
    }, 380);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang.code, targetLang.code, tone, offlineMode]);

  const translateCurrentText = async (text: string) => {
    if (!text.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text,
          sourceLang: sourceLang.code,
          targetLang: targetLang.code,
          tone
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText || '');
        setRomanization(data.romanization || '');
        setAlternatives(data.alternatives || []);
        setFormalityNote(data.formalityExplanation || '');
        setDetectedLangCode(data.sourceLang || null);
        setLatency(data.latency);
        lastTranslatedKeyRef.current = `${sourceLang.code}:${targetLang.code}:${tone}:${text.trim()}`;
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        // Handled silently
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePlayAudio = () => {
    if (!translatedText) return;
    speakText(translatedText, targetLang.speechCode, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const categories = ['All', 'Dining', 'Directions', 'Shopping', 'Hotel', 'Emergency', 'Social'];
  const filteredPhrases =
    activeCategory === 'All'
      ? QUICK_TRAVEL_PHRASES
      : QUICK_TRAVEL_PHRASES.filter((p) => p.category === activeCategory);

  return (
    <div id="text-translator-view" className="max-w-5xl mx-auto space-y-4">
      {/* Language Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3">
        {/* Source Language Button */}
        <button
          id="text-source-lang-btn"
          onClick={onOpenSourceModal}
          className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{sourceLang.flag}</span>
            <div className="text-left">
              <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">Translate From</span>
              <span className="text-sm font-bold text-slate-900">{sourceLang.name}</span>
            </div>
          </div>
        </button>

        {/* Swap Button */}
        <button
          id="text-swap-lang-btn"
          onClick={onSwapLanguages}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 transition-all hover:rotate-180 duration-300"
          title="Swap Languages"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* Target Language Button */}
        <button
          id="text-target-lang-btn"
          onClick={onOpenTargetModal}
          className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{targetLang.flag}</span>
            <div className="text-left">
              <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">Translate To</span>
              <span className="text-sm font-bold text-slate-900">{targetLang.name}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Latency HUD */}
      <LatencyHUD latency={latency} isStreaming={isLoading} />

      {/* Dual Text Translation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Input Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[260px]">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span>{sourceLang.name}</span>
                {detectedLangCode && sourceLang.code === 'auto' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider border border-indigo-100 leading-none">
                    Detected: {detectedLangCode.toUpperCase()}
                  </span>
                )}
              </span>
              {inputText && (
                <button
                  id="clear-input-text-btn"
                  onClick={() => setInputText('')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Clear Text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <textarea
              id="source-text-input"
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter or paste text to translate..."
              className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-normal placeholder-slate-400 resize-none focus:outline-none leading-relaxed tracking-normal"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="tabular-nums font-medium">{inputText.length} characters</span>
            <div className="flex items-center gap-2">
              <button
                id="source-tts-btn"
                onClick={() => speakText(inputText, sourceLang.speechCode)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                title="Listen to original"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Target Translated Output Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[260px] relative overflow-hidden">
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 animate-pulse" />
          )}

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider leading-none">
                  {targetLang.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider border border-indigo-100 leading-none">
                  {tone} Tone
                </span>
              </div>
            </div>

            {translatedText ? (
              <div className="space-y-3">
                <div
                  id="target-translated-text"
                  className="text-slate-900 text-base sm:text-xl font-semibold leading-relaxed tracking-tight"
                >
                  {translatedText}
                </div>

                {romanization && (
                  <div className="text-xs text-indigo-800 font-mono font-medium bg-indigo-50/80 rounded-xl p-2.5 border border-indigo-100 leading-relaxed tracking-tight">
                    🗣 Pronunciation: {romanization}
                  </div>
                )}

                {formalityNote && (
                  <div className="text-xs text-slate-600 font-normal leading-relaxed bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{formalityNote}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 text-sm font-normal italic pt-6 leading-relaxed">
                {isLoading ? 'Translating with neural model...' : 'Translation will appear here instantly...'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono font-medium tabular-nums">{translatedText.length} characters</span>
            <div className="flex items-center gap-1.5">
              <button
                id="target-play-tts-btn"
                onClick={handlePlayAudio}
                disabled={!translatedText}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 font-semibold transition-all leading-none ${
                  isPlaying
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40'
                }`}
                title="Play Native Voice Speech"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Playing...' : 'Speak'}</span>
              </button>

              <button
                id="target-copy-text-btn"
                onClick={handleCopy}
                disabled={!translatedText}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 font-semibold leading-none"
                title="Copy Translation"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
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
      </div>

      {/* Alternative Phrasings (FR-2 & FR-11) */}
      {alternatives.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider leading-none">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Alternative Expressive Phrasings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alternatives.map((alt, idx) => (
              <button
                key={idx}
                id={`apply-alt-phrase-${idx}`}
                onClick={() => {
                  setTranslatedText(alt);
                  speakText(alt, targetLang.speechCode);
                }}
                className="text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 text-xs text-slate-800 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-800 leading-snug tracking-tight group-hover:text-indigo-700">"{alt}"</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Phrase Book & Presets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider leading-none">
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Phrases & Common Travel Contexts</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-pill-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-tight transition-all leading-none ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {filteredPhrases.map((phrase, idx) => (
            <button
              key={idx}
              id={`quick-phrase-card-${idx}`}
              onClick={() => setInputText(phrase.text)}
              className="text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 text-xs transition-all group flex flex-col justify-between"
            >
              <span className="font-medium text-slate-800 leading-snug tracking-tight mb-2 group-hover:text-indigo-700">"{phrase.text}"</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold tracking-wider leading-none">{phrase.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
