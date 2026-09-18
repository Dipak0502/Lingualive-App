import { OCRBoundingBox } from '../types';

export interface SampleCameraScene {
  id: string;
  title: string;
  category: string;
  location: string;
  sourceLang: string;
  targetLang: string;
  description: string;
  imageUrl: string;
  boxes: OCRBoundingBox[];
}

export const SAMPLE_CAMERA_SCENES: SampleCameraScene[] = [
  {
    id: 'tokyo-ramen-menu',
    title: 'Tokyo Ramen Shop Menu',
    category: 'Restaurant & Dining',
    location: 'Shinjuku, Tokyo 🇯🇵',
    sourceLang: 'ja',
    targetLang: 'en',
    description: 'Traditional handwritten wooden board menu in a cozy ramen restaurant.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    boxes: [
      {
        id: 'box-1',
        originalText: '特製濃厚豚骨らーめん',
        translatedText: 'Special Rich Tonkotsu Ramen ($12.50)',
        category: 'menu_item',
        box: { ymin: 120, xmin: 150, ymax: 260, xmax: 850 }
      },
      {
        id: 'box-2',
        originalText: '自家製炙りチャーシュー盛り',
        translatedText: 'House-made Seared Chashu Pork Platter',
        category: 'menu_item',
        box: { ymin: 300, xmin: 180, ymax: 420, xmax: 820 }
      },
      {
        id: 'box-3',
        originalText: '味付け半熟玉子トッピング',
        translatedText: 'Seasoned Soft-Boiled Egg Topping',
        category: 'menu_item',
        box: { ymin: 460, xmin: 200, ymax: 560, xmax: 800 }
      },
      {
        id: 'box-4',
        originalText: 'お支払いは現金または電子マネーのみとなります',
        translatedText: 'Notice: Payment by cash or IC transit card only',
        category: 'sign',
        box: { ymin: 680, xmin: 120, ymax: 820, xmax: 880 }
      }
    ]
  },
  {
    id: 'barcelona-metro-sign',
    title: 'Barcelona Metro Transit Direction',
    category: 'Transit & Directions',
    location: 'Passeig de Gràcia, Barcelona 🇪🇸',
    sourceLang: 'es',
    targetLang: 'en',
    description: 'Bilingual station signs with transfers and accessibility instructions.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    boxes: [
      {
        id: 'box-es-1',
        originalText: 'LÍNEA 3 — DIRECCIÓN ZONA UNIVERSITÀRIA',
        translatedText: 'LINE 3 — TOWARDS UNIVERSITY ZONE',
        category: 'headline',
        box: { ymin: 150, xmin: 100, ymax: 270, xmax: 900 }
      },
      {
        id: 'box-es-2',
        originalText: 'Correspondencia con Línea 4 y Rodalies de Catalunya',
        translatedText: 'Transfer to Line 4 & Regional Commuter Trains',
        category: 'sign',
        box: { ymin: 320, xmin: 130, ymax: 460, xmax: 870 }
      },
      {
        id: 'box-es-3',
        originalText: 'Acceso adaptado para personas con movilidad reducida por ascensor',
        translatedText: 'Step-free accessible elevator for reduced mobility passengers',
        category: 'sign',
        box: { ymin: 520, xmin: 120, ymax: 680, xmax: 880 }
      },
      {
        id: 'box-es-4',
        originalText: 'Conserve su billete hasta la salida de la estación',
        translatedText: 'Please keep your ticket until leaving the station',
        category: 'price',
        box: { ymin: 740, xmin: 160, ymax: 860, xmax: 840 }
      }
    ]
  },
  {
    id: 'paris-cafe-menu',
    title: 'Parisian Bistro Blackboard',
    category: 'Restaurant & Dining',
    location: 'Montmartre, Paris 🇫🇷',
    sourceLang: 'fr',
    targetLang: 'en',
    description: 'Chalkboard specials at a traditional French sidewalk cafe.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    boxes: [
      {
        id: 'box-fr-1',
        originalText: 'PLAT DU JOUR: Canard confit aux herbes de Provence',
        translatedText: "TODAY'S SPECIAL: Crispy duck confit with Provençal herbs (€18.50)",
        category: 'menu_item',
        box: { ymin: 140, xmin: 120, ymax: 280, xmax: 880 }
      },
      {
        id: 'box-fr-2',
        originalText: 'Soupe à l’oignon gratinée maison',
        translatedText: 'Homemade French onion soup with melted Gruyère',
        category: 'menu_item',
        box: { ymin: 320, xmin: 150, ymax: 440, xmax: 850 }
      },
      {
        id: 'box-fr-3',
        originalText: 'Tarte Tatin tiède servie avec crème fraîche d’Isigny',
        translatedText: 'Warm caramelized apple tart with Normandy cream',
        category: 'menu_item',
        box: { ymin: 490, xmin: 140, ymax: 620, xmax: 860 }
      },
      {
        id: 'box-fr-4',
        originalText: 'Service et taxes inclus • Carte bancaire acceptée dès 10€',
        translatedText: 'Service & taxes included • Card accepted from €10',
        category: 'sign',
        box: { ymin: 690, xmin: 110, ymax: 830, xmax: 890 }
      }
    ]
  }
];
