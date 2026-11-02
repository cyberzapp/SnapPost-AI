"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  ArrowRight,
  Layers,
  CheckCircle2,
  Sliders,
  Download,
  Palette,
  Eye,
  Compass,
  CalendarClock,
  ThumbsUp,
  Briefcase,
  FileText,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { CONTENT_STYLES } from "@/lib/constants";
import { SiteHeader, SiteFooter } from "@/components/marketing/SiteHeader";
import { HeroScreenshotCarousel } from "@/components/marketing/HeroScreenshotCarousel";
import {
  MovingResultsCarousel,
  RESULT_CARDS,
} from "@/components/marketing/ShowcaseVisuals";
import { TargetCustomersAndPlatforms } from "@/components/marketing/TargetCustomersAndPlatforms";
import { ReviewCarouselSection } from "@/components/marketing/ReviewCarouselSection";

interface ExpertServiceItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  deliverables: string[];
  metricHighlight: string;
}

const EXPERT_SERVICES: ExpertServiceItem[] = [
  {
    id: "srv-vision",
    badge: "01 • Smart Screenshot Reading",
    title: "Automatic Screenshot & Metric Detection",
    description:
      "Upload any product dashboard, growth chart, or app screen. SnapPost AI identifies your key numbers, headings, and brand colors automatically so your post highlights what matters most.",
    icon: Eye,
    accent: "from-violet-600 to-indigo-600",
    deliverables: [
      "Finds key revenue & growth numbers",
      "Matches your product's color palette",
      "Keeps your original screenshot 100% sharp",
    ],
    metricHighlight: "Zero Manual Cropping",
  },
  {
    id: "srv-layouts",
    badge: "02 • Studio Framing & Layouts",
    title: "Multi-Layout Visual Composition",
    description:
      "Every run creates up to 5 distinct layout designs—including Split Hero, Angled Frame, Floating Highlights, and Top Banner—styled for modern feeds.",
    icon: Layers,
    accent: "from-fuchsia-600 to-pink-600",
    deliverables: [
      "5 distinct layout options per run",
      "12 curated design presets",
      "Clean browser & mobile device frames",
    ],
    metricHighlight: "5 Layouts in 1 Click",
  },
  {
    id: "srv-copy",
    badge: "03 • Platform-Ready Captions",
    title: "Tailored Social Copy & Opening Hooks",
    description:
      "Get ready-to-post captions written specifically for LinkedIn, X, Instagram, Facebook, or Pinterest—complete with 5 headline options and 3 opening hooks.",
    icon: FileText,
    accent: "from-cyan-500 to-blue-600",
    deliverables: [
      "5 headline options & 3 opening hooks",
      "Full post caption matched to each network",
      "Relevant hashtags & call-to-action buttons",
    ],
    metricHighlight: "Ready-to-Post Copy",
  },
  {
    id: "srv-editor",
    badge: "04 • Live Canvas Customization",
    title: "Interactive Drag-and-Drop Layer Editor",
    description:
      "Want to adjust a headline, move a highlight badge, or fine-tune background lighting? Click any element on the canvas to customize it before downloading.",
    icon: Sliders,
    accent: "from-emerald-500 to-teal-600",
    deliverables: [
      "Drag-and-drop text, badge, and image layers",
      "Live font size, spacing, and shadow controls",
      "Instant undo & redo history",
    ],
    metricHighlight: "Full Creative Control",
  },
  {
    id: "srv-brandkit",
    badge: "05 • Saved Brand Kits",
    title: "Multi-Brand & Client Style Management",
    description:
      "Save your company or client logos, primary and accent colors, font pairings, and default call-to-action buttons so every post stays on brand.",
    icon: Palette,
    accent: "from-amber-500 to-orange-600",
    deliverables: [
      "Unlimited saved Brand Kits for teams & agencies",
      "One-click brand color and logo application",
      "Consistent fonts across every campaign",
    ],
    metricHighlight: "100% Brand Consistency",
  },
  {
    id: "srv-export",
    badge: "06 • Multi-Size Batch Download",
    title: "High-Resolution PNG, JPG & ZIP Export",
    description:
      "Download crisp 1x or 2x high-resolution graphics for individual networks, or export all variations and captions together in a single organized ZIP archive.",
    icon: Download,
    accent: "from-blue-600 to-violet-600",
    deliverables: [
      "8 social sizes from 1:1 square to 9:16 vertical",
      "Up to 2x high-DPI export clarity",
      "One-click ZIP bundle with captions included",
    ],
    metricHighlight: "8 Sizes in Seconds",
  },
];

