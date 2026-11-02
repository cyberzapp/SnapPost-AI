"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Quote,
  TrendingUp,
  Award,
} from "lucide-react";

export interface CustomerReview {
  id: string;
  name: string;
  handle: string;
  role: string;
  company: string;
  persona: "SaaS Founders" | "Agencies" | "Developers" | "Marketing Teams";
  avatarInitials: string;
  avatarGradient: string;
  platform: "LinkedIn" | "X / Twitter" | "Product Hunt" | "Instagram";
  rating: number;
  date: string;
  metricBadge: string;
  headline: string;
  quote: string;
}

const REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Arjun Mehta",
    handle: "@arjun_builds",
    role: "Co-Founder & CEO",
    company: "MetricFlow AI",
    persona: "SaaS Founders",
    avatarInitials: "AM",
    avatarGradient: "from-violet-600 to-indigo-600",
    platform: "LinkedIn",
    rating: 5,
    date: "2 days ago",
    metricBadge: "+340% LinkedIn Post Views",
    headline: "Replaced our 45-minute design routine with a 30-second workflow.",
    quote:
      "Every Friday we share 4 product updates. Before SnapPost AI, I posted plain browser screenshots that got 800 views. Now SnapPost reads our growth numbers directly from the screenshot, frames it cleanly, and writes a founder-style LinkedIn post that averages 18,000+ views.",
  },
  {
    id: "rev-2",
    name: "Elena Rostova",
    handle: "@elena_designops",
    role: "Managing Partner",
    company: "Veloce Social Studio",
    persona: "Agencies",
    avatarInitials: "ER",
    avatarGradient: "from-fuchsia-600 to-rose-600",
    platform: "Instagram",
    rating: 5,
    date: "5 days ago",
    metricBadge: "14+ Hours Saved Weekly",
    headline: "Saved Brand Kits and one-click ZIP downloads save our agency hours every day.",
    quote:
      "We manage social media for 11 software clients. SnapPost AI lets us save each client's brand colors, fonts, and call-to-action in Brand Kits. We upload one product screenshot and download LinkedIn, X, and Instagram sizes in a single ZIP file.",
  },
  {
    id: "rev-3",
    name: "Marcus Vance",
    handle: "@mvance_dev",
    role: "Lead Developer Advocate",
    company: "HyperQuery Cloud",
    persona: "Developers",
    avatarInitials: "MV",
    avatarGradient: "from-cyan-500 to-blue-600",
    platform: "X / Twitter",
    rating: 5,
    date: "1 week ago",
    metricBadge: "4.6x More Link Clicks on X",
    headline: "Keeps our real product screenshot 100% sharp without fake stock graphics.",
    quote:
      "Developers scroll right past generic AI illustrations. SnapPost AI keeps our actual code and speed charts crystal clear while adding dark-mode framing, highlight badges, and concise technical posts for X.",
  },
  {
    id: "rev-4",
    name: "Priya Nair",
    handle: "@priya_growth",
    role: "VP of Marketing",
    company: "FinStack Ledger",
    persona: "Marketing Teams",
    avatarInitials: "PN",
    avatarGradient: "from-emerald-500 to-teal-600",
    platform: "Product Hunt",
    rating: 5,
    date: "3 days ago",
    metricBadge: "#1 Launch Day Graphics",
    headline: "We created our entire Product Hunt and LinkedIn launch graphics in 12 minutes.",
    quote:
      "The Visual Layer Editor made all the difference for our team. SnapPost generates 4 clean layout styles from one screenshot, and we can edit any headline or badge directly on the canvas before downloading high-resolution PNGs.",
  },
  {
    id: "rev-5",
    name: "Lucas Bergstrom",
    handle: "@lucas_indie",
    role: "Founder",
    company: "DraftPilot Studio",
    persona: "SaaS Founders",
    avatarInitials: "LB",
    avatarGradient: "from-amber-500 to-orange-600",
    platform: "X / Twitter",
    rating: 5,
    date: "4 days ago",
    metricBadge: "$14k Monthly Revenue Launch",
    headline: "Looks like I hired a dedicated brand designer for my weekly product updates.",
    quote:
      "I am a developer, not a designer. I drop a quick product screenshot into SnapPost AI, pick the Product Launch style, and get a polished visual card with ready-to-post captions for X and LinkedIn.",
  },
  {
    id: "rev-6",
    name: "Hannah Kim",
    handle: "@hannah_pmm",
    role: "Product Marketing Lead",
    company: "Synthetix Ops",
    persona: "Marketing Teams",
    avatarInitials: "HK",
    avatarGradient: "from-blue-600 to-violet-600",
    platform: "LinkedIn",
    rating: 5,
    date: "6 days ago",
    metricBadge: "3.2x More Demo Signups",
    headline: "Captions are tailored for each social network instead of sounding generic.",
    quote:
      "Most caption tools sound repetitive. SnapPost AI reads the actual numbers inside our screenshot and writes professional posts for LinkedIn and engaging visual captions for Instagram.",
  },
  {
    id: "rev-7",
    name: "Devon Brooks",
    handle: "@devon_agency",
    role: "Creative Director",
    company: "NorthStar Media",
    persona: "Agencies",
    avatarInitials: "DB",
    avatarGradient: "from-purple-600 to-pink-600",
    platform: "LinkedIn",
    rating: 5,
    date: "1 week ago",
    metricBadge: "42 Client Campaigns Shipped",
    headline: "Our team creates studio-quality social graphics in under a minute.",
    quote:
      "Between the 12 curated style presets, automatic brand color detection, and instant resizing across 8 social formats, SnapPost AI has become our team's favorite daily tool.",
  },
  {
    id: "rev-8",
    name: "Rohan Kulkarni",
    handle: "@rohan_oss",
    role: "Creator & Maintainer",
    company: "EdgeVector DB",
    persona: "Developers",
    avatarInitials: "RK",
    avatarGradient: "from-sky-500 to-indigo-600",
    platform: "X / Twitter",
    rating: 5,
    date: "2 weeks ago",
    metricBadge: "+2,900 GitHub Stars in 10 Days",
    headline: "The Developer Release style makes benchmark charts stand out on X.",
    quote:
      "We turned our plain benchmark screenshot into a crisp dark-mode card with clear highlight badges. Our release post reached 140,000 views and brought in 2,900 GitHub stars.",
  },
];

