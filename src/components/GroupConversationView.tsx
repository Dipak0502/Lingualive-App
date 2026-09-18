import React, { useState, useEffect } from 'react';
import { GroupMember, GroupMessage, Language, TranslationTone } from '../types';
import { SUPPORTED_LANGUAGES, getLanguage } from '../data/languages';
import { speakText } from '../utils/speech';
import {
  Users,
  Send,
  Volume2,
  Sparkles,
  Plus,
  Radio,
  UserPlus,
  MessageSquare,
  Globe2,
  Check,
  Play
} from 'lucide-react';

interface GroupConversationViewProps {
  userLanguage: Language;
  onOpenUserLangModal: () => void;
  tone: TranslationTone;
  offlineMode: boolean;
}

const INITIAL_MEMBERS: GroupMember[] = [
  { id: 'mem-1', name: 'Sarah (You)', avatar: '👩‍💼', language: 'en', color: 'indigo' },
  { id: 'mem-2', name: 'Elena', avatar: '👩‍🔬', language: 'es', color: 'emerald' },
  { id: 'mem-3', name: 'Kenji', avatar: '👨‍💻', language: 'ja', color: 'rose' },
  { id: 'mem-4', name: 'Pierre', avatar: '👨‍🎨', language: 'fr', color: 'amber' },
  { id: 'mem-5', name: 'Hans', avatar: '👨‍💼', language: 'de', color: 'sky' }
];

const INITIAL_MESSAGES: GroupMessage[] = [
  {
    id: 'gmsg-1',
    memberId: 'mem-1',
    memberName: 'Sarah (You)',
    memberColor: 'indigo',
    sourceLanguage: 'en',
    originalText: 'Welcome everyone to our cross-border project launch meeting!',
    translations: {
      en: 'Welcome everyone to our cross-border project launch meeting!',
      es: '¡Bienvenidos todos a nuestra reunión de lanzamiento del proyecto transfronterizo!',
      ja: '皆様、国境を越えたプロジェクト立ち上げミーティングへようこそ！',
      fr: 'Bienvenue à tous à notre réunion de lancement de projet transfrontalier !',
      de: 'Willkommen alle zu unserem grenzüberschreitenden Projektstart-Treffen!'
    },
    timestamp: '10:00 AM'
  },
  {
    id: 'gmsg-2',
    memberId: 'mem-2',
    memberName: 'Elena',
    memberColor: 'emerald',
    sourceLanguage: 'es',
    originalText: '¡Muchas gracias Sarah! El equipo de Madrid ha completado las pruebas de latencia.',
    translations: {
      en: 'Thank you very much Sarah! The Madrid team has completed the latency tests.',
      es: '¡Muchas gracias Sarah! El equipo de Madrid ha completado las pruebas de latencia.',
      ja: 'サラさん、ありがとうございます！マドリードチームは遅延テストを完了しました。',
      fr: "Merci beaucoup Sarah ! L'équipe de Madrid a terminé les tests de latence.",
      de: 'Vielen Dank, Sarah! Das Team in Madrid hat die Latenztests abgeschlossen.'
    },
    timestamp: '10:01 AM'
  },
  {
    id: 'gmsg-3',
    memberId: 'mem-3',
    memberName: 'Kenji',
    memberColor: 'rose',
    sourceLanguage: 'ja',
    originalText: '東京側でもローカルモデルのメモリ最適化が順調に進んでいます。',
    translations: {
      en: 'In Tokyo as well, memory optimization for the local models is progressing smoothly.',
      es: 'También en Tokio, la optimización de memoria para los modelos locales progresa sin problemas.',
      ja: '東京側でもローカルモデルのメモリ最適化が順調に進んでいます。',
      fr: "À Tokyo également, l'optimisation de la mémoire pour les modèles locaux progresse bien.",
      de: 'Auch in Tokio schreitet die Speicheroptimierung für die lokalen Modelle reibungslos voran.'
    },
    timestamp: '10:02 AM'
  }
];

