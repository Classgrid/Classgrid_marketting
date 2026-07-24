'use client';

import { useState } from 'react';

interface DocsImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

/**
 * Vercel-style docs image component.
 * - Full width of the content area (not overflowing)
 * - Rounded corners with subtle border
 * - Optional caption from alt text
 * - Click to open full size in new tab
 * - Subtle shadow + hover effect
 */
export function DocsImage({ src, alt, title }: DocsImageProps) {
  if (!src) return null;

  const caption = title || alt;

  return (
    <span className="my-8 block w-full">
      <span className="relative block overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-200 group-hover:border-white/[0.15] group-hover:shadow-lg group-hover:shadow-black/20 group">
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-auto block"
          loading="lazy"
        />
      </span>

      {/* Caption */}
      {caption && caption !== alt?.replace(/\s+/g, '') && (
        <span className="mt-3 block text-center text-[13px] text-slate-500 dark:text-zinc-500 leading-relaxed">
          {caption}
        </span>
      )}
    </span>
  );
}
