"use client";

import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init("phc_vwS2QJNp7U9gAS3x5dGpcnVbFxXpiiexsKsGVnoQ3p5P", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
