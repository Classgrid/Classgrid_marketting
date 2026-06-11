"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import locationData from "@/data/india-locations.json";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Search,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Turnstile } from "@marsidev/react-turnstile";

type DemoRequestFormCopy = {
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  instituteNameLabel?: string;
  instituteNamePlaceholder?: string;
  stateLabel?: string;
  statePlaceholder?: string;
  cityLabel?: string;
  cityPlaceholder?: string;
  solutionLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  captchaPlaceholder?: string;
  captchaMismatchMessage?: string;
  securityCheckRequiredMessage?: string;
  submitLoadingLabel?: string;
  genericErrorMessage?: string;
  validationInstitutionNameRequired?: string;
  validationOrgTypeRequired?: string;
  validationFullNameRequired?: string;
  validationEmailInvalid?: string;
  validationPhoneInvalid?: string;
  validationStateRequired?: string;
  validationCityRequired?: string;
  solutionOptions?: Array<{
    value?: string;
    label?: string;
  }>;
};

const FALLBACK_ORG_TYPES = [
  "engineering",
  "school",
  "junior_college",
  "coaching",
  "diploma",
  "other",
] as const;

function getSolutionOptions(copy?: DemoRequestFormCopy) {
  const options = Array.isArray(copy?.solutionOptions)
    ? copy.solutionOptions.filter((option) => option?.value?.trim() && option?.label?.trim())
    : [];

  return options.length
    ? options.map((option) => ({
        value: option.value!.trim(),
        label: option.label!.trim(),
      }))
    : FALLBACK_ORG_TYPES.map((value) => ({
        value,
        label: value
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
}

function createDemoSchema(copy?: DemoRequestFormCopy) {
  const validOrgTypes = getSolutionOptions(copy).map((option) => option.value);

  return z.object({
    institutionName: z
      .string()
      .min(2, copy?.validationInstitutionNameRequired || ""),
    orgType: z.string().refine((value) => validOrgTypes.includes(value), {
      message: copy?.validationOrgTypeRequired || "",
    }),
    adminName: z.string().min(2, copy?.validationFullNameRequired || ""),
    adminEmail: z.string().email(copy?.validationEmailInvalid || ""),
    adminPhone: z
      .string()
      .regex(/^[0-9]{10,15}$/, copy?.validationPhoneInvalid || ""),
    state: z.string().min(2, copy?.validationStateRequired || ""),
    district: z.string().min(2, "District is required"),
    taluka: z.string().min(2, "Taluka is required"),
    customTaluka: z.string().optional(),
    customDistrict: z.string().optional(),
    cityVillage: z.string().min(2, "Institution City/Village is required"),
    message: z.string().optional(),
  });
}

type DemoFormValues = z.infer<ReturnType<typeof createDemoSchema>>;

type DemoRequestFormProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  ctaLine?: string;
  successTitle?: string;
  successBody?: string;
  formTitle?: string;
  formSubtitle?: string;
  submitLabel?: string;
  detailsSectionTitle?: string;
  instituteSectionTitle?: string;
  messageSectionTitle?: string;
  copy?: DemoRequestFormCopy;
};

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function DemoRequestForm({
  label,
  title,
  subtitle,
  ctaLine,
  successTitle,
  successBody,
  formTitle,
  formSubtitle,
  submitLabel,
  detailsSectionTitle,
  instituteSectionTitle,
  messageSectionTitle,
  copy,
}: DemoRequestFormProps) {
  const router = useRouter();
  const resolvedFormTitle = title ?? formTitle;
  const resolvedFormSubtitle = subtitle ?? formSubtitle;
  const solutionOptions = getSolutionOptions(copy);
  const demoSchema = createDemoSchema(copy);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const defaultOrgType =
    typeof solutionOptions[0]?.value === "string" ? solutionOptions[0].value : FALLBACK_ORG_TYPES[0];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      institutionName: "",
      orgType: defaultOrgType,
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      state: "",
      district: "",
      taluka: "",
      customTaluka: "",
      customDistrict: "",
      cityVillage: "",
      message: "",
    },
  });

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedTaluka = watch("taluka");

  const allStates = useMemo(() => {
    return [
      ...Object.keys(locationData.states),
      ...Object.keys(locationData.unionTerritories),
    ].sort();
  }, []);

  const districts = useMemo(() => {
    if (!selectedState) return [];
    const stateData =
      (locationData.states as Record<string, Record<string, string[]>>)[selectedState] ||
      (locationData.unionTerritories as Record<string, Record<string, string[]>>)[selectedState] ||
      {};
    return Object.keys(stateData).sort();
  }, [selectedState]);

  const talukas = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    const stateData =
      (locationData.states as Record<string, Record<string, string[]>>)[selectedState] ||
      (locationData.unionTerritories as Record<string, Record<string, string[]>>)[selectedState] ||
      {};
    return (stateData[selectedDistrict] || []).sort();
  }, [selectedState, selectedDistrict]);

  const handleStateChange = (val: string) => {
    setValue("district", "");
    setValue("customDistrict", "");
    setValue("taluka", "");
    setValue("customTaluka", "");
  };

  const handleDistrictChange = (val: string) => {
    setValue("customDistrict", "");
    setValue("taluka", val === "Other" ? "Other" : "");
    setValue("customTaluka", "");
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const onSubmit = async (payload: DemoFormValues) => {
    if (captchaInput.toUpperCase() !== captchaCode) {
      setCaptchaError(copy?.captchaMismatchMessage || "Incorrect CAPTCHA, please try again.");
      setCaptchaCode(generateCaptcha());
      setCaptchaInput("");
      setTimeout(() => setCaptchaError(""), 3000);
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setCaptchaError(copy?.securityCheckRequiredMessage || "");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const finalTaluka = payload.taluka === "Other" ? payload.customTaluka : payload.taluka;
      const finalDistrict = payload.district === "Other" ? payload.customDistrict : payload.district;
      const apiPayload = { ...payload, district: finalDistrict, taluka: finalTaluka, turnstileToken };

      const response = await fetch(
        "/api/request-demo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || copy?.genericErrorMessage || "");
      const requestId =
        typeof data?.requestId === "string" && data.requestId.trim().length > 0
          ? data.requestId.trim()
          : null;
      router.push(requestId ? `/demo/success?requestId=${encodeURIComponent(requestId)}` : "/demo/success");
    } catch (err: any) {
      setError(err.message || copy?.genericErrorMessage || "");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Reusable icon-box input ── */
  const IconInput = ({
    icon: Icon,
    error: fieldError,
    children,
    label,
  }: {
    icon: any;
    error?: string;
    children: React.ReactNode;
    label: string;
  }) => (
    <div className="space-y-1.5">
      {label?.trim() ? (
        <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {label} <span className="text-rose-500">*</span>
        </Label>
      ) : null}
      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <div className="flex w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">{children}</div>
      </div>
      {fieldError && <p className="text-[10px] text-rose-500">{fieldError}</p>}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
        {label ? (
          <div className="mb-6 flex justify-center">
            <Chip variant="emerald">{label}</Chip>
          </div>
        ) : null}
        
        {title?.trim() ? (
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            {title}
          </h2>
        ) : null}
        
        {subtitle?.trim() ? (
          <div className="mx-auto mt-6 max-w-[90%] md:max-w-2xl text-center text-[15px] md:text-base leading-[1.75] text-muted-foreground space-y-4">
            {subtitle.split('\n').map((line, i) => (
              <p 
                key={i} 
                className="text-balance"
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Bounded card ── */}
      <div className="rounded-2xl border border-border bg-card px-8 py-10 shadow-xl md:px-12 md:py-14">

        {/* Form specific header / CTA line */}
        {ctaLine?.trim() ? (
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {ctaLine}
            </h3>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* ── SECTION 1: YOUR DETAILS ── */}
          <div>
            {detailsSectionTitle?.trim() ? (
              <div className="mb-5 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                  {detailsSectionTitle}
                </h3>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <IconInput icon={User} label={copy?.fullNameLabel || ""} error={errors.adminName?.message}>
                <Input
                  placeholder={copy?.fullNamePlaceholder}
                  className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                  {...register("adminName")}
                />
              </IconInput>

              <IconInput icon={Mail} label={copy?.emailLabel || ""} error={errors.adminEmail?.message}>
                <Input
                  type="email"
                  placeholder={copy?.emailPlaceholder}
                  className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                  {...register("adminEmail")}
                />
              </IconInput>

              <IconInput icon={Phone} label={copy?.phoneLabel || ""} error={errors.adminPhone?.message}>
                <Input
                  placeholder={copy?.phonePlaceholder}
                  className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                  {...register("adminPhone")}
                />
              </IconInput>
            </div>
          </div>

          {/* ── SECTION 2: INSTITUTE DETAILS ── */}
          <div>
            {instituteSectionTitle?.trim() ? (
              <div className="mb-5 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                  {instituteSectionTitle}
                </h3>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <IconInput icon={Building2} label={copy?.instituteNameLabel || ""} error={errors.institutionName?.message}>
                <Input
                  placeholder={copy?.instituteNamePlaceholder}
                  className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                  {...register("institutionName")}
                />
              </IconInput>

              {/* State */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  State / UT <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => { field.onChange(val); handleStateChange(val); }}>
                      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                        <div className="flex w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <SelectTrigger className="flex h-10 flex-1 items-center justify-between rounded-none border-0 !bg-transparent px-3 text-sm text-slate-800 shadow-none ring-0 focus-visible:ring-0 dark:text-white">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        {allStates.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state?.message && <p className="text-[10px] text-rose-500">{errors.state.message}</p>}
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  District <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => { field.onChange(val); handleDistrictChange(val); }} disabled={!selectedState}>
                      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 opacity-disabled">
                        <div className="flex w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <SelectTrigger className="flex h-10 flex-1 items-center justify-between rounded-none border-0 !bg-transparent px-3 text-sm text-slate-800 shadow-none ring-0 focus-visible:ring-0 dark:text-white disabled:cursor-not-allowed">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                        <SelectItem value="Other">Other (Please specify)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.district?.message && <p className="text-[10px] text-rose-500">{errors.district.message}</p>}
              </div>

              {selectedDistrict === "Other" && (
                <IconInput icon={MapPin} label="Enter your District" error={errors.customDistrict?.message}>
                  <Input
                    placeholder="Your District name"
                    className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                    {...register("customDistrict")}
                  />
                </IconInput>
              )}

              {/* Taluka */}
              {selectedDistrict !== "Other" && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Taluka <span className="text-rose-500">*</span>
                  </Label>
                  <Controller
                    name="taluka"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={!selectedDistrict}>
                        <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 opacity-disabled">
                          <div className="flex w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <SelectTrigger className="flex h-10 flex-1 items-center justify-between rounded-none border-0 !bg-transparent px-3 text-sm text-slate-800 shadow-none ring-0 focus-visible:ring-0 dark:text-white disabled:cursor-not-allowed">
                            <SelectValue placeholder="Select Taluka" />
                          </SelectTrigger>
                        </div>
                        <SelectContent>
                          {talukas.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                          <SelectItem value="Other">Other (Please specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.taluka?.message && <p className="text-[10px] text-rose-500">{errors.taluka.message}</p>}
                </div>
              )}

              {selectedTaluka === "Other" && (
                <IconInput icon={MapPin} label="Enter your Taluka" error={errors.customTaluka?.message}>
                  <Input
                    placeholder="Your Taluka name"
                    className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                    {...register("customTaluka")}
                  />
                </IconInput>
              )}

              {/* City/Village */}
              <IconInput icon={MapPin} label="Institution City / Village" error={errors.cityVillage?.message}>
                <Input
                  placeholder="Institution City or Village"
                  className="h-10 rounded-none border-0 bg-transparent text-slate-800 shadow-none focus-visible:ring-0 dark:text-white"
                  {...register("cityVillage")}
                />
              </IconInput>

              {/* OrgType */}
              <div className="space-y-1.5">
                {(copy?.solutionLabel || "").trim() ? (
                  <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    {copy?.solutionLabel} <span className="text-rose-500">*</span>
                  </Label>
                ) : null}
                <Controller
                  name="orgType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                        <div className="flex w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <Search className="h-4 w-4" />
                        </div>
                        <SelectTrigger className="flex h-10 flex-1 items-center justify-between rounded-none border-0 !bg-transparent px-3 text-sm text-slate-800 shadow-none ring-0 focus-visible:ring-0 dark:text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        {solutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.orgType?.message && <p className="text-[10px] text-rose-500">{errors.orgType.message}</p>}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: MESSAGE ── */}
          <div>
            {messageSectionTitle?.trim() ? (
              <div className="mb-5 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                  {messageSectionTitle}
                </h3>
              </div>
            ) : null}

            <div className="space-y-1.5">
              {copy?.messageLabel?.trim() ? (
                <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {copy?.messageLabel}
                </Label>
              ) : null}
              <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                <div className="flex w-10 shrink-0 items-start justify-center pt-3 bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <textarea
                  rows={4}
                  placeholder={copy?.messagePlaceholder}
                  className="flex-1 bg-transparent p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
                  {...register("message")}
                />
              </div>
            </div>
          </div>

          {/* ── SECURITY CHECKS ── */}
          <div className="flex flex-col items-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
            {/* Custom Captcha */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="select-none rounded-md border border-border bg-background px-5 py-2.5 text-xl font-bold italic tracking-[0.4em] text-foreground">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
              <Input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder={copy?.captchaPlaceholder}
                className="h-10 w-full max-w-[220px] border-slate-200 bg-white text-center text-sm font-bold uppercase tracking-widest text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Cloudflare Turnstile */}
            <div className="flex flex-col items-center justify-center border-t border-slate-200 pt-4 dark:border-white/10 w-full">
              {turnstileSiteKey ? (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: "auto" }}
                />
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Security check is disabled because Turnstile site key is not configured.
                </p>
              )}
            </div>
            
            {captchaError && <p className="text-[11px] text-rose-500">{captchaError}</p>}
          </div>

          {/* ── SUBMIT ── */}
          {submitLabel?.trim() || copy?.submitLoadingLabel?.trim() ? (
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full text-base"
              >
                {submitting && <Spinner className="h-5 w-5 text-inherit" />}
                {submitting ? copy?.submitLoadingLabel || "Submitting..." : submitLabel}
              </Button>
              <div className="flex items-center justify-center gap-3">
                <Chip variant="emerald" icon={<ShieldCheck />}>
                  Guided Demo Review
                </Chip>
                <Chip variant="default">
                  Team Will Connect
                </Chip>
              </div>
            </div>
          ) : null}

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-rose-200/50 bg-rose-50/50 p-3 text-sm font-medium text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
