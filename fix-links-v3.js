const fs = require('fs');
const path = require('path');

const files = [
  'lib/ai/rag-answer.ts',
  'lib/ai/static-knowledge.ts'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace all variations of Classgrid Talk link
    content = content.replace(/'Classgrid Talk' \(\/community\)/g, "'Classgrid Talk' (/support/inquiry)");
    content = content.replace(/CLASSGRID TALK \(\/community\)/g, "CLASSGRID TALK (/support/inquiry)");
    content = content.replace(/Classgrid Talk \(\/community\)/g, "Classgrid Talk (/support/inquiry)");
    
    // Re-verify the Forum link
    content = content.replace(/The ClassGrid Forum \—/g, 'The ClassGrid Forum (/community) —');
    content = content.replace(/The ClassGrid Forum \(/g, 'The ClassGrid Forum (/community) ('); // just in case
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fully Updated ${file}`);
  }
});
