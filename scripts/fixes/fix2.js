const fs = require('fs');
let c = fs.readFileSync('scripts/translate-all.mjs', 'utf8');
c = c.replace(/const spanRegex = \/<span data-idx="\((\\\\*)d\+\)">\(\[\^<\]\*\)<(\\\\*)\/span>\/g;/g, 'const spanRegex = /<span data-idx="(\\\\d+)">([^<]*)<\\/span>/g;');
fs.writeFileSync('scripts/translate-all.mjs', c);
console.log('Fixed');
