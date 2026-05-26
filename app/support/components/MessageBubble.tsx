"use client";

import React from "react";
import { BadgeCheck, ShieldCheck, User } from "lucide-react";
import type { FilePreviewSource } from "@/app/support/components/FilePreviewModal";
import InlineAttachment, { type SupportAttachment } from "@/app/support/components/InlineAttachment";

export type SupportMessage = {
  _id?: string;
  author: string;
  role: "user" | "admin";
  avatar?: string;
  body: string;
  date: string;
  footer?: string;
  attachments?: SupportAttachment[];
};

function relativeTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return parts[0]?.slice(0, 2).toUpperCase() || "";
}

function Avatar({ message }: { message: SupportMessage }) {
  const isAdmin = message.role === "admin";
  const fallback = initials(message.author);

  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${isAdmin ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-muted"}`}>
      {message.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={message.avatar} alt={message.author} className="h-full w-full object-cover" />
      ) : fallback ? (
        <span className="text-xs font-bold text-foreground">{fallback}</span>
      ) : isAdmin ? (
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <User className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}

export default function MessageBubble({
  message,
  onPreview,
}: {
  message: SupportMessage;
  onPreview: (file: FilePreviewSource) => void;
}) {
  const isAdmin = message.role === "admin";
  const attachments = message.attachments || [];

  return (
    <div className="flex gap-3 py-3">
      <Avatar message={message} />
      <article className={`min-w-0 flex-1 rounded-lg border p-4 ${isAdmin ? "border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20" : "border-border bg-muted/30"}`}>
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{isAdmin ? message.author || "Classgrid Support" : message.author}</span>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <BadgeCheck className="h-3.5 w-3.5 fill-emerald-500 text-background" />
                Verified
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{relativeTime(message.date)}</p>
        </div>

        <div
          className="text-sm text-foreground/90 leading-relaxed [&>p]:mb-3 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1 [&>strong]:font-semibold [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3 [&>pre]:bg-muted [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>code]:bg-muted [&>code]:px-1 [&>code]:rounded [&_img]:cursor-pointer [&_img]:rounded-lg [&_img]:border [&_img]:border-border"
          dangerouslySetInnerHTML={{ __html: message.body }}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.tagName === "IMG") {
              const src = (target as HTMLImageElement).src;
              const alt = (target as HTMLImageElement).alt || "Image preview";
              onPreview({ name: alt, src });
            }
          }}
        />

        {attachments.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {attachments.map((attachment, index) => (
              <InlineAttachment key={typeof attachment === "string" ? attachment : attachment.id || attachment.url || index} attachment={attachment} onPreview={onPreview} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
