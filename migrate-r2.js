const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

// ── OLD BUCKET (classgrid26@gmail.com) ──
const oldClient = new S3Client({
  region: "auto",
  endpoint: "https://9b3c58af141949f08d960143c6ec84bb.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "eed5165b3b17029c969c9a9830943981",
    secretAccessKey: "91da8aa4f6c1db25f001d3a680e111c7d3485be68805ae4ec28a4be6e4267665",
  },
});
const OLD_BUCKET = "classgrid";

// ── NEW BUCKET (nikhil.shinde@classgrid.in — Startup Credits) ──
const newClient = new S3Client({
  region: "auto",
  endpoint: "https://6b98bf938dfdbbc72a0b4b5a5cac1921.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "061cbc7ecde886384cffdea0fbf642ff",
    secretAccessKey: "4f17ce3f7a8498419abbd97ab1118934031048cfd555b0074e2e5a65de444f99",
  },
});
const NEW_BUCKET = "classgrid-storage";

async function migrate() {
  console.log("🚀 Starting R2 bucket migration...");
  console.log(`   FROM: ${OLD_BUCKET} (classgrid26@gmail.com)`);
  console.log(`   TO:   ${NEW_BUCKET} (nikhil.shinde@classgrid.in)\n`);

  let continuationToken = undefined;
  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let totalBytes = 0;

  do {
    // List objects from old bucket
    const listCmd = new ListObjectsV2Command({
      Bucket: OLD_BUCKET,
      MaxKeys: 50,
      ContinuationToken: continuationToken,
    });

    const listRes = await oldClient.send(listCmd);
    const objects = listRes.Contents || [];

    if (objects.length === 0) {
      console.log("No more objects to migrate.");
      break;
    }

    // Copy each object
    for (const obj of objects) {
      const key = obj.Key;
      const size = obj.Size;

      try {
        // Download from old bucket
        const getCmd = new GetObjectCommand({ Bucket: OLD_BUCKET, Key: key });
        const getRes = await oldClient.send(getCmd);

        // Read the stream into a buffer
        const chunks = [];
        for await (const chunk of getRes.Body) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Upload to new bucket
        const putCmd = new PutObjectCommand({
          Bucket: NEW_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: getRes.ContentType || "application/octet-stream",
        });
        await newClient.send(putCmd);

        totalMigrated++;
        totalBytes += size;
        console.log(`  ✅ [${totalMigrated}] ${key} (${(size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        totalFailed++;
        console.error(`  ❌ FAILED: ${key} — ${err.message}`);
      }
    }

    continuationToken = listRes.NextContinuationToken;
  } while (continuationToken);

  console.log("\n════════════════════════════════════════");
  console.log("  MIGRATION COMPLETE");
  console.log("════════════════════════════════════════");
  console.log(`  ✅ Migrated: ${totalMigrated} objects`);
  console.log(`  ❌ Failed:   ${totalFailed} objects`);
  console.log(`  📦 Total:    ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log("════════════════════════════════════════\n");
}

migrate().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
