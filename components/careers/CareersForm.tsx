// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Paperclip, Eye, Trash2, CalendarIcon, ChevronDown, Loader2, ShieldCheck, MessageSquare } from "lucide-react";
import { Github } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getPresignedUrlForResume } from "@/app/actions/r2-actions";
import FilePreviewModal from "@/app/support/components/FilePreviewModal";
import { Spinner } from "@/components/ui/spinner";
import locationData from "@/data/india-locations.json";

const DEGREES = [
  "B.Tech", "B.E.", "B.Sc", "B.Com", "B.A.", "BBA", "BCA", "B.Arch", "B.Pharm",
  "MBBS", "BDS", "BPT", "B.Sc Nursing", "B.Ed", "LLB", "BA LLB", "BBA LLB", "B.Des", "B.Voc",
  "M.Tech / M.E.", "M.Sc", "M.Com", "M.A.", "MBA", "MCA", "M.Arch", "M.Pharm",
  "MD / MS", "MDS", "MPT", "M.Sc Nursing", "M.Ed", "LLM", "M.Des", "Ph.D",
  "Diploma in Engineering", "Diploma in Pharmacy", "Diploma in Management", "ITI",
  "BMM", "BMS", "BHM (Hotel Management)", "BFA", "B.Lib.I.Sc", "M.Lib.I.Sc",
  "B.P.Ed", "M.P.Ed", "Integrated B.Tech+M.Tech", "Integrated B.Sc+M.Sc",
  "Integrated BBA+MBA", "Other"
];

const YEARS_OF_STUDY = [
  "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduated", "Post-Graduated", "Dropped Out"
];

type SalesRole = {
  label: string;
  value: string;
};


type CareersFormProps = {
  formTitle: string;
  formSubtitle: string;
  submitLabel: string;
  fieldName: string;
  fieldEmail: string;
  fieldInstitution: string;
  fieldRole: string;
  rolePlaceholder: string;
  roles: SalesRole[];
  techStackGroups?: Record<string, string[]>;
};

