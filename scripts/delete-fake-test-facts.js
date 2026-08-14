require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('classgrid');
    const chunksColl = db.collection('rag_chunks');

    console.log("Deleting fake test facts...");
    const result = await chunksColl.deleteMany({
      documentId: { $in: ["test-fake-verbatim-challenge", "test-fake-final-challenge", "test-fake-raigad-fort"] }
    });

    console.log(`Successfully deleted ${result.deletedCount} test documents.`);
  } catch (error) {
    console.error("Error deleting:", error);
  } finally {
    await client.close();
  }
}

main();
