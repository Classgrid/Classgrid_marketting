"use client";

import React from "react";
import { Download, Eye, File, FileImage, FileText } from "lucide-react";
import type { FilePreviewSource } from "@/app/support/components/FilePreviewModal";

export type SupportAttachment =
  | string
  | {
      id?: string;
      name?: string;
      url?: string;
      storage_path?: string;
      storagePath?: string;
      fullPath?: string;
      path?: string;
      mimeType?: string;
      type?: string;
      size?: number;
    };

type NormalizedAttachment = {
  key: string;
  name: string;
  url?: string;
  mimeType: string;
  size?: number;
  isImage: boolean;
  isPdf: boolean;
};

function formatSize(size?: number) {
  if (size === undefined) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function fileNameFromPath(path: string, fallback: string) {
  const raw = path.split(/[\\/]/).pop() || fallback;
  const name = decodeURIComponent(raw);
  return name.includes("_") ? name.substring(name.indexOf("_") + 1) : name;
}

function storageUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  return base ? `${base}/storage/v1/object/public/support-attachments/${path.replace(/^support-attachments\//, "")}` : "";
}

function guessMime(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) return `image/${ext === "jpg" ? "jpeg" : ext}`;
  if (ext === "pdf") return "application/pdf";
  return "application/octet-stream";
}

export function normalizeAttachment(attachment: SupportAttachment, index = 0): NormalizedAttachment {
  if (typeof attachment === "string") {
    const name = fileNameFromPath(attachment, `Attachment ${index + 1}`);
    const mimeType = guessMime(name);
    const url = storageUrl(attachment);
    return { key: `${attachment}-${index}`, name, url, mimeType, isImage: mimeType.startsWith("image/"), isPdf: mimeType === "application/pdf" };
  }

  const path = attachment.url || attachment.storage_path || attachment.storagePath || attachment.path || attachment.fullPath || "";
  const name = attachment.name || fileNameFromPath(path, `Attachment ${index + 1}`);
  const mimeType = attachment.mimeType || attachment.type || guessMime(name);
  const url = attachment.url || storageUrl(path);

  return {
    key: attachment.id || `${path || name}-${index}`,
    name,
    url,
    mimeType,
    size: attachment.size,
    isImage: mimeType.startsWith("image/"),
    isPdf: mimeType === "application/pdf",
  };
}

export default function InlineAttachment({
  attachment,
  onPreview,
}: {
  attachment: SupportAttachment;
  onPreview: (file: FilePreviewSource) => void;
}) {
  const file = normalizeAttachment(attachment);

  if (file.isImage && file.url) {
    return (
      <button
        type="button"
        onClick={() => onPreview({ name: file.name, src: file.url || "", mimeType: file.mimeType })}
        className="group max-w-[220px] overflow-hidden rounded-lg border border-border bg-background p-2 text-left transition-colors hover:border-emerald-500/50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={file.name} className="h-28 w-full rounded-md object-cover" />
        <span className="mt-2 flex items-center gap-2 text-xs font-semibold text-foreground">
          <FileImage className="h-3.5 w-3.5 text-emerald-500" />
          <span className="truncate">{file.name}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background p-2 text-xs">
      {file.isPdf ? <FileText className="h-4 w-4 shrink-0 text-red-500" /> : <File className="h-4 w-4 shrink-0 text-muted-foreground" />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground" title={file.name}>{file.name}</p>
        {file.size !== undefined && <p className="text-muted-foreground">{formatSize(file.size)}</p>}
      </div>
      {file.url && (
        <>
          <button type="button" onClick={() => onPreview({ name: file.name, src: file.url || "", mimeType: file.mimeType })} className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary" title="Preview file">
            <Eye className="h-3.5 w-3.5" />
          </button>
          <a href={file.url} download={file.name} className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary" title="Download file">
            <Download className="h-3.5 w-3.5" />
          </a>
        </>
      )}
    </div>
  );
}
