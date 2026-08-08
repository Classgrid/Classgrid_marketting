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
    const docId = '8FwD3bqpuDdPQOMh1q8t1q'; 
    console.log(`Fetching document ${docId}...`);
    const doc = await client.getDocument(docId);
    
    if (!doc) throw new Error("Document not found");

    // Let's completely wipe all blockquotes from the body first to guarantee no duplicates or old versions remain
    let cleanBlocks = doc.body.en.filter(block => block.style !== 'blockquote');
    
    // Now create EXACTLY ONE continuous string just like the AWS blog
    const singleContinuousString = '"Hi Nikhil, Congratulations! You have been granted $10,000 in Cloudflare credits, valid for 12 months. Welcome to Cloudflare for Startups! We\'re very excited to have you join the program and are here to support you as you rapidly build, deploy, and scale. You have access to three Enterprise domains. To get more information on product usage, what\'s included, and more frequently asked questions, please visit our Startups portal. Can\'t wait to see what you build! — The Cloudflare for Startups Team"';
    
    const perfectEmailBlock = {
      _type: 'block',
      style: 'blockquote',
      children: [
        { _type: 'span', marks: [], text: singleContinuousString }
      ]
    };

    // Insert it safely exactly after the paragraph that ends with "program!"
    const targetText = 'As part of this highly competitive program';
    let insertIndex = cleanBlocks.findIndex(b => 
      b.children && b.children[0] && b.children[0].text.includes(targetText)
    );
    
    if (insertIndex === -1) insertIndex = 2;
    
    cleanBlocks.splice(insertIndex + 1, 0, perfectEmailBlock);

    console.log(`Patching document to force one single blockquote string...`);
    await client
      .patch(docId)
      .set({ 'body.en': cleanBlocks })
      .commit();
      
    console.log('✅ Successfully FORCED it to be one beautiful green box!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
