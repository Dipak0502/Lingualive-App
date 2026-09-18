import { Language, OfflineLanguagePack } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speechCode: 'en-US', popular: true, packSizeMB: 112 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES', popular: true, packSizeMB: 98 },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (普通话)', flag: '🇨🇳', speechCode: 'zh-CN', popular: true, packSizeMB: 145 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP', popular: true, packSizeMB: 132 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR', popular: true, packSizeMB: 104 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE', popular: true, packSizeMB: 108 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', speechCode: 'pt-BR', popular: true, packSizeMB: 96 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT', popular: true, packSizeMB: 92 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA', direction: 'rtl', popular: true, packSizeMB: 124 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU', popular: true, packSizeMB: 118 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN', popular: true, packSizeMB: 120 },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN', popular: true, packSizeMB: 115 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', speechCode: 'ko-KR', popular: true, packSizeMB: 128 },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', speechCode: 'nl-NL', popular: false, packSizeMB: 88 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', speechCode: 'tr-TR', popular: false, packSizeMB: 94 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', speechCode: 'vi-VN', popular: false, packSizeMB: 90 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', speechCode: 'th-TH', popular: false, packSizeMB: 110 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', speechCode: 'id-ID', popular: false, packSizeMB: 84 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', speechCode: 'pl-PL', popular: false, packSizeMB: 92 },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', speechCode: 'el-GR', popular: false, packSizeMB: 96 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', speechCode: 'sv-SE', popular: false, packSizeMB: 86 }
];

export const DEFAULT_OFFLINE_PACKS: OfflineLanguagePack[] = [
  {
    packId: 'pack-en-es',
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    version: 'v2.4.1 (Compact Transformer)',
    sizeMB: 98,
    checksum: 'sha256:7f8a91c3d0b2e',
    downloaded: true,
    lastUpdated: '2026-08-20'
  },
  {
    packId: 'pack-en-ja',
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    version: 'v2.4.0 (Compact Transformer)',
    sizeMB: 132,
    checksum: 'sha256:4b1e90a88df3c',
    downloaded: true,
    lastUpdated: '2026-08-15'
  },
  {
    packId: 'pack-en-fr',
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    version: 'v2.3.9 (Compact Transformer)',
    sizeMB: 104,
    checksum: 'sha256:9c3f2110ea47b',
    downloaded: false
  },
  {
    packId: 'pack-en-de',
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    version: 'v2.3.8 (Compact Transformer)',
    sizeMB: 108,
    checksum: 'sha256:1a84f33d9021e',
    downloaded: false
  },
  {
    packId: 'pack-en-zh',
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    version: 'v2.4.2 (Compact Transformer)',
    sizeMB: 145,
    checksum: 'sha256:3e47b8192a01f',
    downloaded: false
  },
  {
    packId: 'pack-en-it',
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    version: 'v2.3.5 (Compact Transformer)',
    sizeMB: 92,
    checksum: 'sha256:88bc2a319f041',
    downloaded: false
  },
  {
    packId: 'pack-en-ko',
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    version: 'v2.3.7 (Compact Transformer)',
    sizeMB: 128,
    checksum: 'sha256:6e01a884fc921',
    downloaded: false
  },
  {
    packId: 'pack-en-pt',
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    version: 'v2.3.4 (Compact Transformer)',
    sizeMB: 96,
    checksum: 'sha256:22fa45e99810b',
    downloaded: false
  },
  {
    packId: 'pack-en-mr',
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    version: 'v2.3.6 (Compact Transformer)',
    sizeMB: 115,
    checksum: 'sha256:5a9e31d87cf02',
    downloaded: false
  }
];

export const QUICK_TRAVEL_PHRASES = [
  { text: 'Where is the nearest train station?', category: 'Directions' },
  { text: 'Could we please have the bill?', category: 'Dining' },
  { text: 'How much does this cost?', category: 'Shopping' },
  { text: 'Do you have a vegetarian option?', category: 'Dining' },
  { text: 'I have a reservation under this name.', category: 'Hotel' },
  { text: 'Can you help me? I need a doctor.', category: 'Emergency' },
  { text: 'Nice to meet you! Where are you from?', category: 'Social' },
  { text: 'Thank you very much for your kind assistance.', category: 'Courtesies' }
];

