"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Building2,
  Terminal,
  TrendingUp,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
  Layers,
  Share2,
} from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { SocialPlatformId } from "@/types";

interface TargetCustomerPersona {
  id: string;
  title: string;
  shortLabel: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeText: string;
  painPoint: string;
  snapPostSolution: string;
  keyMetrics: { label: string; value: string }[];
  idealStyles: string[];
  topPlatforms: string[];
  visualMockup: {
    sourceType: string;
    detectedSignals: string[];
    generatedHook: string;
    generatedCta: string;
  };
}

const TARGET_CUSTOMERS: TargetCustomerPersona[] = [
  {
    id: "saas-founders",
    title: "SaaS Founders & Indie Hackers",
    shortLabel: "SaaS Founders",
    tagline:
      "Turn weekly product updates, Stripe/ARR milestones, and feature drops into high-authority founder posts.",
    icon: Rocket,
    accentColor: "from-violet-600 to-indigo-600",
    badgeText: "Build-in-Public & Launches",
    painPoint:
      "Posting raw, uncropped browser screenshots that get ignored in busy feeds—or spending 45 minutes fighting Figma templates.",
    snapPostSolution:
      "Upload any dashboard grab. Gemini Vision extracts your real metrics, wraps your UI in a sleek dark-mode macOS frame, and writes an authentic Founder-style LinkedIn + X post.",
    keyMetrics: [
      { label: "Time per Launch Post", value: "35 sec" },
      { label: "Avg. Feed Engagement Lift", value: "+310%" },
      { label: "Design Bottleneck", value: "Eliminated" },
    ],
    idealStyles: [
      "Minimal SaaS",
      "Startup Announcement",
      "Premium Product Launch",
    ],
    topPlatforms: ["LinkedIn Post (1200×1200)", "X / Twitter (1600×900)"],
    visualMockup: {
      sourceType: "Live Revenue & Retention Dashboard",
      detectedSignals: [
        "$1.48M ARR Telemetry",
        "134.8% Net Dollar Retention",
        "Zero-Churn Cohort Curve",
      ],
      generatedHook:
        "We just crossed $1.48M ARR with 134.8% Net Retention. Here is the exact dashboard our team checks every morning:",
      generatedCta: "Try Interactive Demo →",
    },
  },
  {
    id: "agencies",
    title: "Social Media & Creative Agencies",
    shortLabel: "Agencies & Studios",
    tagline:
      "Scale multi-client social asset production 10x with dedicated Brand Kits and 1-click multi-format ZIP exports.",
    icon: Building2,
    accentColor: "from-fuchsia-600 to-rose-600",
    badgeText: "Multi-Client Scale",
    painPoint:
      "Manually resizing client screenshots across 8 aspect ratios and switching hex codes, fonts, and logos for every retainer account.",
    snapPostSolution:
      "Save unlimited client Brand Kits (logos, primary/accent hex colors, typography, default CTAs). Generate 5 layout variations and batch-download all formats as a clean ZIP.",
    keyMetrics: [
      { label: "Client Asset Throughput", value: "10x Faster" },
      { label: "Designer Hours Saved", value: "14+ hrs/wk" },
      { label: "Brand Consistency", value: "100% Locked" },
    ],
    idealStyles: ["Modern Editorial", "Clean Corporate", "Promotional Campaign"],
    topPlatforms: [
      "Instagram Portrait (1080×1350)",
      "LinkedIn Landscape (1200×627)",
      "Facebook Post (1200×630)",
    ],
    visualMockup: {
      sourceType: "Client Q4 Conversion & Attribution Portal",
      detectedSignals: [
        "4.8x Paid ROAS Lift",
        "Multi-Touch Funnel View",
        "Client Brand Palette Auto-Applied",
      ],
      generatedHook:
        "How our client unlocked 4.8x ROAS in 30 days by unifying attribution telemetry:",
      generatedCta: "Book Strategy Audit →",
    },
  },
  {
    id: "devtools",
    title: "Developer Advocates & AI Builders",
    shortLabel: "DevTools & AI",
    tagline:
      "Showcase benchmarks, CLI outputs, API latency graphs, and SDK releases with crisp dark-mode precision.",
    icon: Terminal,
    accentColor: "from-cyan-500 to-blue-600",
    badgeText: "Technical Credibility",
    painPoint:
      "Generic marketing tools ruin code readability or replace real technical proof with cheesy stock illustrations.",
    snapPostSolution:
      "Preserves 100% pixel clarity of your terminal, IDE, or latency chart while highlighting verified throughput numbers and writing crisp, zero-fluff technical copy.",
    keyMetrics: [
      { label: "UI Pixel Preservation", value: "100% Lossless" },
      { label: "X / Twitter Thread CTR", value: "4.6x Higher" },
      { label: "Hallucinated Features", value: "0% (Strict Guard)" },
    ],
    idealStyles: ["Developer Showcase", "Feature Highlight", "Product Update"],
    topPlatforms: ["X / Twitter (1600×900)", "LinkedIn Post (1200×1200)"],
    visualMockup: {
      sourceType: "Vector Query Latency & SDK Benchmark UI",
      detectedSignals: [
        "1.8ms P99 Query Latency",
        "99.99% Uptime SLA",
        "TypeScript SDK v2.4 Snippet",
      ],
      generatedHook:
        "1.8ms p99 vector search at 10M+ embeddings. v2.4 of our open-source SDK is officially live:",
      generatedCta: "npm i @edgevector/sdk →",
    },
  },
  {
    id: "growth-marketers",
    title: "Product & Growth Marketing Teams",
    shortLabel: "Growth Marketers",
    tagline:
      "Ship high-converting feature launches, before/after comparisons, and paid social ad creatives without design queues.",
    icon: TrendingUp,
    accentColor: "from-emerald-500 to-teal-600",
    badgeText: "High-CTR Campaigns",
    painPoint:
      "Waiting 4 days in the design backlog just to test 3 different headline angles for a new product feature launch.",
    snapPostSolution:
      "Instantly spin up 5 distinct visual archetypes with 5 AI headlines, 3 scroll-stopping hooks, and platform-tailored CTAs ready for organic & paid channels.",
    keyMetrics: [
      { label: "Creative Variations / Run", value: "Up to 5" },
      { label: "Copy Hooks per Platform", value: "5 Headlines + 3 Hooks" },
      { label: "Campaign Launch Delay", value: "0 Days" },
    ],
    idealStyles: [
      "Before & After",
      "Bold Typography",
      "Promotional Campaign",
    ],
    topPlatforms: [
      "LinkedIn Post (1200×1200)",
      "Instagram Post (1080×1080)",
      "Pinterest Pin (1000×1500)",
    ],
    visualMockup: {
      sourceType: "Automated Workflow Builder Interface",
      detectedSignals: [
        "1-Click Trigger Canvas",
        "84% Manual Task Reduction",
        "SOC2 Enterprise Badge",
      ],
      generatedHook:
        "Stop gluing spreadsheets together. Automate your entire onboarding pipeline in 3 clicks:",
      generatedCta: "Start 14-Day Free Trial →",
    },
  },
  {
    id: "mobile-ecommerce",
    title: "Mobile App & E-Commerce Creators",
    shortLabel: "Mobile & Creators",
    tagline:
      "Transform iOS/Android app screens and storefront interfaces into vertical Stories, Reels stills, and Pinterest Pins.",
    icon: Smartphone,
    accentColor: "from-amber-500 to-orange-600",
    badgeText: "Vertical & Visual Feeds",
    painPoint:
      "Vertical mobile screenshots look awkward on wide desktop feeds or lack context on Instagram Stories and Pinterest.",
    snapPostSolution:
      "Automatically centers mobile and storefront interfaces in glassmorphic frames with bold consumer-friendly hooks and vertical 9:16 / 4:5 layouts.",
    keyMetrics: [
      { label: "Native Aspect Ratios", value: "8 Formats" },
      { label: "Export Resolution", value: "Up to 2x Ultra-HD" },
      { label: "Visual Editor Layers", value: "100% Editable" },
    ],
    idealStyles: ["App Showcase", "Bold Typography", "Premium Product Launch"],
    topPlatforms: [
      "Instagram Story (1080×1920)",
      "Instagram Portrait (1080×1350)",
      "Pinterest Pin (1000×1500)",
    ],
    visualMockup: {
      sourceType: "iOS AI Habit & Wellness Coach Screen",
      detectedSignals: [
        "92% Daily Streak Score",
        "Glassmorphic Mobile Card",
        "Apple Watch Sync Indicator",
      ],
      generatedHook:
        "Meet your pocket AI wellness coach. 92% of users hit their 30-day streak:",
      generatedCta: "Download on App Store →",
    },
  },
];

