"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Clock3, Loader2, RefreshCw, Tag } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import type { RichReplyEditorRef } from "@/app/support/components/RichReplyEditor";
import FilePreviewModal, { type FilePreviewSource } from "@/app/support/components/FilePreviewModal";
import DayDivider, { getDayLabel } from "@/app/support/components/DayDivider";
import MessageBubble from "@/app/support/components/MessageBubble";
import StickyComposer from "@/app/support/components/StickyComposer";
import TicketSidebar from "@/app/support/components/TicketSidebar";
import { InlineTimelineEvent, type TicketEvent } from "@/app/support/components/TicketTimeline";
import type { SupportAttachment } from "@/app/support/components/InlineAttachment";

type TicketMessage = {
  _id?: string;
  author: string;
  role: "user" | "admin";
  avatar?: string;
  body: string;
  date: string;
  footer?: string;
  attachments?: SupportAttachment[];
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
  events?: TicketEvent[];
  attachments?: SupportAttachment[];
  requester: { name: string; email: string };
  assignedTo?: { name: string; email: string } | null;
  slaStatus?: string;
  lastAdminReplyAt?: string;
  lastUserReplyAt?: string;
  satisfaction?: { rating?: number; comment?: string; createdAt?: string };
};

type ThreadItem =
  | { kind: "message"; id: string; date: string; message: TicketMessage }
  | { kind: "event"; id: string; date: string; event: TicketEvent };

function relativeTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function normalizeSupportEmail(value?: string | null) {
  const next = (value || "").trim();
  return next && next !== "undefined" ? next : "";
}

function cleanLabel(value?: string) {
  if (!value) return "-";
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusBadgeBg(status: string) {
  switch (status) {
    case "resolved":
      return "bg-emerald-500";
    case "closed":
      return "bg-muted";
    case "in_progress":
      return "bg-amber-500";
    case "open":
      return "bg-blue-500";
    default:
      return "bg-muted";
  }
}

function priorityBadgeBg(priority: string) {
  switch (priority) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-sky-500";
    default:
      return "bg-muted";
  }
}

function statusLabel(status: string) {
  return cleanLabel(status);
}

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
  const [previewFile, setPreviewFile] = useState<FilePreviewSource | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated") {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/auth/signin?callbackUrl=${returnUrl}`;
      return;
    }

    const sessionEmail = normalizeSupportEmail(session?.user?.email);
    const paramEmail = normalizeSupportEmail(queryEmail);

    if (paramEmail && sessionEmail && sessionEmail.toLowerCase() !== paramEmail.toLowerCase()) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
  }, [sessionStatus, session, queryEmail]);

  const verifiedEmail = normalizeSupportEmail(session?.user?.email);

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
            "ngrok-skip-browser-warning": "true",
          },
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

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchTicket();
  };

  useEffect(() => {
    if (sessionStatus !== "authenticated" || !verifiedEmail || accessDenied) return;
    fetchTicket();
  }, [sessionStatus, verifiedEmail, ticketId, accessDenied]);

  useEffect(() => {
    if (ticket?.messages?.length) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [ticket?.messages?.length]);

  const handleReply = async () => {
    if (!replyText.trim() || isSending || !ticket) return;

    setIsSending(true);
    setReplyError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/support/public/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifiedEmail,
          message: replyText.trim(),
          name: ticket.requester?.name || "User",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setReplyError(data.message || "Failed to send reply.");
      } else {
        setReplyText("");
        editorRef.current?.clear();
        if (data.ticket) {
          setTicket(data.ticket);
        } else {
          await fetchTicket();
        }
      }
    } catch {
      setReplyError("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

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

  if (accessDenied) {
    return <TicketNotice title="Access Denied" message="This ticket belongs to a different account. Please sign in with the correct account to view it." />;
  }

  if (error || !ticket) {
    return <TicketNotice title="Unable to load ticket" message={error || "Ticket not found."} />;
  }

  const messages = ticket.messages || [];
  const events = ticket.events || [];
  const threadItems: ThreadItem[] = [
    ...messages.map((message, index) => ({
      kind: "message" as const,
      id: message._id || `message-${index}`,
      date: message.date,
      message,
    })),
    ...events.map((event, index) => ({
      kind: "event" as const,
      id: event.id || event._id || `event-${index}`,
      date: event.createdAt || ticket.createdAt,
      event,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="min-h-screen bg-background pt-8 pb-24 px-4 md:px-12 selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-[1120px] mx-auto">
        <div className="mb-10 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link href="/support/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to My Requests
            </Link>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <SectionAccentBar align="left" className="mb-4" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">#{ticket._id?.substring(0, 8)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${statusBadgeBg(ticket.status)}`}>{statusLabel(ticket.status)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${priorityBadgeBg(ticket.priority)}`}>{cleanLabel(ticket.priority)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  <Tag className="w-3 h-3" />
                  {cleanLabel(ticket.category)}
                </span>
              </div>
              <h1 className="break-words text-2xl font-bold text-foreground md:text-3xl">{ticket.subject}</h1>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[260px] lg:grid-cols-1">
              <HeaderStat label="SLA" value={cleanLabel(ticket.slaStatus)} />
              <HeaderStat
                label="Last response"
                value={ticket.lastAdminReplyAt ? relativeTime(ticket.lastAdminReplyAt) : relativeTime(ticket.lastComment)}
                icon={<Clock3 className="w-3.5 h-3.5" />}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {threadItems.length > 0 ? (
              threadItems.map((item, index) => {
                const previous = threadItems[index - 1];
                const showDivider = !previous || getDayLabel(previous.date) !== getDayLabel(item.date);
                return (
                  <React.Fragment key={`${item.kind}-${item.id}`}>
                    {showDivider && <DayDivider date={item.date} />}
                    {item.kind === "message" ? (
                      <MessageBubble message={item.message} onPreview={setPreviewFile} />
                    ) : (
                      <InlineTimelineEvent event={item.event} />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                <p className="text-sm font-bold text-foreground">No replies yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Support replies will appear here.</p>
              </div>
            )}

            <div ref={bottomRef} />
            <StickyComposer
              editorRef={editorRef}
              replyText={replyText}
              status={ticket.status}
              isSending={isSending}
              replyError={replyError}
              onChange={setReplyText}
              onSubmit={handleReply}
            />
          </div>

          <div className="lg:col-span-1">
            <TicketSidebar ticket={ticket} onPreview={setPreviewFile} />
          </div>
        </div>
      </div>

      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </main>
  );
}

function HeaderStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="font-semibold text-foreground">{value || "-"}</p>
    </div>
  );
}

function TicketNotice({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen bg-background py-24 px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-md mx-auto mt-10 bg-card border border-border rounded-lg p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <Link href="/support/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to My Requests
        </Link>
      </div>
    </main>
  );
}
