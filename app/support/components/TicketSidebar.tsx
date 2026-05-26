"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, PanelRightOpen, Paperclip, Star, User, X } from "lucide-react";
import type { FilePreviewSource } from "@/app/support/components/FilePreviewModal";
import InlineAttachment, { type SupportAttachment } from "@/app/support/components/InlineAttachment";
import TicketTimeline, { type TicketEvent } from "@/app/support/components/TicketTimeline";

type TicketMessage = { attachments?: SupportAttachment[] };

type RelatedTicket = {
  _id: string;
  subject: string;
  status: string;
  createdAt?: string;
  lastComment?: string;
};

type TicketLike = {
  _id: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  lastComment: string;
  requester?: { name?: string; email?: string };
  assignedTo?: { name?: string; email?: string } | string | null;
  attachments?: SupportAttachment[];
  events?: TicketEvent[];
  messages?: TicketMessage[];
  slaStatus?: string;
  lastAdminReplyAt?: string;
  lastUserReplyAt?: string;
  satisfaction?: { rating?: number; comment?: string; createdAt?: string };
  relatedTickets?: RelatedTicket[];
};

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function label(value?: string) {
  if (!value) return "-";
  return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function statusDot(status: string) {
  if (status === "open") return "bg-blue-500";
  if (status === "in_progress") return "bg-amber-500";
  if (status === "resolved") return "bg-emerald-500";
  return "bg-muted-foreground";
}

function assigneeName(ticket: TicketLike) {
  if (!ticket.assignedTo) return "Unassigned";
  if (typeof ticket.assignedTo === "string") return ticket.assignedTo;
  return ticket.assignedTo.name || ticket.assignedTo.email || "Unassigned";
}

function SidebarContent({
  ticket,
  onPreview,
}: {
  ticket: TicketLike;
  onPreview: (file: FilePreviewSource) => void;
}) {
  const attachments = useMemo(
    () => [...(ticket.attachments || []), ...((ticket.messages || []).flatMap((message) => message.attachments || []))],
    [ticket.attachments, ticket.messages]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{ticket.requester?.name || "Requester"}</p>
            <p className="truncate text-xs text-muted-foreground">{ticket.requester?.email || "-"}</p>
          </div>
        </div>
        <dl className="space-y-3">
          <MetaRow label="Id" value={`#${ticket._id.substring(0, 8)}`} mono />
          <MetaRow label="Status" value={label(ticket.status)} dot={statusDot(ticket.status)} />
          <MetaRow label="Priority" value={label(ticket.priority)} />
          <MetaRow label="Category" value={label(ticket.category)} />
          <MetaRow label="Assigned to" value={assigneeName(ticket)} />
          <MetaRow label="Created" value={formatDate(ticket.createdAt)} />
          <MetaRow label="Last activity" value={formatDate(ticket.lastComment)} />
          {ticket.slaStatus && <MetaRow label="SLA" value={label(ticket.slaStatus)} />}
          {ticket.lastAdminReplyAt && <MetaRow label="Last admin reply" value={formatDate(ticket.lastAdminReplyAt)} />}
          {ticket.lastUserReplyAt && <MetaRow label="Last user reply" value={formatDate(ticket.lastUserReplyAt)} />}
        </dl>
      </section>

      <TicketTimeline events={ticket.events || []} />

      {attachments.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Paperclip className="h-4 w-4" />
            Attachments ({attachments.length})
          </h3>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <InlineAttachment key={typeof attachment === "string" ? attachment : attachment.id || attachment.url || index} attachment={attachment} onPreview={onPreview} />
            ))}
          </div>
        </section>
      )}

      {ticket.relatedTickets && ticket.relatedTickets.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-bold text-foreground">Related tickets</h3>
          <div className="space-y-2">
            {ticket.relatedTickets.map((related) => (
              <Link key={related._id} href={`/support/requests/${related._id}`} className="block rounded-lg border border-border bg-background p-3 hover:border-emerald-500/50">
                <p className="truncate text-sm font-semibold text-foreground">{related.subject}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label(related.status)} · {formatDate(related.lastComment || related.createdAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {ticket.satisfaction?.rating && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-bold text-foreground">Satisfaction</h3>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={`h-4 w-4 ${index < (ticket.satisfaction?.rating || 0) ? "fill-current" : ""}`} />
            ))}
          </div>
          {ticket.satisfaction.comment && <p className="mt-2 text-sm text-muted-foreground">{ticket.satisfaction.comment}</p>}
        </section>
      )}

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-bold text-foreground">Need more help?</h3>
        <Link href="/support/ticket" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <MessageSquare className="h-4 w-4" />
          New Support Ticket
        </Link>
      </section>
    </div>
  );
}

export default function TicketSidebar({ ticket, onPreview }: { ticket: TicketLike; onPreview: (file: FilePreviewSource) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-28">
        <SidebarContent ticket={ticket} onPreview={onPreview} />
      </aside>
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-xl lg:hidden">
        <PanelRightOpen className="h-4 w-4" />
        Details
      </button>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close details" className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-lg border border-border bg-background p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Ticket details</h2>
              <button onClick={() => setOpen(false)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Close details">
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent ticket={ticket} onPreview={onPreview} />
          </div>
        </div>
      )}
    </>
  );
}

function MetaRow({ label, value, mono, dot }: { label: string; value: string; mono?: boolean; dot?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-sm font-semibold text-foreground">{label}</dt>
      <dd className={`min-w-0 break-all text-right text-sm text-muted-foreground ${mono ? "font-mono" : ""}`}>
        {dot && <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dot}`} />}
        {value || "-"}
      </dd>
    </div>
  );
}
