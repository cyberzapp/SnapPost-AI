"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PRICING_PLANS } from "@/lib/constants";
import { PlanTier } from "@/types";

function BillingPageInner() {
  const searchParams = useSearchParams();
  const { user, upgradePlan } = useAppStore();
  const [provider, setProvider] = useState<"stripe" | "razorpay">("stripe");
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);
  const [gatewayNotice, setGatewayNotice] = useState<{
    tier: PlanTier;
    provider: "stripe" | "razorpay";
    message: string;
  } | null>(null);
  const [sandboxActivated, setSandboxActivated] = useState<string | null>(
    searchParams.get("checkout") === "success"
      ? "Subscription upgraded successfully!"
      : null
  );

  const handleCheckout = async (tier: PlanTier) => {
    setGatewayNotice(null);
    setSandboxActivated(null);

    if (tier === "FREE") {
      upgradePlan("FREE", "sandbox");
      setSandboxActivated("Switched to Starter Free Plan.");
      return;
    }

    setLoadingTier(tier);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier: tier,
          provider,
          userEmail: user?.email,
          userId: user?.id,
        }),
      });
      const data = await res.json();

      if (data.configured && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.configured && data.provider === "razorpay" && data.orderId) {
        setSandboxActivated(
          `Razorpay Order (${data.orderId}) created. Complete checkout in Razorpay modal.`
        );
        return;
      }

      // Honest, transparent state when Stripe/Razorpay keys are not set in .env
      setGatewayNotice({
        tier,
        provider,
        message:
          data.message ||
          `${provider.toUpperCase()} API keys are not configured in this environment.`,
      });
    } catch (e: unknown) {
      setGatewayNotice({
        tier,
        provider,
        message:
          e instanceof Error
            ? e.message
            : "Payment provider connection unavailable.",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  const handleConfirmSandboxUpgrade = (tier: PlanTier) => {
    upgradePlan(tier, "sandbox");
    setGatewayNotice(null);
    setSandboxActivated(
      `Developer Sandbox Mode: Activated ${tier} Plan and allocated monthly AI credits (No real payment was charged).`
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Subscription &amp; Payment Architecture
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Plans &amp; Billing
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your subscription tier, monthly AI credit allocation, and
            payment gateway preference.
          </p>
        </div>

        {/* Provider Toggle (Stripe USD / Razorpay INR) */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#121520] p-1">
          <button
            type="button"
            onClick={() => setProvider("stripe")}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              provider === "stripe"
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Stripe Checkout (USD $)
          </button>
          <button
            type="button"
            onClick={() => setProvider("razorpay")}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              provider === "razorpay"
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Razorpay (INR ₹)
          </button>
        </div>
      </div>

      {/* Current Subscription Status Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#121520] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Current Plan: {user?.planTier}
              </h2>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                {user?.subscriptionStatus || "active"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {user?.creditsBalance} credits remaining of{" "}
              {user?.monthlyAllowance} monthly allowance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Webhook &amp; server-side credit allocation enabled</span>
        </div>
      </div>

      {sandboxActivated && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{sandboxActivated}</span>
        </div>
      )}

      {/* Honest Unconfigured Gateway Notice (Never pretending live payment succeeded) */}
      {gatewayNotice && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Live {gatewayNotice.provider.toUpperCase()} Credentials Not
                Configured (Development / Test Mode)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-amber-100/90">
                {gatewayNotice.message} Add{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">
                  {gatewayNotice.provider === "stripe"
                    ? "STRIPE_SECRET_KEY"
                    : "RAZORPAY_KEY_ID"}
                </code>{" "}
                in <code className="font-mono">.env.local</code> to process real
                card transactions. For local evaluation, you can test upgrading
                to <strong>{gatewayNotice.tier}</strong> in Developer Sandbox
                mode below:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-8">
            <button
              type="button"
              onClick={() => handleConfirmSandboxUpgrade(gatewayNotice.tier)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                Simulate {gatewayNotice.tier} Upgrade in Sandbox Mode (No Real
                Charge)
              </span>
            </button>
            <button
              type="button"
              onClick={() => setGatewayNotice(null)}
              className="text-xs font-semibold text-amber-200 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = user?.planTier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={`flex flex-col justify-between rounded-2xl border p-6 ${
                plan.popular
                  ? "border-violet-500 bg-[#15192B] shadow-glow"
                  : "border-white/10 bg-[#121520]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                      ACTIVE PLAN
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {provider === "stripe"
                      ? `$${plan.priceMonthly}`
                      : `₹${plan.priceInr.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-violet-400">
                  {plan.creditsPerMonth} monthly AI credits
                </div>

                <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent || loadingTier === plan.tier}
                onClick={() => handleCheckout(plan.tier)}
                className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  isCurrent
                    ? "cursor-default border border-white/10 bg-white/5 text-slate-400"
                    : plan.popular
                    ? "bg-violet-600 text-white shadow-glow hover:bg-violet-500"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {isCurrent
                  ? "Current Active Plan"
                  : loadingTier === plan.tier
                  ? "Connecting to Gateway..."
                  : `${plan.ctaLabel} (${provider.toUpperCase()})`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-slate-400">Loading Billing...</div>
      }
    >
      <BillingPageInner />
    </Suspense>
  );
}
