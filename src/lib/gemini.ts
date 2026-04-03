export interface VocabularyItem {
  vietnamese: string;
  chinese: string;
  pronunciation: string;
  example_vn: string;
  example_zh: string;
}

export async function fetchVocabulary(category: string): Promise<VocabularyItem[]> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Failed to fetch vocabulary from API:", e);
    throw e;
  }
}