export const LANGUAGE_SAMPLE_PHRASES: Record<string, string[]> = {
  en: [
    "Hello, can you please recommend a good local restaurant?",
    "Could you tell me how to get to the main train station?",
    "Thank you so much for your warm hospitality!",
    "How much does a ticket to the city center cost?",
    "Excuse me, where is the nearest pharmacy?"
  ],
  es: [
    "¡Hola! Claro que sí, el restaurante de la esquina es excelente.",
    "Tiene que tomar la línea 3 del metro hacia el centro.",
    "¡De nada, que tenga un excelente viaje y disfrute la ciudad!",
    "El boleto cuesta dos euros con cincuenta.",
    "La farmacia está a solo dos cuadras a la derecha."
  ],
  ja: [
    "こんにちは！近くのおすすめの郷土料理店を教えていただけますか？",
    "中央駅へはどう行けばいいですか？",
    "温かいおもてなしを本当にありがとうございます！",
    "市内中心部までの切符はいくらですか？",
    "すみません、一番近い薬局はどこですか？"
  ],
  fr: [
    "Bonjour ! Pourriez-vous me recommander un bon restaurant local ?",
    "Pouvez-vous m'indiquer le chemin vers la gare centrale ?",
    "Merci beaucoup pour votre accueil chaleureux !",
    "Combien coûte un billet pour le centre-ville ?",
    "Excusez-moi, où se trouve la pharmacie la plus proche ?"
  ],
  de: [
    "Hallo, können Sie mir bitte ein gutes traditionelles Restaurant empfehlen?",
    "Könnten Sie mir sagen, wie ich zum Hauptbahnhof komme?",
    "Vielen Dank für Ihre großartige Gastfreundschaft!",
    "Wie viel kostet eine Fahrkarte ins Stadtzentrum?",
    "Entschuldigung, wo ist die nächste Apotheke?"
  ],
  zh: [
    "你好！请问能推荐一家好吃的地道特色餐厅吗？",
    "请问去中央火车站应该怎么走？",
    "非常感谢您热情的招待和帮助！",
    "请问去市中心的车票多少钱？",
    "请问最近的药店在哪里？"
  ],
  it: [
    "Ciao! Potresti consigliarmi un buon ristorante tipico qui vicino?",
    "Potrebbe dirmi come arrivare alla stazione centrale dei treni?",
    "Grazie mille per la vostra splendida ospitalità!",
    "Quanto costa il biglietto per il centro città?",
    "Mi scusi, dov'è la farmacia più vicina?"
  ],
  pt: [
    "Olá! Poderia me recomendar um bom restaurante típico da região?",
    "Poderia me dizer como chegar à estação de trem central?",
    "Muito obrigado pela sua calorosa hospitalidade!",
    "Quanto custa a passagem para o centro da cidade?",
    "Com licença, onde fica a farmácia mais próxima?"
  ],
  ko: [
    "안녕하세요! 근처에 맛있는 현지 식당을 추천해 주시겠어요?",
    "중앙역으로 가려면 어떻게 가야 하나요?",
    "따뜻하게 환대해 주셔서 진심으로 감사드립니다!",
    "시내 중심가까지 가는 표는 얼마인가요?",
    "실례합니다만, 가장 가까운 약국이 어디에 있나요?"
  ],
  ru: [
    "Здравствуйте! Не могли бы вы порекомендовать хороший местный ресторан?",
    "Подскажите, пожалуйста, как добраться до центрального вокзала?",
    "Большое спасибо за ваше гостеприимство и помощь!",
    "Сколько стоит билет до центра города?",
    "Извините, где находится ближайшая аптека?"
  ],
  ar: [
    "مرحباً! هل يمكنك أن تقترح علي مطعماً محلياً ممتازاً؟",
    "هل يمكنك إخباري كيف أصل إلى محطة القطار الرئيسية؟",
    "شكراً جزيلاً لك على حسن الضيافة والترحيب!",
    "كم تبلغ تكلفة التذكرة إلى وسط المدينة؟",
    "عفواً، أين توجد أقرب صيدلية من هنا؟"
  ],
  hi: [
    "नमस्ते! क्या आप मुझे यहाँ का कोई अच्छा स्थानीय रेस्तरां बता सकते हैं?",
    "क्या आप मुझे बता सकते हैं कि मुख्य रेलवे स्टेशन कैसे जाएँ?",
    "आपके इस गर्मजोशी भरे आतिथ्य के लिए बहुत-बहुत धन्यवाद!",
    "शहर के केंद्र तक जाने का टिकट कितने का है?",
    "माफ़ कीजिए, सबसे नज़दीकी दवाई की दुकान कहाँ है?"
  ],
  mr: [
    "नमस्कार! तुम्ही मला जवळचे एखादे चांगले स्थानिक रेस्टॉरंट सुचवू शकता का?",
    "मुख्य रेल्वे स्थानकावर कसे जायचे ते सांगू शकाल का?",
    "तुमच्या प्रेमळ आदरातिथ्याबद्दल मनापासून खूप खूप धन्यवाद!",
    "शहराच्या मध्यभागात जाण्यासाठी तिकिटाचे भाडे किती आहे?",
    "माफ करा, सर्वात जवळचे औषधांचे दुकान कुठे आहे?"
  ]
};

export function getSamplePhrases(langCode: string): string[] {
  return LANGUAGE_SAMPLE_PHRASES[langCode] || LANGUAGE_SAMPLE_PHRASES.en;
}

export function getLanguage(code: string): Language {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return (
    found || {
      code,
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      flag: '🌐',
      speechCode: 'en-US',
      packSizeMB: 100
    }
  );
}
