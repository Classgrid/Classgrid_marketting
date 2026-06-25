"use client";
import React from "react";
import Marquee from "react-fast-marquee";

// Provide local filenames (place them in `public/logos/`) or set NEXT_PUBLIC_LOGO_BASE_URL
const LOGOS = [
  { name: "Classgrid", file: "classgrid.png", src: "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/android-chrome-512x512.png" },
  { name: "Google Meet", file: "google-meet.svg", src: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Meet_icon_%282020%29.svg" },
  { name: "Zoom", file: "zoom.svg", src: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Zoom_Communications_Logo.svg" },
  { name: "Razorpay", file: "razorpay.svg", src: "https://razorpay.com/assets/razorpay_logo.svg" },
  { name: "Google Drive", file: "google-drive.png", src: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Google_Drive_logo.png" },
  { name: "Excel", file: "excel.svg", src: "https://upload.wikimedia.org/wikipedia/commons/7/77/Microsoft_Excel_2013_logo.svg" },
  { name: "Firebase", file: "firebase.png", src: "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/fb_logo_325x325.png" },
];

export default function MarqueeLogos() {
  // Set `NEXT_PUBLIC_LOGO_BASE_URL` to a public CDN or Supabase storage URL if you prefer remote hosting.
  const base = process.env.NEXT_PUBLIC_LOGO_BASE_URL || "/logos";

  return (
    <div className="py-5">
      <Marquee gradient={false} speed={50} pauseOnHover={true}>
        {LOGOS.map((l, i) => {
          const candidate = `${base}/${l.file}`;
          return (
            <div className="flex items-center gap-3 px-7" key={i}>
              <div className="flex h-10 w-[84px] items-center justify-center">
                <img
                  src={candidate}
                  alt={l.name}
                  className="max-h-9 max-w-[120px] object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = l.src;
                  }}
                />
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
