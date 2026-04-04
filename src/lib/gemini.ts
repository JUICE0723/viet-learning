import { VOCABULARY_DB } from '../data/vocabulary';

export interface VocabularyItem {
  vietnamese: string;
  chinese: string;
  pronunciation: string;
  example_vn: string;
  example_zh: string;
}

export async function fetchVocabulary(category: string): Promise<VocabularyItem[]> {
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
