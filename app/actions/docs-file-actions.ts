"use server";

import { getPresignedUploadUrl, R2_PUBLIC_URL } from "@/lib/r2";

const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml", "image/avif",
  // Documents
  "application/pdf",
  "text/plain", "text/markdown", "text/csv",
  // Office
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

/**
 * Server action to generate a pre-signed Cloudflare R2 URL for Ask AI file attachments.
 * Files are stored under the `ask-ai-files/` prefix.
 */
export async function getPresignedUrlForAskAiFile(
  fileName: string,
  mimeType: string,
  fileSize: number
) {
  // Validate file size
  if (fileSize > MAX_FILE_SIZE) {
    return { error: `File size exceeds the 35MB limit. Your file is ${(fileSize / (1024 * 1024)).toFixed(1)}MB.` };
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return { error: `File type "${mimeType}" is not supported. Please upload an image, PDF, document, or text file.` };
  }

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const filePath = `ask-ai-files/${timestamp}_${sanitizedName}`;

  // Generate a pre-signed URL that expires in 1 hour (3600s)
  const presignedUrl = await getPresignedUploadUrl(filePath, mimeType, 3600);

  return {
    uploadUrl: presignedUrl,
    publicUrl: `${R2_PUBLIC_URL}/${filePath}`,
  };
}
