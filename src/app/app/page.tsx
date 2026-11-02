"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  FileText,
  Palette,
  Sliders,
  Download,
  Rocket,
  Cpu,
  Smartphone,
  LineChart,
  ShoppingBag,
  Briefcase,
  Megaphone,
  GitBranch,
  CheckCircle2,
  ThumbsUp,
  Video,
  Globe,
  CalendarClock,
  BookOpen,
  Flame,
  Users,
  Wand2,
  Compass,
} from "lucide-react";
import { DEMO_SAAS_SCREENSHOT_DATA_URL } from "@/lib/constants";
import { generateDesignVariations } from "@/lib/design-engine";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import { useAppStore } from "@/lib/store";
import { LogoIcon } from "@/components/Logo";
import { TargetCustomersAndPlatforms } from "@/components/marketing/TargetCustomersAndPlatforms";
import { ReviewCarouselSection } from "@/components/marketing/ReviewCarouselSection";

interface ExpertServiceItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  deliverables: string[];
  metricHighlight: string;
}

const EXPERT_SERVICES: ExpertServiceItem[] = [
  {
    id: "vision-audit",
    badge: "SERVICE 01 • GEMINI 3.8 VISION",
    title: "Multimodal UI Vision & Value Extraction",
    subtitle: "Zero-Hallucination Screenshot Intelligence",
    description:
      "Our vision pipeline inspects your uploaded screenshot pixel-by-pixel to identify real KPIs, UI components, product category, and dominant hex colors without inventing fake features.",
    icon: Eye,
    gradient: "from-violet-600 to-indigo-600",
    deliverables: [
      "Automatic KPI & feature callout detection with confidence scoring",
      " Instant 5-color brand palette extraction from live UI pixels",
      "Strategic marketing angle & positioning synthesis",
    ],
    metricHighlight: "99.4% Feature Detection Fidelity",
  },
  {
    id: "multi-archetype",
    badge: "SERVICE 02 • LAYOUT ENGINE",
    title: "Autonomous Multi-Archetype Social Composition",
    subtitle: "3–5 Distinct Studio Layouts per Run",
    description:
      "Instead of slapping text on a generic template, SnapPost AI constructs 3–5 structurally distinct layout archetypes—Split Hero, Perspective Tilt, Floating Cards, and Minimal Editorial.",
    icon: Layers,
    gradient: "from-blue-600 to-cyan-500",
    deliverables: [
      "macOS Dark Glass, Minimal Border, or Floating Shadow device frames",
      "Balanced typographic hierarchy calibrated for mobile & desktop feeds",
      "12+ curated agency style presets (Minimal SaaS to Bold Typography)",
    ],
    metricHighlight: "5 Distinct Variations in <10s",
  },
  {
    id: "copywriting-lab",
    badge: "SERVICE 03 • NATIVE COPYWRITING",
    title: "Platform-Native Copy & Hook Engineering",
    subtitle: "7 Writing Tones Tailored per Social Network",
    description:
      "A LinkedIn thought-leadership post should never read like an Instagram caption. We generate platform-calibrated hooks, full post bodies, CTAs, and hashtags grounded in your screenshot.",
    icon: FileText,
    gradient: "from-emerald-500 to-teal-600",
    deliverables: [
      "5 high-converting headlines + 3 scroll-stopping opening hooks",
      "3 complete caption variations with live character counters",
      "7 writing tones: Founder-style, Technical, Professional, Storytelling & more",
    ],
    metricHighlight: "1-Click Copy for Every Element",
  },
  {
    id: "brand-kit",
    badge: "SERVICE 04 • DESIGN SYSTEMS",
    title: "Multi-Client Brand Kit Automation",
    subtitle: "Instant Brand Governance Across Every Post",
    description:
      "Store unlimited Brand Kits for your startup or agency clients—including logos, primary/secondary/accent hex codes, heading/body fonts, brand voice, and default CTAs.",
    icon: Palette,
    gradient: "from-fuchsia-600 to-rose-600",
    deliverables: [
      "1-click Brand Kit application across all generated variations",
      "Custom logo watermarks and verified feature pill styling",
      "Built for agencies managing 5 to 50+ client accounts",
    ],
    metricHighlight: "100% On-Brand Consistency",
  },
  {
    id: "visual-editor",
    badge: "SERVICE 05 • LIVE CANVAS STUDIO",
    title: "Interactive Layer-Based Visual Editor",
    subtitle: "Full Creative Control When You Want It",
    description:
      "Open any AI-generated variation in our interactive canvas editor. Drag layers, edit copy inline, swap backgrounds, adjust border radius & shadows, reorder layers, and undo/redo.",
    icon: Sliders,
    gradient: "from-amber-500 to-orange-600",
    deliverables: [
      "Live zoom, canvas aspect-ratio switching & selection outlines",
      "Fine-grained typography controls (font family, weight, tracking, line-height)",
      "Add custom badges, shapes, text callouts, or replace screenshots",
    ],
    metricHighlight: "60fps Non-Destructive Layer Editing",
  },
  {
    id: "export-pipeline",
    badge: "SERVICE 06 • ULTRA-HD DELIVERY",
    title: "Ultra-HD Multi-Format & Batch ZIP Export",
    subtitle: "Publication-Ready Assets for Every Channel",
    description:
      "Render crisp, high-DPI social visuals in PNG, JPEG, or WebP at exact native platform dimensions—or download all generated variations simultaneously in a single ZIP bundle.",
    icon: Download,
    gradient: "from-sky-500 to-indigo-600",
    deliverables: [
      "8 native social presets (IG, LinkedIn, X/Twitter, Facebook, Pinterest)",
      "Single-click batch ZIP archive export for whole campaigns",
      "Zero compression artifacts on fine UI text and code snippets",
    ],
    metricHighlight: "Up to 2x Retina Resolution",
  },
];