interface UpcomingFeatureItem {
  id: string;
  quarter: string;
  status: "In Beta" | "In Progress" | "Planned";
  category: "Video & Motion" | "Publishing" | "Team Workflow" | "Automation";
  title: string;
  description: string;
  initialVotes: number;
}

const UPCOMING_FEATURES: UpcomingFeatureItem[] = [
  {
    id: "up-1",
    quarter: "Q2 2026",
    status: "In Beta",
    category: "Video & Motion",
    title: "Animated MP4 & Reel Video Exports",
    description:
      "Turn static product screenshots into 60fps animated MP4 videos with smooth zoom pans and animated highlight badges for Reels, LinkedIn Video, and X.",
    initialVotes: 418,
  },
  {
    id: "up-2",
    quarter: "Q2 2026",
    status: "In Beta",
    category: "Publishing",
    title: "Direct Social Scheduling & Auto-Posting",
    description:
      "Connect your LinkedIn, X, Instagram, and Pinterest accounts to schedule or publish your designed graphics and captions directly from SnapPost AI.",
    initialVotes: 389,
  },
  {
    id: "up-3",
    quarter: "Q3 2026",
    status: "In Progress",
    category: "Automation",
    title: "URL-to-Post Automatic Screenshot Capture",
    description:
      "Paste any public webpage, changelog URL, or Stripe milestone link—SnapPost captures a clean high-resolution screenshot and designs your social kit.",
    initialVotes: 312,
  },
  {
    id: "up-4",
    quarter: "Q3 2026",
    status: "In Progress",
    category: "Team Workflow",
    title: "Multi-Slide LinkedIn PDF & Instagram Carousel Builder",
    description:
      "Upload 3 to 8 product screenshots and generate a cohesive multi-slide swipeable carousel (LinkedIn PDF document & Instagram 10-slide sequence).",
    initialVotes: 364,
  },
  {
    id: "up-5",
    quarter: "Q3 2026",
    status: "Planned",
    category: "Team Workflow",
    title: "Shared Team Workspaces & Client Review Links",
    description:
      "Invite teammates or agency clients to review generated social drafts, leave comments on layers, and approve posts with one click.",
    initialVotes: 247,
  },
  {
    id: "up-6",
    quarter: "Q4 2026",
    status: "Planned",
    category: "Automation",
    title: "GitHub Release & Linear Webhook Automation",
    description:
      "Automatically draft branded release visuals and social posts whenever your team publishes a GitHub release or completes a milestone.",
    initialVotes: 295,
  },
];

const CATEGORY_GROUPS = [
  {
    id: "all",
    label: "All 12 Categories",
    presetIds: CONTENT_STYLES.map((p) => p.id),
    cardIndex: 0,
  },
  {
    id: "saas-product",
    label: "Product & SaaS",
    presetIds: [
      "Minimal SaaS",
      "Product Update",
      "Feature Highlight",
      "Startup Announcement",
    ],
    cardIndex: 0,
  },
  {
    id: "growth-launch",
    label: "Growth & Launches",
    presetIds: [
      "Premium Product Launch",
      "Promotional Campaign",
      "Before & After",
      "Bold Typography",
    ],
    cardIndex: 1,
  },
  {
    id: "brand-editorial",
    label: "Brand & Editorial",
    presetIds: ["Modern Editorial", "Clean Corporate"],
    cardIndex: 4,
  },
  {
    id: "mobile-dev",
    label: "Mobile & Developer",
    presetIds: ["App Showcase", "Developer Showcase"],
    cardIndex: 3,
  },
];

