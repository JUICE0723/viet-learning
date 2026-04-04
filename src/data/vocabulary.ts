import { greetings } from './categories/greetings';
import { numbers } from './categories/numbers';
import { food } from './categories/food';
import { transport } from './categories/transport';
import { shopping } from './categories/shopping';
import { daily } from './categories/daily';

export interface VocabularyItem {
  vietnamese: string;
  chinese: string;
  pronunciation?: string;
  example_vn: string;
  example_zh: string;
}

export const CATEGORIES = [
  { id: 'greetings', name: '基礎問候', icon: '👋', color: 'bg-blue-100 text-blue-600' },
  { id: 'numbers', name: '數字與時間', icon: '123', color: 'bg-green-100 text-green-600' },
  { id: 'food', name: '飲食', icon: '🍜', color: 'bg-orange-100 text-orange-600' },
  { id: 'transport', name: '交通與方向', icon: '🛵', color: 'bg-purple-100 text-purple-600' },
  { id: 'shopping', name: '購物', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { id: 'daily', name: '日常生活', icon: '🏠', color: 'bg-teal-100 text-teal-600' }
] as const;

export const VOCABULARY_DB: Record<string, VocabularyItem[]> = {
  greetings: greetings,
  numbers: numbers,
  food: food,
  transport: transport,
  shopping: shopping,
  daily: daily
};