interface CategoryItem {
  id: string;
  name: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  description: string;
  sampleHook: string;
  recommendedStyle: string;
  bestPlatform: string;
  conversionsLift: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "saas-analytics",
    name: "SaaS Dashboards & ARR",
    tag: "B2B SaaS",
    icon: LineChart,
    accent: "text-violet-400 bg-violet-500/15 border-violet-500/30",
    description:
      "Turn MRR charts, cohort retention tables, and admin panels into executive LinkedIn & X updates.",
    sampleHook: "How we reduced enterprise churn by 41% with real-time cohort alerts:",
    recommendedStyle: "Minimal SaaS",
    bestPlatform: "LinkedIn Post (1200×1200)",
    conversionsLift: "+320% Feed Reach",
  },
  {
    id: "ai-devtools",
    name: "AI & Developer Tools / CLIs",
    tag: "DevTools",
    icon: Cpu,
    accent: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
    description:
      "Frame terminal outputs, SDK snippets, latency benchmarks, and API playgrounds in sleek dark glass.",
    sampleHook: "Sub-2ms p99 inference latency. Our new TypeScript SDK is live:",
    recommendedStyle: "Developer Showcase",
    bestPlatform: "X / Twitter (1600×900)",
    conversionsLift: "4.6x Repo Clicks",
  },
  {
    id: "mobile-apps",
    name: "Mobile Apps (iOS & Android)",
    tag: "Consumer & Mobile",
    icon: Smartphone,
    accent: "text-pink-400 bg-pink-500/15 border-pink-500/30",
    description:
      "Showcase mobile onboarding screens, widgets, and dark/light app flows in vertical 9:16 & 4:5 layouts.",
    sampleHook: "Designed for one-handed speed. Meet the all-new iOS 19 experience:",
    recommendedStyle: "App Showcase",
    bestPlatform: "Instagram Portrait (1080×1350)",
    conversionsLift: "+240% App Store Taps",
  },
  {
    id: "fintech-web3",
    name: "FinTech, Payments & Ledger UI",
    tag: "FinTech",
    icon: Briefcase,
    accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    description:
      "Highlight treasury views, instant payout tables, and security compliance badges with authority.",
    sampleHook: "Instant global settlements across 40+ currencies in a single view:",
    recommendedStyle: "Clean Corporate",
    bestPlatform: "LinkedIn Landscape (1200×627)",
    conversionsLift: "2.9x Demo Requests",
  },
  {
    id: "ecommerce-stores",
    name: "E-Commerce & Storefronts",
    tag: "Commerce",
    icon: ShoppingBag,
    accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    description:
      "Convert product pages, checkout flows, and AOV analytics into scroll-stopping social promotions.",
    sampleHook: "Why top DTC brands switched to our 1-click checkout experience:",
    recommendedStyle: "Promotional Campaign",
    bestPlatform: "Instagram Story (1080×1920)",
    conversionsLift: "+195% Ad ROAS",
  },
  {
    id: "product-launches",
    name: "Product Hunt & Launch Drops",
    tag: "Launches",
    icon: Rocket,
    accent: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    description:
      "Generate cohesive launch-day visual kits for Product Hunt galleries, X threads, and LinkedIn.",
    sampleHook: "After 6 months of building in public, SnapFlow 2.0 is live on Product Hunt!",
    recommendedStyle: "Premium Product Launch",
    bestPlatform: "X / Twitter (1600×900)",
    conversionsLift: "#1 Launch Readiness",
  },
  {
    id: "changelogs",
    name: "Changelogs & Release Notes",
    tag: "Product Updates",
    icon: GitBranch,
    accent: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    description:
      "Turn weekly bug fixes, dark-mode releases, and quality-of-life improvements into engaging visuals.",
    sampleHook: "What we shipped this week: 3x faster exports, keyboard shortcuts & more:",
    recommendedStyle: "Product Update",
    bestPlatform: "LinkedIn Post (1200×1200)",
    conversionsLift: "5x Changelog Views",
  },
  {
    id: "agency-reports",
    name: "Agency Case Studies & Wins",
    tag: "Agencies",
    icon: Megaphone,
    accent: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
    description:
      "Transform client traffic graphs and ROAS screenshots into persuasive social proof cards.",
    sampleHook: "From $12k to $84k monthly pipeline in 60 days—here is the exact breakdown:",
    recommendedStyle: "Before & After",
    bestPlatform: "LinkedIn Post (1200×1200)",
    conversionsLift: "+380% Inbound Leads",
  },
];

