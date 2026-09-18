import React from 'react';
import { TranslationTone } from '../types';
import {
  Mic,
  FileText,
  Users,
  Radio,
  Wifi,
  WifiOff,
  SlidersHorizontal,
  Download,
  Settings,
  Sparkles,
  Share2
} from 'lucide-react';

export type AppMode = 'two_way' | 'text' | 'group' | 'live_captions';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  tone: TranslationTone;
  onSelectTone: (tone: TranslationTone) => void;
  offlineMode: boolean;
  onToggleOffline: () => void;
  onOpenOfflineModal: () => void;
  onOpenExportModal: () => void;
  onOpenSettingsModal: () => void;
  unreadSegmentsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  tone,
  onSelectTone,
  offlineMode,
  onToggleOffline,
  onOpenOfflineModal,
  onOpenExportModal,
  onOpenSettingsModal,
  unreadSegmentsCount = 0
}) => {
  const modes = [
    { id: 'two_way' as AppMode, label: '2-Way Voice', icon: Mic },
    { id: 'text' as AppMode, label: 'Text', icon: FileText },
    { id: 'group' as AppMode, label: 'Group (3+)', icon: Users },
    { id: 'live_captions' as AppMode, label: 'Live Captions', icon: Radio }
  ];

  const toneOptions: Array<{ id: TranslationTone; label: string; icon: string }> = [
    { id: 'casual', label: 'Casual', icon: '☕' },
    { id: 'formal', label: 'Formal', icon: '🎩' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'travel', label: 'Travel', icon: '✈️' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Top Row: Brand & Status on Mobile/Desktop */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  LinguaLive
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 leading-none">
                  v1.0 Real-Time
                </span>
              </div>
              <p className="text-[11px] font-normal text-slate-500 hidden sm:block tracking-normal leading-normal mt-0.5">
                Low-Latency Multimodal Speech & Text Translation
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Tone Selector for Mobile */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 text-xs">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  id={`tone-select-mob-${t.id}`}
                  onClick={() => onSelectTone(t.id)}
                  className={`px-1.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    tone === t.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title={`${t.label} Tone`}
                >
                  <span>{t.icon}</span>
                </button>
              ))}
            </div>

            <button
              id="offline-toggle-mobile-btn"
              onClick={onToggleOffline}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                offlineMode
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-emerald-50 border-emerald-100 text-emerald-700'
              }`}
              title={offlineMode ? 'Offline Mode Active' : 'Cloud Neural Network Connected'}
            >
              {offlineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            </button>

            <button
              id="export-transcript-mobile-btn"
              onClick={onOpenExportModal}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs"
              title="Export Transcript"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              id="settings-mobile-btn"
              onClick={onOpenSettingsModal}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tab Bar - Always visible, never clipped, with explicit shrink-0 items */}
        <nav
          id="main-mode-navigation"
          aria-label="Translation Modes"
          className="flex items-center justify-start sm:justify-center p-1 bg-slate-100/90 border border-slate-200 rounded-xl overflow-x-auto gap-1 shadow-inner scroll-smooth"
        >
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                id={`nav-mode-${m.id}`}
                onClick={() => onSelectMode(m.id)}
                className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="tracking-tight">{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar (Desktop View) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Tone Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-semibold uppercase tracking-wider leading-none">Tone:</span>
            <div className="flex items-center gap-0.5">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  id={`tone-select-${t.id}`}
                  onClick={() => onSelectTone(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-tight transition-all leading-tight ${
                    tone === t.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`${t.label} Tone`}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cloud / Offline Network Status Pill */}
          <button
            id="network-mode-btn"
            onClick={onToggleOffline}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 transition-all leading-tight ${
              offlineMode
                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/70'
                : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/70'
            }`}
            title="Toggle Cloud / Offline Mode"
          >
            {offlineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs uppercase tracking-wider font-bold">Offline Pack</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs uppercase tracking-wider font-bold">Real-Time Cloud</span>
              </>
            )}
          </button>

          {/* Language Packs Modal Trigger */}
          <button
            id="open-offline-packs-btn"
            onClick={onOpenOfflineModal}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
            title="Manage Offline Language Packs"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Export Transcript Trigger */}
          <button
            id="open-export-modal-btn"
            onClick={onOpenExportModal}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
            title="Export Conversation Transcript"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Settings Trigger */}
          <button
            id="open-settings-modal-btn"
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
            title="App Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
