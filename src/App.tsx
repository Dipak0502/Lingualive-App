import React, { useState, useEffect } from 'react';
import {
  Language,
  TranslationSegment,
  TranslationTone,
  OfflineLanguagePack,
  UserPreferences
} from './types';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_OFFLINE_PACKS,
  getLanguage
} from './data/languages';
import { Header, AppMode } from './components/Header';
import { TwoWayConversationView } from './components/TwoWayConversationView';
import { TextTranslatorView } from './components/TextTranslatorView';
import { GroupConversationView } from './components/GroupConversationView';
import { LiveCaptionsView } from './components/LiveCaptionsView';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { OfflinePacksModal } from './components/OfflinePacksModal';
import { TranscriptExportModal } from './components/TranscriptExportModal';
import { SettingsModal } from './components/SettingsModal';
import { Mic, FileText, Users, Radio } from 'lucide-react';

const INITIAL_SEGMENTS: TranslationSegment[] = [
  {
    id: 'init-seg-1',
    speaker: 'speaker_a',
    speakerName: 'Speaker A (English)',
    originalText: 'Good evening! We have a dinner reservation for two under Smith.',
    translatedText: '¡Buenas noches! Tenemos una reserva para cenar para dos personas a nombre de Smith.',
    sourceLang: 'en',
    targetLang: 'es',
    timestamp: '7:42 PM',
    tone: 'travel',
    romanization: 'Bwe-nas no-ches! Te-ne-mos u-na re-ser-va...',
    latencyMs: {
      networkMs: 25,
      asrMs: 80,
      mtMs: 140,
      ttsMs: 45,
      totalMs: 290,
      targetSLA: 2000
    }
  },
  {
    id: 'init-seg-2',
    speaker: 'speaker_b',
    speakerName: 'Speaker B (Spanish)',
    originalText: '¡Perfecto! Su mesa junto a la ventana ya está lista. ¿Desean ver la carta de vinos?',
    translatedText: 'Perfect! Your table by the window is ready now. Would you like to see the wine list?',
    sourceLang: 'es',
    targetLang: 'en',
    timestamp: '7:43 PM',
    tone: 'travel',
    latencyMs: {
      networkMs: 20,
      asrMs: 70,
      mtMs: 120,
      ttsMs: 40,
      totalMs: 250,
      targetSLA: 2000
    }
  }
];

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('two_way');
  const [sourceLang, setSourceLang] = useState<Language>(SUPPORTED_LANGUAGES[0]); // English
  const [targetLang, setTargetLang] = useState<Language>(SUPPORTED_LANGUAGES[1]); // Spanish
  const [tone, setTone] = useState<TranslationTone>('travel');
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [offlinePacks, setOfflinePacks] = useState<OfflineLanguagePack[]>(() => {
    try {
      const saved = localStorage.getItem('lingualive_packs');
      return saved ? JSON.parse(saved) : DEFAULT_OFFLINE_PACKS;
    } catch {
      return DEFAULT_OFFLINE_PACKS;
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('lingualive_prefs');
      return saved
        ? JSON.parse(saved)
        : {
            defaultTone: 'travel',
            speechRate: 1.0,
            autoPlayAudio: true,
            saveHistory: true,
            preferredVoiceGender: 'neutral',
            theme: 'dark'
          };
    } catch {
      return {
        defaultTone: 'travel',
        speechRate: 1.0,
        autoPlayAudio: true,
        saveHistory: true,
        preferredVoiceGender: 'neutral',
        theme: 'dark'
      };
    }
  });

  const [segments, setSegments] = useState<TranslationSegment[]>(() => {
    try {
      const saved = localStorage.getItem('lingualive_segments');
      return saved ? JSON.parse(saved) : INITIAL_SEGMENTS;
    } catch {
      return INITIAL_SEGMENTS;
    }
  });

  // Modals state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langModalTarget, setLangModalTarget] = useState<'source' | 'target' | 'user'>('source');
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Save to localStorage if allowed by preferences
  useEffect(() => {
    if (preferences.saveHistory) {
      localStorage.setItem('lingualive_segments', JSON.stringify(segments));
    }
  }, [segments, preferences.saveHistory]);

  useEffect(() => {
    localStorage.setItem('lingualive_packs', JSON.stringify(offlinePacks));
  }, [offlinePacks]);

  useEffect(() => {
    localStorage.setItem('lingualive_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Handlers
  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleOpenLangModal = (target: 'source' | 'target' | 'user') => {
    setLangModalTarget(target);
    setIsLangModalOpen(true);
  };

  const handleSelectLanguage = (lang: Language) => {
    if (langModalTarget === 'source') {
      setSourceLang(lang);
    } else if (langModalTarget === 'target') {
      setTargetLang(lang);
    } else if (langModalTarget === 'user') {
      setSourceLang(lang);
    }
  };

  const handleAddSegment = (segment: TranslationSegment) => {
    setSegments((prev) => [...prev, segment]);
  };

  const handleClearSegments = () => {
    setSegments([]);
    localStorage.removeItem('lingualive_segments');
  };

  const handleUpdatePack = (updatedPack: OfflineLanguagePack) => {
    setOfflinePacks((prev) =>
      prev.map((p) => (p.packId === updatedPack.packId ? updatedPack : p))
    );
  };

  const handleDeletePack = (packId: string) => {
    setOfflinePacks((prev) =>
      prev.map((p) => (p.packId === packId ? { ...p, downloaded: false } : p))
    );
  };

  const handleClearAllLocalData = () => {
    localStorage.clear();
    setSegments([]);
    setOfflinePacks(DEFAULT_OFFLINE_PACKS);
    setPreferences({
      defaultTone: 'travel',
      speechRate: 1.0,
      autoPlayAudio: true,
      saveHistory: true,
      preferredVoiceGender: 'neutral',
      theme: 'dark'
    });
  };

  return (
    <div id="lingualive-root" className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        tone={tone}
        onSelectTone={setTone}
        offlineMode={offlineMode}
        onToggleOffline={() => setOfflineMode(!offlineMode)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        unreadSegmentsCount={segments.length}
      />

      {/* Main Body View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-6 flex flex-col">
        {currentMode === 'two_way' && (
          <TwoWayConversationView
            sourceLang={sourceLang}
            targetLang={targetLang}
            onOpenSourceModal={() => handleOpenLangModal('source')}
            onOpenTargetModal={() => handleOpenLangModal('target')}
            onSwapLanguages={handleSwapLanguages}
            tone={tone}
            offlineMode={offlineMode}
            segments={segments}
            onAddSegment={handleAddSegment}
            onClearSegments={handleClearSegments}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {currentMode === 'text' && (
          <TextTranslatorView
            sourceLang={sourceLang}
            targetLang={targetLang}
            onOpenSourceModal={() => handleOpenLangModal('source')}
            onOpenTargetModal={() => handleOpenLangModal('target')}
            onSwapLanguages={handleSwapLanguages}
            tone={tone}
            onSelectTone={setTone}
            offlineMode={offlineMode}
          />
        )}

        {currentMode === 'group' && (
          <GroupConversationView
            userLanguage={sourceLang}
            onOpenUserLangModal={() => handleOpenLangModal('user')}
            tone={tone}
            offlineMode={offlineMode}
          />
        )}

        {currentMode === 'live_captions' && (
          <LiveCaptionsView
            sourceLang={sourceLang}
            targetLang={targetLang}
            onOpenSourceModal={() => handleOpenLangModal('source')}
            onOpenTargetModal={() => handleOpenLangModal('target')}
            tone={tone}
            offlineMode={offlineMode}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation for Mobile Devices */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {[
            { id: 'two_way' as AppMode, label: '2-Way Voice', icon: Mic },
            { id: 'text' as AppMode, label: 'Text', icon: FileText },
            { id: 'group' as AppMode, label: 'Group', icon: Users },
            { id: 'live_captions' as AppMode, label: 'Captions', icon: Radio },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                id={`bottom-nav-${m.id}`}
                onClick={() => setCurrentMode(m.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[10px] leading-tight truncate">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <LanguageSelectModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedCode={langModalTarget === 'source' ? sourceLang.code : targetLang.code}
        onSelect={handleSelectLanguage}
        title={
          langModalTarget === 'source'
            ? 'Select Speaker A / Source Language'
            : langModalTarget === 'target'
            ? 'Select Speaker B / Target Language'
            : 'Select Your Preferred Reading Language'
        }
        allowAuto={langModalTarget === 'source'}
        offlinePacks={offlinePacks}
      />

      <OfflinePacksModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        packs={offlinePacks}
        onUpdatePack={handleUpdatePack}
        onDeletePack={handleDeletePack}
      />

      <TranscriptExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        segments={segments}
        sourceLang={sourceLang}
        targetLang={targetLang}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={setPreferences}
        onClearAllLocalData={handleClearAllLocalData}
      />
    </div>
  );
}
