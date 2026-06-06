"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";

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
}: CareersFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        role: formData.get("role") as string,
        skills: formData.get("skills") as string,
        whyJoin: formData.get("whyJoin") as string,
        age18: formData.get("age18") as string,
        twitter: formData.get("twitter") as string,
        github: formData.get("github") as string,
        linkedin: formData.get("linkedin") as string,
        openSource: formData.get("openSource") as string,
        asyncRemote: formData.get("asyncRemote") as string,
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
      } else {
        const data = await response.json();
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setErrorMsg("Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-32 min-h-[600px] space-y-4"
      >
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Application Sent!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for applying to Classgrid! We have received your application and will be in touch shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold">{formTitle}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{formSubtitle}</p>
      
      {errorMsg && (
        <div className="mt-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-lg border border-red-500/20">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldName}</span>
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
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldEmail}</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">Phone Number</span>
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
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">City (Maharashtra)</span>
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
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldRole}</span>
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
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">Are you over the age of 18?</span>
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
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">Twitter / X profile</span>
            <input
              type="url"
              name="twitter"
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">GitHub profile</span>
            <input
              type="url"
              name="github"
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-700 dark:text-zinc-300">LinkedIn profile</span>
            <input
              type="url"
              name="linkedin"
              placeholder="https://"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">What skills do you have?</span>
          <textarea
            name="skills"
            rows={3}
            placeholder="React, Node.js, Marketing, Design, etc."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">Have you made any open source contributions in the past that you'd like to share with us?</span>
          <textarea
            name="openSource"
            rows={3}
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">Why are you interested in joining the Classgrid team?</span>
          <textarea
            name="whyJoin"
            rows={3}
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-700 dark:text-zinc-300">Tell us about your experience working in an async and/or remote environment. What practices or approaches have worked well for you? What challenges have you faced?</span>
          <textarea
            name="asyncRemote"
            rows={4}
            placeholder="Type here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white resize-y"
          ></textarea>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-transparent bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
          {!isSubmitting && <Send className="ml-2 h-4 w-4 text-white" />}
        </button>
      </form>
    </>
  );
}
