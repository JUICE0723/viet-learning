const fs = require('fs');
const path = require('path');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const vocabContent = fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.ts'), 'utf8');
const jsonRaw = vocabContent.replace(/^export const VOCABULARY_DB[^=]+=\s*/, '').replace(/;\s*$/, '');
let VOCABULARY_DB;
try {
  VOCABULARY_DB = eval('(' + jsonRaw + ')');
} catch(e) {
  console.error("Failed to parse", e);
  process.exit(1);
}

const wordsDir = path.join(__dirname, '../public/audio/words');
const examplesDir = path.join(__dirname, '../public/audio/examples');
fs.mkdirSync(wordsDir, { recursive: true });
fs.mkdirSync(examplesDir, { recursive: true });

function getHex(txt) {
  return Buffer.from(txt).toString('hex');
}

async function downloadAudio(tts, text, isExample) {
  const hex = getHex(text);
  const targetDir = isExample ? examplesDir : wordsDir;
  const targetFile = path.join(targetDir, hex + '.mp3');
  
  if (fs.existsSync(targetFile)) return;

  const tmpDir = path.join(targetDir, 'tmp_' + hex);
  try {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    await tts.toFile(tmpDir, text);
    
    const generatedAudio = path.join(tmpDir, 'audio.mp3');
    const generatedMeta = path.join(tmpDir, 'metadata.json');
    
    if (fs.existsSync(generatedAudio)) {
      fs.renameSync(generatedAudio, targetFile);
    }
    if (fs.existsSync(generatedMeta)) {
      fs.unlinkSync(generatedMeta);
    }
    fs.rmdirSync(tmpDir);
  } catch (err) {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function run() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("vi-VN-HoaiMyNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  
  const allWords = new Set();
  const allExamples = new Set();
  
  for (const cat in VOCABULARY_DB) {
     for (const item of VOCABULARY_DB[cat]) {
         if (item.vietnamese) allWords.add(item.vietnamese);
         if (item.example_vn) allExamples.add(item.example_vn);
     }
  }

  const wArray = Array.from(allWords);
  const eArray = Array.from(allExamples);
  const total = wArray.length + eArray.length;
  console.log(`Starting download for ${total} items...`);
  
  let c = 1;
  const chunkLimit = 5; // Reduced concurrency to avoid edge issues
  
  for (let i = 0; i < wArray.length; i += chunkLimit) {
    const chunk = wArray.slice(i, i + chunkLimit);
    await Promise.all(chunk.map(text => downloadAudio(tts, text, false)));
    c += chunk.length;
    process.stdout.write(`\rProgress: ${c}/${total}`);
    await new Promise(r => setTimeout(r, 200));
  }
  
  for (let i = 0; i < eArray.length; i += chunkLimit) {
    const chunk = eArray.slice(i, i + chunkLimit);
    await Promise.all(chunk.map(text => downloadAudio(tts, text, true)));
    c += chunk.length;
    process.stdout.write(`\rProgress: ${c}/${total}`);
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log("\nDone!");
  process.exit(0);
}

run();
