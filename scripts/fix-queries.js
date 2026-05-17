const fs = require('fs');
let content = fs.readFileSync('sanity/lib/queries.ts', 'utf8');

// Find the end of isometricStackQuery
const idx = content.indexOf('export const isometricStackQuery');
const endIdx = content.indexOf('}', idx) + 2;

// Clean out the corrupted powershell append and add the proper query
const cleaned = content.substring(0, endIdx) + '\n\nexport const appEcosystemQuery = groq`\n*[_type == "appEcosystem"][0]{\n  faculty[]{\n    label,\n    icon,\n    "imageUrl": image.asset->url,\n    "imageAlt": coalesce(image.alt, label)\n  },\n  student[]{\n    label,\n    icon,\n    "imageUrl": image.asset->url,\n    "imageAlt": coalesce(image.alt, label)\n  },\n  parent[]{\n    label,\n    icon,\n    "imageUrl": image.asset->url,\n    "imageAlt": coalesce(image.alt, label)\n  }\n}\n`;\n';

fs.writeFileSync('sanity/lib/queries.ts', cleaned);
console.log('Fixed queries.ts');
