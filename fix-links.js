const fs = require('fs');
const path = require('path');

const files = [
  'lib/ai/rag-answer.ts',
  'lib/ai/static-knowledge.ts',
  'lib/ai/platform-resources.ts',
  'lib/ai/platform-knowledge.ts'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace all instances of /community with /support/inquiry
    content = content.replace(/\/community/g, '/support/inquiry');
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
