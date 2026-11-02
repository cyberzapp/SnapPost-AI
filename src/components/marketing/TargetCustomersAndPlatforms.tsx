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
  XCircle,
  LayoutGrid,
  Users,
  Layers,
  Share2,
} from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { SocialPlatformId } from "@/types";
import { RESULT_CARDS } from "./ShowcaseVisuals";

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
  sampleCardIndex: number;
  detectedHighlights: string[];
}

const TARGET_CUSTOMERS: TargetCustomerPersona[] = [
  {
    id: "saas-founders",
    title: "SaaS Founders & Indie Builders",
    shortLabel: "SaaS Founders",
    tagline:
      "Turn weekly product updates, revenue milestones, and feature releases into polished founder posts.",
    icon: Rocket,
    accentColor: "from-violet-600 to-indigo-600",
    badgeText: "Product Launches & Milestones",
    painPoint:
      "Posting plain, uncropped browser screenshots that get scrolled past—or spending 45 minutes adjusting templates in design tools.",
    snapPostSolution:
      "Upload any product screenshot. SnapPost AI highlights your real growth numbers, frames your screen cleanly, and writes a clear LinkedIn and X post.",
    keyMetrics: [
      { label: "Time per Post", value: "35 sec" },
      { label: "Average Reach Increase", value: "+310%" },
      { label: "Design Effort", value: "Zero" },
    ],
    idealStyles: [
      "Minimal SaaS",
      "Startup Announcement",
      "Premium Product Launch",
    ],
    topPlatforms: ["LinkedIn Post (1200 x 1200)", "X / Twitter (1600 x 900)"],
    sampleCardIndex: 0,
    detectedHighlights: [
      "$1.48M Annual Revenue",
      "134.8% Net Retention",
      "+38.4% Monthly Growth",
    ],
  },
  {
    id: "agencies",
    title: "Social Media & Creative Agencies",
    shortLabel: "Agencies & Studios",
    tagline:
      "Deliver client social graphics 10x faster using saved Brand Kits and one-click multi-size ZIP downloads.",
    icon: Building2,
    accentColor: "from-fuchsia-600 to-rose-600",
    badgeText: "Multi-Client Workflow",
    painPoint:
      "Manually resizing client screenshots across 8 social sizes and switching colors, fonts, and logos for every client account.",
    snapPostSolution:
      "Save unlimited client Brand Kits with logos, colors, fonts, and call-to-action buttons. Generate 5 clean variations and download all formats in one ZIP file.",
    keyMetrics: [
      { label: "Client Delivery Speed", value: "10x Faster" },
      { label: "Team Hours Saved", value: "14+ hrs/wk" },
      { label: "Brand Consistency", value: "100% Matched" },
    ],
    idealStyles: ["Modern Editorial", "Clean Corporate", "Promotional Campaign"],
    topPlatforms: [
      "Instagram Portrait (1080 x 1350)",
      "LinkedIn Landscape (1200 x 627)",
      "Facebook Post (1200 x 630)",
    ],
    sampleCardIndex: 4,
    detectedHighlights: [
      "3.8x Conversion Lift",
      "Client Brand Colors Applied",
      "8 Social Sizes Ready",
    ],
  },
  {
    id: "devtools",
    title: "Developer Teams & AI Builders",
    shortLabel: "Developers & AI",
    tagline:
      "Share speed benchmarks, code updates, API charts, and release notes with clean dark-mode presentation.",
    icon: Terminal,
    accentColor: "from-cyan-500 to-blue-600",
    badgeText: "Technical Launches",
    painPoint:
      "Generic design tools blur code text or replace real product screens with unrelated stock graphics.",
    snapPostSolution:
      "Keeps your code, terminal, or benchmark chart 100% sharp while adding dark-mode framing, highlight badges, and concise technical captions.",
    keyMetrics: [
      { label: "Screenshot Clarity", value: "100% Sharp" },
      { label: "X / Twitter Link Clicks", value: "4.6x Higher" },
      { label: "Setup Time", value: "Under 1 Min" },
    ],
    idealStyles: ["Developer Showcase", "Feature Highlight", "Product Update"],
    topPlatforms: ["X / Twitter (1600 x 900)", "LinkedIn Post (1200 x 1200)"],
    sampleCardIndex: 3,
    detectedHighlights: [
      "1.8ms Response Speed",
      "99.99% Uptime Verified",
      "SDK v2.4 Release Ready",
    ],
  },
  {
    id: "growth-marketers",
    title: "Product & Growth Marketing Teams",
    shortLabel: "Marketing Teams",
    tagline:
      "Launch feature announcements, before-and-after comparisons, and campaign visuals without waiting in a design queue.",
    icon: TrendingUp,
    accentColor: "from-emerald-500 to-teal-600",
    badgeText: "Campaign Launches",
    painPoint:
      "Waiting days for design help just to test different headlines and layouts for a weekly product campaign.",
    snapPostSolution:
      "Instantly create up to 5 layout designs with 5 tailored headlines, 3 opening hooks, and platform-ready captions for organic and paid posts.",
    keyMetrics: [
      { label: "Layout Options per Run", value: "Up to 5" },
      { label: "Headline & Hook Options", value: "8 per Post" },
      { label: "Design Wait Time", value: "0 Days" },
    ],
    idealStyles: [
      "Before & After",
      "Bold Typography",
      "Promotional Campaign",
    ],
    topPlatforms: [
      "LinkedIn Post (1200 x 1200)",
      "Instagram Post (1080 x 1080)",
      "Pinterest Pin (1000 x 1500)",
    ],
    sampleCardIndex: 1,
    detectedHighlights: [
      "84% Faster Onboarding",
      "4.8x Return on Ad Spend",
      "Instant Campaign Export",
    ],
  },
  {
    id: "mobile-ecommerce",
    title: "Mobile App & E-Commerce Creators",
    shortLabel: "Mobile & Creators",
    tagline:
      "Turn iOS, Android, and online store screenshots into vertical Stories, Portrait posts, and Pinterest Pins.",
    icon: Smartphone,
    accentColor: "from-amber-500 to-orange-600",
    badgeText: "Vertical & Mobile Formats",
    painPoint:
      "Vertical phone screenshots look awkward on desktop feeds or lack clear headlines on Instagram Stories and Pinterest.",
    snapPostSolution:
      "Centers mobile and store screens inside clean visual cards with clear headlines, benefit badges, and ready-to-share vertical layouts.",
    keyMetrics: [
      { label: "Supported Sizes", value: "8 Formats" },
      { label: "Export Quality", value: "Up to 2x HD" },
      { label: "Editable Layers", value: "100% Custom" },
    ],
    idealStyles: ["App Showcase", "Bold Typography", "Premium Product Launch"],
    topPlatforms: [
      "Instagram Story (1080 x 1920)",
      "Instagram Portrait (1080 x 1350)",
      "Pinterest Pin (1000 x 1500)",
    ],
    sampleCardIndex: 6,
    detectedHighlights: [
      "4.9 Star App Rating",
      "92% 30-Day Retention",
      "Mobile Portrait Ready",
    ],
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
    bestFor: "Square product showcases, feature highlights, and clean profile grids",
    copyStyle: "Clear visual story with a direct link-in-bio call to action",
    hashtagGuide: "6 to 10 relevant niche hashtags",
    accent: "from-pink-500 to-violet-600",
  },
  "instagram-portrait": {
    bestFor: "Maximum vertical screen space in mobile Instagram feeds",
    copyStyle: "Strong opening line followed by easy-to-scan bullet points",
    hashtagGuide: "8 to 10 targeted industry hashtags",
    accent: "from-fuchsia-500 to-rose-500",
  },
  "instagram-story": {
    bestFor: "Full-screen vertical launches, quick updates, and mobile app previews",
    copyStyle: "Short one-line headline with space for interactive link stickers",
    hashtagGuide: "1 to 3 story tags",
    accent: "from-amber-500 to-pink-600",
  },
  "linkedin-post": {
    bestFor: "Company announcements, growth milestones, and founder insights",
    copyStyle: "Professional opening hook with clear, spaced paragraphs",
    hashtagGuide: "3 to 5 industry hashtags",
    accent: "from-blue-500 to-indigo-600",
  },
  "linkedin-landscape": {
    bestFor: "Wide desktop dashboard previews, company updates, and article shares",
    copyStyle: "Clear summary focused on customer results and key takeaways",
    hashtagGuide: "3 to 5 professional hashtags",
    accent: "from-sky-500 to-blue-600",
  },
  "twitter-post": {
    bestFor: "Product launches, speed benchmarks, weekly updates, and thread starters",
    copyStyle: "Direct, concise headline and summary under 280 characters",
    hashtagGuide: "1 to 2 focused tags",
    accent: "from-cyan-400 to-blue-500",
  },
  "facebook-post": {
    bestFor: "Community updates, customer stories, and product awareness campaigns",
    copyStyle: "Friendly benefit-focused story with a clear action link",
    hashtagGuide: "2 to 4 community hashtags",
    accent: "from-indigo-500 to-blue-700",
  },
  "pinterest-pin": {
    bestFor: "Design inspiration boards, product collections, and long-term search traffic",
    copyStyle: "Search-friendly title paired with a clear benefit description",
    hashtagGuide: "4 to 6 topic keywords",
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

  const sampleCard =
    RESULT_CARDS[activePersona.sampleCardIndex] || RESULT_CARDS[0];

  const activePlatform =
    SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatformId) ||
    SOCIAL_PLATFORMS[3];

  const activePlatformMeta = PLATFORM_META[activePlatform.id];

  const maxBox = 210;
  const ratio = activePlatform.width / activePlatform.height;
  const boxWidth = ratio >= 1 ? maxBox : Math.round(maxBox * ratio);
  const boxHeight = ratio >= 1 ? Math.round(maxBox / ratio) : maxBox;

  return (
    <div className="space-y-28">
      {/* SECTION A: VISUALLY SHOW TARGET CUSTOMERS */}
      <section id="customers" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
              <Users className="h-3.5 w-3.5 text-violet-400" />
              <span>BUILT FOR MODERN TEAMS &amp; CREATORS</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Designed for the Way You Build and Share
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Select your role below to see how SnapPost AI turns your everyday
              screenshots into ready-to-publish social posts.
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
                {/* Left 6 Cols: Persona Overview & Metrics */}
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
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400">
                          <XCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>Without SnapPost AI</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                          {activePersona.painPoint}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>With SnapPost AI</span>
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

                {/* Right 6 Cols: Studio-Designed Post Preview for This Customer */}
                <div className="flex flex-col justify-between rounded-2xl border border-violet-500/30 bg-[#0B0D14] p-6 shadow-glow lg:col-span-6">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                        Generated Post Preview
                      </span>
                      <span className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] uppercase text-slate-300">
                        {sampleCard.title} • {sampleCard.platform}
                      </span>
                    </div>

                    {/* Highlighted Points */}
                    <div className="mt-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Key Details Automatically Highlighted
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activePersona.detectedHighlights.map((sig) => (
                          <span
                            key={sig}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{sig}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Studio-Designed Visual Card */}
                    <div className="mt-5 grid items-center gap-5 sm:grid-cols-12">
                      <div className="mx-auto h-[270px] w-[250px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:col-span-6 sm:w-full">
                        {sampleCard.render()}
                      </div>
                      <div className="space-y-3 sm:col-span-6">
                        <div className="rounded-xl border border-white/10 bg-[#121520] p-3.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                            Recommended Style Presets
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {activePersona.idealStyles.map((st) => (
                              <span
                                key={st}
                                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-200"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#121520] p-3.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Included in Export
                          </div>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>High-Resolution PNG &amp; JPG</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>5 Headlines &amp; 3 Opening Hooks</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Platform-Ready Caption &amp; Tags</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="text-xs text-slate-400">
                      Popular Formats:{" "}
                      <span className="font-semibold text-slate-200">
                        {activePersona.topPlatforms.join(" • ")}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/create"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500"
                    >
                      <span>Create This Post</span>
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
      <section id="platforms" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-xs font-semibold text-sky-300">
              <Share2 className="h-3.5 w-3.5 text-sky-400" />
              <span>8 READY-TO-PUBLISH SOCIAL SIZES</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Sized Perfectly for Every Social Network
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Click any social format below to preview its exact proportions,
              recommended content style, and hashtag guidance.
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
                        {plat.width} x {plat.height}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 5 Cols: Live Proportional Preview */}
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
                        Selected Format
                      </span>
                      <h3 className="text-xl font-extrabold text-white">
                        {activePlatform.name}
                      </h3>
                    </div>
                    <span className="rounded-xl border border-violet-500/30 bg-violet-500/15 px-3 py-1 font-mono text-xs font-bold text-violet-300">
                      {activePlatform.width} x {activePlatform.height}px (
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
                        <span>Headline Safe Zone</span>
                        <span>{activePlatform.aspectRatio}</span>
                      </div>
                      <div className="my-auto rounded-lg border border-white/30 bg-slate-950/65 p-2 text-center backdrop-blur-sm">
                        <Layers className="mx-auto h-4 w-4 text-violet-300" />
                        <div className="mt-1 text-[10px] font-bold">
                          Framed Product Screen
                        </div>
                        <div className="font-mono text-[9px] text-slate-300">
                          {activePlatform.width} x {activePlatform.height}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-semibold opacity-90">
                        <span>Brand Footer</span>
                        <span className="inline-flex items-center gap-0.5 rounded bg-white/20 px-1.5 py-0.5">
                          <span>Action Button</span>
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        Best For:{" "}
                      </span>
                      <span className="text-slate-200">
                        {activePlatformMeta.bestFor}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        Caption Style:{" "}
                      </span>
                      <span className="text-slate-200">
                        {activePlatformMeta.copyStyle}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                      <span className="font-semibold text-slate-400">
                        Recommended Hashtags:{" "}
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
                        Create {activePlatform.name} ({activePlatform.width} x{" "}
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
