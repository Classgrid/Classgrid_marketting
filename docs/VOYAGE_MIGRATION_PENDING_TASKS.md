# Voyage AI & MongoDB M10 Migration (Pending Tasks)

This document contains the exact state of the Classgrid AI infrastructure upgrade as of August 19, 2026. 

We paused our work because we are waiting for MongoDB Support to transfer the $500 Startup Credits from a testing organization to the active production organization (`699a81587f5007727cba9142`).

---

## ✅ What We Already Finished Today
1. **Identified the Crash:** We discovered that the Node.js server was crashing with a memory timeout because the MongoDB M0 Free Tier could not handle indexing 2,673 documents using Xenova embeddings.
2. **Created Voyage AI Account:** The founder created a Voyage AI account (which provides 50 Million free tokens out of the box, avoiding Google's strict rate limits).
3. **Saved the API Key:** The `VOYAGE_API_KEY` was successfully saved into the EC2 `.env.local` file.
4. **Wrote the Code Toggle:** We updated `lib/ai/embedding.ts` to automatically route embeddings to Voyage AI (`voyage-large-2-instruct`) whenever the API key is present. The old Xenova code was safely preserved and commented out.
5. **Wrote the Migration Script:** We created `scripts/migrate-voyage.ts` to bulk re-embed all 2,673 documents into 1024-dimension Voyage math.
6. **Emailed MongoDB Support:** We sent an email to `startups@mongodb.com` requesting the transfer of the $500 promo code to the correct organization.

---

## ⏳ What Needs To Be Done (After MongoDB Replies)

When MongoDB Support replies and confirms the credits have been transferred, hand this file to your AI Assistant and tell them to execute these final steps:

### 1. Upgrade the Cluster (Founder Action)
- Go to the MongoDB Atlas dashboard.
- Go to the `Classgrid` cluster in the correct organization.
- Click `...` -> **Edit Configuration**.
- Change the cluster tier from **M0 Sandbox** to **M10 Dedicated**.
- Save and wait 5-10 minutes for the upgrade to finish.

### 2. Run the Migration Script (AI Action)
- SSH into the EC2 server or run it locally connected to production.
- Run the migration script to convert all 2,673 documents from Xenova (384d) to Voyage AI (1024d):
  ```bash
  npx tsx scripts/migrate-voyage.ts
  ```

### 3. Recreate the Vector Index (Founder/AI Action)
- Go to **Atlas Search** in the MongoDB dashboard.
- Delete the old vector index.
- Create a new vector index named `vector_index` with `1024` dimensions (for Voyage AI):
  ```json
  {
    "mappings": {
      "dynamic": true,
      "fields": {
        "embedding": {
          "dimensions": 1024,
          "similarity": "cosine",
          "type": "knnVector"
        }
      }
    }
  }
  ```

### 4. Final Verification
- Ask a test question on the live website (e.g. "When did Classgrid create ChatGPT?").
- The server will NO LONGER timeout because the M10 cluster has massive memory.
- The AI will perfectly find the answer because Voyage AI uses highly accurate 1024-dimension semantic matching.