const PLATFORM_META: Record<
  SocialPlatformId,
  {
    bestFor: string;
    copyStyle: string;
    hashtagGuide: string;
    accent: string;
  }
> = {
  "instagram-post": {
    bestFor: "Product carousels, visual feature highlights & brand grid aesthetics",
    copyStyle: "Punchy visual storytelling + clear bio link CTA",
    hashtagGuide: "6–10 niche discovery hashtags",
    accent: "from-pink-500 to-violet-600",
  },
  "instagram-portrait": {
    bestFor: "Maximum vertical feed real estate on mobile Instagram scrolling",
    copyStyle: "Hook-first caption with scannable bullet takeaways",
    hashtagGuide: "8–10 targeted creator & SaaS hashtags",
    accent: "from-fuchsia-500 to-rose-500",
  },
  "instagram-story": {
    bestFor: "Full-screen vertical launches, link-sticker promos & mobile UI demos",
    copyStyle: "Ultra-concise 1-line hook + interactive sticker space",
    hashtagGuide: "1–3 subtle story tags",
    accent: "from-amber-500 to-pink-600",
  },
  "linkedin-post": {
    bestFor: "B2B SaaS announcements, ARR milestones & founder thought-leadership",
    copyStyle: "High-signal operator hook + spaced insight paragraphs",
    hashtagGuide: "3–5 B2B industry hashtags",
    accent: "from-blue-500 to-indigo-600",
  },
  "linkedin-landscape": {
    bestFor: "Wide desktop dashboard showcases, link previews & company page updates",
    copyStyle: "Executive summary + data-backed value proposition",
    hashtagGuide: "3–5 professional hashtags",
    accent: "from-sky-500 to-blue-600",
  },
  "twitter-post": {
    bestFor: "Build-in-public drops, developer benchmarks, changelog threads & viral hooks",
    copyStyle: "Zero-fluff technical or founder hook under 280 chars",
    hashtagGuide: "1–2 high-velocity tags",
    accent: "from-cyan-400 to-blue-500",
  },
  "facebook-post": {
    bestFor: "Community group announcements, retargeting ads & broad product awareness",
    copyStyle: "Friendly benefit-led narrative + direct action link",
    hashtagGuide: "2–4 community hashtags",
    accent: "from-indigo-500 to-blue-700",
  },
  "pinterest-pin": {
    bestFor: "Evergreen UI inspiration boards, design showcases & long-tail discovery",
    copyStyle: "SEO keyword-rich title + benefit-focused description",
    hashtagGuide: "4–6 search-intent tags",
    accent: "from-rose-500 to-red-600",
  },
};

