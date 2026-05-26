"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, ShieldCheck, Send, Loader2, AlertCircle, BadgeCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import RichReplyEditor, { type RichReplyEditorRef } from "@/app/support/components/RichReplyEditor";

// ─── Types ───────────────────────────────────────────────────────────────────

type TicketMessage = {
  _id?: string;
  author: string;
  role: "user" | "admin";
  avatar?: string;
  body: string;
  date: string;
  footer?: string;
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
    case "open":
      return "bg-emerald-500";
    case "in_progress":
      return "bg-amber-500";
    default:
      return "bg-muted-foreground";
  }
}

function statusBadgeBg(status: string) {
  switch (status) {
    case "resolved":
      return "bg-emerald-500";
    case "closed":
      return "bg-muted0";
    case "in_progress":
      return "bg-amber-500";
    case "open":
      return "bg-blue-500";
    default:
      return "bg-muted0";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function TicketDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const ticketId = params?.id as string;
  const queryEmail = searchParams?.get("email") || "";

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const [replyText, setReplyText] = useState("");
  const editorRef = useRef<RichReplyEditorRef>(null);
  const [isSending, setIsSending] = useState(false);
  const [replyError, setReplyError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Strict session guard — must be logged in ──────────────────────────────
  // If not authenticated, redirect to sign-in page immediately.
  // The email query param is ONLY for display; the session email is the authority.
  useEffect(() => {
    if (sessionStatus === "loading") return; // wait for session to resolve

    if (sessionStatus === "unauthenticated") {
      // Not logged in — redirect to sign-in, return here after login
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/auth/signin?callbackUrl=${returnUrl}`;
      return;
    }

    // Logged in — verify the session email matches the query email (ownership check)
    const sessionEmail = normalizeSupportEmail(session?.user?.email);
    const paramEmail = normalizeSupportEmail(queryEmail);

    if (paramEmail && sessionEmail && sessionEmail.toLowerCase() !== paramEmail.toLowerCase()) {
      // Logged in but trying to access someone else's ticket via URL
      setAccessDenied(true);
      setLoading(false);
      return;
    }
  }, [sessionStatus, session, queryEmail]);

  // The email to use for all API calls — always from session, never from URL alone
  const verifiedEmail = normalizeSupportEmail(session?.user?.email);

  // ── Fetch ticket ──────────────────────────────────────────────────────────

  const fetchTicket = async () => {
    if (!ticketId || !verifiedEmail) {
      setError("Missing ticket ID or email.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/support/public/tickets/${ticketId}?email=${encodeURIComponent(verifiedEmail)}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true"
          }
        }
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
    // Only fetch once session is confirmed and email is available
    if (sessionStatus !== "authenticated" || !verifiedEmail || accessDenied) return;
    fetchTicket();
  }, [sessionStatus, verifiedEmail, ticketId, accessDenied]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (ticket?.messages?.length) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [ticket?.messages?.length]);

  // ── Send reply ────────────────────────────────────────────────────────────

  const handleReply = async () => {
    if (!replyText.trim() || isSending || !ticket) return;

    setIsSending(true);
    setReplyError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/support/public/tickets/${ticketId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: verifiedEmail,
            message: replyText.trim(),
            name: ticket.requester?.name || "User",
          }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setReplyError(data.message || "Failed to send reply.");
      } else {
        setReplyText("");
        editorRef.current?.clear();
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

  // ── Loading / Error states ────────────────────────────────────────────────

  // Still waiting for session to resolve
  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && loading)) {
    return (
      <main className="min-h-screen bg-background py-24 px-4 md:px-12 transition-colors duration-300">
        <div className="max-w-[960px] mx-auto flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
          <p className="text-sm text-muted-foreground">Loading ticket...</p>
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
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This ticket belongs to a different account. Please sign in with the correct account to view it.
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
          <h2 className="text-xl font-bold text-foreground mb-2">Unable to load ticket</h2>
          <p className="text-sm text-muted-foreground mb-6">{error || "Ticket not found."}</p>
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
  const isClosedOrResolved = ticket.status === "closed" || ticket.status === "resolved";

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
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.role === "admin"
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "bg-muted"
                          }`}
                      >
                        {msg.role === "admin" ? (
                          msg.avatar ? (
                            <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          )
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {msg.role === "admin" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <span className="font-bold text-sm text-foreground">
                          {msg.author}
                        </span>
                        {msg.role === "admin" && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-foreground">
                            Classgrid Support
                            <BadgeCheck className="w-4 h-4 text-white fill-[#1DA1F2] dark:text-[#0f0f0f]" />
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(msg.date)}
                        </p>
                      </div>
                      <div
                        className="space-y-3 text-sm text-foreground/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: msg.body }}
                      />
                      {msg.footer && (
                        <div className="pt-4 mt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground whitespace-pre-line">
                            {msg.footer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={bottomRef} />

            {/* ── Reply Box ── */}
            {!isClosedOrResolved ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <div className="space-y-3">
                  <RichReplyEditor
                    ref={editorRef}
                    onChange={setReplyText}
                    placeholder="Type your reply here..."
                    minHeight={120}
                    onSubmit={handleReply}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line.
                    </p>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || isSending}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
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
                  {replyError && (
                    <p className="text-sm text-red-500">{replyError}</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="mt-8 pt-8 border-t border-border text-center py-6">
                <p className="text-sm text-muted-foreground">
                  This ticket has been <strong>{ticket.status}</strong>. If you need further help,{" "}
                  <Link href="/support/ticket" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    submit a new ticket
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
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
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
