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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import LinkModal from "@/app/support/components/LinkModal";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const valid = arr.filter((f) => f.size <= 5 * 1024 * 1024); // 5MB limit
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
    if (!email.trim() || !subject.trim() || !description.trim()) {
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
      formData.append("message", description.trim());
      formData.append("category", category || "inquiry");
      formData.append("institution", institution.trim());
      formData.append("priority", priority);
      files.forEach((f) => formData.append("files", f));

      const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/support/public/tickets`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit ticket.");
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
  const userRole = (session?.user as any)?.role ? String((session?.user as any)?.role).toLowerCase() : "member";

  // ─── Auth / Choice Gate ───
  if (!identityReady && status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  // ── STATE 1: Not logged in ──
  if (!knownEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
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
      <main className="min-h-screen flex items-center justify-center bg-background p-6 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
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
      <main className="min-h-screen flex items-center justify-center bg-background p-6 md:p-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
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
          <SectionAccentBar />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Request submitted
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Your ticket has been created. A member of our support team will
            respond as soon as possible. Redirecting you to your requests.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
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
            className="space-y-8 bg-card border border-border p-6 md:p-10 rounded-2xl shadow-sm"
          >
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 -mt-2">
              <div>
                <SectionAccentBar align="left" className="mb-4" />
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
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Priority</Label>
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
                placeholder="Brief summary of your question"
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            {/* Description with Working Rich-Text Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                {/* Working Toolbar */}
                <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/50 overflow-x-auto">
                  <select
                    className="text-xs font-medium bg-transparent text-muted-foreground border-none focus:ring-0 pr-6 cursor-pointer"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "p") document.execCommand("formatBlock", false, "p");
                      else document.execCommand("formatBlock", false, val);
                      e.target.value = "";
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose heading</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="p">Paragraph</option>
                  </select>
                  <Sep />
                  <ToolBtn icon={<Bold className="w-3.5 h-3.5" />} onClick={() => document.execCommand("bold")} />
                  <ToolBtn icon={<Italic className="w-3.5 h-3.5" />} onClick={() => document.execCommand("italic")} />
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
                    onClick={() => setLinkModalOpen(true)}
                  />
                  <Sep />
                  <ToolBtn icon={<ListOrdered className="w-3.5 h-3.5" />} onClick={() => document.execCommand("insertOrderedList")} />
                  <ToolBtn icon={<List className="w-3.5 h-3.5" />} onClick={() => document.execCommand("insertUnorderedList")} />
                  <ToolBtn
                    icon={<Quote className="w-3.5 h-3.5" />}
                    onClick={() => document.execCommand("formatBlock", false, "blockquote")}
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
                  onInput={(e) => setDescription((e.target as HTMLDivElement).innerHTML)}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'IMG') {
                      setPreviewImage((target as HTMLImageElement).src);
                    }
                  }}
                  className="p-4 bg-transparent text-sm text-foreground outline-none prose prose-sm dark:prose-invert max-w-none [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_img]:max-w-[150px] [&_img]:max-h-[150px] [&_img]:object-cover [&_img]:rounded-md [&_img]:cursor-pointer [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_img]:inline-block [&_img]:m-2 hover:[&_img]:opacity-80 transition-opacity"
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
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
        onInsert={(url, text) => {
          const editor = document.getElementById("richEditor");
          if (editor) editor.focus();
          if (text) {
            document.execCommand("insertHTML", false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
          } else {
            document.execCommand("createLink", false, url);
          }
          if (editor) setDescription(editor.innerHTML);
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
