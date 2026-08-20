"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, ShieldCheck, Send, AlertCircle, BadgeCheck, RefreshCw, Paperclip, Eye, FileText, CheckCircle2, Lock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import RichReplyEditor, { type RichReplyEditorRef } from "@/app/support/components/RichReplyEditor";
import { getPresignedUrlForSupportImage } from "@/app/actions/r2-actions";
import FilePreviewModal, { type FilePreviewSource } from "@/app/support/components/FilePreviewModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type TicketMessage = {
  _id?: string;
  author: string;
  role: "user" | "admin";
  avatar?: string;
  body: string;
  date: string;
  footer?: string;
  attachments?: any[];
  orgName?: string;
  orgLogo?: string;
  authorRole?: string;
};

type TicketData = {
  _id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  lastComment: string;
  messages: TicketMessage[];
  attachments?: string[];
  requester: { name: string; email: string };
  assignedTo?: { name: string; email: string } | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeSupportEmail(value?: string | null) {
  const next = (value || "").trim();
  return next && next !== "undefined" ? next : "";
}

function statusColor(status: string) {
  switch (status) {
    case "resolved":
    case "closed":
      return "bg-muted-foreground";
    case "reopened":
      return "bg-indigo-500";
    case "open":
      return "bg-emerald-500";
    case "in_progress":
      return "bg-amber-500";
    case "waiting_on_user":
      return "bg-red-500";
    default:
      return "bg-muted-foreground";
  }
}

function statusBadgeBg(status: string) {
  switch (status) {
    case "resolved":
      return "bg-emerald-500";
    case "closed":
      return "bg-zinc-500";
    case "reopened":
      return "bg-indigo-500";
    case "in_progress":
      return "bg-amber-500";
    case "open":
      return "bg-blue-500";
    case "waiting_on_user":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "waiting_on_user":
      return "Awaiting your reply";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarColors = [
  "bg-emerald-500", "bg-emerald-600", "bg-green-500", 
  "bg-green-600", "bg-teal-500", "bg-teal-600"
];

function getAvatarColor(name: string) {
  if (!name) return "bg-emerald-500";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}


// ─── Page Component ──────────────────────────────────────────────────────────

function TicketDetailPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const ticketId = params?.id as string;
  const queryEmail = searchParams?.get("email") || "";
  const isPlatformUser = (session?.user as any)?.isPlatformUser === true;
  const entityName = isPlatformUser ? "ticket" : "inquiry";
  const entityNameCapitalized = isPlatformUser ? "Ticket" : "Inquiry";

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const [replyText, setReplyText] = useState("");
  const editorRef = useRef<RichReplyEditorRef>(null);
  const [isSending, setIsSending] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySent, setReplySent] = useState(false);
  const replySentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [previewFile, setPreviewFile] = useState<FilePreviewSource | null>(null);

  // ── Auth guard — ALWAYS require login (like AWS Support) ──────────────
  useEffect(() => {
    if (sessionStatus === "loading") return; // wait for session to resolve

    // Always redirect to login if unauthenticated — no public access via URL email
    if (sessionStatus === "unauthenticated") {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?callbackUrl=${returnUrl}`;
      return;
    }

    const sessionEmail = normalizeSupportEmail(session?.user?.email);
    const paramEmail = normalizeSupportEmail(queryEmail);

    // Verify the logged-in email matches the URL email (ownership check)
    if (sessionEmail && paramEmail && sessionEmail.toLowerCase() !== paramEmail.toLowerCase()) {
      // Trying to access someone else's ticket via URL
      setAccessDenied(true);
      setLoading(false);
      return;
    }
  }, [sessionStatus, session, queryEmail]);

  // The email to use for all API calls: ONLY use the session email (never trust URL alone)
  const verifiedEmail = normalizeSupportEmail(session?.user?.email);

  // ── Fetch ticket ──────────────────────────────────────────────────────────

  const fetchTicket = async () => {
    if (!ticketId || !verifiedEmail) {
      setError("Missing ticket ID or email.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/support-proxy/tickets/${ticketId}?email=${encodeURIComponent(verifiedEmail)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load ticket.");
        return;
      }

      setTicket(data.ticket);
      setError("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchTicket();
  };

  useEffect(() => {
    // Only fetch once session is confirmed (or unauthenticated if we have a valid email)
    if (sessionStatus === "loading" || !verifiedEmail || accessDenied) return;
    fetchTicket();
  }, [sessionStatus, verifiedEmail, ticketId, accessDenied]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (ticket?.messages?.length) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      // Inject ticket context for AI chat
      const rawTextMessages = ticket.messages.map(m => {
        // Strip HTML to save tokens and prevent XSS
        const textOnly = m.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return `${m.author} (${m.role}): ${textOnly.substring(0, 500)}`;
      });
      (window as any).classgrid_current_ticket_context = `Ticket ID: ${ticket._id}\nSubject: ${ticket.subject}\nStatus: ${ticket.status}\nMessages (summarized):\n${rawTextMessages.join('\n\n')}`;
    }
    
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).classgrid_current_ticket_context;
      }
    };
  }, [ticket]);

  // ── Send reply ────────────────────────────────────────────────────────────

  const handleReply = async () => {
    const files = editorRef.current?.getFiles() || [];
    const hasFiles = files.length > 0;
    const currentHTML = editorRef.current?.getHTML() || "";
    
    if ((!currentHTML.trim() && !hasFiles) || isSending || !ticket) return;

    setIsSending(true);
    setReplyError("");

    try {
      let res;
      if (hasFiles) {
        const formData = new FormData();
        const messageToSend = currentHTML.trim() || (hasFiles ? "Sent an attachment" : "");
        formData.append("email", verifiedEmail);
        formData.append("message", messageToSend);
        formData.append("name", ticket.requester?.name || "User");
        files.forEach((f) => formData.append("files", f));

        res = await fetch(`/api/support-proxy/tickets/${ticketId}/reply`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`/api/support-proxy/tickets/${ticketId}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: verifiedEmail,
            message: currentHTML.trim(),
            name: ticket.requester?.name || "User",
          }),
        });
      }
      const data = await res.json();

      if (!res.ok || !data.success) {
        setReplyError(data.message || "Failed to send reply.");
      } else {
        setReplyText("");
        editorRef.current?.clear();
        // Show "Reply Sent" toast for 10 seconds
        setReplySent(true);
        if (replySentTimerRef.current) clearTimeout(replySentTimerRef.current);
        replySentTimerRef.current = setTimeout(() => setReplySent(false), 10000);
        // Update with the latest ticket data from response
        if (data.ticket) {
          setTicket(data.ticket);
        } else {
          // Fallback: re-fetch
          await fetchTicket();
        }
      }
    } catch {
      setReplyError("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // ── Close Ticket ──────────────────────────────────────────────────────────
  
  const handleCloseTicket = async () => {
    if (!ticket || isClosing) return;
    
    setIsClosing(true);
    setReplyError("");
    
    try {
      const res = await fetch(`/api/support-proxy/tickets/${ticketId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifiedEmail }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setReplyError(data.message || "Failed to close ticket.");
      } else {
        if (data.ticket) {
          setTicket(data.ticket);
        } else {
          await fetchTicket();
        }
      }
    } catch {
      setReplyError("Network error. Please try again.");
    } finally {
      setIsClosing(false);
    }
  };

  // ── Loading / Error states ────────────────────────────────────────────────

  // Still waiting for session to resolve
  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && loading)) {
    return (
      <main className="min-h-screen bg-background py-24 px-4 md:px-12 transition-colors duration-300">
        <div className="max-w-[960px] mx-auto flex flex-col items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-muted-foreground" />
        </div>
      </main>
    );
  }

  // Logged in but this ticket belongs to a different account
  if (accessDenied) {
    return (
      <main className="min-h-screen bg-background py-24 px-4 md:px-12 transition-colors duration-300">
        <div className="max-w-md mx-auto mt-10 bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No ticket found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The requested ticket does not exist.
          </p>
          <Link
            href="/support/requests"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Requests
          </Link>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-background py-24 px-4 md:px-12 transition-colors duration-300">
        <div className="max-w-md mx-auto mt-10 bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No ticket found</h2>
          <p className="text-sm text-muted-foreground mb-6">The requested ticket does not exist.</p>
          <Link
            href="/support/requests"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Requests
          </Link>
        </div>
      </main>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const messages = ticket.messages || [];
  const isClosed = ticket.status === "closed";

  return (
    <main className="min-h-screen bg-background pt-8 pb-24 px-4 md:px-12 selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-[960px] mx-auto">

        {/* ── Title + Status Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <SectionAccentBar align="left" className="mb-0 basis-full" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {ticket.subject}
          </h1>
          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${statusBadgeBg(ticket.status)}`}>
            {statusLabel(ticket.status)}
          </span>
          
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full transition-colors disabled:opacity-50"
          >
            <Spinner className={`w-3.5 h-3.5 ${isRefreshing ? "" : "opacity-0"}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Message Thread */}
          <div className="lg:col-span-2 space-y-0">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg._id || `msg-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                >
                  {idx > 0 && (
                    <hr className="border-border my-0" />
                  )}
                    <div className="flex gap-4 py-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.avatar
                          ? ""
                          : `${getAvatarColor(msg.author)} text-white font-bold text-sm`
                          }`}
                      >
                        {msg.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(msg.author)}</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <div className="flex items-center flex-wrap gap-y-1 gap-x-3">
                          <div className="flex items-center">
                            <span className="font-bold text-sm text-foreground">
                              {msg.author}
                            </span>
                            {msg.authorRole === "super_admin" && (
                              <span className="ml-1.5 inline-flex items-center" title="Verified Classgrid Team">
                                <BadgeCheck className="w-4 h-4 text-white fill-[#1DA1F2] dark:text-[#0f0f0f]" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(msg.date)}
                          </p>
                        </div>
                        {msg.orgName && (
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border text-xs font-medium text-muted-foreground">
                              {(msg.orgLogo && msg.orgLogo !== "null") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={msg.orgLogo} alt="" className="w-4 h-4 rounded-none object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-4 h-4 rounded-sm bg-muted-foreground/20 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-foreground/40">
                                    {msg.orgName.slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              {msg.orgName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className="whitespace-pre-wrap break-words text-base text-foreground leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1.5 [&>strong]:font-bold [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3 [&>pre]:bg-muted [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>code]:bg-muted [&>code]:px-1 [&>code]:rounded [&_a]:!text-blue-500 [&_a]:!no-underline hover:[&_a]:!text-blue-400 [&_u]:!decoration-emerald-500 [&_u]:underline-offset-4 [&_u]:decoration-2 [&_span[style*='underline']]:!decoration-emerald-500 [&_span[style*='underline']]:underline-offset-4 [&_span[style*='underline']]:decoration-2 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:my-4 [&_img]:max-h-[500px] [&_img]:object-contain overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: msg.body }}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === "IMG") {
                            const src = (target as HTMLImageElement).src;
                            const alt = (target as HTMLImageElement).alt || "Image preview";
                            setPreviewFile({ name: alt, src });
                          }
                        }}
                      />

                      {/* Message Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.attachments.map((att: any, aIdx: number) => {
                            const path = typeof att === 'string' ? att : (att.url || att.path || '');
                            if (!path || typeof path !== 'string') return null;

                            const fullFileName = typeof att !== 'string' && att.filename ? att.filename : (path.split('/').pop() || `File ${aIdx + 1}`);
                            const fileName = fullFileName.includes('_') ? fullFileName.substring(fullFileName.indexOf('_') + 1) : fullFileName;
                            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bumxgscngzjadyozdpce.supabase.co';
                            const fileUrl = path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/support-attachments/${path}`;

                            return (
                              <button
                                key={`msg-att-${aIdx}`}
                                onClick={() => setPreviewFile({ name: fileName, src: fileUrl })}
                                className="group flex items-center gap-2 px-3 py-1.5 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg text-xs transition-all shadow-sm"
                                title="View attachment"
                              >
                                <div className="w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="font-medium text-foreground truncate max-w-[200px]">{fileName}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={bottomRef} />

            {/* ── Reply Box ── */}
            {!isClosed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <div className="space-y-3">
                  {/* Reply Sent Toast */}
                  <AnimatePresence>
                    {replySent && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          Reply sent
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {ticket.status === "resolved" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                          <p className="font-semibold mb-1">This {entityName} has been marked as resolved.</p>
                          <p>
                            If you are satisfied with the support team's reply, you can close this {entityName}. 
                            Replying will automatically reopen it. If you do not reply within 7 days, it will automatically close.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <RichReplyEditor
                    ref={editorRef}
                    onChange={(text) => {
                      setReplyText(text);
                      // Dismiss toast when user starts typing a new message
                      if (text.trim() && replySent) {
                        setReplySent(false);
                        if (replySentTimerRef.current) clearTimeout(replySentTimerRef.current);
                      }
                    }}
                    placeholder="Type your reply here..."
                    minHeight={120}
                    onSubmit={handleReply}
                    onImageUpload={async (file) => {
                      try {
                        const { uploadUrl, publicUrl } = await getPresignedUrlForSupportImage(file.name, file.type);
                        await fetch(uploadUrl, {
                          method: "PUT",
                          body: file,
                          headers: { "Content-Type": file.type },
                        });
                        return { url: publicUrl, path: publicUrl };
                      } catch (err) {
                        console.error("Image upload failed:", err);
                        return null;
                      }
                    }}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line.
                    </p>
                    <div className="flex items-center gap-2 ml-auto">
                      {ticket.status === "resolved" && (
                        <button
                          onClick={handleCloseTicket}
                          disabled={isSending || isClosing}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground text-sm font-semibold rounded-lg transition-colors disabled:opacity-40"
                        >
                          {isClosing ? (
                            <>
                              <Spinner className="w-4 h-4 text-inherit" />
                              Closing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Close {entityNameCapitalized}
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={handleReply}
                        disabled={(!replyText.trim() && (editorRef.current?.getFiles().length || 0) === 0) || isSending || isClosing}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        {isSending ? (
                          <>
                            <Spinner className="w-4 h-4 text-inherit" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {replyError && (
                    <p className="text-sm text-red-500">{replyError}</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="mt-8 pt-8 border-t border-border text-center py-6">
                <p className="text-sm text-muted-foreground">
                  This {entityName} has been <strong>{ticket.status}</strong>. If you need further help,{" "}
                  <Link href={isPlatformUser ? "/support/ticket" : "/support/inquiry"} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    submit a new {entityName}
                  </Link>.
                </p>
              </div>
            )}
          </div>

          {/* Right: Metadata Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="bg-card border border-border rounded-lg p-5 mt-2 lg:mt-0 lg:sticky lg:top-28"
            >
              <dl className="space-y-4">
                <MetaRow label="Id" value={`#${ticket._id?.substring(0, 8)}`} mono />
                <MetaRow label="Requester" value={ticket.requester?.name || "-"} />
                <MetaRow label="Email" value={ticket.requester?.email || "-"} />
                <MetaRow label="Created" value={formatDate(ticket.createdAt)} />
                <MetaRow label="Assigned to" value={ticket.assignedTo?.name || "Unassigned"} />

                <hr className="border-border" />

                <MetaRow label="Category" value={ticket.category || "-"} />
                <MetaRow label="Priority" value={ticket.priority || "-"} />
                <MetaRow label="Last activity" value={formatDate(ticket.lastComment)} />

                <hr className="border-border" />

                <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                  <dt className="font-semibold text-sm text-foreground">Status</dt>
                  <dd className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/80">
                    <div className={`w-2 h-2 rounded-full ${statusColor(ticket.status)}`} />
                    {statusLabel(ticket.status)}
                  </dd>
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                  {messages.length} message{messages.length !== 1 ? "s" : ""} in this thread
                </div>

                {/* Attachments (Combined from ticket + all messages) */}
                {(() => {
                  const combinedAttachments = [
                    ...(ticket.attachments || []),
                    ...messages.flatMap(m => m.attachments || [])
                  ].filter((v, i, a) => {
                    const getPath = (item: any) => typeof item === 'string' ? item : (item.url || item.path || '');
                    return a.findIndex(t => getPath(t) === getPath(v)) === i;
                  });

                  if (combinedAttachments.length === 0) return null;

                  return (
                    <>
                      <hr className="border-border" />
                      <div>
                        <dt className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5" />
                          All Attachments ({combinedAttachments.length})
                        </dt>
                        <div className="space-y-2">
                          {combinedAttachments.map((attachmentItem: any, idx) => {
                            const path = typeof attachmentItem === 'string' ? attachmentItem : (attachmentItem?.url || attachmentItem?.path || '');
                            if (!path || typeof path !== 'string') return null;

                            const fullFileName = typeof attachmentItem !== 'string' && attachmentItem.filename ? attachmentItem.filename : (path.split('/').pop() || `File ${idx + 1}`);
                            const fileName = fullFileName.includes('_') ? fullFileName.substring(fullFileName.indexOf('_') + 1) : fullFileName;
                            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bumxgscngzjadyozdpce.supabase.co';
                            const fileUrl = path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/support-attachments/${path}`;

                            return (
                              <div
                                key={`sidebar-att-${idx}`}
                                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border text-xs"
                              >
                                <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate flex-1 text-foreground" title={fileName}>
                                  {fileName.length > 20 ? fileName.slice(0, 8) + '...' + fileName.slice(-8) : fileName}
                                </span>
                                <button
                                  onClick={() => setPreviewFile({ name: fileName, src: fileUrl })}
                                  className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                  title="View file"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </main>
  );
}

export default function TicketDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TicketDetailPageInner />
    </Suspense>
  );
}

// ─── Sidebar Row Helper ──────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2 min-w-0">
      <dt className="font-semibold text-sm text-foreground shrink-0">
        {label}
      </dt>
      <dd
        className={`text-right text-muted-foreground min-w-0 break-all ${mono ? "font-mono" : ""} text-sm`}
      >
        {value}
      </dd>
    </div>
  );
}
