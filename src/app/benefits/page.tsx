"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Palette,
  Type,
  MousePointerClick,
  DollarSign,
} from "lucide-react";
import { DEMO_SAAS_SCREENSHOT_DATA_URL } from "@/lib/constants";
import { generateDesignVariations } from "@/lib/design-engine";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import { useAppStore } from "@/lib/store";
import { LogoIcon } from "@/components/Logo";
import { TargetCustomersAndPlatforms } from "@/components/marketing/TargetCustomersAndPlatforms";
import { ReviewCarouselSection } from "@/components/marketing/ReviewCarouselSection";

interface AnatomyLayer {
  id: string;
  step: string;
  title: string;
  ctrImpact: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  visualPrinciple: string;
}

const ANATOMY_LAYERS: AnatomyLayer[] = [
  {
    id: "hook-hierarchy",
    step: "LAYER 01",
    title: "Scroll-Stopping Typographic Hook",
    ctrImpact: "+142% First-Second Attention",
    icon: Type,
    color: "from-violet-600 to-indigo-600",
    description:
      "Raw screenshots force users to zoom in and squint at tiny 12px UI labels. SnapPost AI extracts your core value proposition and renders a bold 52px display headline at the top of the visual hierarchy.",
    visualPrinciple:
      "Calibrated 3:1 headline-to-subheadline contrast ratio legible on mobile feeds at thumb-scrolling speed.",
  },
  {
    id: "framed-proof",
    step: "LAYER 02",
    title: "Lossless Device & Browser Framing",
    ctrImpact: "+88% Perceived Product Quality",
    icon: Layers,
    color: "from-cyan-500 to-blue-600",
    description:
      "Your actual product screenshot is wrapped in a macOS Dark Glass, Floating Shadow, or Minimal Border window with traffic-light chrome and balanced breathing room.",
    visualPrinciple:
      "Zero pixel distortion—your authentic UI remains the undeniable hero proof of the post.",
  },
  {
    id: "metric-pills",
    step: "LAYER 03",
    title: "Verified KPI & Feature Callout Pills",
    ctrImpact: "+115% Scannable Credibility",
    icon: Eye,
    color: "from-emerald-500 to-teal-600",
    description:
      "Gemini 3.8 Vision spots concrete numbers ($1.48M ARR, 134.8% Retention, 1.8ms Latency) inside your screenshot and surfaces them as high-contrast glass callout badges.",
    visualPrinciple:
      "Readers absorb key quantitative proof in 0.8 seconds without reading a single paragraph.",
  },
  {
    id: "brand-aura",
    step: "LAYER 04",
    title: "Adaptive Brand Aura & Mesh Lighting",
    ctrImpact: "100% Feed Recognition",
    icon: Palette,
    color: "from-fuchsia-600 to-rose-600",
    description:
      "Samples dominant hex colors directly from your screenshot (or applies your saved Brand Kit) to generate subtle radial mesh lighting behind the device frame.",
    visualPrinciple:
      "Eliminates the flat, lifeless 'cropped rectangle' look of ordinary screenshots.",
  },
  {
    id: "cta-trigger",
    step: "LAYER 05",
    title: "High-Contrast Action & Brand Footer",
    ctrImpact: "3.4x Higher Profile & Link Clicks",
    icon: MousePointerClick,
    color: "from-amber-500 to-orange-600",
    description:
      "Anchors the bottom of the canvas with your studio watermark and a pill-shaped Call-To-Action badge that guides viewers directly to your trial link or thread.",
    visualPrinciple:
      "Completes the visual F-pattern eye trajectory from Headline → UI Proof → Action.",
  },
];

