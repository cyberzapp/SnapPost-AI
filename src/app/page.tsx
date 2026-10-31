"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Wand2,
  Download,
  Palette,
  CheckCircle2,
  Eye,
  Sliders,
  Zap,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  FileText,
  UploadCloud,
} from "lucide-react";
import {
  CONTENT_STYLES,
  DEMO_SAAS_SCREENSHOT_DATA_URL,
  PRICING_PLANS,
  SOCIAL_PLATFORMS,
} from "@/lib/constants";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import { useAppStore } from "@/lib/store";

export default function LandingPage() {
  const { user, projects } = useAppStore();
  const [compareMode, setCompareMode] = useState<"split" | "before" | "after">(
    "split"
  );
  const [sliderPos, setSliderPos] = useState(52);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const sampleVariations = projects[0]?.variations || [];

  const faqs = [
    {
      q: "How does SnapPost AI turn a plain screenshot into a designed social post?",
      a: "When you upload a screenshot of your SaaS dashboard, web app, or mobile interface, our AI Vision engine inspects the layout, visible features, brand colors, and product value proposition. It then composes 3–5 editable multi-layer social designs with studio-grade browser framing, typographic hierarchy, and platform-native captions.",
    },
    {
      q: "Does SnapPost AI distort or replace my uploaded product screenshot?",
      a: "Never. Your actual screenshot remains the visual proof at the heart of every generated variation. We wrap it in crisp macOS, glass, or minimal device frames with balanced padding, headline callouts, and ambient brand lighting.",
    },
    {
      q: "Can I edit the text, colors, and layout after AI generation?",
      a: "Yes. Every generated post opens in our full Visual Design Editor where you can drag layers, edit headlines, swap backgrounds, adjust typography, add shapes or badges, undo/redo changes, and save versions.",
    },
    {
      q: "What image formats and dimensions can I export?",
      a: "You can export individual variations or batch-download all variations as a ZIP file in PNG, JPEG, or WebP at exact native dimensions for Instagram (1080×1080, 1080×1350, 1080×1920), LinkedIn (1200×1200, 1200×627), X/Twitter (1600×900), Facebook (1200×630), and Pinterest (1000×1500).",
    },
    {
      q: "How does the AI credit system work?",
      a: "Each AI action has a transparent credit cost: Screenshot Vision Analysis costs 1 credit, AI Platform Copy Generation costs 1 credit, and Generating or Regenerating 3–5 Design Variations costs 2 credits. Editing and exporting saved designs is always free.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 selection:bg-violet-600/30">
      {/* Top Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SnapPost <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              className="transition-colors hover:text-white"
            >
              Before &amp; After
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-white"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Dashboard ({user.creditsBalance} cr)
                </Link>
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
                >
                  <span>Create Post</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-14 pb-24 lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.22),_transparent_70%)]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>AI VISION + STUDIO DESIGN ENGINE FOR FOUNDERS &amp; TEAMS</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:leading-[1.08]">
              Turn Any Screenshot Into{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                Scroll-Stopping Social Content.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Upload a raw screenshot of your SaaS dashboard, web app, or
              product interface. SnapPost AI analyzes what your product does,
              generates agency-grade social designs, writes platform-native
              captions, and lets you customize every layer before exporting in
              Ultra-HD.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard/create"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:bg-violet-500 sm:w-auto"
              >
                <span>Create Your First Post</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-slate-200 transition hover:bg-white/10 sm:w-auto"
              >
                <span>See How It Works</span>
              </a>
            </div>
          </div>

          {/* Interactive Hero Before & After Visual Transformation Showcase */}
          <div
            id="showcase"
            className="mt-16 rounded-2xl border border-white/10 bg-[#121520]/90 p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Interactive Transformation Preview
                </span>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Raw Product Screenshot → Agency-Designed Social Asset
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0B0D14] p-1">
                <button
                  type="button"
                  onClick={() => setCompareMode("before")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    compareMode === "before"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  1. Raw Screenshot
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("split")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    compareMode === "split"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Interactive Split
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode("after")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    compareMode === "after"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  2. SnapPost AI Output
                </button>
              </div>
            </div>

            {compareMode === "split" && (
              <div className="grid items-center gap-8 lg:grid-cols-12">
                {/* Left: Raw unstyled screenshot */}
                <div className="lg:col-span-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-amber-400">
                      BEFORE: Plain Browser Grab
                    </span>
                    <span>No context • Low CTR</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#090B10] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={DEMO_SAAS_SCREENSHOT_DATA_URL}
                      alt="Raw SaaS Dashboard Screenshot"
                      className="w-full rounded-lg border border-white/5 opacity-85"
                    />
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#0B0D14] p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>AI Vision Extraction Slider</span>
                      <span className="font-mono text-violet-400">
                        {sliderPos}% framing intensity
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="mt-2 w-full cursor-pointer"
                      aria-label="Adjust framing preview intensity"
                    />
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <span className="rounded-md bg-violet-500/15 px-2.5 py-1 text-violet-300">
                        ✓ Detected: $1.48M ARR Telemetry
                      </span>
                      <span className="rounded-md bg-blue-500/15 px-2.5 py-1 text-blue-300">
                        ✓ Detected: 134.8% Net Retention
                      </span>
                      <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-emerald-300">
                        ✓ Brand Palette Extracted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Arrow */}
                <div className="flex flex-col items-center justify-center lg:col-span-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-600/20 text-violet-300 shadow-glow">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <span className="mt-2 text-center text-xs font-semibold text-violet-300">
                    AI Vision + Layout Engine
                  </span>
                </div>

                {/* Right: Live Rendered Social Post */}
                <div className="flex flex-col items-center lg:col-span-5">
                  <div className="mb-2 flex w-full items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-emerald-400">
                      AFTER: Scroll-Stopping LinkedIn / IG Post
                    </span>
                    <span>1200 × 1200 Ready</span>
                  </div>
                  {sampleVariations[0] && (
                    <div className="flex justify-center overflow-hidden rounded-xl border border-violet-500/30 bg-[#090B10] p-3 shadow-glow">
                      <DesignCanvasRenderer
                        width={sampleVariations[0].width}
                        height={sampleVariations[0].height}
                        document={sampleVariations[0].document}
                        scale={0.32}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {compareMode === "before" && (
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 text-sm text-slate-400">
                  Ordinary screenshots blend into busy feeds because they lack a
                  value-driven hook, contrast framing, and visual hierarchy:
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DEMO_SAAS_SCREENSHOT_DATA_URL}
                  alt="Raw Screenshot"
                  className="mx-auto max-h-[420px] rounded-xl border border-white/10"
                />
              </div>
            )}

            {compareMode === "after" && sampleVariations[0] && (
              <div className="flex flex-col items-center">
                <p className="mb-4 text-sm text-slate-300">
                  SnapPost AI wraps your interface in a customizable multi-layer
                  composition with AI-crafted headlines and CTAs:
                </p>
                <DesignCanvasRenderer
                  width={sampleVariations[0].width}
                  height={sampleVariations[0].height}
                  document={sampleVariations[0].document}
                  scale={0.42}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SUPPORTED PLATFORMS SECTION */}
      <section className="border-y border-white/10 bg-[#0E111B] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Pixel-Perfect Native Dimensions
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Engineered for Every Major Social Platform
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Select your target channel and SnapPost AI automatically adapts
              aspect ratios, typography scaling, and caption style.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {SOCIAL_PLATFORMS.map((plat) => (
              <Link
                href={`/dashboard/create?platform=${plat.id}`}
                key={plat.id}
                className="group flex flex-col items-center justify-between rounded-xl border border-white/10 bg-[#141826] p-4 text-center transition hover:border-violet-500/50 hover:bg-[#191E30]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400 group-hover:bg-violet-600 group-hover:text-white">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {plat.name}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
                    {plat.width}×{plat.height}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 5-STEP WORKFLOW */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              5-Step Creative Pipeline
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              From Raw Screenshot to Published Post in 60 Seconds
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-5">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop any PNG, JPG, or WebP screenshot of your website, SaaS dashboard, or mobile app.",
                icon: UploadCloud,
              },
              {
                step: "02",
                title: "Analyze",
                desc: "AI Vision inspects visible UI features, product category, brand colors, and marketing angles.",
                icon: Eye,
              },
              {
                step: "03",
                title: "Generate",
                desc: "Create 3–5 distinct social post variations plus platform-specific hooks, captions, and hashtags.",
                icon: Wand2,
              },
              {
                step: "04",
                title: "Customize",
                desc: "Fine-tune text, fonts, colors, frames, and layer positions in the interactive Visual Editor.",
                icon: Sliders,
              },
              {
                step: "05",
                title: "Export",
                desc: "Download crisp PNG, JPEG, or WebP assets individually or as a complete multi-variation ZIP.",
                icon: Download,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121520] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-violet-400">
                        STEP {item.step}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXAMPLE GENERATED POSTS SHOWCASE */}
      <section className="border-t border-white/10 bg-[#0E111B] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Multi-Variation Design Engine
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Explore Live Generated Variations
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Every screenshot generates multiple distinct layout archetypes —
                not just color swaps. Click any variation below to inspect it
                live.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleVariations.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveExampleIndex(i)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    activeExampleIndex === i
                      ? "bg-violet-600 text-white shadow-glow"
                      : "border border-white/10 bg-[#141826] text-slate-300 hover:text-white"
                  }`}
                >
                  Variation {i + 1}: {v.layoutArchetype}
                </button>
              ))}
            </div>
          </div>

          {sampleVariations[activeExampleIndex] && (
            <div className="mt-10 grid items-center gap-10 rounded-2xl border border-white/10 bg-[#121520] p-6 sm:p-10 lg:grid-cols-12">
              <div className="flex justify-center lg:col-span-7">
                <DesignCanvasRenderer
                  width={sampleVariations[activeExampleIndex].width}
                  height={sampleVariations[activeExampleIndex].height}
                  document={sampleVariations[activeExampleIndex].document}
                  scale={0.4}
                />
              </div>
              <div className="space-y-5 lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-md bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                  <span>
                    Archetype:{" "}
                    {sampleVariations[activeExampleIndex].layoutArchetype}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {sampleVariations[activeExampleIndex].name}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Preserves the uploaded screenshot inside a crisp browser frame
                  while pairing it with high-contrast headlines, verified UI
                  feature callout pills, and your saved Brand Kit palette.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                  <div className="rounded-lg border border-white/10 bg-[#0B0D14] p-3">
                    <div className="text-slate-400">Canvas Resolution</div>
                    <div className="mt-1 font-mono font-bold text-white">
                      {sampleVariations[activeExampleIndex].width} ×{" "}
                      {sampleVariations[activeExampleIndex].height} px
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#0B0D14] p-3">
                    <div className="text-slate-400">Editable Layers</div>
                    <div className="mt-1 font-mono font-bold text-white">
                      {
                        sampleVariations[activeExampleIndex].document.elements
                          .length
                      }{" "}
                      Vector &amp; Image Nodes
                    </div>
                  </div>
                </div>
                <div className="pt-3">
                  <Link
                    href={`/dashboard/editor?projectId=${projects[0]?.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    <span>Open This Design in Visual Editor</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Complete Creative Suite
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Everything You Need to Ship High-Converting Product Visuals
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Truthful AI Vision Analysis",
                desc: "Detects real visible UI components, metrics, and brand colors from your screenshot without hallucinating fake features.",
              },
              {
                icon: Layers,
                title: "12+ Agency Design Styles",
                desc: `Choose from ${CONTENT_STYLES.slice(0, 5)
                  .map((s) => s.name)
                  .join(", ")}, and more.`,
              },
              {
                icon: FileText,
                title: "Platform-Native AI Copywriter",
                desc: "Generates 5 headlines, 3 scroll-stopping hooks, 3 tailored captions, hashtags, and CTAs per social platform.",
              },
              {
                icon: Sliders,
                title: "Interactive Visual Layer Editor",
                desc: "Drag elements, edit typography, customize browser frames, reorder layers, and undo/redo changes on a live canvas.",
              },
              {
                icon: Palette,
                title: "Multi-Client Brand Kits",
                desc: "Store your brand logos, primary/secondary/accent hex colors, custom fonts, default CTAs, and brand voice.",
              },
              {
                icon: Download,
                title: "Ultra-HD PNG, JPEG, WebP & ZIP",
                desc: "Export individual designs or download all variations at once in a single ZIP archive at native social dimensions.",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-white/10 bg-[#121520] p-6 transition hover:border-violet-500/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section
        id="pricing"
        className="border-t border-white/10 bg-[#0E111B] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Transparent Credit Architecture
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Simple Pricing Built for Indie Makers &amp; Growth Teams
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#141826] p-1">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "USD"
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                USD ($) — Stripe
              </button>
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "INR"
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                INR (₹) — Razorpay
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`relative flex flex-col justify-between rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-violet-500 bg-[#15192B] shadow-glow"
                    : "border-white/10 bg-[#121520]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 right-6 rounded-full bg-violet-600 px-3.5 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {currency === "USD"
                        ? `$${plan.priceMonthly}`
                        : `₹${plan.priceInr.toLocaleString()}`}
                    </span>
                    <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-violet-400">
                    Includes {plan.creditsPerMonth} monthly AI credits
                  </div>

                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={
                    plan.tier === "FREE"
                      ? "/auth/register"
                      : `/dashboard/billing?plan=${plan.tier}`
                  }
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Frequently Asked Questions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Everything You Need to Know About SnapPost AI
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-white/10 bg-[#121520]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-violet-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/10 px-6 py-4 text-sm leading-relaxed text-slate-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#090B10] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">
              SnapPost <span className="text-violet-400">AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/create" className="hover:text-white">
              Create Post
            </Link>
            <Link href="/dashboard/templates" className="hover:text-white">
              Templates
            </Link>
            <Link href="/dashboard/billing" className="hover:text-white">
              Pricing &amp; Billing
            </Link>
            <Link href="/auth/login" className="hover:text-white">
              Sign In
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SnapPost AI Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
