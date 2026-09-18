import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Language, OfflineLanguagePack } from '../types';
import { Search, X, Check, HardDrive, Sparkles } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode: string;
  onSelect: (lang: Language) => void;
  title?: string;
  allowAuto?: boolean;
  offlinePacks?: OfflineLanguagePack[];
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
  title = 'Select Language',
  allowAuto = false,
  offlinePacks = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="language-select-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="language-select-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
          </div>
          <button
            id="close-language-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="language-search-input"
              type="text"
              placeholder="Search by name, native script, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Languages List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
          {allowAuto && (
            <button
              id="select-lang-auto"
              onClick={() => {
                onSelect({
                  code: 'auto',
                  name: 'Auto Detect Language',
                  nativeName: 'Auto Detection',
                  flag: '✨',
                  speechCode: 'en-US',
                  packSizeMB: 0
                });
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                selectedCode === 'auto'
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <span className="text-xl">✨</span>
                <div>
                  <div className="font-semibold text-sm text-slate-900 tracking-tight">Auto Detect Language</div>
                  <div className="text-xs text-slate-500 font-normal leading-normal">Listens and automatically detects speech or text</div>
                </div>
              </div>
              {selectedCode === 'auto' && <Check className="w-4 h-4 text-indigo-600" />}
            </button>
          )}

          {filtered.map((lang) => {
            const isSelected = selectedCode === lang.code;
            const pack = offlinePacks.find((p) => p.code === lang.code);
            const isOfflineReady = pack?.downloaded;

            return (
              <button
                key={lang.code}
                id={`select-lang-${lang.code}`}
                onClick={() => {
                  onSelect(lang);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2 text-slate-900 tracking-tight">
                      {lang.name}
                      {lang.popular && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold uppercase tracking-wider leading-none">
                          Top Tier
                        </span>
                      )}
                      {isOfflineReady && (
                        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider leading-none" title="Offline Pack Downloaded">
                          <HardDrive className="w-2.5 h-2.5" />
                          Offline Pack
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-normal leading-normal">{lang.nativeName}</div>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm font-normal">
              No languages matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
