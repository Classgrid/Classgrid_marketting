require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_WRITE_TOKEN
});

async function main() {
  console.log('Fetching apiDoc documents...');
  const docs = await client.fetch(`*[_type == "apiDoc" && defined(feedbackHistory)] { _id, _rev, feedbackHistory }`);
  console.log(`Found ${docs.length} documents with feedback history.`);

  for (const doc of docs) {
    if (!doc.feedbackHistory || doc.feedbackHistory.length === 0) continue;

    const originalLength = doc.feedbackHistory.length;

    const newFeedbackHistory = doc.feedbackHistory.filter(item => {
      const hasComment = item.comment && item.comment.trim() !== '';
      const hasEmail = item.userEmail && item.userEmail.trim() !== '';
      return hasComment || hasEmail;
    });

    if (newFeedbackHistory.length < originalLength) {
      console.log(`Document ${doc._id}: removing ${originalLength - newFeedbackHistory.length} empty feedback entries.`);
      
      try {
        await client.patch(doc._id)
          .set({ feedbackHistory: newFeedbackHistory })
          .commit();
        console.log(`Successfully updated ${doc._id}`);
      } catch (err) {
        console.error(`Failed to update ${doc._id}:`, err.message);
      }
    }
  }

  console.log('Done cleaning up feedback history.');
}

main().catch(console.error);
