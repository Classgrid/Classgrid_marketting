"use client";

import { useEffect } from "react";
import Script from "next/script";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleOneTap() {
  const router = useRouter();

  useEffect(() => {
    // 1. Define the callback that Google will trigger
    (window as any).handleGoogleOneTap = async (response: any) => {
      if (response.credential) {
        const res = await signIn("google-one-tap", {
          credential: response.credential,
          redirect: false, // Prevent standard NextAuth redirect since we are a popup
        });
        if (res?.ok) {
          // Smoothly refresh the page state so UI updates to logged in
          router.refresh();
        }
      }
    };

    // 2. Client-side Navigation Fix:
    // If you navigate from /blog to /blog/slug, Next.js doesn't reload the page.
    // Google's script is already loaded but won't check for the HTML div again.
    // We must manually trigger it using the JavaScript API.
    if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      const googleId = (window as any).google.accounts.id;
      googleId.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "392201629690-cap30hea8h682f9qcjbpqua2kom6lsml.apps.googleusercontent.com",
        callback: (window as any).handleGoogleOneTap,
        context: "signin",
        ux_mode: "popup"
      });
      googleId.prompt(); // Force it to show again
    }
  }, [router]);

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="lazyOnload" 
        onLoad={() => {
          // 3. First Page Load Fix:
          // When the script finishes downloading for the first time, manually trigger it.
          if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
            const googleId = (window as any).google.accounts.id;
            googleId.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "392201629690-cap30hea8h682f9qcjbpqua2kom6lsml.apps.googleusercontent.com",
              callback: (window as any).handleGoogleOneTap,
              context: "signin",
              ux_mode: "popup"
            });
            googleId.prompt();
          }
        }}
      />
      {/* We no longer need the HTML g_id_onload div because we are strictly using the JS API for React compatibility */}
    </>
  );
}
