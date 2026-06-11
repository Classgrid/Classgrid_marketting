"use client";

import { useEffect } from "react";
import Script from "next/script";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleOneTap() {
  const router = useRouter();

  useEffect(() => {
    // Initialize secure Google One Tap handler
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

    return () => {
      delete (window as any).handleGoogleOneTap;
    };
  }, [router]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      <div 
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "392201629690-cap30hea8h682f9qcjbpqua2kom6lsml.apps.googleusercontent.com"}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleGoogleOneTap"
        data-auto_prompt="true"
      />
    </>
  );
}
