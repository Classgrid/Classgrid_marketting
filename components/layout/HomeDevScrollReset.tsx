"use client";

/**
 * HomeDevScrollReset — DISABLED.
 *
 * This component previously called window.scrollTo(0, 0) on a 75ms interval
 * for 1.5 seconds after every mount, which caused the page to jump to the top
 * whenever React remounted the component (HMR, Strict Mode double-invoke, etc.)
 *
 * It has been replaced with a safe no-op. The identical logic that lived in
 * app/layout.tsx as an inline <script> has also been removed.
 */
export function HomeDevScrollReset() {
  return null;
}
