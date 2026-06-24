"use server";

import { getPresignedUploadUrl, R2_PUBLIC_URL } from "@/lib/r2";

/**
 * Server action to generate a pre-signed Cloudflare R2 URL for direct client uploads.
 * This allows the browser to upload the file securely without exposing secret keys.
 */
export async function getPresignedUrlForResume(fileName: string, mimeType: string) {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const filePath = `resumes/${timestamp}_${sanitizedName}`;
  
  // Generate a pre-signed URL that expires in 1 hour (3600s)
  const presignedUrl = await getPresignedUploadUrl(filePath, mimeType, 3600);
  
  return {
    uploadUrl: presignedUrl,
    publicUrl: `${R2_PUBLIC_URL}/${filePath}`,
  };
}
