"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
  MessageCircle,
  Sparkles,
  Clock,
  Users,
  LogOut,
  Send,
  ShieldCheck,
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
import FilePreviewModal, { type FilePreviewSource } from "@/app/support/components/FilePreviewModal";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

function normalizeSupportEmail(value?: string | null) {
  const next = (value || "").trim();
  return next && next !== "undefined" ? next : "";
}

export default function InquiryPage() {
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
  const [institution, setInstitution] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [previewFile, setPreviewFile] = useState<FilePreviewSource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        // Map param to standard string
        const mappedCat = Array.from(document.querySelectorAll('option')).find(o => o.value.toLowerCase().replace(/[^a-z0-9]/g, '') === cat.toLowerCase().replace(/[^a-z0-9]/g, ''))?.value;
        if (mappedCat) setCategory(mappedCat);
      }
    }
  }, []);

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
    if (subject.trim().length > 200) {
      setError(`Subject is too long (${subject.trim().length}/200 characters). Please shorten it.`);
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("subject", subject.trim());
      formData.append("message", description.trim());
      formData.append("category", category || "inquiry");
      formData.append("institution", institution.trim());
      formData.append("priority", priority);
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`/api/support-proxy/tickets`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit ticket.");
      localStorage.setItem("support_email", email.trim());
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  const userRole = (session?.user as any)?.role ? String((session?.user as any)?.role).toLowerCase() : "member";

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
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Classgrid Talk</h2>
                <div className="w-12 h-1.5 rounded-full bg-primary mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  Connect with a Classgrid product specialist. Get answers tailored to your institution&apos;s unique needs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span>Personal product specialist</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span>Open for prospective institutions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 md:w-1/2 bg-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sign in to continue</h3>
              <p className="text-base text-muted-foreground text-center mb-8 max-w-[300px]">
                Log in so we can track and reply to your inquiry.
              </p>
              <Link href={`/login?next=${encodeURIComponent('/support/inquiry')}`} className="w-full max-w-[300px]">
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

  // ── STATE 1.5: Logged in as Platform User (Blocked from Inquiry) ──
  if (knownEmail && isPlatformUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl md:rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
          
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-primary/5 to-transparent">
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
                  <ShieldCheck className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Institution Member</h2>
                <div className="w-12 h-1.5 rounded-full bg-amber-500 mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed">
                  You are logged in as a {userRole} of {orgName ? <span className="font-semibold text-foreground">{orgName}</span> : "an active institution"}. 
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  Classgrid Talk is reserved for prospective institutions looking to partner with us. Please use the dedicated <Link href="/support/ticket" className="font-semibold text-amber-600 dark:text-amber-500 hover:underline">Platform Support portal</Link> to resolve technical issues for your institution.
                </p>
              </div>
            </div>
            
            {/* Right panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 md:w-1/2 gap-4 bg-card">
              <Link href="/support/ticket" className="w-full max-w-[320px]">
                <Button className="h-14 w-full rounded-xl bg-amber-600 font-semibold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all text-base">
                  Go to Platform Support
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

  // ── STATE 2: Logged in — choice card (open to non-platform users only) ──
  if (knownEmail && !showForm) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl md:rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
          
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left panel */}
            <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-primary/5 to-transparent">
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Welcome back</h2>
                <div className="w-12 h-1.5 rounded-full bg-primary mb-6" />
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  Ready to connect with our product team? Submit a new inquiry or check replies to your existing conversations.
                </p>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {knownEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{knownEmail}</span>
                    <span className="text-xs text-primary font-medium">Signed in</span>
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
                Submit an Inquiry
              </Button>
              <Link href="/support/requests" className="w-full max-w-[320px]">
                <Button variant="outline" className="h-14 w-full rounded-xl border-border font-semibold text-foreground hover:bg-muted flex items-center justify-center gap-2 text-base">
                  <MessageCircle className="w-5 h-5" />
                  View Team Reply
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
                <h2 className="text-2xl font-bold text-foreground">Speak with Classgrid</h2>
                <p className="text-muted-foreground text-sm mt-1">Let us know how we can help your institution.</p>
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
                  className={`w-full h-11 px-4 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                    session?.user?.name 
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
                  className={`w-full h-11 px-4 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                    knownEmail
                      ? "bg-muted/30 text-muted-foreground cursor-not-allowed focus:ring-0 focus:border-input" 
                      : "bg-background text-foreground placeholder:text-muted-foreground"
                  }`}
                />
              </div>
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Institution Name <span className="text-destructive">*</span>
              </Label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                placeholder="e.g. Cambridge High School"
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Category <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent side="bottom" alignItemWithTrigger={false} className="max-h-[280px] overflow-y-auto">
                      <SelectItem value="technical">Technical Support / ERP / AI / API</SelectItem>
                      <SelectItem value="billing">Billing &amp; Subscription</SelectItem>
                      <SelectItem value="academics">Academics / Attendance / Admissions</SelectItem>
                      <SelectItem value="exams">Examination Systems</SelectItem>
                      <SelectItem value="communication">Communication &amp; Scheduling</SelectItem>
                      <SelectItem value="finance">HR &amp; Payroll / Finance</SelectItem>
                      <SelectItem value="getting_started">Getting Started</SelectItem>
                      <SelectItem value="account_security">Account &amp; Security</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
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
                    <option value="" disabled>Select a topic</option>
                    <option value="technical">Technical Support / ERP / AI / API</option>
                    <option value="billing">Billing &amp; Subscription</option>
                    <option value="academics">Academics / Attendance / Admissions</option>
                    <option value="exams">Examination Systems</option>
                    <option value="communication">Communication &amp; Scheduling</option>
                    <option value="finance">HR &amp; Payroll / Finance</option>
                    <option value="getting_started">Getting Started</option>
                    <option value="account_security">Account &amp; Security</option>
                    <option value="general">General Inquiry</option>
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
                      <SelectItem value="low">🟢 Low — General question</SelectItem>
                      <SelectItem value="medium">🟡 Medium — Need help soon</SelectItem>
                      <SelectItem value="high">🔴 High — Urgent / Blocking operations</SelectItem>
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
                    <option value="low">🟢 Low — General question</option>
                    <option value="medium">🟡 Medium — Need help soon</option>
                    <option value="high">🔴 High — Urgent / Blocking operations</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <span className={`text-xs font-medium ${subject.length > 200 ? 'text-destructive' : subject.length > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {subject.length}/200
                </span>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
                required
                placeholder="Brief summary of your question"
                className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${subject.length > 200 ? 'border-destructive' : 'border-input'}`}
              />
            </div>

            {/* Description with Working Rich-Text Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                {/* Working Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/50">
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
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setUploadingImage(true);
                          setUploadProgress(10);
                          const interval = setInterval(() => {
                            setUploadProgress((prev) => {
                              if (prev >= 90) {
                                clearInterval(interval);
                                return 90;
                              }
                              return prev + 15;
                            });
                          }, 100);

                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTimeout(() => {
                              setUploadProgress(100);
                              setTimeout(() => {
                                setUploadingImage(false);
                                if (re.target?.result) {
                                  const editor = document.getElementById("richEditor");
                                  if (editor) editor.focus();
                                  document.execCommand("insertImage", false, re.target.result.toString());
                                  if (editor) setDescription(editor.innerHTML);
                                }
                              }, 300);
                            }, 700);
                          };
                          reader.readAsDataURL(file);
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
                  <ToolBtn icon={<Undo2 className="w-3.5 h-3.5" />} onClick={() => document.execCommand("undo")} />
                  <ToolBtn icon={<Redo2 className="w-3.5 h-3.5" />} onClick={() => document.execCommand("redo")} />
                  {/* Plain text toggle */}
                  <div className="ml-auto flex items-center gap-3">
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
                        if (editor) {
                          const text = editor.innerText;
                          editor.innerHTML = text;
                        }
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Plain text
                    </button>
                  </div>
                </div>
                {/* Editable Area */}
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
                            sel?.removeAllRanges();
                            sel?.addRange(newRange);
                          } else {
                            document.execCommand('insertParagraph');
                          }
                          const el = document.getElementById("richEditor");
                          if (el) setDescription(el.innerHTML);
                        }
                      }
                    }
                  }}
                  className="caret-primary p-4 bg-transparent text-sm text-foreground outline-none whitespace-pre-wrap [&_p]:mb-4 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4 [&_a]:!text-blue-500 [&_a]:!no-underline [&_u]:!decoration-emerald-500 [&_u]:underline-offset-4 [&_u]:decoration-2 [&_span[style*='underline']]:!decoration-emerald-500 [&_span[style*='underline']]:underline-offset-4 [&_span[style*='underline']]:decoration-2 [&_img]:max-w-[150px] [&_img]:max-h-[150px] [&_img]:object-cover [&_img]:rounded-md [&_img]:cursor-pointer [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_img]:inline-block [&_img]:m-2 hover:[&_img]:opacity-80 transition-opacity"
                  style={{ minHeight: 200, maxHeight: 400, overflowY: 'auto' }}
                />
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
                className={`w-full border border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive
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
          setFiles(prev => prev.filter(f => f.name !== previewFile?.name));
          setPreviewFile(null);
        }}
      />
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-xl border border-border shadow-2xl bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background/80 backdrop-blur-md rounded-full text-foreground transition-colors"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-5 h-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImage} alt="Preview" className="w-auto h-auto max-w-full max-h-[90vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
      className={`p-1.5 rounded transition-colors ${
        active
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
