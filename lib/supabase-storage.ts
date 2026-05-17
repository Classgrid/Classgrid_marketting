import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Upload a file to Supabase Storage ─────────────────────────
// Bucket: "support-attachments" (will be created if doesn't exist)

const BUCKET = "support-attachments";

/**
 * Upload a file to Supabase Storage and return the public URL.
 * @param file - The file to upload
 * @param folder - Subfolder path (e.g. "tickets/abc123" or "replies/xyz")
 * @returns The public URL of the uploaded file, or null on error
 */
export async function uploadToSupabase(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; path: string } | null> {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}

/**
 * Delete a file from Supabase Storage by its path.
 */
export async function deleteFromSupabase(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error("Supabase delete error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
}
