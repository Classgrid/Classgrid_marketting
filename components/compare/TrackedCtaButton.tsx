"use client";

import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

type TrackedCtaButtonProps = {
  href: string;
  label: string;
  eventName: string;
  eventData?: Record<string, unknown>;
  variant?: ButtonProps["variant"];
  className?: string;
};

function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    ...eventData,
  };

  window.dataLayer?.push(payload);
  window.gtag?.("event", eventName, eventData);
  window.dispatchEvent(new CustomEvent("classgrid:cta", { detail: payload }));
}

export function TrackedCtaButton({
  href,
  label,
  eventName,
  eventData,
  variant = "default",
  className,
}: TrackedCtaButtonProps) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link href={href} onClick={() => trackEvent(eventName, eventData)}>
        {label}
      </Link>
    </Button>
  );
}
