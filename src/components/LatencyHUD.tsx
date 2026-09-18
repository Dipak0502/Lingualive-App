import React from 'react';
import { LatencyBreakdown } from '../types';
import { Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

interface LatencyHUDProps {
  latency?: LatencyBreakdown;
  isStreaming?: boolean;
}

export const LatencyHUD: React.FC<LatencyHUDProps> = ({ latency, isStreaming }) => {
  if (!latency && !isStreaming) return null;

  const total = latency?.totalMs || 0;
  const isWithinSLA = total <= 2000;

  return (
    <div
      id="latency-diagnostics-hud"
      className="bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-800">
          <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="leading-tight">Real-Time Latency SLA</span>
        </div>
        <div className="flex items-center gap-1">
          {isWithinSLA ? (
            <span className="flex items-center gap-1.5 text-emerald-800 font-mono font-semibold text-[11px] px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-200 leading-none">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{total}ms</span>
              <span className="text-emerald-700 font-sans font-medium text-[10px] uppercase tracking-wider">(SLA ≤ 2.0s Met)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-800 font-mono font-semibold text-[11px] px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-200 leading-none">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{total}ms</span>
              <span className="text-amber-700 font-sans font-medium text-[10px] uppercase tracking-wider">(Degraded)</span>
            </span>
          )}
        </div>
      </div>

      {latency && (
        <div className="space-y-1.5">
          {/* Progress Breakdown Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              style={{ width: `${Math.min(100, ((latency.networkMs || 20) / Math.max(total, 1)) * 100)}%` }}
              className="bg-sky-500 transition-all duration-500"
              title={`Network: ${latency.networkMs}ms`}
            />
            <div
              style={{ width: `${Math.min(100, ((latency.asrMs || 40) / Math.max(total, 1)) * 100)}%` }}
              className="bg-indigo-600 transition-all duration-500"
              title={`ASR Speech Recognition: ${latency.asrMs}ms`}
            />
            <div
              style={{ width: `${Math.min(100, ((latency.mtMs || 80) / Math.max(total, 1)) * 100)}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`MT Translation: ${latency.mtMs}ms`}
            />
            <div
              style={{ width: `${Math.min(100, ((latency.ttsMs || 30) / Math.max(total, 1)) * 100)}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`TTS Synthesis: ${latency.ttsMs}ms`}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-[11px] font-mono text-slate-600 text-center pt-0.5 leading-normal">
            <div>
              <span className="text-sky-700 font-bold font-sans">Net:</span> {latency.networkMs}ms
            </div>
            <div>
              <span className="text-indigo-700 font-bold font-sans">ASR:</span> {latency.asrMs}ms
            </div>
            <div>
              <span className="text-emerald-700 font-bold font-sans">MT:</span> {latency.mtMs}ms
            </div>
            <div>
              <span className="text-amber-700 font-bold font-sans">TTS:</span> {latency.ttsMs}ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
