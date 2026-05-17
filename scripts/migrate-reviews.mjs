/**
 * One-time migration: rename old field names → new field names
 *   college  → institution
 *   helped   → reviewText
 *
 * Run: node scripts/migrate-reviews.mjs
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function migrate() {
  // Find all communityReview docs that still have the old field names
  const reviews = await client.fetch(
    `*[_type == "communityReview" && (defined(college) || defined(helped))] {
      _id, _rev, college, helped
    }`
  );

  if (reviews.length === 0) {
    console.log('✅ No reviews need migration. All good!');
    return;
  }

  console.log(`Found ${reviews.length} review(s) to migrate...\n`);

  for (const review of reviews) {
    const patch = client.patch(review._id).ifRevisionId(review._rev);

    // Copy old values to new fields, then remove old fields
    if (review.college) {
      patch.set({ institution: review.college }).unset(['college']);
    }
    if (review.helped) {
      patch.set({ reviewText: review.helped }).unset(['helped']);
    }

    const result = await patch.commit();
    console.log(`  ✅ Migrated: ${result._id}`);
  }

  console.log('\n🎉 Migration complete!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
