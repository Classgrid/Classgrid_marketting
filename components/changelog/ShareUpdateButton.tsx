"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ShareUpdateButtonProps = {
  title: string;
  url: string;
  className?: string;
};

export function ShareUpdateButton({ title, url, className }: ShareUpdateButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall through to clipboard if native share is dismissed or unavailable.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <Button type="button" variant="ghost" onClick={handleShare} className={className}>
      {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
      {copied ? "Copied" : "Share this update"}
    </Button>
  );
}

