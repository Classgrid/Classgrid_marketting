const fs = require('fs');
let text = fs.readFileSync('sanity/lib/queries.ts', 'utf8');

const str = 'export const comparisonPageBySlugQuery = `*[_type == "comparisonPage" && slug == $slug][0]{';
const parts = text.split(str);
if (parts.length > 2) {
  // It appears 3 times. We want to keep the content BEFORE the first one,
  // and the content AFTER the last one.
  const goodText = parts[0] + str + parts[parts.length - 1];
  fs.writeFileSync('sanity/lib/queries.ts', goodText);
  console.log('Fixed file');
} else {
  console.log('Did not find multiple parts');
}
