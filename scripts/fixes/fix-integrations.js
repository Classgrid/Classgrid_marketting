const fs = require('fs');

const goodFile = fs.readFileSync('components/integration-hero.tsx', 'utf8');

// The UI folder contains the one the user sees right now because Shadcn installed it there 
// and Next.js might be using the @/components/ui/ path if it was auto updated in page.tsx
// I will just overwrite both with the 100% correct icon map I made.

if (fs.existsSync('components/ui/integration-hero.tsx')) {
    fs.writeFileSync('components/ui/integration-hero.tsx', goodFile);
}

// Ensure app/page.tsx points to the fixed version
let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(/\/components\/ui\/integration-hero/g, '/components/integration-hero');
fs.writeFileSync('app/page.tsx', page);

console.log('Fixed integrations');
