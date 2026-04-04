/**
 * generateAudio.cjs - Downloads missing TTS audio (concurrent version)
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CATS = ['greetings', 'numbers', 'food', 'transport', 'shopping', 'daily'];
const words    = new Set();
const examples = new Set();

for (const cat of CATS) {
  const src     = fs.readFileSync(path.join(__dirname, `../src/data/categories/${cat}.ts`), 'utf8');
  const jsonStr = src.replace(new RegExp(`^export const ${cat} = `), '').replace(/;\s*$/, '');
  JSON.parse(jsonStr).forEach(item => {
    if (item.vietnamese?.trim())  words.add(item.vietnamese.trim());
    if (item.example_vn?.trim()) examples.add(item.example_vn.trim());
  });
}

function toHex(text) {
  return Buffer.from(text.normalize('NFC'), 'utf8').toString('hex');
}

const WORDS_DIR    = path.resolve(__dirname, '../public/audio/words');
const EXAMPLES_DIR = path.resolve(__dirname, '../public/audio/examples');
fs.mkdirSync(WORDS_DIR,    { recursive: true });
fs.mkdirSync(EXAMPLES_DIR, { recursive: true });

const tasks = [];
for (const t of words)    { const f = path.join(WORDS_DIR,    toHex(t) + '.mp3'); if (!fs.existsSync(f)) tasks.push([t, WORDS_DIR, f]); }
for (const t of examples) { const f = path.join(EXAMPLES_DIR, toHex(t) + '.mp3'); if (!fs.existsSync(f)) tasks.push([t, EXAMPLES_DIR, f]); }

console.log(`Missing: ${tasks.length}`);
if (tasks.length === 0) { console.log('All present!'); process.exit(0); }

const WORKER_CODE = `
'use strict';
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs   = require('fs');
const path = require('path');
const TEXT = Buffer.from(process.env.TTS_TEXT_B64, 'base64').toString('utf8');
const TMP  = process.env.TTS_TMPDIR;
const DEST = process.env.TTS_DESTFILE;
(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const tts = new MsEdgeTTS();
  await tts.setMetadata('vi-VN-HoaiMyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  await tts.toFile(TMP, TEXT);
  const src = path.join(TMP, 'audio.mp3');
  if (fs.existsSync(src)) fs.renameSync(src, DEST);
})().catch(() => {}).finally(() => {
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
  process.exit(0);
});
`;

const WORKER_PATH = path.join(__dirname, '_tts_worker.cjs');
fs.writeFileSync(WORKER_PATH, WORKER_CODE, 'utf8');

function downloadSync(text, dir, dest) {
  const hex    = toHex(text);
  const tmpDir = path.join(dir, '_tmp_' + hex);
  spawnSync(process.execPath, [WORKER_PATH], {
    stdio: 'ignore',
    timeout: 15000,
    env: {
      ...process.env,
      TTS_TEXT_B64: Buffer.from(text, 'utf8').toString('base64'),
      TTS_TMPDIR:   tmpDir,
      TTS_DESTFILE: dest,
    }
  });
}

// Concurrent download with CONCURRENCY limit
const CONCURRENCY = 6;

async function runAll() {
  let done = 0;
  let idx  = 0;

  async function runNext() {
    while (idx < tasks.length) {
      const [t, dir, f] = tasks[idx++];
      await new Promise(resolve => {
        setImmediate(() => {
          downloadSync(t, dir, f);
          done++;
          process.stdout.write(`\rDownloaded: ${done}/${tasks.length}  `);
          resolve();
        });
      });
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, runNext);
  await Promise.all(workers);
}

runAll().then(() => {
  try { fs.unlinkSync(WORKER_PATH); } catch {}
  console.log('\nAll done!');
  process.exit(0);
});
