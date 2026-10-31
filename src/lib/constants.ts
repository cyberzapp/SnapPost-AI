import {
  SocialPlatformSpec,
  ContentStyleId,
  WritingTone,
  BackgroundStyleType,
} from "@/types";

export const SOCIAL_PLATFORMS: SocialPlatformSpec[] = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    label: "1080 × 1080 (1:1)",
    width: 1080,
    height: 1080,
    aspectRatio: "1 / 1",
    iconName: "Instagram",
    maxHashtags: 15,
  },
  {
    id: "instagram-portrait",
    name: "Instagram Portrait",
    label: "1080 × 1350 (4:5)",
    width: 1080,
    height: 1350,
    aspectRatio: "4 / 5",
    iconName: "Instagram",
    maxHashtags: 15,
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    label: "1080 × 1920 (9:16)",
    width: 1080,
    height: 1920,
    aspectRatio: "9 / 16",
    iconName: "Smartphone",
    maxHashtags: 8,
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    label: "1200 × 1200 (1:1)",
    width: 1200,
    height: 1200,
    aspectRatio: "1 / 1",
    iconName: "Linkedin",
    maxHashtags: 5,
  },
  {
    id: "linkedin-landscape",
    name: "LinkedIn Landscape",
    label: "1200 × 627 (1.91:1)",
    width: 1200,
    height: 627,
    aspectRatio: "1200 / 627",
    iconName: "Linkedin",
    maxHashtags: 5,
  },
  {
    id: "twitter-post",
    name: "X / Twitter Post",
    label: "1600 × 900 (16:9)",
    width: 1600,
    height: 900,
    aspectRatio: "16 / 9",
    iconName: "Twitter",
    maxHashtags: 3,
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    label: "1200 × 630 (1.9:1)",
    width: 1200,
    height: 630,
    aspectRatio: "1200 / 630",
    iconName: "Share2",
    maxHashtags: 6,
  },
  {
    id: "pinterest-pin",
    name: "Pinterest Pin",
    label: "1000 × 1500 (2:3)",
    width: 1000,
    height: 1500,
    aspectRatio: "2 / 3",
    iconName: "Pin",
    maxHashtags: 10,
  },
];

export const CONTENT_STYLES: {
  id: ContentStyleId;
  name: string;
  description: string;
  badge: string;
  accentHex: string;
}[] = [
  {
    id: "Minimal SaaS",
    name: "Minimal SaaS",
    description: "Clean dark glass framing, crisp typography, subtle ambient glow.",
    badge: "Popular",
    accentHex: "#7C3AED",
  },
  {
    id: "Premium Product Launch",
    name: "Premium Product Launch",
    description: "High-impact launch badge, dramatic lighting, bold value proposition.",
    badge: "Launch",
    accentHex: "#3B82F6",
  },
  {
    id: "Bold Typography",
    name: "Bold Typography",
    description: "Oversized editorial headline paired with angled interface proof.",
    badge: "High CTR",
    accentHex: "#EC4899",
  },
  {
    id: "Modern Editorial",
    name: "Modern Editorial",
    description: "Refined magazine-inspired composition with structured callouts.",
    badge: "Editorial",
    accentHex: "#A855F7",
  },
  {
    id: "Developer Showcase",
    name: "Developer Showcase",
    description: "Monospace telemetry badges, terminal dark aesthetics, technical clarity.",
    badge: "DevTools",
    accentHex: "#10B981",
  },
  {
    id: "Startup Announcement",
    name: "Startup Announcement",
    description: "Milestone-driven layout ideal for funding, v2.0 drops, and launches.",
    badge: "News",
    accentHex: "#6366F1",
  },
  {
    id: "Feature Highlight",
    name: "Feature Highlight",
    description: "Spotlights key UI workflow with floating benefit pills.",
    badge: "Product",
    accentHex: "#06B6D4",
  },
  {
    id: "Product Update",
    name: "Product Update",
    description: "Changelog-ready card layout showcasing what's new in your app.",
    badge: "Changelog",
    accentHex: "#8B5CF6",
  },
  {
    id: "Before & After",
    name: "Before & After",
    description: "Transformation-focused messaging contrasting old friction vs new speed.",
    badge: "Conversion",
    accentHex: "#F59E0B",
  },
  {
    id: "App Showcase",
    name: "App Showcase",
    description: "Sleek device presentation with CTA pill and rating proof.",
    badge: "Mobile/Web",
    accentHex: "#3B82F6",
  },
  {
    id: "Promotional Campaign",
    name: "Promotional Campaign",
    description: "Conversion-engineered offer layout with urgency badge and strong CTA.",
    badge: "Promo",
    accentHex: "#EF4444",
  },
  {
    id: "Clean Corporate",
    name: "Clean Corporate",
    description: "Executive enterprise aesthetic built for LinkedIn & B2B buyers.",
    badge: "B2B",
    accentHex: "#0EA5E9",
  },
];

