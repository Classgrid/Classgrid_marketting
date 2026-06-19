import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing Cloudflare R2 environment variables. Please check your .env.local file.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'classgrid';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-14d5af5a38c6456da3b086aeea5188e1.r2.dev';

/**
 * Upload a file Buffer directly to Cloudflare R2
 */
export async function uploadToR2(buffer: Buffer, fileName: string, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await r2Client.send(command);

  // Return the public URL for the file
  return `${R2_PUBLIC_URL}/${fileName}`;
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  });

  await r2Client.send(command);
  return true;
}

/**
 * Get a temporary, pre-signed upload URL so the browser can upload directly to R2 
 * (bypasses Next.js API limits)
 */
export async function getPresignedUploadUrl(fileName: string, mimeType: string, expiresInSeconds = 3600) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    ContentType: mimeType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}
