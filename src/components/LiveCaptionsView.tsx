import React, { useState, useEffect } from 'react';
import { Language, TranslationTone } from '../types';
import { speakText } from '../utils/speech';
import {
  Radio,
  Play,
  Pause,
  Sparkles,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  ListTodo,
  Volume2,
  Clock,
  Download
} from 'lucide-react';

interface LiveCaptionsViewProps {
  sourceLang: Language;
  targetLang: Language;
  onOpenSourceModal: () => void;
  onOpenTargetModal: () => void;
  tone: TranslationTone;
  offlineMode: boolean;
}

interface CaptionLine {
  id: string;
  speaker: string;
  original: string;
  translated: string;
  timestamp: string;
}

const SAMPLE_MEETING_SCRIPT: Array<{ speaker: string; original: string; translated: string }> = [
  {
    speaker: 'Dr. Hiroshi (Tokyo)',
    original: '次世代モデルの量子化により、モバイル端末での推論遅延が35%削減されました。',
    translated: 'With next-gen model quantization, mobile on-device inference latency has been reduced by 35%.'
  },
  {
    speaker: 'Dr. Hiroshi (Tokyo)',
    original: '特にオフライン時のメモリ消費量を150MB未満に抑えることに成功しています。',
    translated: 'In particular, we successfully constrained offline memory usage to under 150MB.'
  },
  {
    speaker: 'Claire (Paris)',
    original: 'C’est une excellente nouvelle pour nos utilisateurs voyageurs avec des forfaits limités.',
    translated: 'That is great news for our traveling users who have limited cellular data plans.'
  },
  {
    speaker: 'Sarah (San Francisco)',
    original: 'Let us also confirm the end-to-end SLA round-trip target of 2 seconds for cloud sessions.',
    translated: 'クラウドセッションにおいて、エンドツーエンドの2秒以内の往復SLA目標も確認しましょう。'
  },
  {
    speaker: 'Dr. Hiroshi (Tokyo)',
    original: 'はい、ASR 400ms、MT 300ms、TTS 400msの配分でテスト完了しています。',
    translated: 'Yes, tests are complete with the budget: ASR 400ms, MT 300ms, and TTS 400ms.'
  }
];

export const LiveCaptionsView: React.FC<LiveCaptionsViewProps> = ({
  sourceLang,
  targetLang,
  onOpenSourceModal,
  onOpenTargetModal,
  tone,
  offlineMode
}) => {
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState<any>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Meeting timer
  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Feed stream simulation
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        const item = SAMPLE_MEETING_SCRIPT[currentIndex % SAMPLE_MEETING_SCRIPT.length];
        const newCaption: CaptionLine = {
          id: `cap-${Date.now()}`,
          speaker: item.speaker,
          original: item.original,
          translated: item.translated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setCaptions((prev) => [...prev, newCaption]);
        setCurrentIndex((i) => i + 1);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentIndex]);

  const handleGenerateSummary = async () => {
    if (captions.length === 0) return;
    setIsGeneratingSummary(true);

    try {
      if (!offlineMode) {
        const response = await fetch('/api/meeting-summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: captions,
            sourceLang: sourceLang.code,
            targetLang: targetLang.code
          })
        });

        if (response.ok) {
          const data = await response.json();
          setMeetingSummary(data);
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setMeetingSummary({
          summary: 'The cross-functional engineering team discussed on-device model quantization, memory footprint reduction under 150MB, and verified the 2.0s latency budget.',
          actionItems: [
            'Validate quantized models on low-end test devices',
            'Deploy regional edge routing for latency optimization',
            'Finalize GDPR compliant privacy retention settings'
          ],
          topics: ['Model Quantization', 'Latency SLA Adherence', 'Offline Storage Constraints']
        });
      }
    } catch (err) {
      console.error('Summary error', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="live-captions-view" className="max-w-5xl mx-auto space-y-4">
      {/* Top Banner Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Live Meeting Captions & Subtitles Companion</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold font-mono border border-indigo-100">
                {formatTimer(elapsedSeconds)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live dual-language captioning overlay for international video calls and meetings.
            </p>
          </div>
        </div>

        {/* Live Stream Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-live-caption-stream-btn"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Live Audio Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Live Meeting Stream</span>
              </>
            )}
          </button>

          <button
            id="generate-meeting-summary-btn"
            onClick={handleGenerateSummary}
            disabled={captions.length === 0 || isGeneratingSummary}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isGeneratingSummary ? 'Summarizing...' : 'AI Meeting Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Subtitle Teleprompter Stage */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[360px] max-h-[460px] overflow-y-auto space-y-3.5 relative">
        {captions.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <Radio className="w-10 h-10 text-indigo-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">Live Subtitle Feed Ready</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Tap "Start Live Meeting Stream" above to start receiving bilingual real-time captions with instant neural translation.
            </p>
          </div>
        )}

        {captions.map((cap) => (
          <div
            key={cap.id}
            id={`caption-item-${cap.id}`}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-700">{cap.speaker}</span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {cap.timestamp}
              </span>
            </div>

            {/* Original Spoken Language */}
            <div className="text-xs text-slate-500 italic font-normal leading-normal">
              "{cap.original}"
            </div>

            {/* Translated Live Subtitle (Large Display Typography) */}
            <div className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-relaxed">
              {cap.translated}
            </div>
          </div>
        ))}
      </div>

      {/* AI Meeting Summary & Action Items Card (FR-10 & FR-13) */}
      {meetingSummary && (
        <div id="ai-meeting-summary-card" className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Executive Meeting Summary & Action Items</h3>
            </div>
            <button
              id="copy-summary-btn"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(meetingSummary, null, 2));
                setCopiedSummary(true);
                setTimeout(() => setCopiedSummary(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executive Overview</h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {meetingSummary.summary}
            </p>
          </div>

          {meetingSummary.actionItems && meetingSummary.actionItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
                <span>Action Items & Commitments</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {meetingSummary.actionItems.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
