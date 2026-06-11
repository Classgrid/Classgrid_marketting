"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleOneTap() {
  const router = useRouter();
  const { status } = useSession();
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

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

    // 2. Only show the popup if NextAuth confirms the user is NOT logged in.
    // If status is "loading", we wait. If "authenticated", we do nothing.
    if (status === "unauthenticated" && (googleScriptLoaded || (typeof window !== "undefined" && (window as any).google?.accounts?.id))) {
      const googleId = (window as any).google.accounts.id;
      
      googleId.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "392201629690-cap30hea8h682f9qcjbpqua2kom6lsml.apps.googleusercontent.com",
        callback: (window as any).handleGoogleOneTap,
        context: "signin",
        ux_mode: "popup"
      });

      // Force it to show again (or for the first time) safely
      googleId.prompt(); 
    }

  }, [status, googleScriptLoaded, router]);

  // If they are already authenticated, don't even bother downloading the Google script
  if (status === "authenticated") return null;

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="lazyOnload" 
        onLoad={() => {
          // Tell the useEffect that Google is ready to trigger the prompt
          setGoogleScriptLoaded(true);
        }}
      />
    </>
  );
}
