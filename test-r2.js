const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// New R2 credentials (nikhil.shinde@classgrid.in — Startup Credits Account)
const R2_ACCOUNT_ID = "6b98bf938dfdbbc72a0b4b5a5cac1921";
const R2_ACCESS_KEY_ID = "061cbc7ecde886384cffdea0fbf642ff";
const R2_SECRET_ACCESS_KEY = "4f17ce3f7a8498419abbd97ab1118934031048cfd555b0074e2e5a65de444f99";
const R2_BUCKET_NAME = "classgrid-storage";
const R2_PUBLIC_URL = "https://pub-96a564393c0440f2bab37ad8bbe92398.r2.dev";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function testR2() {
  console.log("🔗 Testing connection to new R2 bucket...\n");

  // Step 1: List objects (test connection)
  try {
    const listCmd = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME, MaxKeys: 5 });
    const listRes = await client.send(listCmd);
    console.log("✅ Connection successful! Bucket exists and is accessible.");
    console.log(`   Objects in bucket: ${listRes.KeyCount || 0}\n`);
  } catch (err) {
    console.error("❌ Connection FAILED:", err.message);
    process.exit(1);
  }

  // Step 2: Upload the test PDF
  const filePath = "C:\\Users\\nikhi\\Downloads\\SOCIAL MEDIA INFLUENCE ON STUDENTS (2).pdf";
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `test-uploads/${Date.now()}-${path.basename(filePath)}`;

  console.log(`📤 Uploading "${path.basename(filePath)}" (${(fileBuffer.length / 1024).toFixed(1)} KB)...`);

  try {
    const putCmd = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: "application/pdf",
    });
    await client.send(putCmd);

    const publicUrl = `${R2_PUBLIC_URL}/${fileName}`;
    console.log("✅ Upload successful!");
    console.log(`   Public URL: ${publicUrl}\n`);

    // Step 3: Verify it exists
    const verifyCmd = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME, Prefix: fileName });
    const verifyRes = await client.send(verifyCmd);
    if (verifyRes.KeyCount > 0) {
      console.log("✅ Verification: File confirmed in bucket!");
      console.log(`   Size: ${(verifyRes.Contents[0].Size / 1024).toFixed(1)} KB`);
    }
  } catch (err) {
    console.error("❌ Upload FAILED:", err.message);
    process.exit(1);
  }

  console.log("\n🎉 All tests passed! New R2 bucket is fully working.");
}

testR2();