export const GroupConversationView: React.FC<GroupConversationViewProps> = ({
  userLanguage,
  onOpenUserLangModal,
  tone,
  offlineMode
}) => {
  const [members, setMembers] = useState<GroupMember[]>(INITIAL_MEMBERS);
  const [messages, setMessages] = useState<GroupMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeSpeakerMember, setActiveSpeakerMember] = useState<string>('mem-1');

  // Send a message from the active member and fan out translation to all languages
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const sender = members.find((m) => m.id === activeSpeakerMember) || members[0];
    const textToSend = inputMessage;
    setInputMessage('');
    setIsSending(true);

    const targetLangs = members.map((m) => m.language);

    try {
      let translationsMap: Record<string, string> = {};

      const response = await fetch('/api/group-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          sourceLang: sender.language,
          targetLangs,
          speakerName: sender.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        translationsMap = data.translations || {};
        translationsMap[sender.language] = textToSend;
      }

      const newMsg: GroupMessage = {
        id: `gmsg-${Date.now()}`,
        memberId: sender.id,
        memberName: sender.name,
        memberColor: sender.color,
        sourceLanguage: sender.language,
        originalText: textToSend,
        translations: translationsMap,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newMsg]);

      // Speak in user's language
      const userText = translationsMap[userLanguage.code] || textToSend;
      speakText(userText, userLanguage.speechCode);
    } catch (err) {
      console.error('Group translation error', err);
    } finally {
      setIsSending(false);
    }
  };

  const simulatePartnerMessage = (member: GroupMember, sampleText: string) => {
    setActiveSpeakerMember(member.id);
    setInputMessage(sampleText);
  };

  return (
    <div id="group-conversation-view" className="max-w-5xl mx-auto space-y-4">
      {/* Top Group Banner & Language Customization */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Multilingual Group Room (5 Participants)</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
                Live Fan-Out Translation
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Each participant speaks and reads in their own native language.
            </p>
          </div>
        </div>

        {/* User's Reading Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">You are reading in:</span>
          <button
            id="group-user-lang-btn"
            onClick={onOpenUserLangModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 transition-colors"
          >
            <span>{userLanguage.flag}</span>
            <span>{userLanguage.name}</span>
          </button>
        </div>
      </div>

      {/* Participants Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {members.map((m) => {
          const lang = getLanguage(m.language);
          const isSelectedSender = activeSpeakerMember === m.id;

          return (
            <button
              key={m.id}
              id={`group-member-${m.id}`}
              onClick={() => setActiveSpeakerMember(m.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                isSelectedSender
                  ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{m.avatar}</span>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{m.name}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Group Chat Stream */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isMe = msg.memberId === 'mem-1';
          const displayedText = msg.translations[userLanguage.code] || msg.originalText;
          const senderLang = getLanguage(msg.sourceLanguage);

          return (
            <div
              key={msg.id}
              id={`group-msg-${msg.id}`}
              className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 text-xs px-1">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <span>{msg.memberName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({senderLang.flag} {senderLang.name})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({msg.timestamp})</span>
              </div>

              {/* Message Bubble Card */}
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-4 ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-indigo-200'
                    : 'bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none shadow-sm text-slate-900'
                }`}
              >
                {/* Original foreign text if different from user's language */}
                {msg.sourceLanguage !== userLanguage.code && (
                  <div className={`text-xs mb-1.5 italic font-normal pb-1.5 border-b leading-relaxed ${isMe ? 'text-indigo-200 border-indigo-500' : 'text-slate-500 border-slate-200'}`}>
                    Original ({senderLang.name}): "{msg.originalText}"
                  </div>
                )}

                {/* Translated output in user's preferred language */}
                <div className="text-sm sm:text-base font-semibold leading-relaxed tracking-tight">
                  {displayedText}
                </div>

                {/* Action Footer */}
                <div className={`mt-2.5 pt-2 flex items-center justify-between text-xs border-t ${isMe ? 'border-indigo-500 text-indigo-100' : 'border-slate-200 text-slate-500'}`}>
                  <span className="text-[10px] font-medium leading-none">
                    Localized into {userLanguage.name}
                  </span>
                  <button
                    id={`tts-group-${msg.id}`}
                    onClick={() => speakText(displayedText, userLanguage.speechCode)}
                    className={`p-1 rounded-lg transition-colors flex items-center gap-1 font-semibold leading-none ${
                      isMe
                        ? 'hover:bg-indigo-700 text-white'
                        : 'hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Cockpit */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-2">
        <div className="text-xs text-slate-500 px-2 font-medium shrink-0 flex items-center gap-1.5">
          <span>Speaking as:</span>
          <span className="font-bold text-slate-900">
            {members.find((m) => m.id === activeSpeakerMember)?.name}
          </span>
        </div>

        <input
          id="group-chat-input"
          type="text"
          placeholder="Type in your language and fan-out translate to all..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
        />

        <button
          id="group-send-btn"
          onClick={handleSendMessage}
          disabled={isSending || !inputMessage.trim()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-40 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? 'Translating...' : 'Send'}</span>
        </button>
      </div>
    </div>
  );
};
