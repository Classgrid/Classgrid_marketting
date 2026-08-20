import { connectMongo } from "../lib/mongodb";
import { RagChunk } from "../lib/models/RagChunk";
import { embedManyTexts } from "../lib/ai/embedding";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrate() {
  if (!process.env.VOYAGE_API_KEY) {
    console.error("❌ VOYAGE_API_KEY is missing from .env.local!");
    process.exit(1);
  }

  await connectMongo();
  console.log("✅ Connected to MongoDB.");

  const total = await RagChunk.countDocuments();
  console.log(`Total documents to migrate: ${total}`);

  // Fetch all documents that need migrating (batching to save memory)
  const cursor = RagChunk.find({ $expr: { $eq: [ { $size: "$embedding" }, 384 ] } }).cursor();
  let batch: any[] = [];
  let processed = 0;

  for await (const doc of cursor) {
    batch.push(doc);

    if (batch.length >= 15) {
      await processBatch(batch);
      processed += batch.length;
      console.log(`Progress: ${processed} / ${total}. Waiting 22 seconds for rate limits...`);
      await new Promise(r => setTimeout(r, 22000));
      batch = [];
    }
  }

  if (batch.length > 0) {
    await processBatch(batch);
    processed += batch.length;
    console.log(`Progress: ${processed} / ${total}`);
  }

  console.log("🎉 Migration to Voyage AI complete!");
  process.exit(0);
}

async function processBatch(batch: any[]) {
  const texts = batch.map(d => d.chunkText);
  try {
    const embeddings = await embedManyTexts(texts);

    // Bulk write back to Mongo
    const operations = batch.map((doc, i) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { embedding: embeddings[i] } }
      }
    }));

    await RagChunk.bulkWrite(operations);
  } catch (error: any) {
    console.error("❌ Error processing batch:", error.message);
    throw error;
  }
}

migrate().catch(console.error);
