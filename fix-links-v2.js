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
    
    // Replace Classgrid Talk (/community) with (/support/inquiry)
    content = content.replace(/Classgrid Talk: \/community/g, 'Classgrid Talk: /support/inquiry');
    content = content.replace(/Classgrid Talk \(\/community\)/g, 'Classgrid Talk (/support/inquiry)');
    content = content.replace(/\[Classgrid Talk\]\(\/community\)/g, '[Classgrid Talk](/support/inquiry)');
    
    // Ensure the Forum is correctly mapped to /community
    content = content.replace(/The ClassGrid Forum \—/g, 'The ClassGrid Forum (/community) —');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
