"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const ICONS_ROW1 = [
  "https://cdn.worldvectorlogo.com/logos/zoom-app.svg",
  "https://cdn.worldvectorlogo.com/logos/google-meet.svg",
  "https://cdn.worldvectorlogo.com/logos/aws-s3.svg",
  "https://cdn.worldvectorlogo.com/logos/razorpay.svg",
  "https://cdn.worldvectorlogo.com/logos/supabase.svg",
  "https://cdn.worldvectorlogo.com/logos/redis.svg",
  "https://cdn.worldvectorlogo.com/logos/brevo-1.svg",
];

const ICONS_ROW2 = [
  "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
  "https://cdn.worldvectorlogo.com/logos/postgresql.svg",
  "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
  "https://cdn.worldvectorlogo.com/logos/twilio-1.svg",
  "https://cdn.worldvectorlogo.com/logos/whatsapp-icon.svg",
  "https://cdn.worldvectorlogo.com/logos/sendgrid-1.svg",
  "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
];

const repeatedIcons = (icons: string[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative overflow-hidden bg-white py-32 dark:bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-black dark:border-gray-700 dark:bg-black dark:text-white">
          Integrations
        </span>
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
          Connect Classgrid to your campus stack
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500 dark:text-white">
          Sync payments, meetings, messaging, and data across AWS, Razorpay, Zoom,
          and 250+ education-ready apps.
        </p>
        <Button
          asChild
          className="mt-8 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          <Link href="/integrations">Explore integrations</Link>
        </Button>

        <div className="relative mt-12 overflow-hidden pb-2">
          <div className="flex animate-scroll-left gap-10 whitespace-nowrap">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => (
              <div
                key={`row1-${i}`}
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-300"
              >
                <img src={src} alt="integration icon" className="h-10 w-10 object-contain" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex animate-scroll-right gap-10 whitespace-nowrap">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => (
              <div
                key={`row2-${i}`}
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-300"
              >
                <img src={src} alt="integration icon" className="h-10 w-10 object-contain" />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent dark:from-black" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent dark:from-black" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
