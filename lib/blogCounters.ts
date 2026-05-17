import { supabaseAdmin } from "@/lib/supabase";

const NOT_FOUND_CODE = "PGRST116";
const UNIQUE_VIOLATION_CODE = "23505";
const MAX_COUNTER_RETRIES = 5;
const MAX_SLUG_LENGTH = 160;

export type BlogCounterTable = "blog_likes" | "blog_views";

type CounterRow = {
  slug: string;
  count: number | null;
  updated_at: string | null;
};

function safeCount(input: unknown): number {
  if (typeof input === "number" && Number.isFinite(input) && input > 0) {
    return Math.trunc(input);
  }
  return 0;
}

function isSupabaseNotFoundError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === NOT_FOUND_CODE
  );
}

function isUniqueViolation(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === UNIQUE_VIOLATION_CODE
  );
}

export function normalizeBlogSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_SLUG_LENGTH) return null;
  return trimmed;
}

export async function getBlogCounterCount(table: BlogCounterTable, slug: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("count")
    .eq("slug", slug)
    .maybeSingle();

  if (error && !isSupabaseNotFoundError(error)) {
    throw error;
  }

  const countData = data as { count?: unknown } | null;
  return safeCount(countData?.count ?? 0);
}

export async function getBlogCounterMap(
  table: BlogCounterTable,
  slugs: string[]
): Promise<Record<string, number>> {
  const uniqueSlugs = Array.from(new Set(slugs.map((item) => item.trim()).filter(Boolean)));
  if (uniqueSlugs.length === 0) return {};

  const counts: Record<string, number> = {};
  for (const slug of uniqueSlugs) {
    counts[slug] = 0;
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("slug,count")
    .in("slug", uniqueSlugs);

  if (error) {
    throw error;
  }

  for (const row of (data ?? []) as Array<{ slug?: unknown; count?: unknown }>) {
    if (!row?.slug) continue;
    counts[String(row.slug)] = safeCount(row.count);
  }

  return counts;
}

export async function incrementBlogCounter(table: BlogCounterTable, slug: string): Promise<number> {
  for (let attempt = 0; attempt < MAX_COUNTER_RETRIES; attempt += 1) {
    const { data: currentRow, error: readError } = await supabaseAdmin
      .from(table)
      .select("slug,count,updated_at")
      .eq("slug", slug)
      .maybeSingle();

    if (readError && !isSupabaseNotFoundError(readError)) {
      throw readError;
    }

    const current = currentRow as CounterRow | null;

    if (!current) {
      const now = new Date().toISOString();
      const { data: insertedRow, error: insertError } = await supabaseAdmin
        .from(table)
        .insert({ slug, count: 1, updated_at: now })
        .select("count")
        .maybeSingle();

      if (!insertError && insertedRow) {
        const inserted = insertedRow as { count?: unknown };
        return safeCount(inserted.count) || 1;
      }

      if (isUniqueViolation(insertError)) {
        continue;
      }

      if (insertError) {
        throw insertError;
      }

      continue;
    }

    const now = new Date().toISOString();
    const currentCount = safeCount(current.count);
    const nextCount = currentCount + 1;
    let updateQuery = supabaseAdmin
      .from(table)
      .update({ count: nextCount, updated_at: now })
      .eq("slug", slug)
      .eq("count", currentCount);

    if (current.updated_at) {
      updateQuery = updateQuery.eq("updated_at", current.updated_at);
    } else {
      updateQuery = updateQuery.is("updated_at", null);
    }

    const { data: updatedRow, error: updateError } = await updateQuery
      .select("count")
      .maybeSingle();

    if (!updateError && updatedRow) {
      const updated = updatedRow as { count?: unknown };
      return safeCount(updated.count) || nextCount;
    }

    if (updateError && !isSupabaseNotFoundError(updateError)) {
      throw updateError;
    }
  }

  throw new Error(`Failed to increment ${table} counter for slug: ${slug}`);
}
