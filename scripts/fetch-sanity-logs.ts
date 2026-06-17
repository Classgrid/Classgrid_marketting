import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
});

client.fetch('*[_type == "aiEscalation"] | order(_createdAt desc)[0...10]')
  .then(docs => {
    docs.forEach(d => console.log(`${d._createdAt} | ID: ${d._id} | TicketId/Error: ${d.ticketId} | Status: ${d.status}`));
  })
  .catch(console.error);
