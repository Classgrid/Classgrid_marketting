"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowRight,
  CircleCheck,
  Clock3,
  Search,
  ExternalLink,
  Mail,
  PlusCircle,
  Ticket,
  Shield,
  MessageSquare,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function normalizeSupportEmail(value?: string | null) {
  const next = (value || "").trim();
  return next && next !== "undefined" ? next : "";
}

function formatDate(iso?: string) {
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

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "waiting_on_user":
      return "Awaiting your reply";
    case "open":
      return "Open";
    case "reopened":
      return "Reopened";
    case "closed":
      return "Closed";
    case "resolved":
      return "Resolved";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export default function MyRequestsPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any");
  
  // Auth state
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlatformUserApi, setIsPlatformUserApi] = useState(false);
  const isPlatformUser = (session?.user as any)?.isPlatformUser === true || isPlatformUserApi;
  
  // Data state
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?callbackUrl=${returnUrl}`;
      return;
    }

    const sessionEmail = normalizeSupportEmail(session?.user?.email);
    if (sessionEmail) {
      setEmail(sessionEmail);
      setIsAuthenticated(true);
      fetchTickets(sessionEmail);
    } else {
      setIsAuthenticated(false);
    }
  }, [status, session?.user?.email]);

  const fetchTickets = async (userEmail: string) => {
    const validEmail = normalizeSupportEmail(userEmail);
    if (!validEmail) {
      setIsAuthenticated(false);
      setTickets([]);
      setError("Email is required to load your tickets.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/support-proxy/tickets?email=${encodeURIComponent(validEmail)}`);
      const data = await res.json();
      
      if (data.success) {
        setTickets(data.tickets);
        setIsPlatformUserApi(!!data.isPlatformUser);
      } else {
        setError(data.message || "Failed to load tickets.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const filteredRequests = tickets.filter((r) =>
    r.subject?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === "Any" || r.status === statusFilter)
  );
  const activeTickets = tickets.filter((ticket) => ticket.status === "open" || ticket.status === "in_progress").length;
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved" || ticket.status === "closed").length;
  const latestActivity = tickets.reduce<string | undefined>((latest, ticket) => {
    const current = ticket.lastComment || ticket.updatedAt || ticket.createdAt;
    if (!latest) return current;
    return new Date(current).getTime() > new Date(latest).getTime() ? current : latest;
  }, undefined);
  const isCheckingSession = status === "loading";

  return (
    <main className="min-h-screen bg-background py-24 px-4 md:px-12 selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-[960px] mx-auto">
        
        {isCheckingSession || !isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-10 bg-card border border-border rounded-2xl p-8 shadow-sm text-center"
          >
            <Spinner className="w-6 h-6 mx-auto text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Authenticating...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* ── Support ID Card (Brevo-style) ── */}
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-300">
                      <Activity className="h-3 w-3" />
                      Support workspace
                    </div>
                    {isPlatformUser ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                        <Shield className="h-3 w-3" />
                        Platform User
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-orange-600 dark:text-orange-400">
                        <MessageSquare className="h-3 w-3" />
                        Classgrid Talk
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    My requests
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Tracking conversations for <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{email}</span>
                  </p>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline"
                    showGlow={false}
                    size="sm"
                    className="mt-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 max-w-fit"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </div>

                <Link
                  href={isPlatformUser ? "/support/ticket" : "/support/inquiry"}
                  className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/25"
                >
                  <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-white/30 transition-all duration-700 group-hover:left-[130%]" />
                  <PlusCircle className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="relative">{isPlatformUser ? "New Support Ticket" : "New Inquiry"}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>



              {/* Informational Reminder */}
              <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <Info className="h-5 w-5 shrink-0 text-blue-500" />
                <p>
                  <strong>Note on Replies:</strong> You will receive an automated email notification whenever the Classgrid Support Team replies to your {isPlatformUser ? "ticket" : "request"}. 
                  Please check back on this dashboard to view updates or continue the conversation.
                </p>
              </div>

              <div className="mt-6 grid gap-4 border-t border-border pt-5 dark:border-[#2a2a2a] sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">{tickets.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active</p>
                    <p className="text-xl font-bold text-foreground">{activeTickets}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last activity</p>
                    <p className="text-sm font-semibold text-foreground">{formatDate(latestActivity)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Title ── */}
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Request history
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeTickets} active, {resolvedTickets} resolved or closed.
                </p>
              </div>
            </div>

            {/* ── Filters Row ── */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search requests"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 md:ml-auto shrink-0">
                <span className="text-xs font-medium text-muted-foreground">
                  Status:
                </span>
                <div className="relative">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 px-3 rounded-lg border border-border bg-muted text-sm font-medium text-foreground focus:ring-2 focus:ring-emerald-500/40 w-fit min-w-[130px]">
                      <SelectValue placeholder="Any">
                        {statusFilter === "Any" ? "Any" : statusLabel(statusFilter)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent side="bottom" className="w-fit min-w-[130px]">
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="reopened">Reopened</SelectItem>
                      <SelectItem value="waiting_on_user">Awaiting your reply</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
                  >
                    <option value="Any">Any</option>
                    <option value="open">Open</option>
                    <option value="reopened">Reopened</option>
                    <option value="waiting_on_user">Awaiting your reply</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-4 text-xs font-bold text-foreground tracking-wide">
                        Subject
                      </th>
                      <th className="p-4 text-xs font-bold text-foreground tracking-wide">
                        Id
                      </th>
                      <th className="p-4 text-xs font-bold text-foreground tracking-wide">
                        Created
                      </th>
                      <th className="p-4 text-xs font-bold text-foreground tracking-wide">
                        Last comment ▾
                      </th>
                      <th className="p-4 text-xs font-bold text-foreground tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <Spinner className="w-6 h-6 mx-auto text-muted-foreground" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Ticket className="h-6 w-6" />
                          </div>
                          <p className="mt-4 text-sm font-semibold text-foreground">No matching requests</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Start a new support ticket or adjust your filters.
                          </p>
                          <Link
                            href={isPlatformUser ? "/support/ticket" : "/support/inquiry"}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-[#2a2a2a] dark:text-white dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                          >
                            <PlusCircle className="h-4 w-4" />
                            {isPlatformUser ? "New Support Ticket" : "New Inquiry"}
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-muted dark:hover:bg-zinc-800/40 transition-colors group"
                        >
                          <td className="p-4">
                            <Link
                              href={`/support/requests/${req._id}?email=${encodeURIComponent(email)}`}
                              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 hover:decoration-emerald-500 inline-flex items-center gap-1.5"
                            >
                              {req.subject}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground font-mono">
                            #{req._id?.substring(0, 8)}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(req.createdAt)}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(req.lastComment)}
                          </td>
                          <td className="p-4">
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/80">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  req.status === "resolved" || req.status === "closed"
                                    ? "bg-muted-foreground"
                                    : req.status === "reopened"
                                    ? "bg-indigo-500"
                                    : req.status === "open"
                                    ? "bg-emerald-500"
                                    : req.status === "waiting_on_user"
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {statusLabel(req.status)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col divide-y divide-border">
                {loading ? (
                  <div className="p-12 text-center">
                    <Spinner className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-sm text-red-500">
                    {error}
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-foreground">No matching requests</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start a new support ticket or adjust your filters.
                    </p>
                    <Link
                      href={isPlatformUser ? "/support/ticket" : "/support/inquiry"}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <PlusCircle className="h-4 w-4" />
                      {isPlatformUser ? "New Support Ticket" : "New Inquiry"}
                    </Link>
                  </div>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <div key={idx} className="p-5 flex flex-col gap-3 hover:bg-muted transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={`/support/requests/${req._id}?email=${encodeURIComponent(email)}`}
                          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 hover:decoration-emerald-500"
                        >
                          {req.subject}
                        </Link>
                        <div className="inline-flex items-center shrink-0 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              req.status === "resolved" || req.status === "closed"
                                ? "bg-muted-foreground"
                                : req.status === "reopened"
                                ? "bg-indigo-500"
                                : req.status === "open"
                                ? "bg-emerald-500"
                                : req.status === "waiting_on_user"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {statusLabel(req.status)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">#{req._id?.substring(0, 8)}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">Created:</span> {formatDate(req.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">Last reply:</span> {formatDate(req.lastComment)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