export default function VisualBenefitsPage() {
  const { user } = useAppStore();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    ANATOMY_LAYERS[0].id
  );
  const [postsPerWeek, setPostsPerWeek] = useState<number>(6);
  const [channelsPerPost, setChannelsPerPost] = useState<number>(3);

  const activeLayer =
    ANATOMY_LAYERS.find((l) => l.id === selectedLayerId) || ANATOMY_LAYERS[0];

  const showcaseVariation = useMemo(() => {
    const list = generateDesignVariations({
      projectId: "proj-benefits-anatomy",
      screenshotUrl: DEMO_SAAS_SCREENSHOT_DATA_URL,
      platformId: "linkedin-post",
      stylePreset: "Minimal SaaS",
      variationCount: 1,
      backgroundStyle: "radial-violet",
      primaryBrandColor: "#7C3AED",
      analysis: {
        screenshotRepresents: "ARR & Net Retention Executive SaaS Dashboard",
        category: "B2B SaaS Revenue Intelligence",
        mainPurpose:
          "Track Annual Recurring Revenue ($1.48M), Net Dollar Retention (134.8%), and AI churn predictions in real time.",
        productSummary:
          "PulseMetrics AI unifies subscription telemetry, cohort retention, and automated expansion signals.",
        visibleFeatures: [
          {
            name: "$1.48M ARR (+38.4% MoM)",
            description: "Live recurring revenue telemetry.",
            confidence: "high",
          },
          {
            name: "134.8% Net Dollar Retention",
            description: "Top-decile SaaS expansion velocity.",
            confidence: "high",
          },
        ],
        uiElements: ["Dark sidebar", "KPI cards", "Pipeline chart"],
        brandColors: ["#7C3AED", "#3B82F6", "#10B981"],
        designStyle: "Dark Obsidian SaaS UI",
        targetAudience: "SaaS Founders & Growth Teams",
        uniqueSellingPoints: ["99.4% forecast accuracy"],
        marketingAngles: ["Real-time ARR clarity"],
        recommendedPlatforms: ["linkedin-post"],
        suggestedHeadline:
          "134.8% Net Retention Starts With Real-Time Clarity",
        suggestedSubheadline:
          "Unify ARR telemetry, churn radar, and expansion triggers in one workspace.",
        suggestedCta: "Start 14-Day Free Trial →",
        analyzedBy: "gemini-vision",
      },
      isFreePlan: false,
    });
    return list[0];
  }, []);

  // ROI Calculator Math
  const totalAssetsPerMonth = postsPerWeek * channelsPerPost * 4;
  const manualHoursPerMonth = Math.round((totalAssetsPerMonth * 32) / 60);
  const snapPostMinutesPerMonth = Math.round((postsPerWeek * 4 * 0.75));
  const hoursSavedPerMonth = Math.max(
    1,
    manualHoursPerMonth - Math.ceil(snapPostMinutesPerMonth / 60)
  );
  const annualDesignSavingsUsd = hoursSavedPerMonth * 12 * 65;

  return (
    <div className="min-h-screen bg-[#080A11] text-slate-100 selection:bg-violet-600/30">
      {/* Top Sticky Glass Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080A11]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <LogoIcon size={36} priority />
              <span className="text-lg font-extrabold tracking-tight text-white">
                SnapPost <span className="text-violet-400">AI</span>
              </span>
            </Link>

            {/* Page Switcher */}
            <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-[#111422] p-1 md:flex">
              <Link
                href="/"
                className="rounded-lg px-3 py-1 text-xs font-medium text-slate-400 transition hover:text-white"
              >
                Classic Home
              </Link>
              <Link
                href="/app"
                className="rounded-lg px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Fluid Showcase (/app)
              </Link>
              <Link
                href="/benefits"
                className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white shadow-glow"
              >
                Visual Benefits (/benefits)
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white md:hidden"
            >
              /app Page
            </Link>
            {user ? (
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-violet-500 sm:text-sm"
              >
                <span>Create Post ({user.creditsBalance} cr)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-violet-500 sm:text-sm"
              >
                <span>Start Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO: CREATIVE VISUAL BENEFITS */}
      <section className="relative overflow-hidden pt-14 pb-20 lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.16),_rgba(124,58,237,0.15)_45%,_transparent_70%)]" />

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>THE VISUAL ADVANTAGE • WHY SNAPPOST AI CONVERTS</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              See the Creative &amp; Business{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Benefits Visually.
              </span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              Why do plain product screenshots flop while SnapPost AI visuals
              drive 3.4x higher engagement? Explore the 5-layer visual anatomy,
              calculate your team&apos;s exact hours saved, and inspect how we
              serve every creator &amp; social platform.
            </p>
          </motion.div>

          {/* 4 Visual Benefit Hero Metric Cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Feed Click-Through Lift",
                value: "3.4x Higher",
                sub: "vs. unstyled browser grabs",
                icon: TrendingUp,
                accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
              },
              {
                label: "Design Production Speed",
                value: "38 Seconds",
                sub: "down from 45 mins in Figma",
                icon: Clock,
                accent: "text-violet-400 border-violet-500/30 bg-violet-500/10",
              },
              {
                label: "Screenshot UI Fidelity",
                value: "100% Intact",
                sub: "never distorted or hallucinated",
                icon: ShieldCheck,
                accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
              },
              {
                label: "Multi-Channel Coverage",
                value: "8 Ratios",
                sub: "1-click resize & ZIP export",
                icon: Zap,
                accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-[#121521] p-6 text-left shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      {card.label}
                    </span>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.accent}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-extrabold text-white">
                    {card.value}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{card.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE 5-LAYER VISUAL ANATOMY EXPLORER */}
      <section className="border-t border-white/10 bg-[#0B0E18] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Interactive Conversion X-Ray
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              The 5 Visual Layers That Stop the Scroll
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Click each conversion layer on the left to inspect how SnapPost AI
              engineers visual authority around your product screenshot.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-8 lg:grid-cols-12">
            {/* Left 6 Cols: 5 Interactive Layer Selector Cards */}
            <div className="space-y-3 lg:col-span-6">
              {ANATOMY_LAYERS.map((layer) => {
                const Icon = layer.icon;
                const isSelected = layer.id === activeLayer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                      isSelected
                        ? "border-violet-500 bg-gradient-to-r from-violet-600/20 via-[#161B2E] to-[#121520] shadow-glow"
                        : "border-white/10 bg-[#121520] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${layer.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] font-bold text-violet-400">
                            {layer.step}
                          </div>
                          <div className="text-sm font-bold text-white sm:text-base">
                            {layer.title}
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-300">
                        {layer.ctrImpact}
                      </span>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-300"
                      >
                        <p>{layer.description}</p>
                        <div className="mt-2 rounded-lg bg-black/30 px-3 py-2 font-medium text-violet-200">
                          <strong>Why it works:</strong> {layer.visualPrinciple}
                        </div>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right 6 Cols: Live Annotated Canvas Stage */}
            <div className="flex flex-col items-center rounded-3xl border border-violet-500/30 bg-[#111524] p-6 shadow-2xl sm:p-8 lg:col-span-6">
              <div className="mb-4 flex w-full items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="font-bold text-violet-300">
                  ACTIVE INSPECTION: {activeLayer.step} — {activeLayer.title}
                </span>
                <span className="font-mono text-emerald-400">
                  {activeLayer.ctrImpact}
                </span>
              </div>

              {showcaseVariation && (
                <div className="relative flex justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#080A11] p-4 shadow-glow">
                  <DesignCanvasRenderer
                    width={showcaseVariation.width}
                    height={showcaseVariation.height}
                    document={showcaseVariation.document}
                    scale={0.35}
                  />
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 w-full rounded-2xl border border-white/10 bg-[#080A11] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {activeLayer.title}
                    </span>
                    <Link
                      href="/dashboard/editor"
                      className="text-xs font-bold text-violet-400 hover:text-violet-300"
                    >
                      Edit This Layer in Studio →
                    </Link>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {activeLayer.visualPrinciple}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE VISUAL ROI & TIME-SAVED SIMULATOR */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#131728] via-[#101320] to-[#161229] p-6 shadow-2xl sm:p-12 lg:grid-cols-12">
            {/* Left 6 Cols: Interactive Sliders */}
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
                <DollarSign className="h-3.5 w-3.5" />
                <span>INTERACTIVE ROI &amp; VELOCITY CALCULATOR</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Calculate How Much Time &amp; Design Budget You Reclaim
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Drag the sliders to match your weekly product updates or client
                post volume. Compare manual Figma/Canva production against
                SnapPost AI&apos;s 38-second workflow.
              </p>

              <div className="space-y-5 pt-2">
                <div className="rounded-2xl border border-white/10 bg-[#090C15] p-5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">
                      Screenshots / Updates Shipped per Week
                    </span>
                    <span className="rounded-lg bg-violet-600/20 px-3 py-1 font-mono text-sm text-violet-300">
                      {postsPerWeek} updates / wk
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={postsPerWeek}
                    onChange={(e) => setPostsPerWeek(Number(e.target.value))}
                    aria-label="Screenshots shipped per week"
                    className="mt-3 w-full cursor-pointer"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#090C15] p-5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">
                      Social Platforms Targeted per Update
                    </span>
                    <span className="rounded-lg bg-cyan-500/20 px-3 py-1 font-mono text-sm text-cyan-300">
                      {channelsPerPost} platforms
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={channelsPerPost}
                    onChange={(e) => setChannelsPerPost(Number(e.target.value))}
                    aria-label="Social platforms targeted per update"
                    className="mt-3 w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Visual Output Dashboard */}
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              <div className="rounded-2xl border border-white/10 bg-[#090C15] p-6">
                <div className="text-xs font-semibold text-slate-400">
                  Monthly Social Assets Generated
                </div>
                <div className="mt-2 font-mono text-4xl font-extrabold text-white">
                  {totalAssetsPerMonth}
                </div>
                <div className="mt-1 text-xs text-violet-300">
                  Across {channelsPerPost} native aspect ratios
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <div className="text-xs font-semibold text-emerald-200">
                  Design Hours Saved / Month
                </div>
                <div className="mt-2 font-mono text-4xl font-extrabold text-emerald-400">
                  {hoursSavedPerMonth} hrs
                </div>
                <div className="mt-1 text-xs text-emerald-200/80">
                  vs. {manualHoursPerMonth} hrs manual Figma work
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                      Estimated Annual Design Bandwidth Saved
                    </div>
                    <div className="mt-1 font-mono text-4xl font-extrabold text-white sm:text-5xl">
                      ${annualDesignSavingsUsd.toLocaleString()}
                      <span className="text-base font-normal text-slate-400">
                        {" "}
                        / year
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      Based on $65/hr average SaaS designer &amp; copywriter
                      hourly rate.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500 sm:text-sm"
                  >
                    <span>Reclaim Your Time Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISUAL WORKFLOW COMPARISON (OLD WAY VS SNAPPOST AI) */}
      <section className="border-t border-white/10 bg-[#0B0E18] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Workflow Transformation
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              45 Minutes of Manual Friction vs. 38 Seconds of Flow
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Old Manual Pipeline */}
            <div className="rounded-3xl border border-red-500/25 bg-[#12131C] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-bold text-white">
                    Manual Screenshot-to-Social Workflow
                  </h3>
                </div>
                <span className="rounded-full bg-red-500/15 px-3 py-1 font-mono text-xs font-bold text-red-300">
                  ~45 Mins / Post
                </span>
              </div>

              <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                {[
                  "1. Take a raw browser screenshot with awkward aspect ratio & clutter.",
                  "2. Open Figma or Canva, hunt for a dark-mode device mockup frame.",
                  "3. Manually eyedropper brand colors and align padding/shadows.",
                  "4. Stare at a blank cursor trying to write a LinkedIn hook & X thread.",
                  "5. Duplicate artboards 5 times to resize for IG, LinkedIn, and X.",
                  "6. Export files one by one and manually copy-paste captions.",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 p-3.5 text-slate-400"
                  >
                    <XCircle className="h-4 w-4 shrink-0 text-red-400/80" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SnapPost AI Pipeline */}
            <div className="rounded-3xl border border-emerald-500/35 bg-gradient-to-b from-[#131C26] to-[#101522] p-6 shadow-glow sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">
                    The SnapPost AI Automated Studio
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                  38 Secs / Campaign
                </span>
              </div>

              <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                {[
                  "1. Drag & drop any PNG, JPG, or WebP screenshot into SnapPost AI.",
                  "2. Gemini 3.8 Vision extracts real KPIs, features, and brand hex palette.",
                  "3. Instantly generates 3–5 distinct agency layout variations.",
                  "4. Writes 5 headlines, 3 hooks, and 3 platform-native captions.",
                  "5. Fine-tune any text or layer on the live 60fps Visual Editor canvas.",
                  "6. 1-click Ultra-HD PNG/JPEG/WebP or complete multi-asset ZIP download.",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VISUALLY SHOW TARGET CUSTOMERS & SUPPORTED PLATFORMS */}
      <div className="py-24">
        <TargetCustomersAndPlatforms />
      </div>

      {/* SECTION 5: FLUID CAROUSEL MOVING REVIEW SECTION */}
      <ReviewCarouselSection />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06080E] py-12 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">SnapPost AI</span>
            <span>• Visual Benefits (/benefits)</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-white">
              Classic Landing (/)
            </Link>
            <Link href="/app" className="hover:text-white">
              Fluid Showcase (/app)
            </Link>
            <Link href="/benefits" className="text-violet-400 hover:text-white">
              Visual Benefits (/benefits)
            </Link>
            <Link href="/dashboard/create" className="hover:text-white">
              Create Post
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
