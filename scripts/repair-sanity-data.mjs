import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

function extractText(obj) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) {
    return obj.map(extractText).join(' ');
  }
  if (obj && typeof obj === 'object') {
    if (obj.text) return extractText(obj.text);
    if (obj.children) return extractText(obj.children);
  }
  return '';
}

function fixBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map(block => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map(child => {
          if (child._type === 'span' && Array.isArray(child.text)) {
            return {
              ...child,
              text: extractText(child.text)
            }
          }
          return child;
        })
      }
    }
    return block;
  });
}

async function run() {
  console.log("Fetching all articles to repair...");
  const articles = await client.fetch(`*[_type == "helpArticle"]`);
  
  let fixedCount = 0;

  for (const article of articles) {
    let needsPatch = false;
    const patch = {};

    // 1. Fix Summary (should be string, not array/object)
    if (article.summary && article.summary.en && typeof article.summary.en !== 'string') {
      patch['summary.en'] = extractText(article.summary.en);
      needsPatch = true;
    }

    // 2. Fix Portable Text spans
    if (article.content && Array.isArray(article.content.en)) {
      const fixedContent = fixBlocks(article.content.en);
      // Cheap way to check if we modified it
      if (JSON.stringify(fixedContent) !== JSON.stringify(article.content.en)) {
        patch['content.en'] = fixedContent;
        needsPatch = true;
      }
    }

    if (needsPatch) {
      console.log(`Fixing corrupted data in article: ${article.slug?.current}`);
      await client.patch(article._id).set(patch).commit();
      fixedCount++;
    }
  }

  console.log(`Done! Repaired ${fixedCount} corrupted articles.`);
}

run().catch(console.error);
