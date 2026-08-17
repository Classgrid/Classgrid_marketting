'use client';

import { useState } from 'react';
import { Copy, Link2 } from 'lucide-react';

interface ChangelogSidebarProps {
  readingTime?: number | null;
}

export function ChangelogSidebar({ readingTime }: ChangelogSidebarProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleCopyUrl = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(console.error);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const el = document.querySelector('.changelog-content');
    const text = el?.textContent || 'No content found.';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(console.error);
    }
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleAI = (name: string) => {
    const url = window.location.href;
    const prompt = `Read from ${url} so I can ask questions about its contents`;
    navigator.clipboard.writeText(prompt);
    setTimeout(() => {
      if (name === 'ChatGPT') {
        window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank');
      } else if (name === 'Claude') {
        window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank');
      }
    }, 800);
  };

  return (
    <aside className="w-[200px] hidden xl:block sticky top-[5rem] h-fit pt-2 pl-6 text-sm shrink-0">
      <div className="flex flex-col gap-5">
        {/* Read Time */}
        {readingTime && (
          <div className="space-y-1">
            <p className="text-[13px] text-muted-foreground">{readingTime} min read</p>
          </div>
        )}

        {/* Copy */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-2">Copy</h4>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 cursor-pointer hover:bg-muted/50"
              >
                {copiedUrl ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <Link2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>Copy URL</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 cursor-pointer hover:bg-muted/50"
              >
                {copiedMd ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <Copy className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>Copy Markdown</span>
              </button>
            </li>
          </ul>
        </div>

        {/* AI */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-2">AI</h4>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => handleAI('ChatGPT')}
                className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 cursor-pointer hover:bg-muted/50"
              >
                <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/images.jpg" alt="ChatGPT" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                <span>Ask ChatGPT</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAI('Claude')}
                className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 cursor-pointer hover:bg-muted/50"
              >
                <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/claude-color.svg" alt="Claude" className="w-3.5 h-3.5 shrink-0" />
                <span>Ask Claude</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
