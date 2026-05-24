import { createClient } from '@sanity/client';
import fs from 'fs';

function loadEnv(file) {
  if (fs.existsSync(file)) {
    fs.readFileSync(file, 'utf8').split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq > 0) process.env[trimmed.substring(0, eq)] = trimmed.substring(eq + 1).replace(/^["']|["']$/g, '');
    });
  }
}

loadEnv('.env.local');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  // List all blog posts
  const posts = await client.fetch(`*[_type == "post"]{ _id, title, "slug": slug.current, publishedAt }`);
  
  console.log('\n📋 ALL BLOG POSTS IN SANITY:\n');
  posts.forEach((p, i) => {
    const title = typeof p.title === 'object' ? (p.title.en || JSON.stringify(p.title)) : p.title;
    console.log(`  ${i + 1}. [${p._id}]`);
    console.log(`     Title: ${title}`);
    console.log(`     Slug: ${p.slug}`);
    console.log(`     Published: ${p.publishedAt || 'DRAFT'}`);
    console.log('');
  });
  
  console.log(`Total: ${posts.length} posts\n`);
}

run();
