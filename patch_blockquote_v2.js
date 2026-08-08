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
    const docId = '8FwD3bqpuDdPQOMh1q8t1q'; // The ID of the Cloudflare blog
    
    console.log(`Fetching document ${docId}...`);
    const doc = await client.getDocument(docId);
    
    if (!doc) throw new Error("Document not found");

    // Remove any existing blockquotes
    const newBlocks = doc.body.en.filter(block => block.style !== 'blockquote');
    
    // Create a single unified blockquote with ONE continuous paragraph like the AWS blog!
    const textStr = '"Subject: 10k in Cloudflare credits! Welcome to Cloudflare for Startups! We\'re very excited to have you join the program and are here to support you as you rapidly build, deploy, and scale. You have been granted $10,000 in Cloudflare credits, valid for 12 months. You have access to three Enterprise domains. To get more information on product usage, what\'s included, and more frequently asked questions, please visit our Startups portal. Best, The Cloudflare for Startups Team"';
    
    const emailBlock = {
      _type: 'block',
      style: 'blockquote',
      children: [
        { _type: 'span', marks: [], text: textStr }
      ]
    };

    // Insert after block 3
    const insertIndex = 3; 
    newBlocks.splice(insertIndex, 0, emailBlock);

    console.log(`Patching document to format as a single blockquote string...`);
    await client
      .patch(docId)
      .set({ 'body.en': newBlocks })
      .commit();
      
    console.log('✅ Successfully formatted as one beautiful green box!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