interface UpcomingFeatureItem {
  id: string;
  quarter: string;
  status: "In Private Beta" | "Shipping Q1" | "In Active R&D" | "Architecture Ready";
  statusColor: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  initialVotes: number;
  highlights: string[];
}

const UPCOMING_FEATURES: UpcomingFeatureItem[] = [
  {
    id: "auto-publish",
    quarter: "NEXT RELEASE • Q1",
    status: "In Private Beta",
    statusColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    title: "Direct 1-Click Social Publishing & Smart Scheduler",
    description:
      "Connect your LinkedIn, X/Twitter, Instagram, Buffer, or Typefully accounts to publish or queue generated visuals and captions without leaving SnapPost AI.",
    icon: CalendarClock,
    initialVotes: 418,
    highlights: [
      "OAuth 1-click connection for LinkedIn Pages, Personal Profiles & X",
      "Best-time-to-post AI scheduling queue",
      "Auto-attaches first-comment links for LinkedIn & X threads",
    ],
  },
  {
    id: "motion-video",
    quarter: "UPCOMING • Q1",
    status: "Shipping Q1",
    statusColor: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    title: "Animated Motion Video & Reel Exporter (60fps MP4)",
    description:
      "Transform static screenshots into smooth 3D-panning, zoom-reveal, and cursor-highlight motion videos ready for Instagram Reels, TikTok, and LinkedIn Video.",
    icon: Video,
    initialVotes: 529,
    highlights: [
      "Automatic spring-physics camera zoom onto detected KPI callouts",
      "1-click 1080×1920 vertical Reel & 1600×900 X video rendering",
      "Subtle ambient background particle & aurora motion loops",
    ],
  },
  {
    id: "browser-extension",
    quarter: "UPCOMING • Q2",
    status: "In Active R&D",
    statusColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    title: "Chrome & Arc 1-Click DOM Screenshot Grabber",
    description:
      "Capture any specific UI card, chart, or full retina viewport directly from your browser tab and beam it straight into your SnapPost AI studio.",
    icon: Globe,
    initialVotes: 364,
    highlights: [
      "Element-picker mode snaps clean isolated DOM components",
      "Automatically strips sensitive user emails or PII before capture",
      "Instant keyboard shortcut (Cmd+Shift+S) from localhost or production",
    ],
  },
  {
    id: "multi-slide-carousel",
    quarter: "UPCOMING • Q2",
    status: "In Active R&D",
    statusColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    title: "Multi-Slide LinkedIn PDF & IG Carousel Builder",
    description:
      "Upload 3–8 product screenshots (or paste a changelog URL) to generate a cohesive, swipeable multi-slide storytelling deck with seamless background continuity.",
    icon: BookOpen,
    initialVotes: 482,
    highlights: [
      "Exports native multi-page PDF for LinkedIn document carousels",
      "Continuous panoramic background artwork across 5–10 slides",
      "Auto-writes slide-by-slide narrative arc + final CTA slide",
    ],
  },
  {
    id: "ctr-heatmap",
    quarter: "UPCOMING • Q3",
    status: "Architecture Ready",
    statusColor: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    title: "Gemini Vision CTR Predictor & Attention Heatmap",
    description:
      "Simulate where feed scrollers look during the first 1.5 seconds. Get an instant 0–100 Visual Stopping Score and contrast recommendations before you export.",
    icon: Flame,
    initialVotes: 312,
    highlights: [
      "Simulated visual saliency heatmap overlay on your canvas",
      "Mobile feed thumbnail legibility check",
      "1-click auto-contrast booster for low-visibility headlines",
    ],
  },
  {
    id: "team-approvals",
    quarter: "UPCOMING • Q3",
    status: "Architecture Ready",
    statusColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    title: "Agency Client Review Links & Multiplayer Canvas",
    description:
      "Share a passwordless white-label preview link with clients so they can approve social variations, leave pin comments, or request copy tweaks in real time.",
    icon: Users,
    initialVotes: 289,
    highlights: [
      "Custom agency domain support (e.g. social.youragency.com)",
      "1-click 'Approved for Publishing' status workflow",
      "Role-based permissions for designers, copywriters & clients",
    ],
  },
];

