"use client";

import { SubscribeForm } from "@/components/shared/SubscribeForm";

/**
 * Changelog-specific subscribe form wrapper.
 * Passes type="changelog" so the API sends the correct Welcome Email
 * and only turns on the changelog preference (not blog).
 */
export function ChangelogSubscribeForm() {
  return <SubscribeForm type="changelog" />;
}
