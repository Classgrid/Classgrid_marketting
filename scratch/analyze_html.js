const fs = require('fs');
const html = fs.readFileSync('competitor_blog.html', 'utf8');

// Extract body
const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/si);
if (bodyMatch) {
  const body = bodyMatch[1];
  
  // Extract all class attributes
  const classMatches = body.match(/class="([^"]+)"/g) || [];
  
  // Flatten and get unique classes
  const classes = classMatches
    .map(c => c.replace('class="', '').replace('"', ''))
    .join(' ')
    .split(/\s+/);
    
  const uniqueClasses = [...new Set(classes)].filter(c => c.length > 0);
  
  // Filter interesting layout classes
  const layouts = uniqueClasses.filter(c => c.startsWith('max-w-') || c.startsWith('w-') || c.startsWith('px-') || c.startsWith('py-') || c.startsWith('text-') || c.startsWith('mx-') || c.startsWith('my-') || c.startsWith('gap-') || c.startsWith('mt-') || c.startsWith('mb-'));
  
  console.log('--- INTERESTING TAILWIND CLASSES FOUND ---');
  console.log(layouts.join('\n'));
} else {
  console.log('No body found');
}
