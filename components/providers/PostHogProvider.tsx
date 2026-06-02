"use client";

import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

if (typeof window !== "undefined") {
  posthog.init("phc_vwS2QJNp7U9gAS3x5dGpcnVbFxXpiiexsKsGVnoQ3p5P", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always", // Track anonymous users across sessions
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);
  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <CSPostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageViews />
      </Suspense>
      {children}
    </CSPostHogProvider>
  );
}