export default function ShowcaseAppLandingPage() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [selectedPresetId, setSelectedPresetId] =
    useState<string>("Minimal SaaS");
  const [roadmapFilter, setRoadmapFilter] = useState<string>("All");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const activeCategoryGroup =
    CATEGORY_GROUPS.find((g) => g.id === activeCategoryTab) ||
    CATEGORY_GROUPS[0];

  const visiblePresets = CONTENT_STYLES.filter((preset) =>
    activeCategoryGroup.presetIds.includes(preset.id)
  );

  const activePreset =
    CONTENT_STYLES.find((p) => p.id === selectedPresetId) || CONTENT_STYLES[0];

  const activePreviewCard =
    RESULT_CARDS[activeCategoryGroup.cardIndex] || RESULT_CARDS[0];

  const filteredRoadmap =
    roadmapFilter === "All"
      ? UPCOMING_FEATURES
      : UPCOMING_FEATURES.filter((item) => item.status === roadmapFilter);

  const toggleUpvote = (id: string) => {
    setUpvotedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 selection:bg-violet-600 selection:text-white">
      {/* Shared Header with 4 Main Hover Mega-Menus */}
      <SiteHeader />

      {/* 1. HERO: PLAIN GROWTH GRAPH SCREENSHOT -> SLOW ZOOM OUT -> 3D CAROUSEL */}
      <HeroScreenshotCarousel />

      {/* 2. SMOOTH ANIMATED HORIZONTAL CAROUSEL OF GENERATED RESULTS */}
      <MovingResultsCarousel />

      {/* 3. OUR EXPERT SERVICES SECTION */}
      <section
        id="expert-services"
        className="relative bg-[#0B0D14] py-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.08),_transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
                <Briefcase className="h-3.5 w-3.5 text-violet-400" />
                <span>OUR EXPERT SERVICES</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Everything Needed to Turn Screenshots into Social Growth
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                From reading your growth numbers to framing your screenshot and
                writing platform-specific captions, every step is handled for
                you.
              </p>
            </div>
            <Link
              href="/benefits"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-300 transition hover:bg-violet-500/20"
            >
              <span>See Visual Benefits &amp; Time Saved</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXPERT_SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#121520]/90 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-glow"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-violet-400">
                        {srv.badge}
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        {srv.metricHighlight}
                      </span>
                    </div>

                    <div
                      className={`mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${srv.accent} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-white">
                      {srv.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                    {srv.deliverables.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DESIGN CATEGORIES EXPLORER */}
      <section
        id="categories"
        className="relative bg-[#0B0D14] py-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(217,70,239,0.06),_transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1 text-xs font-semibold text-fuchsia-300">
              <Compass className="h-3.5 w-3.5 text-fuchsia-400" />
              <span>12 CURATED DESIGN CATEGORIES</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Pick the Right Style for Every Announcement
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Browse 12 purpose-built visual categories—each tuned with clean
              typography, balanced spacing, and platform-ready framing.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_GROUPS.map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => {
                  setActiveCategoryTab(grp.id);
                  setSelectedPresetId(grp.presetIds[0]);
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                  activeCategoryTab === grp.id
                    ? "bg-violet-600 text-white shadow-glow"
                    : "border border-white/10 bg-[#121520] text-slate-300 hover:border-white/25 hover:text-white"
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
            {/* Left 7 Cols: Category Cards Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2 lg:col-span-7">
              {visiblePresets.map((preset) => {
                const isSelected = preset.id === activePreset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-violet-500 bg-[#171B2E] shadow-glow"
                        : "border-white/10 bg-[#121520] hover:border-white/25 hover:bg-[#151928]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          style={{ backgroundColor: preset.accentHex }}
                          className="inline-block h-3 w-10 rounded-full"
                        />
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                          {preset.badge}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-white">
                        {preset.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {preset.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-violet-400">
                      <span>Preview Category</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 5 Cols: Live Category Preview Stage */}
            <div className="sticky top-24 rounded-3xl border border-violet-500/30 bg-[#121520] p-6 shadow-2xl lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24 }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                        Selected Style Category
                      </span>
                      <h4 className="text-lg font-extrabold text-white">
                        {activePreset.name}
                      </h4>
                    </div>
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                      {activePreset.badge}
                    </span>
                  </div>

                  {/* Studio Card Visual */}
                  <div className="mx-auto mt-5 h-[285px] w-full max-w-[275px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                    {activePreviewCard.render()}
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-300">
                    {activePreset.description}
                  </p>

                  <div className="mt-5">
                    <Link
                      href={`/dashboard/create?style=${activePreset.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500"
                    >
                      <Wand2 className="h-4 w-4" />
                      <span>Use &ldquo;{activePreset.name}&rdquo; Preset</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISUALLY SHOW TARGET CUSTOMERS & SUPPORTED PLATFORMS */}
      <div className="py-24">
        <TargetCustomersAndPlatforms />
      </div>

      {/* 6. UPCOMING FEATURES & PRODUCT ROADMAP */}
      <section
        id="upcoming"
        className="relative bg-[#0B0D14] py-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06),_transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
                <CalendarClock className="h-3.5 w-3.5 text-emerald-400" />
                <span>UPCOMING FEATURES &amp; ROADMAP</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                What We Are Building Next
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Vote on upcoming features to help prioritize what our team
                releases next.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "In Beta", "In Progress", "Planned"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setRoadmapFilter(st)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    roadmapFilter === st
                      ? "bg-violet-600 text-white shadow-glow"
                      : "border border-white/10 bg-[#121520] text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoadmap.map((item) => {
              const isVoted = Boolean(upvotedIds[item.id]);
              const count = item.initialVotes + (isVoted ? 1 : 0);

              const statusColor =
                item.status === "In Beta"
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                  : item.status === "In Progress"
                  ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                  : "border-sky-500/30 bg-sky-500/15 text-sky-300";

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#121520] p-6 transition hover:border-violet-500/35"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full border px-3 py-0.5 text-[11px] font-bold ${statusColor}`}
                      >
                        {item.status}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        {item.quarter} • {item.category}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-slate-400">
                      Community Priority
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleUpvote(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
                        isVoted
                          ? "border-violet-500 bg-violet-600 text-white shadow-glow"
                          : "border-white/15 bg-white/5 text-slate-200 hover:border-violet-400/50 hover:bg-white/10"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{isVoted ? "Voted" : "Vote"}</span>
                      <span className="ml-1 rounded bg-black/25 px-1.5 py-0.5 font-mono text-[11px]">
                        {count}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. REALISTIC MOVING CUSTOMER REVIEW CAROUSEL */}
      <ReviewCarouselSection />

      {/* 8. BOTTOM CALL TO ACTION */}
      <section className="relative overflow-hidden bg-[#0B0D14] py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/70 via-[#121520] to-indigo-950/60 p-10 shadow-2xl sm:p-14">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-200">
              <Zap className="h-3.5 w-3.5 text-violet-300" />
              <span>START IN SECONDS</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to Turn Your Product Screenshots into High-Performing Posts?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Start with 3 free social posts every month, or explore how much
              time and design budget your team can save on our visual Benefits
              page.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-sm font-bold text-white shadow-glow transition hover:bg-violet-500"
              >
                <Wand2 className="h-4 w-4" />
                <span>Create Your First Post Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/benefits"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                <ShieldCheck className="h-4 w-4 text-violet-400" />
                <span>Explore Visual Benefits</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <SiteFooter />
    </div>
  );
}
