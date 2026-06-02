"use client";

import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init("phc_vwS2QJNp7U9gAS3x5dGpcnVbFxXpiiexsKsGVnoQ3p5P", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always", // Track anonymous users across sessions
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
