"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { CheckoutPayload } from "@/lib/contracts";
import { billingCycles, checkoutPlans, pricingCopy } from "@/content/siteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type Plan = (typeof checkoutPlans)[number];
type BillingCycle = (typeof billingCycles)[number];

type CheckoutResponse = {
  checkoutUrl?: string;
  message?: string;
};

const checkoutSchema = z.object({
  orgId: z.string().min(2, pricingCopy.orgIdMissing),
  billingCycle: z.enum(billingCycles, {
    message: pricingCopy.checkoutError,
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function PricingCheckoutForm() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orgId: "",
      billingCycle: "monthly",
    },
  });

  const startCheckout = async (plan: Plan) => {
    const values = getValues();
    const requestPayload: CheckoutPayload = {
      plan,
      orgId: values.orgId.trim(),
      billingCycle: values.billingCycle as BillingCycle,
    };

    if (!requestPayload.orgId) {
      setError(pricingCopy.orgIdMissing);
      return;
    }

    setLoadingPlan(plan);
    setError("");
    setCheckoutUrl("");

    try {
      const response = await fetch("https://api.classgrid.in/api/public/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const data: CheckoutResponse = await response.json().catch(() => ({}));

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.message || pricingCopy.checkoutError);
      }

      setCheckoutUrl(data.checkoutUrl);
      window.location.assign(data.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : pricingCopy.checkoutError
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
      <h3 className="text-heading text-lg font-semibold text-white">{pricingCopy.checkoutTitle}</h3>
      <p className="mt-1 text-sm text-slate-300">{pricingCopy.checkoutSubtitle}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="orgId" className="text-slate-200">
            {pricingCopy.orgIdLabel}
          </Label>
          <Input
            id="orgId"
            className="h-10 border-white/15 bg-slate-950/50 text-white"
            placeholder={pricingCopy.orgIdPlaceholder}
            {...register("orgId")}
          />
          {errors.orgId ? (
            <p className="text-xs text-rose-300">{errors.orgId.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle" className="text-slate-200">
            {pricingCopy.billingCycleLabel}
          </Label>
          <NativeSelect id="billingCycle" className="w-full" {...register("billingCycle")}>
            <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
            <NativeSelectOption value="yearly">Yearly</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleSubmit(() => startCheckout("core"))}
          disabled={loadingPlan !== null}
          className="bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] text-white"
        >
          {loadingPlan === "core" ? pricingCopy.coreLoadingLabel : pricingCopy.coreLabel}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(() => startCheckout("premium"))}
          disabled={loadingPlan !== null}
          className="bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] text-white"
        >
          {loadingPlan === "premium" ? pricingCopy.premiumLoadingLabel : pricingCopy.premiumLabel}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(() => startCheckout("enterprise"))}
          disabled={loadingPlan !== null}
          className="border border-amber-300/30 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30"
        >
          {loadingPlan === "enterprise" ? pricingCopy.enterpriseLoadingLabel : pricingCopy.enterpriseLabel}
        </Button>
      </div>

      {checkoutUrl ? (
        <p className="mt-3 text-xs text-emerald-200">
          {pricingCopy.checkoutFallback}{" "}
          <a href={checkoutUrl} className="underline">
            Secure checkout
          </a>
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
