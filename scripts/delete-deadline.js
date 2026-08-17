const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  await db.collection('rag_chunks').deleteOne({ documentId: "test-fa1-deadline" });
  console.log("Deleted test-fa1-deadline from database.");
  process.exit(0);
}

main().catch(console.error);
