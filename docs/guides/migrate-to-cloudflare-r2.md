---
title: "Migrating from Supabase to Cloudflare R2"
slug: "migrate-to-cloudflare-r2"
category: "Guides"
summary: "A complete walkthrough to migrate Classgrid's file storage from Supabase to Cloudflare R2 for unlimited scalability and zero egress fees."
tags: [infrastructure, storage, r2, supabase, migration, admin]
type: helpArticle
---

## Overview

This guide explains the step-by-step process to migrate the `classgrid_platform` React + Vite application from Supabase Storage to Cloudflare R2. This migration eliminates the 1GB Supabase storage limit and utilizes Cloudflare's zero-egress fee architecture while keeping your frontend UI completely intact.

## Prerequisites

- Access to the Cloudflare Dashboard
- Access to the `classgrid_platform` codebase (both `server` and `client`)
- The Cloudflare R2 Account ID, Access Key ID, and Secret Access Key
- Role required: Lead Developer / Infrastructure Admin

## Step 1 — Setup Environment Variables

You must first copy the Cloudflare credentials from your Sandbox and place them securely into your backend configuration. 

> **Warning:** Do not put these keys in the Vite client `.env` file! They must only be stored in the Node.js `server/.env` file to prevent malicious users from deleting your bucket.

```env
# Cloudflare R2 Storage (Inside server/.env)
R2_ACCOUNT_ID="9b3c58af141949f08d960143c6ec84bb"
R2_ACCESS_KEY_ID="eed5165b3b17029c969c9a9830943981"
R2_SECRET_ACCESS_KEY="91da8aa4f6c1db25f001d3a680e111c7d3485be68805ae4ec28a4be6e4267665"
R2_BUCKET_NAME="classgrid"
R2_PUBLIC_URL="https://pub-14d5af5a38c6456da3b086aeea5188e1.r2.dev"
```

## Step 2 — Configure Cloudflare CORS

To allow your Vite frontend to securely upload files directly to Cloudflare, you must set the CORS (Cross-Origin Resource Sharing) policy in the Cloudflare Dashboard.

1. Go to **Cloudflare Dashboard** -> **R2 Object Storage** -> **`classgrid`** bucket.
2. Click **Settings**.
3. Scroll down to **CORS Policy** and click **Add CORS Policy**.
4. Paste the following JSON block exactly:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://app.classgrid.in"
    ],
    "AllowedMethods": [
      "PUT",
      "GET"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 3 — Generate Presigned URLs (Backend)

Because you cannot store secret keys in Vite, your Node.js backend must act as the security guard. It will verify the user and generate a temporary "ticket" (Presigned URL) for the upload.

First, install the AWS SDK in your Node.js `server` directory:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Next, create a new API route (e.g., `server/src/routes/storage.routes.js`) that securely generates the ticket:

```javascript
const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const router = express.Router();

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

router.post('/get-upload-url', async (req, res) => {
  // IMPORTANT: Implement your RLS / Security Check here!
  // Example: if (!req.user) return res.status(401).send("Unauthorized");
  
  const { fileName, mimeType } = req.body;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    ContentType: mimeType,
  });

  try {
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    res.json({ uploadUrl: signedUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate ticket" });
  }
});

module.exports = router;
```

## Step 4 — Replace Client Upload Logic

Finally, update your Vite frontend to use the new Node.js endpoint instead of Supabase. Go to `client/src/lib/supabase-storage.ts` and rewrite the `uploadToSupabase` function.

> **Tip:** You may want to rename this file to `cloudflare-storage.ts` to reflect the new architecture.

```typescript
export async function uploadToR2(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; path: string } | null> {
  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;

    // 1. Ask your Node.js backend for the ticket
    const urlResponse = await fetch("/api/storage/get-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: filePath, mimeType: file.type })
    });
    
    if (!urlResponse.ok) throw new Error("Failed to get upload ticket");
    const { uploadUrl } = await urlResponse.json();

    // 2. Upload directly to Cloudflare using the ticket
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type
      }
    });

    if (!uploadResponse.ok) throw new Error("Cloudflare upload failed");

    // 3. Return the public URL
    const publicUrl = `https://pub-14d5af5a38c6456da3b086aeea5188e1.r2.dev/${filePath}`;
    
    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}
```

## Common Mistakes

- **Forgetting CORS:** If you skip Step 2, the browser will completely block the upload with a CORS error in the console.
- **Exposing Secret Keys:** Never commit your `.env` files or hardcode the Secret Access Key into your React/Vite components.

## Related Articles

- [Classgrid API Reference](/docs/api/overview)
