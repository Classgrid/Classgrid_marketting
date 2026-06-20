import fs from 'fs';
import path from 'path';

const scriptsDir = path.join(process.cwd(), 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js') || f.endsWith('.mjs'));

let scrubCount = 0;
files.forEach(f => {
  const filePath = path.join(scriptsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const sanityRegex = /['"]skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M['"]/g;
  const geminiRegex = /['"]AIzaSyB60vMuWPjIuDI0LP64dMQwqblRwN7UN6c['"]/g;
  
  let updated = content.replace(sanityRegex, 'process.env.SANITY_API_WRITE_TOKEN');
  updated = updated.replace(geminiRegex, 'process.env.GEMINI_API_KEY');
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    console.log('Scrubbed ' + f);
    scrubCount++;
  }
});
console.log('Total files scrubbed: ' + scrubCount);