export function ReviewCarouselSection() {
  const [selectedPersona, setSelectedPersona] = useState<string>("All");
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const filteredReviews =
    selectedPersona === "All"
      ? REVIEWS
      : REVIEWS.filter((r) => r.persona === selectedPersona);

  const currentSpotlight =
    filteredReviews[spotlightIndex % filteredReviews.length] || REVIEWS[0];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, filteredReviews.length]);

  const handlePrev = () => {
    setSpotlightIndex(
      (prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length
    );
  };

  const handleNext = () => {
    setSpotlightIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const rowOneReviews = [...REVIEWS.slice(0, 4), ...REVIEWS.slice(0, 4)];
  const rowTwoReviews = [...REVIEWS.slice(4, 8), ...REVIEWS.slice(4, 8)];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#0B0D14] py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.16),_transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Bar */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300">
              <Award className="h-3.5 w-3.5 text-violet-400" />
              <span>CUSTOMER STORIES &amp; RESULTS</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Trusted by Founders, Agencies &amp; Marketing Teams
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              See how fast-moving teams turn everyday product screenshots into
              high-performing social posts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              "All",
              "SaaS Founders",
              "Agencies",
              "Developers",
              "Marketing Teams",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedPersona(tab);
                  setSpotlightIndex(0);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedPersona === tab
                    ? "bg-violet-600 text-white shadow-glow"
                    : "border border-white/10 bg-[#121624] text-slate-300 hover:border-white/25 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={
                isPaused ? "Resume review carousel" : "Pause review carousel"
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-amber-400" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Spotlight Review Card */}
        <div className="mt-10">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-[#131726] via-[#101320] to-[#17132B] p-6 shadow-2xl sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSpotlight.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: currentSpotlight.rating }).map(
                          (_, idx) => (
                            <Star
                              key={idx}
                              className="h-4 w-4 fill-amber-400 text-amber-400"
                            />
                          )
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{currentSpotlight.metricBadge}</span>
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                        Shared on {currentSpotlight.platform} •{" "}
                        {currentSpotlight.date}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                      &ldquo;{currentSpotlight.headline}&rdquo;
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                      {currentSpotlight.quote}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentSpotlight.avatarGradient} text-sm font-extrabold text-white shadow-lg`}
                        >
                          {currentSpotlight.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">
                              {currentSpotlight.name}
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-sky-400" />
                            <span className="font-mono text-xs text-slate-400">
                              {currentSpotlight.handle}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {currentSpotlight.role} at{" "}
                            <span className="font-semibold text-violet-300">
                              {currentSpotlight.company}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Verified Rating Summary */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0D14]/90 p-6 lg:col-span-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                      Customer Rating
                    </span>
                    <Quote className="h-5 w-5 text-violet-400/50" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">
                      4.95
                    </span>
                    <span className="text-sm text-slate-400">/ 5.0 average</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Based on 480+ verified founders, product marketers, and
                    creative agencies.
                  </p>

                  <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Screenshot Quality</span>
                      <span className="font-mono font-bold text-emerald-400">
                        100% Sharp UI
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Average Time to Post</span>
                      <span className="font-mono font-bold text-violet-300">
                        38 Seconds
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Customer Group</span>
                      <span className="rounded bg-violet-500/20 px-2 py-0.5 font-semibold text-violet-300">
                        {currentSpotlight.persona}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1.5">
                    {filteredReviews.map((r, idx) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSpotlightIndex(idx)}
                        aria-label={`View review ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          idx === spotlightIndex % filteredReviews.length
                            ? "w-7 bg-violet-500"
                            : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous review"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/15"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next review"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/15"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continuous Moving Review Carousels (2 Opposite-Direction Rows) */}
      <div className="carousel-edge-mask mt-12 space-y-5 overflow-hidden py-2">
        {/* Track 1: Left-Moving Row */}
        <div
          className={`animate-marquee-left gap-5 px-4 ${
            isPaused ? "marquee-paused" : ""
          }`}
        >
          {rowOneReviews.map((rev, idx) => (
            <div
              key={`${rev.id}-r1-${idx}`}
              className="w-[370px] shrink-0 rounded-2xl border border-white/10 bg-[#121521]/95 p-5 shadow-card transition hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rev.avatarGradient} text-xs font-extrabold text-white`}
                  >
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">
                        {rev.name}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {rev.role} • {rev.company}
                    </div>
                  </div>
                </div>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  {rev.platform}
                </span>
              </div>

              <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-slate-300">
                &ldquo;{rev.quote}&rdquo;
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  {rev.metricBadge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Track 2: Right-Moving Row */}
        <div
          className={`animate-marquee-right gap-5 px-4 ${
            isPaused ? "marquee-paused" : ""
          }`}
        >
          {rowTwoReviews.map((rev, idx) => (
            <div
              key={`${rev.id}-r2-${idx}`}
              className="w-[370px] shrink-0 rounded-2xl border border-white/10 bg-[#121521]/95 p-5 shadow-card transition hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rev.avatarGradient} text-xs font-extrabold text-white`}
                  >
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">
                        {rev.name}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {rev.role} • {rev.company}
                    </div>
                  </div>
                </div>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  {rev.platform}
                </span>
              </div>

              <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-slate-300">
                &ldquo;{rev.quote}&rdquo;
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                  {rev.metricBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
