const fs = require('fs');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');

const dir = 'C:\\Users\\nikhi\\.gemini\\antigravity-ide\\brain\\028e8e87-4e01-4b3f-8189-b8bdf8cd8d49';
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('media_') && f.endsWith('.png'))
  .map(f => ({ name: f, time: fs.statSync(dir + '\\' + f).mtime.getTime() }))
  .sort((a, b) => b.time - a.time);

const imgPath = dir + '\\' + files[0].name;
console.log('Reading:', imgPath);

const buffer = fs.readFileSync(imgPath);
const png = PNG.sync.read(buffer);
const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

if (code) {
  console.log('Found QR code:', code.data);
} else {
  console.log('No QR code found.');
}
