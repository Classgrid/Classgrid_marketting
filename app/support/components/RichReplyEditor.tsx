"use client";

import React, { useRef, useCallback, useImperativeHandle, forwardRef, useState } from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Image as ImageIcon,
  X,
  ExternalLink,
  Trash2,
} from "lucide-react";
import LinkModal from "@/app/support/components/LinkModal";
import { uploadToSupabase } from "@/lib/supabase-storage";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// ── Toolbar button ──────────────────────────────────────────────

function ToolBtn({ icon, onClick, title }: { icon: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="w-7 h-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
    >
      {icon}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-border mx-1" />;
}

// ── Types ───────────────────────────────────────────────────────

export interface RichReplyEditorRef {
  clear: () => void;
  getHTML: () => string;
}

interface RichReplyEditorProps {
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  onSubmit?: () => void;
}

// ── Link Tooltip ────────────────────────────────────────────────

interface LinkTooltipState {
  url: string;
  x: number;
  y: number;
}

// ── Main Component ──────────────────────────────────────────────

const RichReplyEditor = forwardRef<RichReplyEditorRef, RichReplyEditorProps>(
  ({ onChange, placeholder = "Type your reply here...", minHeight = 120, onSubmit }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [linkTooltip, setLinkTooltip] = useState<LinkTooltipState | null>(null);
    const [isPlainText, setIsPlainText] = useState(false);
    const savedHTML = useRef<string>("");
    const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const syncContent = useCallback(() => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, [onChange]);

    // Expose clear and getHTML methods
    useImperativeHandle(ref, () => ({
      clear: () => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          onChange("");
        }
      },
      getHTML: () => editorRef.current?.innerHTML || "",
    }), [onChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && onSubmit) {
          const text = editorRef.current?.innerText?.trim() || "";
          if (text) {
            e.preventDefault();
            onSubmit();
          }
        }
      },
      [onSubmit]
    );

    // Paste handler — preserves rich HTML from ChatGPT etc.
    const handlePaste = useCallback(
      (e: React.ClipboardEvent) => {
        const html = e.clipboardData.getData("text/html");
        if (html) {
          e.preventDefault();
          document.execCommand("insertHTML", false, html);
          syncContent();
        }
      },
      [syncContent]
    );

    // Link insertion via LinkModal
    const handleLinkInsert = useCallback((url: string, text?: string) => {
      editorRef.current?.focus();
      const label = text || url;
      document.execCommand("insertHTML", false,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>&nbsp;`
      );
      syncContent();
    }, [syncContent]);

    // Image upload handler
    const handleImageUpload = useCallback(() => {
      imageInputRef.current?.click();
    }, []);

    const onImageSelected = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadProgress(10);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 80) { clearInterval(interval); return 80; }
            return prev + 10;
          });
        }, 200);

        const result = await uploadToSupabase(file, "replies");
        clearInterval(interval);

        if (result) {
          setUploadProgress(100);
          setTimeout(() => {
            setUploadingImage(false);
            editorRef.current?.focus();
            document.execCommand("insertHTML", false,
              `<img src="${result.url}" alt="${file.name}" data-path="${result.path}" style="max-width:200px;max-height:200px;border-radius:8px;margin:8px 4px;cursor:pointer;" />`
            );
            syncContent();
          }, 300);
        } else {
          setUploadingImage(false);
          alert("Image upload failed. Please try again.");
        }
        e.target.value = "";
      },
      [syncContent]
    );

    // Hover handler for links — shows tooltip
    const handleMouseOver = useCallback((e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && editorRef.current?.contains(anchor)) {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        const rect = anchor.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        setLinkTooltip({
          url: anchor.getAttribute("href") || "",
          x: rect.left - editorRect.left,
          y: rect.bottom - editorRect.top + 4,
        });
      }
    }, []);

    const handleMouseOut = useCallback((e: React.MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      // Don't hide if moving to the tooltip itself
      if (related?.closest?.(".link-tooltip-popup")) return;
      tooltipTimeout.current = setTimeout(() => setLinkTooltip(null), 300);
    }, []);

    // Click handler — preview inline images
    const handleEditorClick = useCallback((e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        setPreviewImage((target as HTMLImageElement).src);
      }
    }, []);

    // Delete image from editor
    const deleteClickedImage = useCallback(() => {
      if (!previewImage || !editorRef.current) return;
      const imgs = editorRef.current.querySelectorAll("img");
      imgs.forEach((img) => {
        if (img.src === previewImage) img.remove();
      });
      setPreviewImage(null);
      syncContent();
    }, [previewImage, syncContent]);

    // Remove a link (unlink)
    const removeLink = useCallback(() => {
      if (!linkTooltip || !editorRef.current) return;
      const links = editorRef.current.querySelectorAll("a");
      links.forEach((a) => {
        if (a.getAttribute("href") === linkTooltip.url) {
          const text = document.createTextNode(a.textContent || "");
          a.parentNode?.replaceChild(text, a);
        }
      });
      setLinkTooltip(null);
      syncContent();
    }, [linkTooltip, syncContent]);

    return (
      <>
        <div className="rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-500 transition-all overflow-hidden">
          {/* Hidden file input for images */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={onImageSelected}
            className="hidden"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/50 overflow-x-auto flex-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Select
              onValueChange={(val) => {
                editorRef.current?.focus();
                document.execCommand("formatBlock", false, val);
                syncContent();
              }}
            >
              <SelectTrigger className="h-7 text-xs font-medium bg-transparent border-none shadow-none focus:ring-0 text-muted-foreground px-2 w-[110px]">
                <SelectValue placeholder="Heading" />
              </SelectTrigger>
              <SelectContent side="bottom" className="min-w-[130px]">
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="p">Paragraph</SelectItem>
              </SelectContent>
            </Select>
            <Sep />
            <ToolBtn icon={<Bold className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("bold"); syncContent(); }} title="Bold" />
            <ToolBtn icon={<Italic className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("italic"); syncContent(); }} title="Italic" />
            <Sep />
            <ToolBtn icon={<ImageIcon className="w-3.5 h-3.5" />} onClick={handleImageUpload} title="Insert image" />
            <ToolBtn icon={<Link2 className="w-3.5 h-3.5" />} onClick={() => setLinkModalOpen(true)} title="Insert link" />
            <Sep />
            <ToolBtn icon={<ListOrdered className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("insertOrderedList"); syncContent(); }} title="Numbered list" />
            <ToolBtn icon={<List className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("insertUnorderedList"); syncContent(); }} title="Bullet list" />
            <ToolBtn icon={<Quote className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("formatBlock", false, "blockquote"); syncContent(); }} title="Quote" />
            <Sep />
            <ToolBtn icon={<Undo2 className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("undo"); syncContent(); }} title="Undo" />
            <ToolBtn icon={<Redo2 className="w-3.5 h-3.5" />} onClick={() => { document.execCommand("redo"); syncContent(); }} title="Redo" />
            {/* Upload progress + Plain text toggle */}
            <div className="ml-auto flex items-center gap-3">
              {uploadingImage && (
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-bold text-emerald-500">Uploading {uploadProgress}%</div>
                  <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!editorRef.current) return;
                  if (isPlainText) {
                    // Restore rich text
                    editorRef.current.innerHTML = savedHTML.current;
                    setIsPlainText(false);
                  } else {
                    // Save HTML and show plain text
                    savedHTML.current = editorRef.current.innerHTML;
                    editorRef.current.innerText = editorRef.current.innerText;
                    setIsPlainText(true);
                  }
                  syncContent();
                }}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${isPlainText ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-muted text-muted-foreground hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-accent-foreground"}`}
              >
                {isPlainText ? "Rich text" : "Plain text"}
              </button>
            </div>
          </div>

          {/* Editable Area (relative for tooltip positioning) */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              data-placeholder={placeholder}
              onInput={syncContent}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onClick={handleEditorClick}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              className="p-4 bg-transparent text-sm text-foreground outline-none prose prose-sm dark:prose-invert max-w-none [&_p]:mb-3 [&_p]:leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-400 dark:empty:before:text-zinc-600 empty:before:pointer-events-none [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 dark:[&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-emerald-500 [&_a]:underline [&_a]:cursor-pointer [&_img]:max-w-[150px] [&_img]:max-h-[150px] [&_img]:object-cover [&_img]:rounded-lg [&_img]:cursor-pointer [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_img]:inline-block [&_img]:m-2 hover:[&_img]:opacity-80"
              style={{ minHeight, maxHeight: 300, overflowY: "auto" }}
            />

            {/* Link Hover Tooltip */}
            {linkTooltip && (
              <div
                className="link-tooltip-popup absolute z-20 flex items-center gap-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-xl text-xs text-white animate-in fade-in duration-150"
                style={{ left: linkTooltip.x, top: linkTooltip.y }}
                onMouseEnter={() => {
                  if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
                }}
                onMouseLeave={() => setLinkTooltip(null)}
              >
                <span className="max-w-[200px] truncate text-muted-foreground">{linkTooltip.url}</span>
                <a
                  href={linkTooltip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </a>
                <button
                  onClick={removeLink}
                  className="flex items-center gap-1 px-2 py-1 bg-red-600/80 text-white rounded font-semibold hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Link Modal */}
        <LinkModal
          open={linkModalOpen}
          onClose={() => setLinkModalOpen(false)}
          onInsert={handleLinkInsert}
        />

        {/* Image Preview / Delete Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            {/* Top-right action buttons */}
            <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); deleteClickedImage(); }}
                title="Delete image"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                title="Close"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Image */}
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg border border-border shadow-2xl bg-card"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }
);

RichReplyEditor.displayName = "RichReplyEditor";
export default RichReplyEditor;
