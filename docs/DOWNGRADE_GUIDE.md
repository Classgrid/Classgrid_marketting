# Classgrid Database & AI Downgrade Guide (9 Months)

When your $500 MongoDB Startup Credits expire in 9 months, you may want to downgrade back to the Free Tier (M0) and revert to the free `Xenova` embedding model so you do not have to pay the $57/month for the M10 cluster.

If you just downgrade the database without changing the code, **the AI will crash** because the code will be looking for 1024-dimension Voyage AI math, but the free tier will only support 384-dimension Xenova math.

---

## 🤖 INSTRUCTIONS FOR THE AI ASSISTANT
*(If you are an AI assistant reading this 9 months from now, follow these exact instructions to downgrade the user's system safely!)*

**AI MISSION:** The user's M10 cluster credits have expired. You must revert their Voyage AI implementation back to local Xenova embeddings (384 dimensions) so they can run on an M0 free tier cluster without timing out.

**AI EXECUTION STEPS:**
1. Open `lib/ai/rag-retrieve.ts` and `lib/ai/rag-ingest.ts`.
2. Delete the `Voyage AI` API calls.
3. Restore the local `@xenova/transformers` pipeline (`Xenova/all-MiniLM-L6-v2`).
4. Keep `DEFAULT_NUM_CANDIDATES = 1000` but ensure `.limit(150)` is on the `fallbackCosineSearch` so the M0 cluster doesn't crash on timeouts.
5. Create a Node.js script (`scratch/re-embed-xenova.js`) that unsets the `1024-dimension` embeddings and regenerates all chunks using Xenova (384 dimensions). Run this script for the user.
6. Provide the user with the JSON snippet below to recreate their MongoDB Atlas Vector Search Index.

---

## 👨‍💻 INSTRUCTIONS FOR YOU (THE FOUNDER)
Follow these steps while the AI assistant does the coding.

### Phase 1: Tell the AI to Revert the Code
1. Upload this document to the AI.
2. Tell the AI: *"My credits expired. Follow the AI MISSION in the downgrade guide to revert my code to Xenova."*
3. The AI will push the code to GitHub. Wait for EC2 to deploy it.

### Phase 2: Downgrade the Database Cluster
1. Log in to **MongoDB Atlas**.
2. Go to your **Clusters** page.
3. Click the `...` menu next to your M10 cluster and click **Terminate/Downgrade**. 
   *(Note: MongoDB makes it hard to downgrade M10 directly to M0. You may need to create a fresh M0 cluster, dump the data from M10, and restore it to M0).*
4. If you create a new M0 cluster, update your `MONGO_URI` in the `.env.local` file on your EC2 server to point to the new cluster.

### Phase 3: The AI Re-Embeds the Data
1. Tell the AI: *"The database is downgraded. Please run the re-embedding script now."*
2. The AI will delete all Voyage AI embeddings and regenerate them using Xenova.

### Phase 4: Recreate the Vector Search Index
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
