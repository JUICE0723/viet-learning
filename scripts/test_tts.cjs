const { MSEdgeTTS } = require('msedge-tts');

async function test() {
  const tts = new MSEdgeTTS();
  await tts.setMetadata('vi-VN-HoaiMyNeural', tts.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  await tts.toFile('test.mp3', 'Chào bạn');
  console.log('Success');
}
test().catch(console.error);
