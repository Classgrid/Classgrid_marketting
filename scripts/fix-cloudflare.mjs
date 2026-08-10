import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function fixCloudflare() {
  const query = `*[_type == "post" && slug.current == "cloudflare-startups-grant-2026"][0]`;
  const doc = await client.fetch(query);

  if (!doc) {
    console.error('Could not find Cloudflare blog in Sanity');
    return;
  }

  // Iterate through the portable text blocks and fix the text
  const newBody = doc.body?.en?.map(block => {
    if (block._type !== 'block' || !block.children) return block;

    const newChildren = block.children.map(span => {
      if (span._type !== 'span' || !span.text) return span;
      
      let text = span.text;
      // Fix 1
      text = text.replace(
        ", valid for the next 12 months. This grant gives",
        ". This grant gives"
      );
      // Fix 2
      text = text.replace(
        "caching and edge computing for the next 12 months without worrying",
        "caching and edge computing without worrying"
      );
      
      return { ...span, text };
    });

    return { ...block, children: newChildren };
  });

  if (newBody) {
    await client.patch(doc._id)
      .set({ 'body.en': newBody })
      .commit();
    console.log(`✅ Patched ${doc._id} successfully!`);
  }
}

fixCloudflare();
