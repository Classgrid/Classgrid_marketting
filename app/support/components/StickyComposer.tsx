"use client";

import React from "react";
import { Loader2, Lock, Send } from "lucide-react";
import RichReplyEditor, { type RichReplyEditorRef } from "@/app/support/components/RichReplyEditor";

function plainText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function statusText(status: string) {
  return status === "closed" ? "This ticket is closed" : "This ticket is resolved";
}

export default function StickyComposer({
  editorRef,
  replyText,
  status,
  isSending,
  replyError,
  onChange,
  onSubmit,
}: {
  editorRef: React.RefObject<RichReplyEditorRef | null>;
  replyText: string;
  status: string;
  isSending: boolean;
  replyError?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const isClosed = status === "resolved" || status === "closed";
  const text = plainText(replyText);
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (isClosed) {
    return (
      <div className="mt-8 pt-8 border-t border-border">
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{statusText(status)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Create a new ticket if you need more help.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-8 pt-8 border-t border-border"
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && text && !isSending) {
          event.preventDefault();
          onSubmit();
        }
      }}
    >
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg shadow-black/5">
        <RichReplyEditor ref={editorRef} onChange={onChange} placeholder="Type your reply here..." minHeight={120} />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Ctrl+Enter / Cmd+Enter to send. Enter adds a new line.
            <span className="ml-2">{wordCount} words / {text.length} characters</span>
          </p>
          <button
            onClick={onSubmit}
            disabled={!text || isSending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSending ? "Sending" : "Send Reply"}
          </button>
        </div>
        {replyError && <p className="mt-3 text-sm text-red-500">{replyError}</p>}
      </div>
    </div>
  );
}
