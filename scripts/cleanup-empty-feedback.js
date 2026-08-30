/**
 * Cleanup Script: Remove empty feedbackHistory entries from Sanity
 * 
 * This removes all feedbackHistory entries that have NO comment AND NO title
 * (i.e., vote-only entries that were incorrectly added before the API fix).
 * Only entries with actual text comments should remain.
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function cleanup() {
  console.log('🔍 Fetching all apiDoc documents with feedbackHistory...\n');

  const docs = await client.fetch(`*[_type == "apiDoc" && defined(feedbackHistory) && length(feedbackHistory) > 0]{
    _id,
    title,
    feedbackHistory
  }`);

  console.log(`Found ${docs.length} documents with feedbackHistory\n`);

  let totalRemoved = 0;
  let totalKept = 0;

  for (const doc of docs) {
    const history = doc.feedbackHistory || [];
    
    // Find entries WITHOUT any comment or title (vote-only, should not be in history)
    const emptyEntries = history.filter(entry => {
      const hasComment = entry.comment && entry.comment.trim() !== '';
      const hasTitle = entry.title && entry.title.trim() !== '';
      return !hasComment && !hasTitle;
    });

    const keptEntries = history.filter(entry => {
      const hasComment = entry.comment && entry.comment.trim() !== '';
      const hasTitle = entry.title && entry.title.trim() !== '';
      return hasComment || hasTitle;
    });

    if (emptyEntries.length === 0) {
      console.log(`  ✅ "${doc.title}" — all ${history.length} entries have comments, skipping`);
      totalKept += history.length;
      continue;
    }

    console.log(`  🧹 "${doc.title}" — removing ${emptyEntries.length} empty entries, keeping ${keptEntries.length} with comments`);
    
    // Log what we're removing
    for (const entry of emptyEntries) {
      console.log(`     ❌ ${entry.reaction || '?'} | ${entry.userEmail || 'anonymous'} | ${entry.submittedAt || 'no date'}`);
    }

    // Replace feedbackHistory with only the entries that have comments
    await client
      .patch(doc._id)
      .set({ feedbackHistory: keptEntries })
      .commit();

    totalRemoved += emptyEntries.length;
    totalKept += keptEntries.length;
  }

  console.log(`\n✅ Done! Removed ${totalRemoved} empty entries. Kept ${totalKept} entries with comments.`);
}

cleanup().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