export default function FluidAppLandingPage() {
  const { user } = useAppStore();
  const [activeVariationIdx, setActiveVariationIdx] = useState(0);
  const [selectedCategoryTag, setSelectedCategoryTag] = useState<string>("All");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [activeServiceId, setActiveServiceId] = useState<string>(
    EXPERT_SERVICES[0].id
  );

  const heroVariations = useMemo(
    () =>
      generateDesignVariations({
        projectId: "proj-fluid-app-showcase",
        screenshotUrl: DEMO_SAAS_SCREENSHOT_DATA_URL,
        platformId: "linkedin-post",
        stylePreset: "Premium Product Launch",
        variationCount: 4,
        backgroundStyle: "radial-violet",
        primaryBrandColor: "#7C3AED",
        analysis: {
          screenshotRepresents: "ARR & Net Retention Executive SaaS Dashboard",
          category: "B2B SaaS Revenue Intelligence",
          mainPurpose:
            "Track Annual Recurring Revenue ($1.48M), Net Dollar Retention (134.8%), and AI churn predictions in real time.",
          productSummary:
            "PulseMetrics AI unifies subscription telemetry, cohort retention, and automated expansion signals into one zero-config dark-mode workspace.",
          visibleFeatures: [
            {
              name: "$1.48M ARR (+38.4% MoM)",
              description: "Live recurring revenue telemetry card.",
              confidence: "high",
            },
            {
              name: "134.8% Net Dollar Retention",
              description: "Top-decile SaaS expansion benchmark.",
              confidence: "high",
            },
            {
              name: "99.4% AI Forecast Accuracy",
              description: "Automated churn & expansion copilot.",
              confidence: "high",
            },
          ],
          uiElements: [
            "Dark navigation sidebar",
            "3 KPI summary cards",
            "Predictive pipeline area chart",
          ],
          brandColors: ["#7C3AED", "#3B82F6", "#10B981"],
          designStyle: "Dark Obsidian SaaS UI",
          targetAudience: "SaaS Founders, CFOs, RevOps & Growth Teams",
          uniqueSellingPoints: [
            "99.4% AI anomaly forecast accuracy",
            "Real-time Slack expansion alerts",
          ],
          marketingAngles: [
            "How we grew Net Dollar Retention to 134.8% with AI Revenue Intelligence",
          ],
          recommendedPlatforms: [
            "linkedin-post",
            "twitter-post",
            "instagram-post",
          ],
          suggestedHeadline:
            "134.8% Net Retention Starts With Real-Time Clarity",
          suggestedSubheadline:
            "Unify ARR telemetry, churn radar, and expansion triggers in one intelligent workspace.",
          suggestedCta: "Start 14-Day Free Trial →",
          analyzedBy: "gemini-vision",
        },
        isFreePlan: false,
      }),
    []
  );

  // Auto-cycle hero variation preview smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVariationIdx((prev) => (prev + 1) % heroVariations.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroVariations.length]);

  const categoryTags = [
    "All",
    "B2B SaaS",
    "DevTools",
    "Consumer & Mobile",
    "FinTech",
    "Commerce",
    "Launches",
    "Agencies",
  ];

  const filteredCategories =
    selectedCategoryTag === "All"
      ? CATEGORIES
      : CATEGORIES.filter(
          (c) =>
            c.tag === selectedCategoryTag ||
            (selectedCategoryTag === "Launches" &&
              (c.tag === "Launches" || c.tag === "Product Updates"))
        );

  const toggleUpvote = (id: string) => {
    setUpvotedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeService =
    EXPERT_SERVICES.find((s) => s.id === activeServiceId) || EXPERT_SERVICES[0];

  return (
    <div className="min-h-screen bg-[#080A11] text-slate-100 selection:bg-violet-600/30">
      {/* Top Sticky Glass Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080A11]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <LogoIcon size={36} priority />
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  SnapPost <span className="text-violet-400">AI</span>
                </span>
                <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-300">
                  2.0 FLUID
                </span>
              </div>
            </Link>

            {/* Page Switcher Pills */}
            <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-[#111422] p-1 lg:flex">
              <Link
                href="/"
                className="rounded-lg px-3 py-1 text-xs font-medium text-slate-400 transition hover:text-white"
              >
                Classic Home
              </Link>
              <Link
                href="/app"
                className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white shadow-glow"
              >
                Fluid Showcase (/app)
              </Link>
              <Link
                href="/benefits"
                className="rounded-lg px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Visual Benefits ✨
              </Link>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-semibold text-slate-300 xl:flex">
            <a href="#expert-services" className="transition hover:text-white">
              Expert Services
            </a>
            <a href="#categories" className="transition hover:text-white">
              Categories
            </a>
            <a href="#target-customers" className="transition hover:text-white">
              Customers &amp; Platforms
            </a>
            <a href="#upcoming-features" className="transition hover:text-white">
              Roadmap
            </a>
            <a href="#reviews" className="transition hover:text-white">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/benefits"
              className="inline-flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-300 transition hover:bg-violet-500/20 lg:hidden"
            >
              <span>Benefits</span>
            </Link>
            {user ? (
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:from-violet-500 hover:to-indigo-500 sm:text-sm"
              >
                <span>Open Studio ({user.creditsBalance} cr)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white sm:text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:from-violet-500 hover:to-indigo-500 sm:text-sm"
                >
                  <span>Start Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* FLUID ANIMATED HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20">
        {/* Ambient Animated Glow Orbs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[620px] w-[1080px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.24),_rgba(6,182,212,0.08)_45%,_transparent_70%)] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left 6 Cols: Animated Editorial Pitch */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300">
                <Wand2 className="h-3.5 w-3.5 text-violet-400" />
                <span>NEXT-GEN SCREENSHOT-TO-SOCIAL AI STUDIO</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:leading-[1.06]">
                Fluid AI Design That Turns{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Raw UI Into Viral Social Proof.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Experience the complete creative pipeline: Gemini 3.8 Vision
                audits your screenshot, engineers 5 distinct social post
                archetypes, writes platform-native hooks, and exports Ultra-HD
                assets across 8 social formats.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02] sm:text-base"
                >
                  <span>Launch AI Post Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/benefits"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-slate-200 transition hover:border-violet-500/40 hover:bg-white/10 sm:text-base"
                >
                  <Compass className="h-4 w-4 text-violet-400" />
                  <span>Explore Visual Benefits</span>
                </Link>
              </div>

              {/* Live Floating Telemetry Strip */}
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                <div className="rounded-2xl border border-white/10 bg-[#111524]/80 p-3.5">
                  <div className="font-mono text-xl font-extrabold text-white sm:text-2xl">
                    8 Formats
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    IG, LinkedIn, X, FB, Pin
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#111524]/80 p-3.5">
                  <div className="font-mono text-xl font-extrabold text-emerald-400 sm:text-2xl">
                    12 Styles
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    Agency Layout Presets
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#111524]/80 p-3.5">
                  <div className="font-mono text-xl font-extrabold text-violet-400 sm:text-2xl">
                    38 Sec
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    Screenshot → ZIP Export
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right 6 Cols: Fluid Animated AI Scanner + Live Morphing Variations Deck */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-b from-[#141829] to-[#0D101B] p-5 shadow-2xl sm:p-7">
                {/* Top Status Bar */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs font-bold text-slate-200">
                      LIVE AI ARCHETYPE MORPHING
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {heroVariations.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setActiveVariationIdx(idx)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                          activeVariationIdx === idx
                            ? "bg-violet-600 text-white shadow-glow"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {v.layoutArchetype}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Animated Canvas Stage with Floating Input Badge */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#080A11] p-4">
                  {/* Animated Scan Beam Overlay */}
                  <div className="animate-scan-beam pointer-events-none absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_20px_rgba(167,139,250,0.9)]" />

                  <AnimatePresence mode="wait">
                    {heroVariations[activeVariationIdx] && (
                      <motion.div
                        key={heroVariations[activeVariationIdx].id}
                        initial={{ opacity: 0, scale: 0.94, rotateX: 4 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.38, ease: "easeOut" }}
                        className="flex justify-center"
                      >
                        <DesignCanvasRenderer
                          width={heroVariations[activeVariationIdx].width}
                          height={heroVariations[activeVariationIdx].height}
                          document={heroVariations[activeVariationIdx].document}
                          scale={0.34}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Mini Raw Input Card */}
                  <div className="animate-float-slow mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#121626]/95 px-4 py-2.5 text-xs backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                        VISION VERIFIED
                      </span>
                      <span className="text-slate-300">
                        Archetype:{" "}
                        <strong className="text-white">
                          {heroVariations[activeVariationIdx]?.name}
                        </strong>
                      </span>
                    </div>
                    <Link
                      href="/dashboard/editor"
                      className="font-semibold text-violet-400 hover:text-violet-300"
                    >
                      Customize Layers →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 1: OUR EXPERT SERVICES (INTERACTIVE FLUID BENTO + SPOTLIGHT) */}
      <section
        id="expert-services"
        className="border-t border-white/10 bg-[#0B0E18] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>OUR EXPERT SERVICES &amp; AI CAPABILITIES</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Six Specialized AI Services Powering Every Social Post
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              SnapPost AI combines computer vision, agency layout engineering,
              platform-native copywriting, and a live vector/layer editor in one
              unified SaaS platform.
            </p>
          </div>

          {/* Interactive Service Cards Grid */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXPERT_SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              const isSelected = srv.id === activeService.id;
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  onClick={() => setActiveServiceId(srv.id)}
                  className={`group cursor-pointer rounded-3xl border p-6 transition-all ${
                    isSelected
                      ? "border-violet-500 bg-gradient-to-b from-[#171C30] to-[#111524] shadow-glow"
                      : "border-white/10 bg-[#111420] hover:border-violet-500/40 hover:bg-[#141828]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-violet-400">
                      {srv.badge}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${srv.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {srv.title}
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-violet-300">
                    {srv.subtitle}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {srv.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                    {srv.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-[#090C14] px-3.5 py-2.5 text-xs">
                    <span className="font-mono font-bold text-emerald-400">
                      {srv.metricHighlight}
                    </span>
                    <Link
                      href="/dashboard/create"
                      className="font-semibold text-violet-400 hover:text-violet-300"
                    >
                      Try Service →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORIES EXPLORER (FILTERABLE USE-CASE TAXONOMY) */}
      <section id="categories" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-300">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>8 SPECIALIZED SCREENSHOT CATEGORIES</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Trained Across Every Product &amp; Content Category
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Filter by category to see how SnapPost AI adapts its visual
                framing, callout pills, and copywriting hooks for your exact
                domain.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categoryTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedCategoryTag(tag)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    selectedCategoryTag === tag
                      ? "bg-violet-600 text-white shadow-glow"
                      : "border border-white/10 bg-[#121520] text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    layout
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121520] p-6 transition hover:border-violet-500/40"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${cat.accent}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{cat.tag}</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-emerald-400">
                          {cat.conversionsLift}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-white">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {cat.description}
                      </p>

                      <div className="mt-4 rounded-xl border border-white/5 bg-[#0B0D14] p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                          AI Sample Hook
                        </div>
                        <p className="mt-1 text-xs italic text-slate-200">
                          &ldquo;{cat.sampleHook}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Preset: {cat.recommendedStyle}</span>
                      </div>
                      <Link
                        href="/dashboard/create"
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-600"
                      >
                        <span>Generate in Category</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: VISUALLY SHOW TARGET CUSTOMERS & PLATFORMS */}
      <div
        id="target-customers"
        className="border-t border-white/10 bg-[#0B0E18] py-24"
      >
        <TargetCustomersAndPlatforms />
      </div>

      {/* SECTION 4: UPCOMING FEATURES & INTERACTIVE PRODUCT ROADMAP */}
      <section
        id="upcoming-features"
        className="border-t border-white/10 bg-[#080A11] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
              <Rocket className="h-3.5 w-3.5 text-emerald-400" />
              <span>UPCOMING FEATURES &amp; PUBLIC ROADMAP</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              What We&apos;re Shipping Next at SnapPost AI
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Vote on upcoming capabilities to prioritize our engineering queue
              and lock in early-access beta invites.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_FEATURES.map((feat) => {
              const Icon = feat.icon;
              const isUpvoted = Boolean(upvotedIds[feat.id]);
              const voteCount = feat.initialVotes + (isUpvoted ? 1 : 0);

              return (
                <motion.div
                  key={feat.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#121520] p-6 shadow-card"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {feat.quarter}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${feat.statusColor}`}
                      >
                        {feat.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold leading-snug text-white">
                        {feat.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      {feat.description}
                    </p>

                    <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                      {feat.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleUpvote(feat.id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                        isUpvoted
                          ? "border-violet-500 bg-violet-600 text-white shadow-glow"
                          : "border-white/15 bg-white/5 text-slate-300 hover:border-violet-500/40 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{isUpvoted ? "Upvoted!" : "Upvote Feature"}</span>
                      <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">
                        {voteCount}
                      </span>
                    </button>

                    <Link
                      href="/auth/register"
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      Join Beta →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: FLUID CAROUSEL MOVING REVIEW SECTION */}
      <div id="reviews">
        <ReviewCarouselSection />
      </div>

      {/* FINAL CONVERSION CTA BANNER */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0E1222] to-[#080A11] py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Ready to Transform Your First Product Screenshot?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Start with 25 free monthly AI credits. Upload any screenshot, test
            all 12 agency styles, or explore our interactive Visual Benefits
            breakdown.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-glow transition hover:bg-violet-500"
            >
              <span>Create Your First Post Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/benefits"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-slate-200 transition hover:bg-white/10"
            >
              <span>See Creative Visual Benefits Page</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06080E] py-12 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">SnapPost AI</span>
            <span>• Fluid Showcase (/app)</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-white">
              Classic Landing (/)
            </Link>
            <Link href="/app" className="text-violet-400 hover:text-white">
              Fluid Showcase (/app)
            </Link>
            <Link href="/benefits" className="hover:text-white">
              Visual Benefits (/benefits)
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
