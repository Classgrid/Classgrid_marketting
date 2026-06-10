"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Paperclip, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase-storage";
import FilePreviewModal from "@/app/support/components/FilePreviewModal";
import { Spinner } from "@/components/ui/spinner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [showStacks, setShowStacks] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const cities = [
    "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar (Aurangabad)",
    "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg", "Satara", "Sangli", "Solapur", "Kolhapur",
    "Dhule", "Nandurbar", "Jalgaon", "Ahilyanagar (Ahmednagar)", "Jalna", "Beed", "Dharashiv (Osmanabad)",
    "Latur", "Nanded", "Parbhani", "Hingoli", "Amravati", "Akola", "Buldhana", "Washim", "Yavatmal",
    "Bhandara", "Gondia", "Chandrapur", "Gadchiroli", "Wardha"
  ].sort();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setUploadProgress(0);

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
        
        const timestamp = Date.now();
        const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `applications/${timestamp}_${sanitizedName}`;

        const { data, error } = await supabase.storage
          .from("resumes")
          .upload(filePath, selectedFile, { cacheControl: "3600", upsert: false });

        if (error) {
          console.error("Supabase upload error:", error.message);
          setErrorMsg("Failed to upload resume. Please try again.");
          setIsSubmitting(false);
          clearInterval(progressInterval!);
          return;
        }

        const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(data.path);
        resumeUrl = urlData.publicUrl;
        setUploadProgress(100);
      }

      const payload = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        role: formData.get("role") as string,
        techStack: selectedStacks.join(", "),
        skills: formData.get("skills") as string,
        whyJoin: formData.get("whyJoin") as string,
        age18: formData.get("age18") as string,
        twitter: formData.get("twitter") as string,
        github: formData.get("github") as string,
        linkedin: formData.get("linkedin") as string,
        openSource: formData.get("openSource") as string,
        asyncRemote: formData.get("asyncRemote") as string,
        resumeUrl: resumeUrl,
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">{fieldName}</span>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">{fieldEmail}</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Phone Number</span>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+91"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">City (Maharashtra)</span>
            <select
              name="city"
              required
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
              defaultValue=""
            >
              <option value="" disabled>Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="Other">Other / Outside Maharashtra</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">{fieldRole}</span>
            <select
              name="role"
              required
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
              defaultValue=""
            >
              <option value="" disabled>{rolePlaceholder}</option>
              {roles.map((role) => (
                <option key={role.value} value={role.label}>{role.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Are you over the age of 18?</span>
          <div className="flex gap-4 items-center h-11 px-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="age18" value="Yes" required className="accent-emerald-500 w-4 h-4" />
              <span className="text-slate-900 dark:text-white">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="age18" value="No" required className="accent-emerald-500 w-4 h-4" />
              <span className="text-slate-900 dark:text-white">No</span>
            </label>
          </div>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Twitter / X profile</span>
            <input
              type="url"
              name="twitter"
              required
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">GitHub profile</span>
            <input
              type="url"
              name="github"
              required
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">LinkedIn profile</span>
            <input
              type="url"
              name="linkedin"
              required
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
        </div>

        {Object.keys(techStackGroups).length > 0 && (
          <div className="block text-sm">
            <span className="mb-1 flex items-center justify-between text-muted-foreground">
              <span>Your Tech Stack</span>
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
                            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                              isSelected
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
          </div>
        )}

        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Upload Resume (PDF, DOCX) - Max 5MB <span className="text-rose-500">*</span></span>
          <div className="relative">
            <motion.div 
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              className={`flex items-center gap-3 h-11 w-full rounded-lg border border-dashed bg-white px-3 transition-colors relative overflow-hidden ${
                isSubmitting ? 'border-slate-200 dark:border-zinc-800' : 'border-slate-300 hover:border-slate-900 dark:border-zinc-700 dark:hover:border-white'
              } dark:bg-[#0A0A0A]`}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
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
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Have you made any open source contributions in the past that you'd like to share with us?</span>
          <textarea
            name="openSource"
            rows={3}
            required
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Why are you interested in joining the Classgrid team?</span>
          <textarea
            name="whyJoin"
            rows={3}
            required
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Tell us about your experience working in an async and/or remote environment. What practices or approaches have worked well for you? What challenges have you faced?</span>
          <textarea
            name="asyncRemote"
            rows={4}
            required
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 disabled:opacity-50 mt-4"
        >
          {isSubmitting && <Spinner className="h-5 w-5 text-inherit" />}
          {isSubmitting ? "Submitting..." : submitLabel}
          {!isSubmitting && <Send className="h-4 w-4 text-white" />}
        </button>
      </form>
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