export function TargetCustomersAndPlatforms() {
  const [activePersonaId, setActivePersonaId] = useState<string>(
    TARGET_CUSTOMERS[0].id
  );
  const [selectedPlatformId, setSelectedPlatformId] =
    useState<SocialPlatformId>("linkedin-post");

  const activePersona =
    TARGET_CUSTOMERS.find((p) => p.id === activePersonaId) ||
    TARGET_CUSTOMERS[0];

  const activePlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatformId) ||
    SOCIAL_PLATFORMS[3];

  const activePlatformMeta = PLATFORM_META[activePlatform.id];

  // Calculate visual aspect box dimensions (max 220px)
  const maxBox = 210;
  const ratio = activePlatform.width / activePlatform.height;
  const boxWidth = ratio >= 1 ? maxBox : Math.round(maxBox * ratio);
  const boxHeight = ratio >= 1 ? Math.round(maxBox / ratio) : maxBox;

  return (
    <div className="space-y-28">
      {/* SECTION A: VISUALLY SHOW TARGET CUSTOMERS */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>BUILT FOR MODERN DIGITAL BUILDERS</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Visually Engineered for Every Creator &amp; Team Workflow
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Click any customer profile below to inspect how SnapPost AI
              transforms their raw screenshots into tailored, high-converting
              social assets.
            </p>
          </div>

          {/* Interactive Persona Selector Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {TARGET_CUSTOMERS.map((persona) => {
              const Icon = persona.icon;
              const isSelected = persona.id === activePersona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setActivePersonaId(persona.id)}
                  className={`group flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-bold transition-all sm:text-sm ${
                    isSelected
                      ? "border-violet-500 bg-gradient-to-r from-violet-600/30 to-blue-600/20 text-white shadow-glow"
                      : "border-white/10 bg-[#121520] text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${persona.accentColor} text-white`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{persona.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Visual Persona Showcase Stage */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="grid items-stretch gap-8 rounded-3xl border border-white/10 bg-[#121520]/95 p-6 shadow-2xl sm:p-10 lg:grid-cols-12"
              >
                {/* Left 6 Cols: Persona Deep-Dive & Impact Metrics */}
                <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
                      <span>{activePersona.badgeText}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                      {activePersona.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {activePersona.tagline}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                          ✗ The Old Bottleneck
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                          {activePersona.painPoint}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          ✓ With SnapPost AI
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                          {activePersona.snapPostSolution}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3 Visual Impact Metric Cards */}
                  <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                    {activePersona.keyMetrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-white/10 bg-[#0B0D14] p-3.5 text-center"
                      >
                        <div className="text-lg font-extrabold text-white sm:text-xl">
                          {m.value}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 6 Cols: Interactive Visual Pipeline Diagram for This Customer */}
                <div className="flex flex-col justify-between rounded-2xl border border-violet-500/30 bg-[#0B0D14] p-6 shadow-glow lg:col-span-6">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                        Live AI Transformation Blueprint
                      </span>
                      <span className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                        {activePersona.visualMockup.sourceType}
                      </span>
                    </div>

                    {/* Step 1: Extracted Visual Signals */}
                    <div className="mt-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        1. Gemini 3.8 Vision Extracted Signals
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activePersona.visualMockup.detectedSignals.map(
                          (sig) => (
                            <span
                              key={sig}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>{sig}</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Step 2: Generated Visual Social Card Mockup */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#161B2E] via-[#111524] to-[#1D1636] p-5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-400">
                          ● AUTO-COMPOSED SOCIAL POST PREVIEW
                        </span>
                        <span>{activePersona.topPlatforms[0]}</span>
                      </div>
                      <p className="mt-3 text-sm font-bold leading-snug text-white">
                        &ldquo;{activePersona.visualMockup.generatedHook}&rdquo;
                      </p>

                      {/* Mini Framed UI Representation */}
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-[#090B11] p-3">
                        <div className="mb-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                          <span className="ml-2 font-mono text-[10px] text-slate-500">
                            {activePersona.visualMockup.sourceType}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {activePersona.visualMockup.detectedSignals.map(
                            (sig, i) => (
                              <div
                                key={i}
                                className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-[10px] font-semibold text-slate-200"
                              >
                                {sig}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {activePersona.idealStyles.map((st) => (
                            <span
                              key={st}
                              className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                        <span className="rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-bold text-white">
                          {activePersona.visualMockup.generatedCta}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="text-xs text-slate-400">
                      Top Channels:{" "}
                      <span className="font-semibold text-slate-200">
                        {activePersona.topPlatforms.join(" • ")}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/create"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500"
                    >
                      <span>Try This Workflow</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION B: VISUALLY SHOW SUPPORTED PLATFORMS & ASPECT RATIOS */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-xs font-semibold text-sky-300">
              <Share2 className="h-3.5 w-3.5 text-sky-400" />
              <span>8 NATIVE SOCIAL DIMENSIONS &amp; SAFE ZONES</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Every Social Platform, Visually Proportioned &amp; Ready
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Select any platform below to see its true aspect-ratio geometry,
              typography scaling rules, and native copywriting structure.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: 8 Platform Interactive Grid */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:col-span-7">
              {SOCIAL_PLATFORMS.map((plat) => {
                const isSelected = plat.id === activePlatform.id;
                const meta = PLATFORM_META[plat.id];
                const platRatio = plat.width / plat.height;
                const miniW = platRatio >= 1 ? 44 : Math.round(44 * platRatio);
                const miniH = platRatio >= 1 ? Math.round(44 / platRatio) : 44;

                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setSelectedPlatformId(plat.id)}
                    className={`group flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-violet-500 bg-[#171C2E] shadow-glow"
                        : "border-white/10 bg-[#121520] hover:border-white/25 hover:bg-[#151928]"
                    }`}
                  >
                    {/* Proportional Visual Aspect Frame */}
                    <div className="flex h-14 w-full items-center justify-center">
                      <div
                        style={{ width: `${miniW}px`, height: `${miniH}px` }}
                        className={`flex items-center justify-center rounded-md border-2 transition-all ${
                          isSelected
                            ? `border-white bg-gradient-to-br ${meta.accent} shadow-md`
                            : "border-violet-400/50 bg-violet-500/10 group-hover:border-violet-400"
                        }`}
                      >
                        <span className="font-mono text-[9px] font-bold text-white">
                          {plat.aspectRatio}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs font-bold text-white">
                        {plat.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                        {plat.width} × {plat.height}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 5 Cols: Live Proportional Geometry Inspector */}
            <div className="rounded-3xl border border-white/10 bg-[#121520] p-6 shadow-2xl sm:p-8 lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlatform.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                        Active Format Spec
                      </span>
                      <h3 className="text-xl font-extrabold text-white">
                        {activePlatform.name}
                      </h3>
                    </div>
                    <span className="rounded-xl border border-violet-500/30 bg-violet-500/15 px-3 py-1 font-mono text-xs font-bold text-violet-300">
                      {activePlatform.width}×{activePlatform.height}px (
                      {activePlatform.aspectRatio})
                    </span>
                  </div>

                  {/* True Scale Visual Frame Preview */}
                  <div className="my-6 flex h-[230px] items-center justify-center rounded-2xl border border-white/10 bg-[#0B0D14] p-4">
                    <motion.div
                      layout
                      style={{
                        width: `${boxWidth}px`,
                        height: `${boxHeight}px`,
                      }}
                      className={`relative flex flex-col justify-between rounded-xl bg-gradient-to-br ${activePlatformMeta.accent} p-3 text-white shadow-2xl`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider opacity-90">
                        <span>Safe Header Zone</span>
                        <span>{activePlatform.aspectRatio}</span>
                      </div>
                      <div className="my-auto rounded-lg border border-white/30 bg-slate-950/65 p-2 text-center backdrop-blur-sm">
                        <Layers className="mx-auto h-4 w-4 text-violet-300" />
                        <div className="mt-1 text-[10px] font-bold">
                          Framed Screenshot Proof
                        </div>
                        <div className="font-mono text-[9px] text-slate-300">
                          {activePlatform.width} × {activePlatform.height}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-semibold opacity-90">
                        <span>Brand Kit Footer</span>
                        <span className="rounded bg-white/20 px-1.5 py-0.5">
                          CTA Pill →
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        Best Used For:{" "}
                      </span>
                      <span className="text-slate-200">
                        {activePlatformMeta.bestFor}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        AI Copy Architecture:{" "}
                      </span>
                      <span className="text-slate-200">
                        {activePlatformMeta.copyStyle}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        Hashtag Calibration:{" "}
                      </span>
                      <span className="text-violet-300">
                        {activePlatformMeta.hashtagGuide}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/dashboard/create?platform=${activePlatform.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span>
                        Generate {activePlatform.name} ({activePlatform.width}×
                        {activePlatform.height}) Post
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
