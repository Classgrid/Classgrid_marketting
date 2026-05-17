const fs = require('fs');
let c = fs.readFileSync('scripts/translate-all.mjs', 'utf8');
c = c.replace(/\\\`<span data-idx="\\\${index}">\\\${child\.text}<\/span>\\\`/g, '`<span data-idx="${index}">${child.text}</span>`');
fs.writeFileSync('scripts/translate-all.mjs', c);
console.log('Fixed');
