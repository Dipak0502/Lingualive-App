export type TranslationTone = 'casual' | 'formal' | 'business' | 'travel';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
  speechCode: string;
  popular?: boolean;
  packSizeMB: number;
}

export interface LatencyBreakdown {
  networkMs: number;
  asrMs: number;
  mtMs: number;
  ttsMs: number;
  totalMs: number;
  targetSLA: number; // 2000ms
}

export interface TranslationSegment {
  id: string;
  conversationId?: string;
  speaker: 'speaker_a' | 'speaker_b' | string;
  speakerName?: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedLang?: string;
  confidence?: number;
  timestamp: string;
  tone?: TranslationTone;
  romanization?: string;
  latencyMs?: LatencyBreakdown;
  audioBase64?: string;
  starred?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  mode: 'two_way' | 'face_to_face' | 'group' | 'live_captions' | 'text';
  sourceLang: string;
  targetLang: string;
  startedAt: string;
  endedAt?: string;
  segments: TranslationSegment[];
  optedInStorage: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  language: string;
  color: string;
}

export interface GroupMessage {
  id: string;
  memberId: string;
  memberName: string;
  memberColor: string;
  sourceLanguage: string;
  originalText: string;
  translations: Record<string, string>; // langCode -> translatedText
  timestamp: string;
}

export interface OfflineLanguagePack {
  packId: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  version: string;
  sizeMB: number;
  checksum: string;
  downloaded: boolean;
  downloading?: boolean;
  progress?: number;
  lastUpdated?: string;
}

export interface OCRBoundingBox {
  id: string;
  originalText: string;
  translatedText: string;
  category?: 'sign' | 'menu_item' | 'price' | 'headline' | 'paragraph';
  box: {
    ymin: number; // 0 - 1000
    xmin: number; // 0 - 1000
    ymax: number; // 0 - 1000
    xmax: number; // 0 - 1000
  };
}

export interface LatencyBreakdown {
  networkMs: number;
  asrMs: number;
  mtMs: number;
  ttsMs: number;
  totalMs: number;
  targetSLA: number; // 2000ms
}

export interface UserPreferences {
  recentLanguagePairs?: Array<{ source: string; target: string }>;
  defaultTone: TranslationTone;
  autoPlayAudio: boolean;
  speechRate: number; // 0.5 - 1.5
  preferredVoiceGender?: 'female' | 'male' | 'neutral';
  saveHistory: boolean;
  theme?: 'dark' | 'light';
}
