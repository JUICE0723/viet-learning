import { VOCABULARY_DB } from '../data/vocabulary';

export interface VocabularyItem {
  vietnamese: string;
  chinese: string;
  pronunciation: string;
  example_vn: string;
  example_zh: string;
}

export async function fetchVocabulary(category: string): Promise<VocabularyItem[]> {
  if (category === '我的最愛') {
    return getFavorites();
  }

  // Simulate network delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const data = VOCABULARY_DB[category];
    if (!data) {
      throw new Error(`無法找到分類: ${category} 的資料`);
    }
    return data;
  } catch (e) {
    console.error("Failed to fetch vocabulary from local database:", e);
    throw e;
  }
}

export function getFavorites(): VocabularyItem[] {
  try {
    const favs = localStorage.getItem('viet-learning-favorites');
    return favs ? JSON.parse(favs) : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(word: string): boolean {
  return getFavorites().some(item => item.vietnamese === word);
}

export function toggleFavorite(item: VocabularyItem): boolean {
  const favs = getFavorites();
  const index = favs.findIndex(f => f.vietnamese === item.vietnamese);
  if (index >= 0) {
    favs.splice(index, 1);
    localStorage.setItem('viet-learning-favorites', JSON.stringify(favs));
    return false; // Removed
  } else {
    favs.push(item);
    localStorage.setItem('viet-learning-favorites', JSON.stringify(favs));
    return true; // Added
  }
}
