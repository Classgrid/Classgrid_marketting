"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Smooth scroll handler.
 * Intercepts all anchor-link clicks (href="#section" or href="/#section")
 * and performs a smooth, easeOutExpo scroll animation instead of the
 * browser's default jump.
 *
 * Fix: initial hash-scroll now uses a ref so it fires exactly ONCE on
 * mount (not on every pathname change), and all pending timers are
 * cancelled in cleanup to prevent stale scroll calls after navigation.
 */
export function SmoothScrollHandler() {
  const pathname = usePathname();
  const router = useRouter();
  // Tracks whether we've already fired the initial hash-scroll for this mount.
  const hasFiredHashScroll = useRef(false);

  useEffect(() => {
    // Only run once per mount, and only when there's actually a hash.
    if (hasFiredHashScroll.current) return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");
    if (!id) return;

    hasFiredHashScroll.current = true;

    let attempts = 0;
    const pendingTimers: ReturnType<typeof setTimeout>[] = [];

    const tryFindAndScroll = () => {
      attempts++;
      const el = document.getElementById(id);

      if (el) {
        // Wait for layout to settle (images, carousels, etc.) before scrolling.
        const t = setTimeout(() => scrollToHash(hash), 600);
        pendingTimers.push(t);
        return;
      }

      if (attempts < 15) {
        const t = setTimeout(tryFindAndScroll, 200);
        pendingTimers.push(t);
      }
    };

    const initialTimer = setTimeout(tryFindAndScroll, 200);
    pendingTimers.push(initialTimer);

    // Cancel all pending timers if the effect cleans up (e.g. route change).
    return () => {
      pendingTimers.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← intentionally empty: run once on mount only

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;

      try {
        const targetUrl = new URL(href, window.location.origin);

        // Only handle same-domain links.
        if (targetUrl.host !== window.location.host) return;

        const hasHash = !!targetUrl.hash;
        if (!hasHash) return;

        const id = targetUrl.hash.replace("#", "");
        if (!id) return;

        const isSamePage = targetUrl.pathname === window.location.pathname;

        if (!isSamePage) {
          // Cross-page hash navigation — let the browser handle routing,
          // then the mount effect above will scroll to the hash.
          e.preventDefault();
          e.stopPropagation();
          window.location.assign(targetUrl.pathname + targetUrl.hash);
          return;
        }

        // Same-page hash navigation.
        const el = document.getElementById(id);
        if (!el) return;

        e.preventDefault();
        e.stopPropagation();

        window.history.pushState(null, "", `#${id}`);
        scrollToHash(`#${id}`);
      } catch {
        // Invalid URL — do nothing.
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [router]);

  return null;
}

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  if (!id) return false;

  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  const headerOffset = 80;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const targetPosition = Math.max(0, elementPosition - headerOffset);
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;

  let startTime: number | null = null;
  const duration = 700;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    window.scrollTo(0, startPosition + distance * ease);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
  return true;
}
