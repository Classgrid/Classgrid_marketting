// Script to add a test image to the Introduction docs page in Sanity
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2026-03-30',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function addImageToIntroduction() {
  // First, fetch the current introduction doc
  const doc = await client.fetch(`*[_type == "apiDoc" && slug.current == "introduction"][0]`);

  if (!doc) {
    console.error('❌ Introduction doc not found in Sanity');
    return;
  }

  console.log('📄 Found doc:', doc.title);
  console.log('📝 Current content length:', doc.content?.length || 0);

  // Add image markdown after the first paragraph
  const imageMarkdown = `\n\n![Two-factor authentication status on the Members page](https://fiherpwzabiftbkwuqsb.supabase.co/storage/v1/object/public/notes-files/members-2fa-dark.avif "Two-factor authentication status on the Members page")\n\n`;

  // Find a good place to insert — after "custom React components!" paragraph
  const insertAfter = 'custom React components!';
  let newContent = doc.content;

  if (doc.content.includes(insertAfter)) {
    const idx = doc.content.indexOf(insertAfter) + insertAfter.length;
    newContent = doc.content.slice(0, idx) + imageMarkdown + doc.content.slice(idx);
    console.log('✅ Inserting image after "custom React components!" paragraph');
  } else {
    // Fallback: add after first paragraph
    const firstParaEnd = doc.content.indexOf('\n\n');
    if (firstParaEnd !== -1) {
      newContent = doc.content.slice(0, firstParaEnd) + imageMarkdown + doc.content.slice(firstParaEnd);
      console.log('✅ Inserting image after first paragraph (fallback)');
    }
  }

  // Patch the document
  await client
    .patch(doc._id)
    .set({ content: newContent })
    .commit();

  console.log('🎉 Done! Image added to Introduction doc.');
  console.log('🔄 Refresh localhost:3000/docs/introduction to see it.');
}

addImageToIntroduction().catch(console.error);
