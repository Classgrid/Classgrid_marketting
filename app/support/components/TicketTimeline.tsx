"use client";

import React from "react";
import { CheckCircle2, CircleDot, MessageSquare, PencilLine, RotateCcw, Tag, UserCheck } from "lucide-react";

export type TicketEvent = {
  _id?: string;
  id?: string;
  type?: string;
  label?: string;
  from?: unknown;
  to?: unknown;
  actorName?: string;
  actorRole?: string;
  createdAt?: string;
};

function eventIcon(type?: string) {
  switch (type) {
    case "adminReply":
    case "userReply":
      return <MessageSquare className="h-3.5 w-3.5" />;
    case "statusChanged":
    case "resolved":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "reopened":
      return <RotateCcw className="h-3.5 w-3.5" />;
    case "assigned":
    case "unassigned":
      return <UserCheck className="h-3.5 w-3.5" />;
    case "priorityChanged":
    case "categoryChanged":
      return <Tag className="h-3.5 w-3.5" />;
    default:
      return <PencilLine className="h-3.5 w-3.5" />;
  }
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketTimeline({ events = [] }: { events?: TicketEvent[] }) {
  const visibleEvents = events.filter((event) => event.label || event.type).slice(-8).reverse();
  if (!visibleEvents.length) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">Timeline</h3>
      <div className="space-y-4">
        {visibleEvents.map((event, index) => (
          <div key={event.id || event._id || `${event.type}-${index}`} className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {eventIcon(event.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{event.label || event.type}</p>
              <p className="text-xs text-muted-foreground">
                {event.actorName ? `${event.actorName} · ` : ""}
                {formatDate(event.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InlineTimelineEvent({ event }: { event: TicketEvent }) {
  if (!event.label && !event.type) return null;
  return (
    <div className="flex justify-center py-2">
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
        <CircleDot className="h-3 w-3 shrink-0" />
        <span className="truncate">{event.label || event.type}</span>
      </div>
    </div>
  );
}
