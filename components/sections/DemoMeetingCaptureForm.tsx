"use client";

import { useState } from "react";

type DemoMeetingCaptureFormProps = {
  requestId: string;
};

export function DemoMeetingCaptureForm({ requestId }: DemoMeetingCaptureFormProps) {
  const [provider, setProvider] = useState("google");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!scheduledAt || !meetingUrl) {
      setError("Please fill meeting date-time and meeting URL.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/request-demo/${encodeURIComponent(requestId)}/meeting-booked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          scheduledAt,
          meetingUrl,
          timezone,
          notes,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save meeting details.");
      }

      setSuccess("Meeting details saved. Confirmation email has been queued.");
      setMeetingUrl("");
      setNotes("");
    } catch (err: any) {
      setError(err?.message || "Failed to save meeting details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-foreground">Already booked your call?</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Fill these details once so both you and Classgrid team receive exact schedule confirmation.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Provider
          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="google">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Timezone
          <input
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            placeholder="Asia/Kolkata"
          />
        </label>

        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Meeting Date & Time
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            required
          />
        </label>

        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Meeting URL
          <input
            value={meetingUrl}
            onChange={(event) => setMeetingUrl(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            placeholder="https://meet.google.com/... or https://zoom.us/..."
            required
          />
        </label>
      </div>

      <label className="mt-3 grid gap-1 text-xs font-medium text-muted-foreground">
        Notes (Optional)
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Any extra context for the call..."
        />
      </label>

      {error ? <p className="mt-3 text-sm text-rose-500">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-emerald-500">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Confirm Scheduled Meeting"}
      </button>
    </form>
  );
}