export const WRITING_TONES: WritingTone[] = [
  "Professional",
  "Friendly",
  "Founder-style",
  "Technical",
  "Promotional",
  "Storytelling",
  "Casual",
];

export const BACKGROUND_PRESETS: {
  id: BackgroundStyleType;
  name: string;
  cssGradient: string;
  baseColor: string;
}[] = [
  {
    id: "radial-violet",
    name: "Obsidian Violet Glow",
    cssGradient:
      "radial-gradient(circle at 50% 15%, rgba(124, 58, 237, 0.38) 0%, rgba(15, 23, 42, 0.95) 55%, #090B10 100%)",
    baseColor: "#090B10",
  },
  {
    id: "mesh-cyber",
    name: "Deep Navy & Electric Blue",
    cssGradient:
      "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.35) 0%, rgba(124, 58, 237, 0.2) 45%, #0B0F19 100%)",
    baseColor: "#0B0F19",
  },
  {
    id: "solid-obsidian",
    name: "Matte Carbon Studio",
    cssGradient: "linear-gradient(180deg, #131622 0%, #090B10 100%)",
    baseColor: "#090B10",
  },
  {
    id: "emerald-aurora",
    name: "Emerald Terminal",
    cssGradient:
      "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.28) 0%, rgba(6, 182, 212, 0.14) 50%, #090D14 100%)",
    baseColor: "#090D14",
  },
  {
    id: "sunset-blaze",
    name: "Founder Launch Dusk",
    cssGradient:
      "radial-gradient(circle at 75% 15%, rgba(236, 72, 153, 0.32) 0%, rgba(124, 58, 237, 0.28) 50%, #0D0B14 100%)",
    baseColor: "#0D0B14",
  },
  {
    id: "editorial-slate",
    name: "Editorial Charcoal",
    cssGradient: "linear-gradient(135deg, #1E293B 0%, #0F172A 60%, #090D16 100%)",
    baseColor: "#0F172A",
  },
  {
    id: "clean-light",
    name: "Architectural Ivory",
    cssGradient: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)",
    baseColor: "#F8FAFC",
  },
];

export const FONT_FAMILIES = [
  "Inter",
  "Geist",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "JetBrains Mono",
  "Georgia",
];

export const CREDIT_COSTS = {
  screenshot_analysis: 1,
  copy_generation: 1,
  design_generation: 2,
  design_regeneration: 2,
} as const;

export const PRICING_PLANS = [
  {
    tier: "FREE" as const,
    name: "Starter Free",
    priceMonthly: 0,
    priceInr: 0,
    creditsPerMonth: 25,
    description: "For solo builders testing screenshot-to-social workflows.",
    features: [
      "25 monthly AI credits",
      "Core social platform sizes",
      "6 essential design templates",
      "Standard PNG & JPG exports",
      "Up to 10 saved projects",
    ],
    ctaLabel: "Start For Free",
    popular: false,
  },
  {
    tier: "PRO" as const,
    name: "Creator Pro",
    priceMonthly: 29,
    priceInr: 2499,
    creditsPerMonth: 250,
    description: "For founders, indie hackers, and marketers shipping daily content.",
    features: [
      "250 monthly AI credits",
      "All 12+ premium design styles",
      "Ultra-HD 2x Retina PNG, JPG & WebP exports",
      "No watermarks on exported assets",
      "Custom Brand Kit (logos, colors, fonts)",
      "Batch ZIP export for all variations",
      "Unlimited saved projects",
    ],
    ctaLabel: "Upgrade to Pro",
    popular: true,
  },
  {
    tier: "BUSINESS" as const,
    name: "Agency Business",
    priceMonthly: 79,
    priceInr: 6499,
    creditsPerMonth: 1000,
    description: "For agencies and growth teams managing multiple client brands.",
    features: [
      "1,000 monthly AI credits",
      "Unlimited Multi-Client Brand Kits",
      "Agency workflow & version history",
      "Priority OpenAI Vision queue",
      "All platform dimensions + custom canvas",
      "Dedicated priority support",
    ],
    ctaLabel: "Scale with Business",
    popular: false,
  },
];

