const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
});

function createBlock(text, style = 'normal', marks = []) {
  if (style === 'blockquote') {
    return {
      _type: 'block',
      style: 'blockquote',
      children: [{ _type: 'span', marks: [], text }]
    };
  }
  return {
    _type: 'block',
    style,
    children: [{ _type: 'span', marks, text }]
  };
}

async function uploadImage(url, filename) {
  console.log(`Downloading ${filename}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch image: ' + response.statusText);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`Uploading ${filename} to Sanity...`);
  const asset = await client.assets.upload('image', buffer, { filename });
  console.log(`Uploaded ${filename}:`, asset._id);
  return asset._id;
}

async function main() {
  try {
    const coverAssetId = await uploadImage(
      'https://cdn.classgrid.in/Abstract_Dark_Tech_Background.png',
      'cloudflare-bg.png'
    );
    const authorAssetId = await uploadImage(
      'https://cdn.classgrid.in/Nikhil.jpg',
      'nikhil-author.jpg'
    );

    console.log('Creating Cloudflare blog post...');
    const doc = {
      _type: 'post',
      title: { en: 'Leveling Up Our Network: Classgrid Secures $10,000 Cloudflare for Startups Grant' },
      slug: { _type: 'slug', current: 'cloudflare-startups-grant-2026' },
      publishedAt: new Date().toISOString(),
      category: 'Announcements',
      tags: ['Cloudflare', 'Startups', 'Security', 'EdTech', 'Classgrid'],
      sendSubscriberNotification: true,
      readingTimeOverride: 3,
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: coverAssetId }
      },
      authors: [
        {
          _type: 'blogAuthor',
          _key: 'author-1',
          name: 'Nikhil Shinde',
          bio: 'Content Writer & Tech Enthusiast',
          profileLink: 'https://www.linkedin.com/in/nikhil-shinde-286937367/',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: authorAssetId }
          }
        }
      ],
      body: {
        en: [
          createBlock('Building an educational platform for the masses comes with a unique set of challenges. When thousands of students and parents log in simultaneously to check exam results, pay fees, or view urgent announcements, the platform simply cannot afford to slow down.'),
          createBlock('Today, we are thrilled to announce a major leap forward in our infrastructure: Classgrid has been officially selected for the Cloudflare for Startups program!', 'normal', ['strong']),
          createBlock('As part of this highly competitive program, Cloudflare has awarded us a massive $10,000 in infrastructure credits, valid for the next 12 months. This grant gives our engineering team the runway to deploy enterprise-grade security and performance features to every single school that uses Classgrid.'),
          createBlock('✉️ Official Communication from Cloudflare', 'blockquote', ['strong']),
          createBlock('Subject: 10k in Cloudflare credits!', 'blockquote', ['strong']),
          createBlock("Welcome to Cloudflare for Startups! We're very excited to have you join the program and are here to support you as you rapidly build, deploy, and scale.", 'blockquote'),
          createBlock('You have been granted $10,000 in Cloudflare credits, valid for 12 months...', 'blockquote'),
          createBlock('You have access to three Enterprise domains. To get more information on product usage, what\'s included, and more frequently asked questions, please visit our Startups portal.', 'blockquote'),
          createBlock('Best,\nThe Cloudflare for Startups Team', 'blockquote'),
          createBlock('What exactly did we get?', 'h3'),
          createBlock("Cloudflare routes roughly 20% of all global internet traffic, making it one of the most powerful networks on the planet. Through this program, Cloudflare isn't just giving us credits—they are unlocking their top-tier features for our platform."),
          createBlock('Here is exactly what this grant includes:'),
          createBlock('🌐 Access to 3 Enterprise Domains', 'h4'),
          createBlock("This is the biggest win. Upgrading to Enterprise domain status means Classgrid now benefits from Cloudflare's absolute highest tier of routing and security. Our schools get blazing-fast DNS resolution and unmetered DDoS protection, ensuring our servers stay completely online even during massive traffic spikes (like exam result days)."),
          createBlock('🎫 Prioritized Engineering Support', 'h4'),
          createBlock('When you are managing critical infrastructure for schools, you cannot wait in line for support. As part of the Startups program, Classgrid has been granted a prioritized ticket queue, meaning we have direct, expedited access to Cloudflare\'s engineering teams if we ever need architectural guidance or troubleshooting.'),
          createBlock('⚡ Massive Compute Runway', 'h4'),
          createBlock('The $10,000 in credits covers a vast array of Cloudflare\'s ecosystem, allowing us to leverage heavy-duty caching and edge computing for the next 12 months without worrying about immediate infrastructure costs. While high-intensity products like Workers AI and R2 have reasonable caps, the core network delivery that powers Classgrid is now heavily subsidized by Cloudflare themselves.'),
          createBlock('Moving Forward', 'h3'),
          createBlock('With $10,000 in credits securing our perimeter and supercharging our delivery speeds, our engineering team can remain 100% focused on what we do best: building the ultimate operating system for educational institutions.'),
          createBlock('We are incredibly grateful to the Cloudflare Startups team for backing our vision.'),
          createBlock('Stay tuned—we have even more massive platform updates rolling out soon!')
        ]
      }
    };

    const res = await client.create(doc);
    console.log('🎉 Cloudflare blog post uploaded successfully with ID:', res._id);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error(err.response.body);
    }
  }
}

main();
