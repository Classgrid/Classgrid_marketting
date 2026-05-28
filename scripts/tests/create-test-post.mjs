import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const randomStr = crypto.randomBytes(4).toString('hex');
  // Prefixing the _id with 'drafts.' creates it as a draft in Sanity.
  const docId = `drafts.cron-test-post-${randomStr}`;
  
  const doc = {
    _id: docId,
    _type: 'post',
    title: { en: `Manual Publish Test ${randomStr}` },
    slug: { current: `manual-publish-test-${randomStr}` },
    excerpt: { en: 'This is a draft post. Please publish it from Sanity to test the webhook and cron jobs.' },
    sendSubscriberNotification: true, // User needs to ensure this is on before publishing
    category: 'Software',
    body: {
      en: [
        {
          _key: 'b1',
          _type: 'block',
          children: [
            {
              _key: 'c1',
              _type: 'span',
              text: 'Publish this post from the Sanity Studio to verify that the webhook fires and cron job sends the emails.',
              marks: []
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ]
    },
    authors: [
      {
        _key: 'a1',
        name: 'Test Author',
        bio: 'Just a test author.'
      }
    ]
  };

  console.log('Creating draft post in Sanity...');
  const res = await client.createIfNotExists(doc);
  console.log('Created draft ID:', res._id);
  console.log('Draft Title:', res.title?.en);
  
  console.log('\n✅ Draft created in Sanity! You can now go to Sanity Studio and hit "Publish".');
}

main().catch(console.error);