// High-resolution vector SVG screenshot data URI representing a real SaaS dashboard ("PulseMetrics AI")
export const DEMO_SAAS_SCREENSHOT_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" fill="none">
  <rect width="1200" height="760" rx="16" fill="#0D111C"/>
  <!-- Sidebar -->
  <rect x="0" y="0" width="230" height="760" fill="#111625"/>
  <rect x="230" y="0" width="1" height="760" fill="#1E293B"/>
  <circle cx="42" cy="42" r="14" fill="#7C3AED"/>
  <text x="68" y="48" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="700" font-size="18">PulseMetrics</text>
  <rect x="20" y="90" width="190" height="40" rx="8" fill="#7C3AED" fill-opacity="0.18"/>
  <rect x="20" y="90" width="4" height="40" rx="2" fill="#7C3AED"/>
  <text x="44" y="115" fill="#C4B5FD" font-family="Inter, sans-serif" font-weight="600" font-size="14">Revenue Intelligence</text>
  <text x="44" y="165" fill="#94A3B8" font-family="Inter, sans-serif" font-weight="500" font-size="14">Live Cohorts</text>
  <text x="44" y="210" fill="#94A3B8" font-family="Inter, sans-serif" font-weight="500" font-size="14">Attribution AI</text>
  <text x="44" y="255" fill="#94A3B8" font-family="Inter, sans-serif" font-weight="500" font-size="14">Churn Radar</text>
  <text x="44" y="300" fill="#94A3B8" font-family="Inter, sans-serif" font-weight="500" font-size="14">API Webhooks</text>

  <!-- Header -->
  <text x="270" y="52" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="700" font-size="24">ARR &amp; Net Retention Overview</text>
  <rect x="990" y="26" width="170" height="38" rx="8" fill="#7C3AED"/>
  <text x="1022" y="50" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="600" font-size="13">+ Export AI Report</text>

  <!-- Metric Cards -->
  <rect x="270" y="88" width="280" height="130" rx="14" fill="#151B2D" stroke="#26314D"/>
  <text x="296" y="122" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">Annual Recurring Revenue</text>
  <text x="296" y="166" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="800" font-size="34">$1,482,900</text>
  <rect x="296" y="182" width="96" height="22" rx="11" fill="#10B981" fill-opacity="0.16"/>
  <text x="308" y="197" fill="#34D399" font-family="Inter, sans-serif" font-weight="600" font-size="12">+38.4% MoM</text>

  <rect x="575" y="88" width="280" height="130" rx="14" fill="#151B2D" stroke="#26314D"/>
  <text x="601" y="122" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">Net Dollar Retention</text>
  <text x="601" y="166" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="800" font-size="34">134.8%</text>
  <rect x="601" y="182" width="110" height="22" rx="11" fill="#3B82F6" fill-opacity="0.18"/>
  <text x="613" y="197" fill="#60A5FA" font-family="Inter, sans-serif" font-weight="600" font-size="12">Top 1% SaaS</text>

  <rect x="880" y="88" width="280" height="130" rx="14" fill="#151B2D" stroke="#26314D"/>
  <text x="906" y="122" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">AI Anomaly Forecasts</text>
  <text x="906" y="166" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="800" font-size="34">99.4% Acc</text>
  <rect x="906" y="182" width="118" height="22" rx="11" fill="#7C3AED" fill-opacity="0.22"/>
  <text x="918" y="197" fill="#C4B5FD" font-family="Inter, sans-serif" font-weight="600" font-size="12">Zero Churn Risk</text>

  <!-- Main Chart Card -->
  <rect x="270" y="244" width="890" height="310" rx="16" fill="#151B2D" stroke="#26314D"/>
  <text x="300" y="284" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="700" font-size="17">Real-Time Expansion Velocity &amp; Predictive Pipeline</text>
  <line x1="300" y1="330" x2="1120" y2="330" stroke="#1E293B" stroke-dasharray="4 4"/>
  <line x1="300" y1="395" x2="1120" y2="395" stroke="#1E293B" stroke-dasharray="4 4"/>
  <line x1="300" y1="460" x2="1120" y2="460" stroke="#1E293B" stroke-dasharray="4 4"/>
  <path d="M300 490 C400 475, 460 430, 550 415 C640 400, 710 355, 810 335 C910 315, 1010 275, 1120 255 L1120 515 L300 515 Z" fill="#7C3AED" fill-opacity="0.18"/>
  <path d="M300 490 C400 475, 460 430, 550 415 C640 400, 710 355, 810 335 C910 315, 1010 275, 1120 255" stroke="#8B5CF6" stroke-width="4" fill="none"/>
  <circle cx="810" cy="335" r="7" fill="#7C3AED" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="1120" cy="255" r="8" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>

  <!-- Bottom Row -->
  <rect x="270" y="580" width="890" height="145" rx="16" fill="#151B2D" stroke="#26314D"/>
  <text x="300" y="618" fill="#F8FAFC" font-family="Inter, sans-serif" font-weight="600" font-size="15">Automated Revenue Copilot Insights</text>
  <text x="300" y="650" fill="#94A3B8" font-family="Inter, sans-serif" font-size="14">• Enterprise tier upgrades increased 42% after launching instant Slack alerts.</text>
  <text x="300" y="680" fill="#94A3B8" font-family="Inter, sans-serif" font-size="14">• 14 high-intent accounts ready for annual contract expansion this week.</text>
</svg>`)}`;
