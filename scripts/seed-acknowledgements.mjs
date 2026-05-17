import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
});

const acknowledgements = [
  // Contributors
  {
    _type: 'acknowledgement',
    name: 'Swarrop Ghorpade',
    category: 'contributor',
    message: 'For their support, discussions, and encouragement during the development of this platform.',
    order: 3
  },
  {
    _type: 'acknowledgement',
    name: 'Krushna Gore',
    category: 'contributor',
    order: 4
  },
  // Mentor
  {
    _type: 'acknowledgement',
    name: 'Dr. Amol Kharche',
    category: 'mentor',
    role: 'Respected science Educator',
    message: 'A special note of gratitude to Dr. Amol Kharche, our respected mentor, whose guidance and academic insights played a significant role in shaping the foundation of Classgrid.',
    order: 1
  },
  // Family
  {
    _type: 'acknowledgement',
    name: 'Parents',
    category: 'family',
    message: 'I express my deepest gratitude to my parents for their constant support, belief, and motivation throughout this journey.',
    order: 1
  }
];

async function seedAcknowledgements() {
  console.log('Seeding Acknowledgements to Sanity...');
  try {
    for (const doc of acknowledgements) {
      const result = await client.create(doc);
      console.log(`Created document: ${result.name}`);
    }
    console.log('Successfully seeded acknowledgements!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

seedAcknowledgements();
