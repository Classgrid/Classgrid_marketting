# Classgrid Database & AI Downgrade Guide (9 Months)

When your $500 MongoDB Startup Credits expire in 9 months, you may want to downgrade back to the Free Tier (M0) and revert to the free `Xenova` embedding model so you do not have to pay the $57/month for the M10 cluster.

If you just downgrade the database without changing the code, **the AI will crash** because the code will be looking for 1024-dimension Voyage AI math, but the free tier will only support 384-dimension Xenova math.

Follow these exact steps to downgrade safely without breaking the system.

## Phase 1: Revert the Codebase
Before you touch the database, you must tell the Node.js server to stop using Voyage AI and switch back to the free Xenova model.

1. Open `lib/ai/rag-retrieve.ts` and `lib/ai/rag-ingest.ts`.
2. Find the Voyage AI API code (which expects `1024` dimensions).
3. Delete the Voyage AI code and restore the `@xenova/transformers` code (which expects `384` dimensions). 
4. Ensure `DEFAULT_NUM_CANDIDATES = 1000` and `limit(150)` are kept in the fallback to prevent memory crashes on the free tier.
5. Push the code to GitHub and wait for EC2 to deploy it.

## Phase 2: Downgrade the Database Cluster
Now that the code is reverted, you can downgrade the infrastructure.

1. Log in to **MongoDB Atlas**.
2. Go to your **Clusters** page.
3. Click the `...` menu next to your M10 cluster and click **Terminate/Downgrade** (or create a new M0 cluster and migrate the data over). 
   *(Note: MongoDB makes it hard to downgrade M10 directly to M0. You may need to create a fresh M0 cluster, dump the data from M10, and restore it to M0 using `mongodump` and `mongorestore`).*
4. If you create a new M0 cluster, update your `MONGO_URI` in the `.env.local` file on your EC2 server to point to the new cluster.

## Phase 3: Re-Embed the Data (Crucial Step)
Your database currently holds 1024-dimension math (from Voyage AI). Your Xenova code cannot read this math. You must delete all the Voyage AI math and regenerate it with Xenova.

1. Connect to your MongoDB cluster and run this command to delete all the 1024-dimension Voyage embeddings:
   ```javascript
   db.collection('rag_chunks').updateMany({}, { $unset: { embedding: "" } })
   ```
2. Write a script to loop through all 2,673 documents and run them through the local Xenova pipeline to regenerate 384-dimension embeddings.
3. Save the new 384-dimension embeddings back to the database.

## Phase 4: Recreate the Vector Search Index
Now that the math is 384 dimensions again, you must recreate the MongoDB Atlas Vector Search Index.

1. Go to **Atlas Search** in the MongoDB Dashboard.
2. Delete the old `1024` dimension vector index.
3. Create a new vector index named `vector_index` with `384` dimensions:
   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "embedding": {
           "dimensions": 384,
           "similarity": "cosine",
           "type": "knnVector"
         }
       }
     }
   }
   ```

## Final Verification
1. Ask a question on the website.
2. The AI will use Xenova to search the M0 free tier database.
3. It will succeed without downloading 60MB of data because the Vector Index is active!

> **WARNING:** Because the M0 Free Tier is limited in size, it may only index the first few hundred documents. Your AI will be free and won't crash, but its memory will be limited to those few hundred documents.
