"use server";

import { getPresignedUploadUrl, R2_PUBLIC_URL } from "@/lib/r2";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
import { AiRateLimit } from "@/lib/models/AiRateLimit";

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

  // Rate Limiting (Max 10 files per session/hour)
  try {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip") || "unknown";
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const identifier = userEmail || ip;

    await connectMongo();

    const ONE_HOUR_MS = 60 * 60 * 1000;
    const MAX_FILES = 10;

    let rateLimitRecord = await AiRateLimit.findOne({ identifier });
    if (rateLimitRecord) {
      if ((rateLimitRecord.fileUploadCount || 0) >= MAX_FILES) {
        return { error: `You have reached the maximum file upload limit. Please try again later.` };
      }
      rateLimitRecord.fileUploadCount = (rateLimitRecord.fileUploadCount || 0) + 1;
      await rateLimitRecord.save();
    } else {
      await AiRateLimit.create({
        identifier,
        count: 0,
        fileUploadCount: 1,
        expireAt: new Date(Date.now() + ONE_HOUR_MS)
      });
    }
  } catch (error) {
    console.error("[docs-file-actions] Rate limit error:", error);
    // Proceed with upload if DB fails, to not break core functionality
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

/**
 * Pre-flight check to see if the user has enough hourly quota left for a batch of files.
 * This prevents the frontend from showing 'fake uploads' in the UI if they are going to fail anyway.
 */
export async function checkAiUploadRateLimit(filesToUpload: number) {
  try {
    const session = await getServerSession(authOptions);
    const identifier = session?.user?.email || (await headers()).get("x-forwarded-for") || "unknown-ip";
    
    await connectMongo();
    const rateLimit = await AiRateLimit.findOne({ identifier });
    const MAX_FILES = 10;
    
    const currentCount = rateLimit?.fileUploadCount || 0;
    if (currentCount >= MAX_FILES) {
      return { error: `You have reached the maximum file upload limit. Please try again later.` };
    }
    
    if (currentCount + filesToUpload > MAX_FILES) {
      const remaining = MAX_FILES - currentCount;
      return { error: `Only ${remaining} file${remaining === 1 ? '' : 's'} left. Please select ${remaining} file${remaining === 1 ? '' : 's'}.` };
    }
    
    return { success: true };
  } catch (error) {
    console.error("[docs-file-actions] Pre-flight check error:", error);
    return { success: true }; // Fail open so we don't break the app if DB is down
  }
}

