"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { demoCopy, demoFormCopy, demoOrgTypes } from "@/content/siteContent";
import type { DemoRequestPayload } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const demoSchema = z.object({
  institutionName: z.string().min(2, "Institution Name is required"),
  orgType: z.enum(demoOrgTypes, { message: "Organization Type is required" }),
  adminName: z.string().min(2, "Administrator Name is required"),
  adminEmail: z.string().email("Enter a valid Administrator Email"),
  adminPhone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid Administrator Phone"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
});

type DemoRequestFormValues = z.infer<typeof demoSchema>;

type DemoApiResponse = {
  success?: boolean;
  subdomain?: string;
  loginUrl?: string;
  message?: string;
};

type DemoRequestFormProps = {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successTitle?: string;
  nextStep?: string;
};

export function DemoRequestForm({
  title,
  subtitle,
  submitLabel,
  successTitle,
  nextStep,
}: DemoRequestFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DemoApiResponse | null>(null);
  const [error, setError] = useState<string>("");

  const formTitle = title ?? demoFormCopy.title;
  const formSubtitle = subtitle ?? demoFormCopy.subtitle;
  const buttonLabel = submitLabel ?? demoFormCopy.submitLabel;
  const successHeading = successTitle ?? demoFormCopy.successTitle;
  const nextStepCopy = nextStep ?? demoCopy.nextStep;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoRequestFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      institutionName: "",
      orgType: "engineering",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      state: "",
      city: "",
    },
  });

  const onSubmit = async (payload: DemoRequestFormValues) => {
    const requestPayload: DemoRequestPayload = payload;

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "https://api.classgrid.in/api/public/request-demo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      const data: DemoApiResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || demoFormCopy.errorFallback);
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : demoFormCopy.errorFallback
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass border-white/10 py-0">
      <CardHeader className="pt-6">
        <CardTitle className="text-heading text-2xl text-white">{formTitle}</CardTitle>
        <p className="text-sm text-slate-300">
          {formSubtitle}
        </p>
      </CardHeader>
      <CardContent className="pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="institutionName" className="text-slate-200">
              Institution Name
            </Label>
            <Input
              id="institutionName"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("institutionName")}
            />
            {errors.institutionName ? (
              <p className="text-xs text-rose-300">{errors.institutionName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgType" className="text-slate-200">
              Organization Type
            </Label>
            <NativeSelect
              id="orgType"
              className="w-full"
              {...register("orgType")}
            >
              <NativeSelectOption value="engineering">Engineering</NativeSelectOption>
              <NativeSelectOption value="school">School</NativeSelectOption>
              <NativeSelectOption value="junior_college">Junior College</NativeSelectOption>
              <NativeSelectOption value="coaching">Coaching</NativeSelectOption>
              <NativeSelectOption value="diploma">Diploma</NativeSelectOption>
              <NativeSelectOption value="other">Other</NativeSelectOption>
            </NativeSelect>
            {errors.orgType ? (
              <p className="text-xs text-rose-300">{errors.orgType.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminName" className="text-slate-200">
              Administrator Name
            </Label>
            <Input
              id="adminName"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("adminName")}
            />
            {errors.adminName ? (
              <p className="text-xs text-rose-300">{errors.adminName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail" className="text-slate-200">
              Administrator Email
            </Label>
            <Input
              id="adminEmail"
              type="email"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("adminEmail")}
            />
            {errors.adminEmail ? (
              <p className="text-xs text-rose-300">{errors.adminEmail.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPhone" className="text-slate-200">
              Administrator Phone
            </Label>
            <Input
              id="adminPhone"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("adminPhone")}
            />
            {errors.adminPhone ? (
              <p className="text-xs text-rose-300">{errors.adminPhone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-slate-200">
              State
            </Label>
            <Input
              id="state"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("state")}
            />
            {errors.state ? (
              <p className="text-xs text-rose-300">{errors.state.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="city" className="text-slate-200">
              City
            </Label>
            <Input
              id="city"
              className="h-10 border-white/15 bg-slate-950/50 text-white"
              {...register("city")}
            />
            {errors.city ? (
              <p className="text-xs text-rose-300">{errors.city.message}</p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={submitting}
              className="h-10 w-full bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] text-white"
            >
              {submitting ? demoFormCopy.submittingLabel : buttonLabel}
            </Button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-rose-300">{error}</p>
        ) : null}

        {result?.success ? (
          <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-900/20 p-4 text-sm text-emerald-100">
            <p>{successHeading}</p>
            <p className="mt-2 text-xs text-emerald-100/80">{nextStepCopy}</p>
            {result.subdomain ? (
              <p className="mt-2 text-xs">
                {demoFormCopy.subdomainLabel} {result.subdomain}.classgrid.in
              </p>
            ) : null}
            {result.loginUrl ? (
              <p className="mt-2 text-xs">
                {demoFormCopy.loginUrlLabel}{" "}
                <a className="underline" href={`https://${result.loginUrl}`}>
                  {result.loginUrl}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
