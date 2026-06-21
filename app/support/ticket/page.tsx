"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Image as ImageIcon,
  Quote,
  Undo2,
  Redo2,
  Paperclip,
  X,
  FileText,
  Upload,
  Shield,
  Building2,
  Mail,
  Lock,
  Headphones,
  LogOut,
  TicketCheck,
  Send,
  ExternalLink,
  Trash2,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import LinkModal from "@/app/support/components/LinkModal";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { uploadToSupabase } from "@/lib/supabase-storage";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import FilePreviewModal, { type FilePreviewSource } from "@/app/support/components/FilePreviewModal";

function normalizeSupportEmail(value?: string | null) {
  const next = (value || "").trim();
  return next && next !== "undefined" ? next : "";
}

export default function RaiseTicketPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [identityReady, setIdentityReady] = useState(false);
  const [knownEmail, setKnownEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FilePreviewSource | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [isPlainText, setIsPlainText] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [linkTooltip, setLinkTooltip] = useState<{ url: string; x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedEditorHTML = useRef<string>("");
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure the editor has focus AND a valid cursor position
  const ensureEditorFocus = () => {
    const editor = document.getElementById("richEditor");
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  // Pre-fill from session once loaded
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;

    const sessionEmail = normalizeSupportEmail(session?.user?.email);
    const savedEmail = normalizeSupportEmail(localStorage.getItem("support_email"));
    const resolvedEmail = sessionEmail || savedEmail;

    setKnownEmail(resolvedEmail);
    setIdentityReady(true);

    if (resolvedEmail) {
      setEmail(resolvedEmail);
      localStorage.setItem("support_email", resolvedEmail);
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    if (!isSuccess) return;

    const timer = window.setTimeout(() => {
      router.push("/support/requests");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [isSuccess, router]);

  // ─── File Handling ───
  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles).slice(0, 5 - files.length);
    const valid = arr.filter((f) => f.size <= 10 * 1024 * 1024); // 10MB limit
    if (valid.length < arr.length) {
      setError("Some files exceeded the 5 MB limit and were skipped.");
    }
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  }, [files.length]);

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // ─── Submit ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Read latest content from editor DOM before validating
    const editorEl = document.getElementById("richEditor");
    const latestDescription = editorEl ? editorEl.innerHTML : description;
    if (latestDescription !== description) setDescription(latestDescription);
    if (!email.trim() || !subject.trim() || !latestDescription.trim()) {
      setError("Email, subject, and description are required.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("subject", subject.trim());

      const selectedCategory = (category || "general").toLowerCase().trim();

      formData.append("message", description.trim());
      formData.append("category", selectedCategory);
      formData.append("priority", priority);
      files.forEach((f) => formData.append("files", f));

      const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
      const res = await fetch(`${backendUrl}/api/support/public/tickets`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        // Specific guard: account exists but has no linked institution
        if (data.code === "NO_ORG") {
          throw new Error(
            "Your account is not linked to a registered institution. Support tickets are only available to active platform users. Please contact your institution administrator."
          );
        }
        throw new Error(data.message || "Failed to submit ticket.");
      }
      localStorage.setItem("support_email", email.trim());
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("support_email");
    setKnownEmail("");
    setEmail("");
    setShowForm(false);
    if (status === "authenticated") {
      await signOut({ redirect: false });
    }
  };

  const displayEmail = email || knownEmail;

  // ─── Derive org status from session ───
  const isPlatformUser = (session?.user as any)?.isPlatformUser === true;
  const orgName = (session?.user as any)?.orgName || null;

  // ─── Auth / Choice Gate ───
  if (!identityReady && status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-6 h-6" />
      </main>
    );
  }

  // ── STATE 1: Not logged in ──
  if (!knownEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl md:rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />

          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-primary/5 to-transparent">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Platform Support</h2>
                <div className="w-12 h-1.5 rounded-full bg-primary mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  Dedicated support portal for active Classgrid institutions. Get help directly from our technical team.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-primary shrink-0" />
                    <span>Institution-verified access for students & faculty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Headphones className="w-4 h-4 text-primary shrink-0" />
                    <span>Direct ERP & LMS technical support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 md:w-1/2 bg-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sign in to continue</h3>
              <p className="text-base text-muted-foreground text-center mb-8 max-w-[300px]">
                Log in so we can verify your institution and track your ticket.
              </p>
              <Link href={`/login?next=${encodeURIComponent('/support/ticket')}`} className="w-full max-w-[300px]">
                <Button className="h-14 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-base">
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── STATE 2: Logged in but NOT a platform user (no org) ──
  if (knownEmail && !isPlatformUser && !showForm) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl md:rounded-[2rem] border border-amber-500/30 bg-card shadow-2xl shadow-black/30">
          {/* Top accent - amber/warning */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />

          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
                  <Building2 className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Institution Not Found</h2>
                <div className="w-12 h-1.5 rounded-full bg-amber-500 mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your account <span className="font-medium text-foreground">{knownEmail}</span> is not linked to any Classgrid institution. Support ticketing is reserved for verified students, faculty, and admins.
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 md:w-1/2 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-6 text-center">What you can do</h3>
              <div className="space-y-4 w-full max-w-[320px] mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <Building2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Contact your institute admin to add your email to the platform.
                  </p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Email us directly at <a href="mailto:support@classgrid.in" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">support@classgrid.in</a>
                  </p>
                </div>
              </div>
              <Link href="/support/inquiry" className="w-full max-w-[320px]">
                <Button className="h-14 w-full rounded-xl bg-amber-600 font-semibold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all text-base">
                  Speak with Classgrid
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                showGlow={false}
                className="mt-4 h-12 w-full max-w-[320px] rounded-xl font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── STATE 3: Logged in platform user — choice card ──
  if (knownEmail && isPlatformUser && !showForm) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl md:rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />

          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-primary/5 to-transparent">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Welcome back</h2>
                <div className="w-12 h-1.5 rounded-full bg-primary mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  You are verified as a member of{orgName ? <span className="font-semibold text-foreground"> {orgName}</span> : " your institution"}. Choose an action below.
                </p>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {knownEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{knownEmail}</span>
                    <span className="text-xs text-primary font-medium">Institution verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 md:w-1/2 gap-4 bg-card">
              <Button
                onClick={() => setShowForm(true)}
                className="h-14 w-full max-w-[320px] rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Send className="w-5 h-5" />
                Submit a New Ticket
              </Button>
              <Link href="/support/requests" className="w-full max-w-[320px]">
                <Button variant="outline" className="h-14 w-full rounded-xl border-border font-semibold text-foreground hover:bg-muted flex items-center justify-center gap-2 text-base">
                  <TicketCheck className="w-5 h-5" />
                  View My Tickets
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                showGlow={false}
                className="mt-4 h-12 w-full max-w-[320px] rounded-xl font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Success ───
  if (isSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-md w-full bg-card rounded-2xl p-8 sm:p-10 text-center shadow-xl border border-border"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <SectionAccentBar />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Request submitted
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Your ticket has been created. A member of our support team will
            respond as soon as possible. Redirecting you to your requests.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Spinner className="w-4 h-4 text-inherit" />
            Opening your requests...
          </div>
        </motion.div>
      </main>
    );
  }

  // ─── Form ───
  return (
    <main className="min-h-screen bg-background py-24 px-4 md:px-12 selection:bg-primary/30 transition-colors duration-300">
      <div className="max-w-[780px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Form Card ── */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-card border border-border p-5 md:p-10 rounded-2xl shadow-sm"
          >
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 -mt-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Submit a request</h2>
                <p className="text-muted-foreground text-sm mt-1">Please provide the details of your issue.</p>
              </div>
              {displayEmail && (
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {displayEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex min-w-0 flex-col items-start text-sm">
                    <span className="max-w-[180px] truncate font-medium text-foreground" title={displayEmail}>{displayEmail}</span>
                    <button type="button" onClick={handleLogout} className="text-xs font-semibold text-primary hover:underline mt-0.5 text-left">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Your Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Your name
                </Label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!!session?.user?.name}
                  placeholder="John Doe"
                  className={`w-full h-11 px-4 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${session?.user?.name
                    ? "bg-muted/30 text-muted-foreground cursor-not-allowed focus:ring-0 focus:border-input"
                    : "bg-background text-foreground placeholder:text-muted-foreground"
                    }`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Email address <span className="text-destructive">*</span>
                </Label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  readOnly={!!knownEmail}
                  placeholder="you@company.com"
                  className={`w-full h-11 px-4 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${knownEmail
                    ? "bg-muted/30 text-muted-foreground cursor-not-allowed focus:ring-0 focus:border-input"
                    : "bg-background text-foreground placeholder:text-muted-foreground"
                    }`}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Subject <span className="text-destructive">*</span>
              </Label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Category</Label>
                <div className="relative">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-[280px] overflow-y-auto">
                      <SelectItem value="login">Login &amp; Authentication Issues</SelectItem>
                      <SelectItem value="dashboard">Dashboard Not Loading</SelectItem>
                      <SelectItem value="profile">Profile &amp; Settings</SelectItem>
                      <SelectItem value="attendance">Attendance &amp; Biometric</SelectItem>
                      <SelectItem value="fee">Fee Payment &amp; Receipts</SelectItem>
                      <SelectItem value="examination">Examination &amp; Results</SelectItem>
                      <SelectItem value="timetable">Timetable &amp; Scheduling</SelectItem>
                      <SelectItem value="assignments">Assignments &amp; Submissions</SelectItem>
                      <SelectItem value="live-classes">Live Classes &amp; Video</SelectItem>
                      <SelectItem value="chat">Chat &amp; Notifications</SelectItem>
                      <SelectItem value="admission">Admission &amp; Enrollment</SelectItem>
                      <SelectItem value="library">Library &amp; Resources</SelectItem>
                      <SelectItem value="documents">Documents &amp; Uploads</SelectItem>
                      <SelectItem value="erp">ERP Module Issues</SelectItem>
                      <SelectItem value="ai">AI Assistant</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="login">Login &amp; Authentication Issues</option>
                    <option value="dashboard">Dashboard Not Loading</option>
                    <option value="profile">Profile &amp; Settings</option>
                    <option value="attendance">Attendance &amp; Biometric</option>
                    <option value="fee">Fee Payment &amp; Receipts</option>
                    <option value="examination">Examination &amp; Results</option>
                    <option value="timetable">Timetable &amp; Scheduling</option>
                    <option value="assignments">Assignments &amp; Submissions</option>
                    <option value="live-classes">Live Classes &amp; Video</option>
                    <option value="chat">Chat &amp; Notifications</option>
                    <option value="admission">Admission &amp; Enrollment</option>
                    <option value="library">Library &amp; Resources</option>
                    <option value="documents">Documents &amp; Uploads</option>
                    <option value="erp">ERP Module Issues</option>
                    <option value="ai">AI Assistant</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Priority</Label>
                <div className="relative">
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-[280px] overflow-y-auto">
                      <SelectItem value="low">🟢 Low — Minor issue, not urgent</SelectItem>
                      <SelectItem value="medium">🟡 Medium — Affecting my work</SelectItem>
                      <SelectItem value="high">🔴 High — Blocking critical operations</SelectItem>
                    </SelectContent>
                  </Select>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
                  >
                    <option value="" disabled>Select priority</option>
                    <option value="low">🟢 Low — Minor issue, not urgent</option>
                    <option value="medium">🟡 Medium — Affecting my work</option>
                    <option value="high">🔴 High — Blocking critical operations</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description with Working Rich-Text Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                {/* Working Toolbar */}
                <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/50">
                  <Select
                    onValueChange={(val) => {
                      const editor = document.getElementById("richEditor");
                      if (editor) editor.focus();
                      document.execCommand("formatBlock", false, val);
                      if (editor) setDescription(editor.innerHTML);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs font-medium bg-transparent border-none shadow-none focus:ring-0 text-muted-foreground px-2 w-[130px]">
                      <SelectValue placeholder="Choose heading" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="min-w-[140px]">
                      <SelectItem value="h1">Heading 1</SelectItem>
                      <SelectItem value="h2">Heading 2</SelectItem>
                      <SelectItem value="h3">Heading 3</SelectItem>
                      <SelectItem value="p">Paragraph</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(val) => {
                      const editor = document.getElementById("richEditor");
                      if (editor) editor.focus();
                      document.execCommand("fontSize", false, val);
                      if (editor) setDescription(editor.innerHTML);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs font-medium bg-transparent border-none shadow-none focus:ring-0 text-muted-foreground px-2 w-[80px]">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="min-w-[100px]">
                      <SelectItem value="1">Size 1</SelectItem>
                      <SelectItem value="2">Size 2</SelectItem>
                      <SelectItem value="3">Size 3</SelectItem>
                      <SelectItem value="4">Size 4</SelectItem>
                      <SelectItem value="5">Size 5</SelectItem>
                      <SelectItem value="6">Size 6</SelectItem>
                      <SelectItem value="7">Size 7</SelectItem>
                    </SelectContent>
                  </Select>
                  <Sep />
                  <ToolBtn icon={<Bold className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("bold"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<Italic className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("italic"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<Underline className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("underline"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <Sep />
                  <ToolBtn
                    icon={<ImageIcon className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setUploadingImage(true);
                          setUploadProgress(10);
                          const interval = setInterval(() => {
                            setUploadProgress((prev) => {
                              if (prev >= 80) {
                                clearInterval(interval);
                                return 80;
                              }
                              return prev + 10;
                            });
                          }, 200);

                          const result = await uploadToSupabase(file, "tickets");
                          clearInterval(interval);

                          if (result) {
                            setUploadProgress(100);
                            setTimeout(() => {
                              setUploadingImage(false);
                              const editor = document.getElementById("richEditor");
                              if (editor) editor.focus();
                              document.execCommand("insertHTML", false,
                                `<img src="${result.url}" alt="${file.name}" data-path="${result.path}" style="max-width:200px;max-height:200px;border-radius:8px;margin:8px 4px;cursor:pointer;" />`
                              );
                              if (editor) setDescription(editor.innerHTML);
                            }, 300);
                          } else {
                            setUploadingImage(false);
                            alert("Image upload failed. Please try again.");
                          }
                        }
                      };
                      input.click();
                    }}
                  />
                  <ToolBtn
                    icon={<Link2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const editor = document.getElementById("richEditor");
                      const sel = window.getSelection();
                      if (sel && sel.rangeCount > 0 && editor?.contains(sel.anchorNode)) {
                        setSavedSelection(sel.getRangeAt(0));
                      } else {
                        setSavedSelection(null);
                      }
                      setLinkModalOpen(true);
                    }}
                  />
                  <Sep />
                  <ToolBtn icon={<AlignLeft className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("justifyLeft"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<AlignCenter className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("justifyCenter"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<AlignRight className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("justifyRight"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<AlignJustify className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("justifyFull"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <Sep />
                  <ToolBtn icon={<ListOrdered className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("insertOrderedList"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn icon={<List className="w-3.5 h-3.5" />} onClick={() => { ensureEditorFocus(); document.execCommand("insertUnorderedList"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }} />
                  <ToolBtn
                    icon={<Quote className="w-3.5 h-3.5" />}
                    onClick={() => { ensureEditorFocus(); document.execCommand("formatBlock", false, "blockquote"); setDescription(document.getElementById("richEditor")?.innerHTML || ""); }}
                  />
                  <Sep />
                  <div className="ml-auto flex items-center gap-1">
                    <ToolBtn icon={<Undo2 className="w-3.5 h-3.5" />} onClick={() => document.execCommand("undo")} />
                    <ToolBtn icon={<Redo2 className="w-3.5 h-3.5" />} onClick={() => document.execCommand("redo")} />
                    {/* Plain text toggle */}
                    <div className="flex items-center gap-3 ml-1 sm:ml-2">
                      {uploadingImage && (
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold text-primary">Uploading {uploadProgress}%</div>
                          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const editor = document.getElementById("richEditor");
                          if (!editor) return;
                          if (isPlainText) {
                            // Restore rich text
                            editor.innerHTML = savedEditorHTML.current;
                            setIsPlainText(false);
                          } else {
                            // Save HTML and show plain text
                            savedEditorHTML.current = editor.innerHTML;
                            editor.innerText = editor.innerText;
                            setIsPlainText(true);
                          }
                          setDescription(editor.innerHTML);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${isPlainText ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                      >
                        {isPlainText ? "Rich text" : "Plain text"}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Editable Area */}
                <div className="relative">
                  <div
                    id="richEditor"
                    contentEditable
                    onInput={() => {
                      if (descDebounceRef.current) clearTimeout(descDebounceRef.current);
                      descDebounceRef.current = setTimeout(() => {
                        const el = document.getElementById("richEditor");
                        if (el) setDescription(el.innerHTML);
                      }, 300);
                    }}
                    onPaste={(e) => {
                      const html = e.clipboardData.getData("text/html");
                      if (html) {
                        e.preventDefault();
                        document.execCommand("insertHTML", false, html);
                        setDescription(document.getElementById("richEditor")?.innerHTML || "");
                      }
                    }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        setPreviewImage((target as HTMLImageElement).src);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.shiftKey) {
                        if (e.key === "7") {
                          e.preventDefault();
                          document.execCommand("insertOrderedList");
                          setDescription(document.getElementById("richEditor")?.innerHTML || "");
                          return;
                        }
                        if (e.key === "8") {
                          e.preventDefault();
                          document.execCommand("insertUnorderedList");
                          setDescription(document.getElementById("richEditor")?.innerHTML || "");
                          return;
                        }
                        if (e.key === "9") {
                          e.preventDefault();
                          document.execCommand("formatBlock", false, "blockquote");
                          setDescription(document.getElementById("richEditor")?.innerHTML || "");
                          return;
                        }
                      }

                      // Markdown auto-formatting (lists) & Auto-link
                      if (e.key === " " || e.key === "Enter") {
                        const sel = window.getSelection();
                        if (sel && sel.focusNode && sel.focusNode.nodeType === Node.TEXT_NODE) {
                          const text = sel.focusNode.textContent || "";
                          const offset = sel.focusOffset;
                          const textBeforeCursor = text.slice(0, offset);

                          // Markdown List Auto-format on Space
                          if (e.key === " " && offset === text.length) {
                            if (textBeforeCursor === "*" || textBeforeCursor === "-") {
                              e.preventDefault();
                              const range = document.createRange();
                              range.setStart(sel.focusNode, 0);
                              range.setEnd(sel.focusNode, offset);
                              range.deleteContents();
                              document.execCommand("insertUnorderedList");
                              const el = document.getElementById("richEditor");
                              if (el) setDescription(el.innerHTML);
                              return;
                            }
                            if (/^\d+\.$/.test(textBeforeCursor)) {
                              e.preventDefault();
                              const range = document.createRange();
                              range.setStart(sel.focusNode, 0);
                              range.setEnd(sel.focusNode, offset);
                              range.deleteContents();
                              document.execCommand("insertOrderedList");
                              const el = document.getElementById("richEditor");
                              if (el) setDescription(el.innerHTML);
                              return;
                            }
                          }

                          const match = textBeforeCursor.match(/(?:^|\s)([^\s]+)$/);
                          if (match) {
                            const word = match[1];
                            const isUrl = /^(https?:\/\/[^\s]+|www\.[^\s]+)$/i.test(word);
                            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(word);
                            if (isUrl || isEmail) {
                              e.preventDefault();
                              const url = isEmail ? `mailto:${word}` : (word.startsWith('http') ? word : `https://${word}`);
                              const wordStartOffset = offset - word.length;
                              const range = document.createRange();
                              range.setStart(sel.focusNode, wordStartOffset);
                              range.setEnd(sel.focusNode, offset);
                              sel.removeAllRanges();
                              sel.addRange(range);
                              document.execCommand('createLink', false, url);
                              sel.collapseToEnd();
                              if (e.key === " ") {
                                document.execCommand('insertText', false, ' ');
                              } else {
                                document.execCommand('insertParagraph');
                              }
                              const el = document.getElementById("richEditor");
                              if (el) setDescription(el.innerHTML);
                              return;
                            }
                          }
                        }
                      }

                      // When inside a list or blockquote, force Shift+Enter to act like a regular Enter
                      if (e.key === "Enter" && e.shiftKey) {
                        const sel = window.getSelection();
                        const node = sel?.focusNode;
                        if (node) {
                          const container = (node.nodeType === Node.TEXT_NODE ? node.parentElement : node) as HTMLElement;
                          const isInsideList = container?.closest?.("ul, ol, li, blockquote");
                          if (isInsideList) {
                            e.preventDefault();
                            const li = container.closest("li");
                            if (li && li.parentNode) {
                              const newLi = document.createElement("li");
                              newLi.innerHTML = "&#8203;";
                              if (li.nextSibling) {
                                li.parentNode.insertBefore(newLi, li.nextSibling);
                              } else {
                                li.parentNode.appendChild(newLi);
                              }
                              const newRange = document.createRange();
                              newRange.setStart(newLi, 0);
                              newRange.collapse(true);
                              sel.removeAllRanges();
                              sel.addRange(newRange);
                            } else {
                              document.execCommand('insertParagraph');
                            }
                            const el = document.getElementById("richEditor");
                            if (el) setDescription(el.innerHTML);
                          }
                        }
                      }
                    }}
                    onMouseOver={(e) => {
                      const target = e.target as HTMLElement;
                      const anchor = target.closest("a");
                      const editor = document.getElementById("richEditor");
                      if (anchor && editor?.contains(anchor)) {
                        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                        const rect = anchor.getBoundingClientRect();
                        const editorRect = editor.getBoundingClientRect();
                        setLinkTooltip({
                          url: anchor.getAttribute("href") || "",
                          x: rect.left - editorRect.left,
                          y: rect.bottom - editorRect.top + 4,
                        });
                      }
                    }}
                    onMouseOut={(e) => {
                      const related = e.relatedTarget as HTMLElement | null;
                      if (related?.closest?.(".link-tooltip-popup")) return;
                      tooltipTimeoutRef.current = setTimeout(() => setLinkTooltip(null), 300);
                    }}
                    className="caret-primary p-4 bg-transparent text-sm text-foreground outline-none prose prose-sm dark:prose-invert max-w-none [&_p]:mb-3 [&_p]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:!text-blue-500 [&_a]:!no-underline [&_a]:cursor-pointer [&_u]:!decoration-emerald-500 [&_u]:underline-offset-4 [&_u]:decoration-2 [&_span[style*='underline']]:!decoration-emerald-500 [&_span[style*='underline']]:underline-offset-4 [&_span[style*='underline']]:decoration-2 [&_img]:max-w-[150px] [&_img]:max-h-[150px] [&_img]:object-cover [&_img]:rounded-md [&_img]:cursor-pointer [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_img]:inline-block [&_img]:m-2 hover:[&_img]:opacity-80 transition-opacity"
                    style={{ minHeight: 200, maxHeight: 400, overflowY: 'auto' }}
                  />
                  {/* Link Hover Tooltip */}
                  {linkTooltip && (
                    <div
                      className="link-tooltip-popup absolute z-20 flex items-center gap-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-xl text-xs text-popover-foreground animate-in fade-in duration-150"
                      style={{ left: linkTooltip.x, top: linkTooltip.y }}
                      onMouseEnter={() => {
                        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                      }}
                      onMouseLeave={() => setLinkTooltip(null)}
                    >
                      <span className="max-w-[200px] truncate text-muted-foreground">{linkTooltip.url}</span>
                      <a
                        href={linkTooltip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                      <button
                        onClick={() => {
                          const editor = document.getElementById("richEditor");
                          if (editor) {
                            const links = editor.querySelectorAll("a");
                            links.forEach((a) => {
                              if (a.getAttribute("href") === linkTooltip.url) {
                                const text = document.createTextNode(a.textContent || "");
                                a.parentNode?.replaceChild(text, a);
                              }
                            });
                            setDescription(editor.innerHTML);
                          }
                          setLinkTooltip(null);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-red-600/80 text-white rounded font-semibold hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-primary/80">
                Please enter the details of your request. A member of our
                support staff will respond as soon as possible.
              </p>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Attachments (optional)
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full border border-dashed rounded-xl p-5 sm:p-8 text-center transition-all cursor-pointer ${dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                />
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium hover:underline">
                    Add file
                  </span>{" "}
                  or drop files here
                </p>
              </div>

              {/* File List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-2"
                  >
                    {files.map((file, idx) => (
                      <motion.div
                        key={`${file.name}-${idx}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                        {/* View / Preview button */}
                        <button
                          type="button"
                          title={file.type.startsWith("image/") ? "Preview image" : "Open file"}
                          onClick={() => setPreviewFile({ name: file.name, src: file, mimeType: file.type })}
                          className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      {files.length}/5 files · Max 5 MB each
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto font-bold rounded-lg px-8 h-11 text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="w-4 h-4 text-inherit" />
                    Submitting…
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
      {/* ── File Preview Modal (attachments) ── */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDelete={() => {
          // Remove from files array by name
          setFiles(prev => prev.filter(f => f.name !== previewFile?.name));
          setPreviewFile(null);
        }}
      />

      {/* ── Inline editor image preview ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
            <button
              type="button"
              title="Delete image from message"
              onClick={(e) => {
                e.stopPropagation();
                const editor = document.getElementById("richEditor");
                if (editor && previewImage) {
                  const imgs = editor.querySelectorAll("img");
                  imgs.forEach((img) => { if (img.src === previewImage) img.remove(); });
                  setDescription(editor.innerHTML);
                }
                setPreviewImage(null);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              title="Close"
              onClick={() => setPreviewImage(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg border border-border shadow-2xl bg-card"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <LinkModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        initialText={typeof window !== "undefined" ? window.getSelection()?.toString() : ""}
        onInsert={(url, text) => {
          const editor = document.getElementById("richEditor");
          if (editor) editor.focus();
          const sel = window.getSelection();
          if (savedSelection && sel) {
            sel.removeAllRanges();
            sel.addRange(savedSelection);
          }

          const label = text || url;
          if (text && savedSelection && !savedSelection.collapsed) {
             document.execCommand("insertHTML", false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
          } else if (!savedSelection || savedSelection.collapsed) {
             document.execCommand("insertHTML", false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>&nbsp;`);
          } else {
             document.execCommand("createLink", false, url);
          }

          if (editor) setDescription(editor.innerHTML);
          setSavedSelection(null);
        }}
      />
    </main>
  );
}

// ─── Toolbar Helpers ───
function ToolBtn({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={`p-1.5 rounded transition-colors ${active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
    >
      {icon}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-border mx-1 shrink-0" />;
}