export function CareersForm({
  formTitle,
  formSubtitle,
  submitLabel,
  fieldName,
  fieldEmail,
  fieldInstitution,
  fieldRole,
  rolePlaceholder,
  roles,
  techStackGroups = {},
}: CareersFormProps) {
  // TOGGLE: Set to true once Meta WhatsApp billing issue is resolved
  const REQUIRE_OTP = false;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [showStacks, setShowStacks] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } } as any;

  // --- Location cascading state ---
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState<Date>();
  const [tempDate, setTempDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // OAuth States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleFilled, setGoogleFilled] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedGithubRepos, setSelectedGithubRepos] = useState<string[]>([]);
  const [githubProfile, setGithubProfile] = useState<{ username: string, url: string } | null>(null);
  const [selectedDropdownRepo, setSelectedDropdownRepo] = useState("");
  const [isVerifyingRepo, setIsVerifyingRepo] = useState(false);
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [isUnder18, setIsUnder18] = useState(false);

  // WhatsApp OTP Verification State
  const [phoneValue, setPhoneValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);
  const otpCooldownRef = useRef<NodeJS.Timeout | null>(null);
  const otpExpiryRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (otpCooldownRef.current) clearInterval(otpCooldownRef.current);
      if (otpExpiryRef.current) clearInterval(otpExpiryRef.current);
    };
  }, []);

  const handleSendOtp = async () => {
    const cleanPhone = phoneValue.replace(/^\+91/, "").replace(/\s+/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setOtpError("Enter a valid 10-digit Indian phone number.");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/careers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpInput("");
        // Start 30s resend cooldown
        setOtpCooldown(30);
        if (otpCooldownRef.current) clearInterval(otpCooldownRef.current);
        otpCooldownRef.current = setInterval(() => {
          setOtpCooldown((prev) => {
            if (prev <= 1) { clearInterval(otpCooldownRef.current!); return 0; }
            return prev - 1;
          });
        }, 1000);
        // Start 5min expiry countdown
        setOtpExpiry(120);
        if (otpExpiryRef.current) clearInterval(otpExpiryRef.current);
        otpExpiryRef.current = setInterval(() => {
          setOtpExpiry((prev) => {
            if (prev <= 1) { clearInterval(otpExpiryRef.current!); setOtpSent(false); setOtpError("OTP expired. Please request a new one."); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOtpError(data.message || "Failed to send OTP.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanPhone = phoneValue.replace(/^\+91/, "").replace(/\s+/g, "");
    if (!/^\d{6}$/.test(otpInput)) {
      setOtpError("Enter the 6-digit code from WhatsApp.");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/careers/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: otpInput }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setPhoneVerified(true);
        setPhoneVerificationToken(data.token);
        if (otpCooldownRef.current) clearInterval(otpCooldownRef.current);
        if (otpExpiryRef.current) clearInterval(otpExpiryRef.current);
      } else {
        setOtpError(data.message || "Invalid OTP.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'google_oauth_success') {
        setGoogleLoading(false);
        setGoogleFilled(true);
        const { firstName, lastName, email } = data.profile;
        const fnInput = document.querySelector('input[name="firstName"]') as HTMLInputElement;
        const lnInput = document.querySelector('input[name="lastName"]') as HTMLInputElement;
        const emInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        if (fnInput && firstName) fnInput.value = firstName;
        if (lnInput && lastName) lnInput.value = lastName;
        if (emInput && email) emInput.value = email;
      }

      if (data.type === 'github_oauth_success') {
        setGithubLoading(false);
        setGithubRepos(data.repos);
        setGithubProfile({ username: data.username, url: data.profileUrl });
      }

      if (data.type === 'oauth_error') {
        setGoogleLoading(false);
        setGithubLoading(false);
        setErrorMsg("OAuth Error: " + data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGooglePrefill = () => {
    setGoogleLoading(true);
    setErrorMsg("");
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open('/api/oauth/google/login', 'Google OAuth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleGithubConnect = () => {
    setGithubLoading(true);
    setErrorMsg("");
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open('/api/oauth/github/login', 'GitHub OAuth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  // Merge states + union territories into one sorted list
  const allStates = useMemo(() => {
    return [
      ...Object.keys(locationData.states),
      ...Object.keys(locationData.unionTerritories),
    ].sort();
  }, []);

  // Get districts for selected state
  const districts = useMemo(() => {
    if (!selectedState) return [];
    const stateData =
      (locationData.states as Record<string, Record<string, string[]>>)[selectedState] ||
      (locationData.unionTerritories as Record<string, Record<string, string[]>>)[selectedState] ||
      {};
    return Object.keys(stateData).sort();
  }, [selectedState]);

  // Get talukas for selected district
  const talukas = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    const stateData =
      (locationData.states as Record<string, Record<string, string[]>>)[selectedState] ||
      (locationData.unionTerritories as Record<string, Record<string, string[]>>)[selectedState] ||
      {};
    return (stateData[selectedDistrict] || []).sort();
  }, [selectedState, selectedDistrict]);

  // Reset child dropdowns when parent changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedTaluka("");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTaluka(district === "Other" ? "Other" : "");
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleStack = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else if (selectedStacks.length < 10) {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setUploadProgress(0);

    if (selectedGithubRepos.length === 0) {
      setErrorMsg("Please connect GitHub and select your best repository.");
      setIsSubmitting(false);
      return;
    }

    if (REQUIRE_OTP && (!phoneVerified || !phoneVerificationToken)) {
      setErrorMsg("Please verify your phone number via WhatsApp OTP before submitting.");
      setIsSubmitting(false);
      return;
    }

    let progressInterval: NodeJS.Timeout;
    if (selectedFile) {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 400);
    }

    try {
      const formData = new FormData(e.currentTarget);

      let resumeUrl = "";
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          setErrorMsg("Resume must be less than 5MB.");
          setIsSubmitting(false);
          return;
        }

        try {
          const { uploadUrl, publicUrl } = await getPresignedUrlForResume(
            selectedFile.name,
            selectedFile.type || 'application/octet-stream'
          );

          const r2Response = await fetch(uploadUrl, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type || 'application/octet-stream',
            },
          });

          if (!r2Response.ok) {
            throw new Error(`R2 upload failed: ${r2Response.statusText}`);
          }

          resumeUrl = publicUrl;
          setUploadProgress(100);
        } catch (error: any) {
          console.error("Cloudflare R2 upload error:", error.message || error);
          setErrorMsg("Failed to upload resume. Please try again.");
          setIsSubmitting(false);
          clearInterval(progressInterval!);
          return;
        }
      }

      const payload = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        gender: formData.get("gender") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        country: formData.get("country") as string,
        state: selectedState,
        district: selectedDistrict === "Other" ? formData.get("customDistrict") as string : selectedDistrict,
        taluka: selectedTaluka === "Other" ? formData.get("customTaluka") as string : selectedTaluka,
        cityVillage: formData.get("cityVillage") as string,
        degree: formData.get("degree") as string,
        yearOfStudy: formData.get("yearOfStudy") as string,
        college: formData.get("college") as string,
        branch: formData.get("branch") as string,
        cgpa: formData.get("cgpa") as string,
        currentOccupation: formData.get("currentOccupation") as string,
        experience: formData.get("experience") as string,
        availability: availabilityDate ? format(availabilityDate, 'yyyy-MM-dd') : "",
        workType: formData.get("workType") as string,
        role: formData.get("role") as string,
        techStack: selectedStacks.join(", "),
        skills: formData.get("skills") as string,
        whyJoin: formData.get("whyJoin") as string,
        age18: formData.get("age18") as string,
        twitter: formData.get("twitter") as string,
        githubRepos: selectedGithubRepos,
        githubProfileUrl: githubProfile?.url || "",
        githubUsername: githubProfile?.username || "",
        linkedin: formData.get("linkedin") as string,
        portfolio: formData.get("portfolio") as string,
        codingProfile: formData.get("codingProfile") as string,
        openSource: formData.get("openSource") as string,
        asyncRemote: formData.get("asyncRemote") as string,
        resumeUrl: resumeUrl,
        termsConsent: formData.get("termsConsent") === "on",
        phoneVerificationToken,
      };

      const response = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Fix for footer jump: manually scroll back to top of the page when the form collapses
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await response.json();
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setErrorMsg("Failed to submit. Please check your connection.");
    } finally {
      if (selectedFile) clearInterval(progressInterval!);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-16 space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Application Sent!</h3>
          <p className="text-muted-foreground max-w-sm">
            Thank you for applying to Classgrid! We have received your application and will be in touch shortly.
          </p>
        </motion.div>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{formTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{formSubtitle}</p>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-lg border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {isUnder18 && (
            <div className="mt-4 p-4 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-500/20 flex items-start gap-3 shadow-sm">
              <span className="text-xl shrink-0">⛔</span>
              <div>
                <div className="font-semibold text-sm sm:text-base text-red-700 dark:text-red-400">Not Eligible to Apply</div>
                <div className="text-xs sm:text-sm text-red-600/90 dark:text-red-300/90 mt-0.5">
                  Applicants must be at least 18 years of age to apply for roles at Classgrid.
                </div>
              </div>
            </div>
          )}

          {!googleFilled && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-secondary/30 p-4 rounded-xl border border-border">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground block">Save time applying</span>
                Autofill your name and email using Google.
              </div>
              <button
                type="button"
                onClick={handleGooglePrefill}
                disabled={googleLoading}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 shadow-sm transition hover:bg-slate-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                <img src="https://cdn.classgrid.in/svg__logo_collection/google-icon-logo-svgrepo-com.svg" alt="Google" className="h-5 w-5" />
                {googleLoading ? "Connecting..." : "Fill with Google"}
              </button>
            </div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.04 }
              }
            }}
          >
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">First Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="John"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Last Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Doe"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">{fieldEmail} <span className="text-red-500">*</span></span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
              <div className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Phone Number <span className="text-red-500">*</span></span>
                {!REQUIRE_OTP ? (
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit number"
                    maxLength={13}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                  />
                ) : phoneVerified ? (
                  <div className="flex items-center gap-2">
                    <div className="h-11 flex-1 flex items-center rounded-lg border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 text-slate-900 dark:text-white">
                      <span>+91 {phoneValue.replace(/^\+91/, "").replace(/\s+/g, "")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold whitespace-nowrap">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </div>
                    <input type="hidden" name="phone" value={phoneValue.replace(/^\+91/, "").replace(/\s+/g, "")} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phoneValue}
                        onChange={(e) => { setPhoneValue(e.target.value); setOtpSent(false); setOtpError(""); setPhoneVerified(false); }}
                        placeholder="10-digit number"
                        maxLength={13}
                        className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || otpCooldown > 0 || phoneValue.replace(/^\+91/, "").replace(/\s+/g, "").length < 10}
                        className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {otpLoading ? "Sending..." : otpCooldown > 0 ? `Resend (${otpCooldown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    </div>

                    {otpSent && !phoneVerified && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          OTP sent to your WhatsApp! Expires in {Math.floor(otpExpiry / 60)}:{String(otpExpiry % 60).padStart(2, "0")}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={otpInput}
                            onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white tracking-[0.3em] text-center font-mono text-lg"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || otpInput.length !== 6}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 shadow-sm transition hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            {otpLoading ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                      </div>
                    )}

                    {otpError && (
                      <p className="text-xs text-red-500 font-medium">{otpError}</p>
                    )}
                    <input type="hidden" name="phone" value={phoneValue.replace(/^\+91/, "").replace(/\s+/g, "")} />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Gender <span className="text-red-500">*</span></span>
                <select
                  name="gender"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Are you over the age of 18? <span className="text-red-500">*</span></span>
                <div className="flex gap-4 items-center h-11 px-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="age18" 
                      value="Yes" 
                      required 
                      onChange={() => setIsUnder18(false)}
                      className="accent-emerald-500 w-4 h-4" 
                    />
                    <span className="text-slate-900 dark:text-white">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="age18" 
                      value="No" 
                      required 
                      onChange={() => setIsUnder18(true)}
                      className="accent-emerald-500 w-4 h-4" 
                    />
                    <span className="text-slate-900 dark:text-white">No</span>
                  </label>
                </div>
              </label>
            </motion.div>

            {!isUnder18 && (
              <>

            {/* Location: Country → State → District → Taluka */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Country</span>
                <div className="flex items-center gap-2 h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-slate-900 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-white opacity-80">
                  <img
                    src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Flag_of_India.svg.png"
                    alt="India"
                    className="h-auto w-[22px] rounded-none object-contain shadow-sm border border-slate-200/50 dark:border-zinc-700/50"
                  />
                  <span className="font-medium text-[15px]">India</span>
                  <input type="hidden" name="country" value="India" />
                </div>
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">State / UT <span className="text-red-500">*</span></span>
                <select
                  name="state"
                  required
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                >
                  <option value="" disabled>Select State</option>
                  {allStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">District <span className="text-red-500">*</span></span>
                <select
                  name="district"
                  required
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!selectedState}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>{selectedState && districts.length === 0 ? "Coming soon" : "Select District"}</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                  <option value="Other">Other (Please specify)</option>
                </select>
              </label>
              {selectedDistrict !== "Other" && (
                <label className="block text-sm">
                  <span className="mb-2 block text-muted-foreground">Taluka <span className="text-red-500">*</span></span>
                  <select
                    name="taluka"
                    required
                    value={selectedTaluka}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                    disabled={!selectedDistrict}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>{selectedDistrict && talukas.length === 0 ? "Coming soon" : "Select Taluka"}</option>
                    {talukas.map((taluka) => (
                      <option key={taluka} value={taluka}>{taluka}</option>
                    ))}
                    <option value="Other">Other (Please specify)</option>
                  </select>
                </label>
              )}
            </motion.div>

            {selectedDistrict === "Other" && (
              <motion.label variants={{ hidden: { opacity: 0, height: 0 }, show: { opacity: 1, height: "auto" } }} className="block text-sm overflow-hidden">
                <span className="mb-2 block text-muted-foreground">Enter your District</span>
                <input
                  type="text"
                  name="customDistrict"
                  required
                  placeholder="Your District name"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </motion.label>
            )}

            {selectedTaluka === "Other" && (
              <motion.label variants={{ hidden: { opacity: 0, height: 0 }, show: { opacity: 1, height: "auto" } }} className="block text-sm overflow-hidden">
                <span className="mb-2 block text-muted-foreground">Enter your Taluka</span>
                <input
                  type="text"
                  name="customTaluka"
                  required
                  placeholder="Your Taluka name"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </motion.label>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Highest Qualification / Degree <span className="text-red-500">*</span></span>
                <select
                  name="degree"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select your degree</option>
                  {DEGREES.map(deg => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Current Year of Study <span className="text-red-500">*</span></span>
                <select
                  name="yearOfStudy"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select year</option>
                  {YEARS_OF_STUDY.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">College / University Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="Your College Name"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Branch / Specialization <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="branch"
                  required
                  placeholder="e.g. CSE, IT, ECE"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">CGPA / Percentage <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
                <input
                  type="text"
                  name="cgpa"
                  placeholder="Optional"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                />
              </label>
            </motion.div>

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">City / Village <span className="text-red-500">*</span></span>
              <input
                type="text"
                name="cityVillage"
                required
                placeholder="Your City or Village name"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
              />
            </motion.label>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">{fieldRole} <span className="text-red-500">*</span></span>
                <select
                  name="role"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>{rolePlaceholder}</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.label}>{role.label}</option>
                  ))}
                </select>
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Current Occupation <span className="text-red-500">*</span></span>
                <select
                  name="currentOccupation"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select Occupation</option>
                  <option value="Student">Student</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Years of Experience <span className="text-red-500">*</span></span>
                <select
                  name="experience"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select Experience</option>
                  <option value="0">0 (Fresher)</option>
                  <option value="1-2">1–2 Years</option>
                  <option value="3-5">3–5 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Expected Joining Date <span className="text-red-500">*</span></span>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-left font-normal outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] flex items-center gap-2 ${!availabilityDate ? "text-slate-500 dark:text-zinc-500" : "text-slate-900 dark:text-white"}`}
                      onClick={() => { setTempDate(availabilityDate); setIsCalendarOpen(true); }}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {availabilityDate ? format(availabilityDate, "PPP") : "Select date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 shadow-2xl rounded-xl border border-slate-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95" align="start">
                    <Calendar
                      mode="single"
                      selected={tempDate}
                      onSelect={setTempDate}
                      initialFocus
                      required
                      fixedWeeks
                      className="p-0 border-none"
                    />
                    <div className="p-2 border-t border-slate-100 dark:border-zinc-800 mt-1">
                      <button
                        type="button"
                        onClick={() => { setAvailabilityDate(tempDate); setIsCalendarOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-all border border-transparent dark:hover:border-zinc-700 hover:scale-[0.98]"
                      >
                        Apply <span className="opacity-50 text-[10px]">↵</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Preferred Work Type <span className="text-red-500">*</span></span>
                <select
                  name="workType"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select Work Type</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Twitter / X profile <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
                <input
                  type="url"
                  name="twitter"
                  placeholder="https:// (Optional)"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">LinkedIn profile <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https:// (Optional)"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="block text-sm border border-border p-5 rounded-xl bg-slate-50/50 dark:bg-[#111]">
              <span className="mb-2 block font-medium text-foreground">GitHub Portfolio <span className="text-red-500">*</span></span>
              <p className="text-xs text-muted-foreground mb-4">Connect your GitHub to select your best project to show us.</p>

              {githubRepos.length === 0 ? (
                <button
                  type="button"
                  onClick={handleGithubConnect}
                  disabled={githubLoading}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap rounded-lg bg-[#24292F] px-4 py-2.5 text-sm font-semibold text-white border border-transparent shadow-sm transition hover:bg-[#24292F]/90 disabled:opacity-50"
                >
                  <Github className="h-4 w-4" />
                  {githubLoading ? "Connecting to GitHub..." : "Connect GitHub"}
                </button>
              ) : (
                <div className="space-y-4">
                  {isGithubVerified ? (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#111] space-y-2">
                      <div className="text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                        GITHUB VERIFIED
                      </div>
                      <div className="text-sm text-foreground">
                        Handle: <span className="font-semibold">@{githubProfile?.username}</span>
                      </div>
                      <div className="text-sm text-foreground">
                        Repository: <span className="font-semibold">{selectedGithubRepos.map(url => {
                          const repo = githubRepos.find(r => r.url === url);
                          return repo ? repo.name : url;
                        }).join(', ')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsGithubVerified(false);
                          setSelectedGithubRepos([]);
                          setSelectedDropdownRepo("");
                        }}
                        className="text-xs text-muted-foreground underline hover:text-foreground mt-2 block"
                      >
                        Change repository
                      </button>
                    </div>
                  ) : (
                    <>
                      {githubProfile && (
                        <div className="text-sm font-medium text-muted-foreground">
                          Handle: <a href={githubProfile.url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline font-semibold">@{githubProfile.username}</a>
                        </div>
                      )}
                      <div className="flex flex-col gap-3">
                        <select
                          value={selectedDropdownRepo}
                          onChange={(e) => setSelectedDropdownRepo(e.target.value)}
                          disabled={isVerifyingRepo}
                          className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white disabled:opacity-50"
                        >
                          <option value="" disabled>Select a repository you've contributed to...</option>
                          {githubRepos.map(repo => (
                            <option key={repo.id} value={repo.url}>
                              {repo.name} {repo.language ? `• ${repo.language}` : ''} {repo.stars > 0 ? `• ★ ${repo.stars}` : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedDropdownRepo) {
                              setIsVerifyingRepo(true);
                              setSelectedGithubRepos([selectedDropdownRepo]);
                              setTimeout(() => {
                                setIsVerifyingRepo(false);
                                setIsGithubVerified(true);
                                setSelectedDropdownRepo("");
                              }, 600);
                            }
                          }}
                          disabled={!selectedDropdownRepo || isVerifyingRepo}
                          className="w-full sm:w-auto sm:self-start h-11 px-6 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium hover:bg-slate-50 transition dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 disabled:opacity-50 shadow-sm"
                        >
                          {isVerifyingRepo ? "Verifying..." : "Use this repository"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Portfolio / Personal Website</span>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https:// (Optional)"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Coding Profile (LeetCode/HackerRank)</span>
                <input
                  type="url"
                  name="codingProfile"
                  placeholder="https:// (Optional)"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>
            </motion.div>

            {Object.keys(techStackGroups).length > 0 && (
              <motion.div variants={itemVariants} className="block text-sm">
                <span className="mb-1 flex items-center justify-between text-muted-foreground">
                  <span>Your Tech Stack <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
                  <span className="text-xs text-slate-500">
                    {selectedStacks.length} / 10 selected
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-3">Click below to open the list and select up to 10 technologies you're proficient in.</p>

                {/* Show selected chips */}
                {selectedStacks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedStacks.map((stack) => (
                      <span
                        key={stack}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        {stack}
                        <button
                          type="button"
                          onClick={() => toggleStack(stack)}
                          className="ml-0.5 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => setShowStacks(!showStacks)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-slate-400 hover:bg-slate-100 dark:border-zinc-700 dark:bg-[#111] dark:hover:border-zinc-600 dark:hover:bg-[#1a1a1a]"
                >
                  {showStacks ? "▲ Hide Tech Stack List" : "▼ Select from 200+ Technologies"}
                </button>

                {/* Collapsible grouped list */}
                {showStacks && (
                  <div className="mt-3 space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-[#111] max-h-[400px] overflow-y-auto">
                    {Object.entries(techStackGroups).map(([group, items]) => (
                      <div key={group}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                          {group}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((stack) => {
                            const isSelected = selectedStacks.includes(stack);
                            const isDisabled = !isSelected && selectedStacks.length >= 10;
                            return (
                              <button
                                key={stack}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => toggleStack(stack)}
                                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${isSelected
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "border-slate-200 bg-white text-muted-foreground hover:border-slate-300 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:hover:border-zinc-600"
                                  } ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
                              >
                                {stack}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Additional Skills <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
              <textarea
                name="skills"
                rows={2}
                placeholder="e.g. Project Management, Graphic Design, Public Speaking..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white resize-y"
              ></textarea>
            </motion.label>

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Upload Resume (PDF, DOCX) - Max 5MB (Optional)</span>
              <div className="relative">
                <motion.div
                  whileHover={(!isSubmitting ? { scale: 1.01 } : {}) as any}
                  whileTap={(!isSubmitting ? { scale: 0.99 } : {}) as any}
                  className={`flex items-center gap-3 h-11 w-full rounded-lg border border-dashed bg-white px-3 transition-colors relative overflow-hidden ${isSubmitting ? 'border-slate-200 dark:border-zinc-800' : 'border-slate-300 hover:border-slate-900 dark:border-zinc-700 dark:hover:border-white'
                    } dark:bg-[#0A0A0A]`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"

                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      } else {
                        clearFile();
                      }
                    }}
                    className={`absolute inset-0 w-full h-full opacity-0 ${isSubmitting || selectedFile ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'} z-10`}
                    disabled={isSubmitting || !!selectedFile}
                    title=""
                  />
                  {/* Background progress fill */}
                  {isSubmitting && selectedFile && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-slate-900/5 dark:bg-white/10 z-0"
                      initial={{ width: "0%" }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: "easeInOut", duration: 0.3 }}
                    />
                  )}

                  <Paperclip className="h-4 w-4 text-slate-500 dark:text-zinc-400 z-10 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 truncate z-10 text-sm">
                    {selectedFile ? selectedFile.name : "Choose a file..."}
                  </span>

                  {isSubmitting && selectedFile ? (
                    <span className="ml-auto text-xs font-bold text-slate-700 dark:text-zinc-300 z-10 shrink-0 tabular-nums">
                      {uploadProgress}%
                    </span>
                  ) : selectedFile ? (
                    <div className="ml-auto flex items-center gap-1 z-30 shrink-0 relative">
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mr-2 tabular-nums pointer-events-none">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewOpen(true); }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Preview file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearFile(); }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-500 hover:text-red-500 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              </div>
            </motion.label>

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Have you made any open source contributions in the past that you'd like to share with us? <span className="text-red-500">*</span></span>
              <textarea
                name="openSource"
                rows={3}
                required
                placeholder="Type here..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white resize-y"
              ></textarea>
            </motion.label>

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Why are you interested in joining the Classgrid team? <span className="text-red-500">*</span></span>
              <textarea
                name="whyJoin"
                rows={3}
                required
                placeholder="Type here..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white resize-y"
              ></textarea>
            </motion.label>

            <motion.label variants={itemVariants} className="block text-sm">
              <span className="mb-2 block text-muted-foreground">Tell us about your experience working in an async and/or remote environment. What practices or approaches have worked well for you? What challenges have you faced? <span className="text-red-500">*</span></span>
              <textarea
                name="asyncRemote"
                rows={4}
                required
                placeholder="Type here..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-all focus:border-slate-900 dark:focus:border-white dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white resize-y"
              ></textarea>
            </motion.label>

            <motion.label variants={itemVariants} className="flex items-start gap-3 text-sm cursor-pointer mt-6 mb-2">
              <input type="checkbox" name="termsConsent" required className="accent-emerald-500 w-4 h-4 mt-1" />
              <span className="text-muted-foreground leading-relaxed">
                I agree to the <a href="/terms" className="text-emerald-500 hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-emerald-500 hover:underline">Privacy Policy</a>, and I consent to my data being processed for recruitment purposes.
              </span>
            </motion.label>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>{submitLabel}</span>
                  <Send className="h-4 w-4 text-white" />
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.form>
        </>
      )}

      {previewOpen && selectedFile && (
        <FilePreviewModal
          file={{ name: selectedFile.name, src: selectedFile }}
          onClose={() => setPreviewOpen(false)}
          onDelete={() => {
            clearFile();
            setPreviewOpen(false);
          }}
        />
      )}
    </>
  );
}
