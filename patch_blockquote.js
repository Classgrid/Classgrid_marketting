const { createClient } = require('@sanity/client');

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

async function main() {
  try {
    const docId = '8FwD3bqpuDdPQOMh1q8t1q'; // The ID of the Cloudflare blog
    
    console.log(`Fetching document ${docId}...`);
    const doc = await client.getDocument(docId);
    
    if (!doc) {
      throw new Error("Document not found");
    }

    // Keep all blocks except the blockquotes
    const newBlocks = doc.body.en.filter(block => block.style !== 'blockquote');
    
    // Create a single unified blockquote block for the email
    const emailBlock = {
      _type: 'block',
      style: 'blockquote',
      children: [
        { _type: 'span', marks: ['strong'], text: '✉️ Official Communication from Cloudflare\n\nSubject: 10k in Cloudflare credits!\n\n' },
        { _type: 'span', marks: [], text: 'Welcome to Cloudflare for Startups! We\'re very excited to have you join the program and are here to support you as you rapidly build, deploy, and scale.\n\n' },
        { _type: 'span', marks: ['strong'], text: 'You have been granted $10,000 in Cloudflare credits' },
        { _type: 'span', marks: [], text: ', valid for 12 months...\n\n' },
        { _type: 'span', marks: [], text: 'You have access to ' },
        { _type: 'span', marks: ['strong'], text: 'three Enterprise domains' },
        { _type: 'span', marks: [], text: '. To get more information on product usage, what\'s included, and more frequently asked questions, please visit our Startups portal.\n\n' },
        { _type: 'span', marks: ['em'], text: 'Best,\nThe Cloudflare for Startups Team' }
      ]
    };

    // Find where the first blockquote was in the original array (usually after block 3)
    // The original structure had 3 normal blocks, then the blockquotes.
    const insertIndex = 3; 
    
    newBlocks.splice(insertIndex, 0, emailBlock);

    console.log(`Patching document to combine blockquotes...`);
    await client
      .patch(docId)
      .set({ 'body.en': newBlocks })
      .commit();
      
    console.log('✅ Successfully unified the email into a single blockquote!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
