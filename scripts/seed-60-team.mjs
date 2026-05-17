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

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Nikhil', 'Rahul', 'Rohan', 'Sneha', 'Priya', 'Ananya', 'Diya', 'Aadya', 'Kavya', 'Isha', 'Riya', 'Neha', 'Pooja', 'John', 'Jane', 'Alex', 'Sarah', 'Michael'];
const lastNames = ['Patil', 'Deshmukh', 'Joshi', 'Kulkarni', 'Pawar', 'Shinde', 'Rao', 'Sharma', 'Verma', 'Singh', 'Kumar', 'Das', 'Roy', 'Gupta', 'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Jain', 'Shah'];

const departments = ['leadership', 'engineering', 'sales', 'support'];
const roles = {
  leadership: ['CEO & Founder', 'Co-Founder', 'CTO', 'CMO'],
  engineering: ['Lead Engineer', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer'],
  sales: ['Sales Director', 'Sales Representative', 'Marketing Manager'],
  support: ['Support Manager', 'Customer Support', 'Module Expert']
};

const platforms = ['LinkedIn', 'Twitter', 'GitHub', 'Facebook', 'Instagram', 'Website'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData() {
  console.log('Seeding 60 dummy team members for testing...');
  const promises = [];

  for (let i = 0; i < 60; i++) {
    const dept = getRandomItem(departments);
    const role = getRandomItem(roles[dept]);
    const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
    
    // Create random social links (2 to 4)
    const numLinks = Math.floor(Math.random() * 3) + 2;
    const socialLinks = [];
    const usedPlatforms = new Set();
    
    for (let j = 0; j < numLinks; j++) {
      let platform = getRandomItem(platforms);
      while(usedPlatforms.has(platform)) {
        platform = getRandomItem(platforms);
      }
      usedPlatforms.add(platform);
      
      socialLinks.push({
        _key: `link-${j}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        platform,
        url: `https://${platform.toLowerCase()}.com/${name.toLowerCase().replace(' ', '')}`
      });
    }

    const hasBio = Math.random() > 0.4;
    const bioText = hasBio 
      ? `${name} is an exceptional ${role} who brings incredible expertise to our ${dept} department. We are thrilled to have them on the team!`
      : undefined;

    const doc = {
      _type: 'teamMember',
      name,
      role,
      department: dept,
      ...(bioText && { bio: bioText }),
      order: i,
      socialLinks,
      isTest: true,
      // No image so it falls back to the Lucide icon
    };

    promises.push(client.create(doc));
  }

  try {
    await Promise.all(promises);
    console.log(`Successfully seeded 60 dummy team members.`);
  } catch (err) {
    console.error('Failed to seed team members:', err);
  }
}

seedData();
