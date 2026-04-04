const fs = require('fs');
const path = require('path');

const categories = ['greetings', 'numbers', 'food', 'transport', 'shopping', 'daily'];
const allWords = new Set();
const allExamples = new Set();

categories.forEach(cat => {
  try {
    const fileContent = fs.readFileSync(path.join(__dirname, `../src/data/categories/${cat}.ts`), 'utf8');
    const jsonStr = fileContent.replace(new RegExp(`^export const ${cat} = `), '').replace(/;\s*$/, '');
    const arr = JSON.parse(jsonStr);
    arr.forEach(item => {
      if (item.vietnamese && item.vietnamese.trim()) allWords.add(item.vietnamese.trim());
      if (item.example_vn && item.example_vn.trim()) allExamples.add(item.example_vn.trim());
    });
  } catch (err) {
    console.error(`Error parsing ${cat}:`, err);
  }
});

// Use same NFC normalization as frontend TextEncoder
function textToHex(text) {
  const normalized = text.normalize('NFC');
  const encoder = new (require('util').TextEncoder)();
  const bytes = encoder.encode(normalized);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

const wordsDir = path.join(__dirname, '../public/audio/words');
const examplesDir = path.join(__dirname, '../public/audio/examples');
fs.mkdirSync(wordsDir, { recursive: true });
fs.mkdirSync(examplesDir, { recursive: true });

// Check missing files
const missingWords = [];
const missingExamples = [];

for (const text of allWords) {
  const hex = textToHex(text);
  const f = path.join(wordsDir, hex + '.mp3');
  if (!fs.existsSync(f)) {
    missingWords.push({ text, hex });
  }
}

for (const text of allExamples) {
  const hex = textToHex(text);
  const f = path.join(examplesDir, hex + '.mp3');
  if (!fs.existsSync(f)) {
    missingExamples.push({ text, hex });
  }
}

console.log(`Words total: ${allWords.size}, missing: ${missingWords.length}`);
console.log(`Examples total: ${allExamples.size}, missing: ${missingExamples.length}`);
console.log(`Total to download: ${missingWords.length + missingExamples.length}`);
