const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
});

async function main() {
  try {
    console.log('Querying for AWS and Cloudflare blogs...');
    
    // Find both blogs by their slugs
    const query = `*[_type == "post" && slug.current in ["aws-mongodb-milestone", "cloudflare-startups-grant-2026"]]`;
    const posts = await client.fetch(query);
    
    if (posts.length === 0) {
      console.log('No posts found!');
      return;
    }

    console.log(`Found ${posts.length} posts. Patching categories to 'Milestone'...`);

    // Patch all found posts
    for (const post of posts) {
      console.log(`Patching post: ${post.title.en || post.title} (ID: ${post._id})`);
      await client
        .patch(post._id)
        .set({ category: 'Milestone' })
        .commit();
      console.log(`✅ Updated ${post.slug.current} to Milestone!`);
    }

    console.log('Done patching categories!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
