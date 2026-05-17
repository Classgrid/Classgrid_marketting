import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'c:\\Users\\nikhi\\OneDrive\\Documents\\classgrid_marketting\\.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Nikhil', 'Rahul', 'Rohan', 'Sneha', 'Priya', 'Ananya', 'Diya', 'John', 'Jane', 'Alex'];
const lastNames = ['Patil', 'Deshmukh', 'Joshi', 'Kulkarni', 'Pawar', 'Shinde', 'Rao', 'Sharma', 'Verma', 'Singh', 'Kumar', 'Das', 'Roy', 'Gupta', 'Mishra', 'Pandey'];

const categories = ['contributor', 'mentor', 'family'];
const roles = {
  contributor: ['Open Source Developer', 'Code Reviewer', 'Design Consultant', 'QA Tester', 'Beta Tester'],
  mentor: ['Senior Advisor', 'Industry Expert', 'Academic Guide', 'Technical Mentor'],
  family: ['Parent', 'Sibling', 'Spouse', 'Supporter']
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData() {
  console.log('Seeding 30 dummy acknowledgements for testing...');
  const promises = [];

  for (let i = 0; i < 30; i++) {
    const category = getRandomItem(categories);
    const role = getRandomItem(roles[category]);
    const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
    
    const hasMessage = Math.random() > 0.3; // 70% chance to have a message
    const message = hasMessage 
      ? `We are incredibly grateful for the continuous support and guidance provided by ${name}. Their role as a ${role} has been instrumental to our journey.`
      : undefined;

    const doc = {
      _type: 'acknowledgement',
      name,
      category,
      role,
      ...(message && { message }),
      order: i,
      isTest: true,
    };

    promises.push(client.create(doc));
  }

  try {
    await Promise.all(promises);
    console.log(`Successfully seeded 30 dummy acknowledgements.`);
  } catch (err) {
    console.error('Failed to seed acknowledgements:', err);
  }
}

seedData();
