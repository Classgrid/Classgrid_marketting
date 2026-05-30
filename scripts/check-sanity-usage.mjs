import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
})

async function checkUsage() {
  console.log("Fetching current Sanity usage metrics...\n");

  // Get total document count (excluding system documents that start with _.)
  const docCount = await client.fetch(`count(*[!(_id in path("_.**"))])`);
  
  // Get all assets and sum their sizes
  const assets = await client.fetch(`*[_type == "sanity.imageAsset" || _type == "sanity.fileAsset"]{ size, originalFilename }`);
  
  let totalBytes = 0;
  assets.forEach(asset => {
    if (asset.size) totalBytes += asset.size;
  });

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  console.log("=== CURRENT SANITY USAGE ===");
  console.log(`📄 Total Documents: ${docCount} / 100,000`);
  console.log(`🖼️ Total Asset Storage: ${totalMB} MB / 5,000 MB (5 GB)`);
  console.log(`📦 Total Assets Uploaded: ${assets.length}`);
  console.log("============================");
}

checkUsage().catch(console.error);
