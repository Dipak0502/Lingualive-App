import React from 'react';
import { UserPreferences, TranslationTone } from '../types';
import {
  Settings,
  X,
  Volume2,
  Sliders,
  Shield,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: UserPreferences) => void;
  onClearAllLocalData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onClearAllLocalData
}) => {
  if (!isOpen) return null;

  const toneOptions: Array<{ id: TranslationTone; label: string; desc: string }> = [
    { id: 'casual', label: 'Casual', desc: 'Relaxed, friendly everyday conversation' },
    { id: 'formal', label: 'Formal', desc: 'Respectful, polite etiquette with elders & officials' },
    { id: 'business', label: 'Business', desc: 'Professional commercial meetings & contracts' },
    { id: 'travel', label: 'Travel', desc: 'Clear, concise phrasing for stations, hotels & dining' }
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="settings-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Settings & Preferences</h2>
              <p className="text-xs text-slate-500">Voice synthesis, privacy, and translation defaults</p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* TTS Speech Rate & Voice Settings */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                Speech Synthesis Voice Controls
              </span>
              <span className="text-indigo-600 font-mono font-semibold">{preferences.speechRate}x</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Playback Speed</span>
                <span>{preferences.speechRate}x (Normal 1.0x)</span>
              </div>
              <input
                id="speech-rate-slider"
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={preferences.speechRate}
                onChange={(e) =>
                  onUpdatePreferences({ ...preferences, speechRate: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Auto Playback Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Auto-Play Audio Translations</div>
                <div className="text-slate-500">Automatically speak translated responses aloud</div>
              </div>
              <input
                id="auto-play-toggle"
                type="checkbox"
                checked={preferences.autoPlayAudio}
                onChange={(e) =>
                  onUpdatePreferences({ ...preferences, autoPlayAudio: e.target.checked })
                }
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Default Translation Tone */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Default Translation Tone & Register
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  id={`pref-tone-${t.id}`}
                  onClick={() => onUpdatePreferences({ ...preferences, defaultTone: t.id })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferences.defaultTone === t.id
                      ? 'bg-indigo-50 border-indigo-500 text-slate-900 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900 mb-0.5 tracking-tight">{t.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal leading-normal">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & GDPR Compliance (TDD Section 12) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Privacy & Zero-Retention Security
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Ephemeral Audio Processing</div>
                <div className="text-slate-500">
                  Transcribed voice buffers are discarded immediately after translation.
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Save Local History on This Device</div>
                <div className="text-slate-500">Retain session transcripts in browser localStorage</div>
              </div>
              <input
                id="save-history-toggle"
                type="checkbox"
                checked={preferences.saveHistory}
                onChange={(e) =>
                  onUpdatePreferences({ ...preferences, saveHistory: e.target.checked })
                }
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Clear Data Reset */}
          <div className="pt-1">
            <button
              id="clear-all-data-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all local conversation logs and reset preferences?')) {
                  onClearAllLocalData();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100/80 text-rose-600 font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Conversation History</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
