const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const categories = ['greetings', 'numbers', 'food', 'transport', 'shopping', 'daily'];
const allWords = new Set();
const allExamples = new Set();

categories.forEach(cat => {
  try {
    const fileContent = fs.readFileSync(path.join(__dirname, `../src/data/categories/${cat}.ts`), 'utf8');
    const jsonStr = fileContent.replace(new RegExp(`^export const ${cat} = `), '').replace(/;\s*$/, '');
    const arr = JSON.parse(jsonStr);
    arr.forEach(item => {
      if (item.vietnamese) allWords.add(item.vietnamese);
      if (item.example_vn) allExamples.add(item.example_vn);
    });
  } catch (err) {
    console.error(`Error parsing ${cat}:`, err);
  }
});

const wordsDir = path.join(__dirname, '../public/audio/words');
const examplesDir = path.join(__dirname, '../public/audio/examples');
fs.mkdirSync(wordsDir, { recursive: true });
fs.mkdirSync(examplesDir, { recursive: true });

function getHex(txt) {
  return Buffer.from(txt).toString('hex');
}

const wArray = Array.from(allWords).filter(i => i.trim());
const eArray = Array.from(allExamples).filter(i => i.trim());
const total = wArray.length + eArray.length;
console.log(`Starting download for ${total} items...`);

function runWorker(text, isExample) {
  const hex = getHex(text);
  const targetDir = isExample ? examplesDir : wordsDir;
  const targetFile = path.join(targetDir, hex + '.mp3');
  
  if (fs.existsSync(targetFile)) return;

  const script = `
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
async function r() {
  let tts = new MsEdgeTTS();
  await tts.setMetadata('vi-VN-HoaiMyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  await tts.toFile('${targetDir.replace(/\\/g, '/')}//tmp_${hex}', \`${text.replace(/`/g, '\\`')}\`);
  fs.renameSync('${targetDir.replace(/\\/g, '/')}//tmp_${hex}//audio.mp3', '${targetFile.replace(/\\/g, '/')}');
  fs.rmSync('${targetDir.replace(/\\/g, '/')}//tmp_${hex}', { recursive: true, force: true });
}
r().catch(e => { process.exit(1); });
  `;
  try {
    execSync(`node -e "${script.replace(/\n/g, ' ')}"`, { stdio: 'ignore' });
  } catch (e) {
  }
}

let c = 1;
for (const text of wArray) {
  runWorker(text, false);
  process.stdout.write(`\rProgress: ${c}/${total}`);
  c++;
}

for (const text of eArray) {
  runWorker(text, true);
  process.stdout.write(`\rProgress: ${c}/${total}`);
  c++;
}

console.log("\nDone!");
