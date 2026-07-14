const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
});

async function main() {
  console.log('Downloading image...');
  const imageUrl = 'https://png.pngtree.com/template/20200917/ourmid/pngtree-restaurant-facebook-cover-image_414054.jpg';
  
  // Use native fetch available in Node.js 18+
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Failed to fetch image: ' + response.statusText);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('Uploading asset to Sanity...');
  const asset = await client.assets.upload('image', buffer, {
    filename: 'restaurant-cover.jpg'
  });
  console.log('Asset uploaded:', asset._id);

  console.log('Creating blog post...');
  const doc = {
    _type: 'post',
    title: { en: 'Delicious Dining: A Restaurant Experience Like No Other' },
    slug: { _type: 'slug', current: 'delicious-dining-restaurant-experience-2026' },
    publishedAt: new Date().toISOString(),
    category: 'Education', // Picking a valid category from schema
    coverImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    },
    excerpt: { en: 'Explore the finest dining options and what makes a restaurant stand out in 2026. Discover the secrets to culinary success and amazing customer experiences.' },
    body: {
      en: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { 
              _type: 'span', 
              marks: [],
              text: 'Welcome to our latest feature where we dive into what makes a modern restaurant truly spectacular! A great dining experience goes beyond just the food; it encompasses the ambiance, the service, and the unique flair that every establishment brings to the table. In 2026, technology and tradition blend seamlessly to create unforgettable moments for every guest. Stay tuned for more tips and insights!' 
            }
          ]
        }
      ]
    },
    authors: [
      {
        _type: 'blogAuthor',
        _key: 'author-1',
        name: 'Classgrid Culinary Team',
        bio: 'Exploring the best of dining and hospitality.'
      }
    ]
  };

  const res = await client.create(doc);
  console.log('Blog post created successfully with ID:', res._id);
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.response) {
      console.error(err.response.body);
  }
});
