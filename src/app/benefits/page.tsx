"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wand2,
  ArrowRight,
  Clock,
  TrendingUp,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Zap,
  BarChart3,
  Palette,
  Calculator,
  Award,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/SiteHeader";
import {
  GrowthDashboardShot,
  RESULT_CARDS,
  MovingResultsCarousel,
} from "@/components/marketing/ShowcaseVisuals";
import { TargetCustomersAndPlatforms } from "@/components/marketing/TargetCustomersAndPlatforms";
import { ReviewCarouselSection } from "@/components/marketing/ReviewCarouselSection";

export default function CreativeBenefitsPage() {
  const [postsPerWeek, setPostsPerWeek] = useState<number>(8);
  const [designerHourlyRate, setDesignerHourlyRate] = useState<number>(55);
  const [selectedComparisonTab, setSelectedComparisonTab] = useState<
    "visual" | "metrics"
  >("visual");

  // Manual workflow: ~42 mins per post (screenshot crop + framing + resizing + writing caption)
  // SnapPost AI: ~1 min per post
  const manualHoursPerMonth = Math.round(((postsPerWeek * 42) / 60) * 4.3);
  const snapPostHoursPerMonth = Math.max(
    1,
    Math.round(((postsPerWeek * 1.5) / 60) * 4.3)
  );
  const hoursSavedPerMonth = Math.max(
    1,
    manualHoursPerMonth - snapPostHoursPerMonth
  );
  const monthlyDollarSavings = hoursSavedPerMonth * designerHourlyRate;

  const featuredResultCard = RESULT_CARDS[0];

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 selection:bg-violet-600 selection:text-white">
      {/* Shared Header with 4 Hover Mega-Menus */}
      <SiteHeader />

      {/* 1. HERO: CREATIVE VISUAL BENEFITS */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-[540px] w-[960px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-emerald-500/10 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              <span>MEASURABLE VALUE FOR FOUNDERS, TEAMS &amp; AGENCIES</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:leading-[1.08]">
              Why Plain Screenshots Get Ignored—and How{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                Designed Posts Win Attention
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              See the visual difference between dropping an unedited browser
              screenshot and sharing a studio-designed social card with clear
              headlines, highlighted metrics, and tailored captions.
            </p>
          </div>

          {/* Interactive Before vs. After Visual Comparison Stage */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#121520]/95 p-6 shadow-2xl sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  Side-by-Side Visual Comparison
                </span>
                <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                  Plain Browser Screenshot vs. SnapPost AI Result
                </h2>
              </div>

              <div className="inline-flex rounded-xl border border-white/10 bg-[#0B0D14] p-1">
                <button
                  type="button"
                  onClick={() => setSelectedComparisonTab("visual")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                    selectedComparisonTab === "visual"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Visual Comparison
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedComparisonTab("metrics")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                    selectedComparisonTab === "metrics"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Time &amp; Reach Breakdown
                </button>
              </div>
            </div>

            {selectedComparisonTab === "visual" ? (
              <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-12">
                {/* Left: Plain Screenshot */}
                <div className="flex flex-col justify-between rounded-2xl border border-red-500/25 bg-red-500/[0.03] p-6 lg:col-span-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Before: Plain Browser Screenshot</span>
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        42 Mins Manual Effort
                      </span>
                    </div>

                    {/* Actual Growth Dashboard Screenshot */}
                    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#0B0D14] p-2 shadow-lg">
                      <GrowthDashboardShot className="h-auto w-full rounded-lg opacity-85" />
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>
                        Small dashboard numbers are hard to read on mobile feeds
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>
                        No clear headline or story explaining why the chart
                        matters
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>
                        Gets cropped awkwardly on Instagram, LinkedIn, and X
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Right: SnapPost AI Output */}
                <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 shadow-glow lg:col-span-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>After: SnapPost AI Designed Card</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        38 Seconds Total
                      </span>
                    </div>

                    <div className="mt-5 grid items-center gap-5 sm:grid-cols-12">
                      <div className="mx-auto h-[270px] w-[250px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:col-span-6 sm:w-full">
                        {featuredResultCard.render()}
                      </div>
                      <div className="space-y-3 sm:col-span-6">
                        <div className="rounded-xl border border-white/10 bg-[#0B0D14] p-3.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                            What SnapPost Added Automatically
                          </div>
                          <ul className="mt-2 space-y-2 text-xs text-slate-200">
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>Bold $148K milestone headline</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>+38.4% growth callout badge</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>Clean browser frame &amp; brand glow</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>Tailored LinkedIn &amp; X captions</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-center">
                          <div className="text-xl font-black text-emerald-300">
                            3.4x More Engagement
                          </div>
                          <div className="mt-0.5 text-[11px] text-emerald-200/80">
                            Compared to unedited screenshots
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>
                        Keeps your real screenshot 100% clear while making the
                        key takeaway unmistakable
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>
                        Exports in all 8 social platform dimensions in one click
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Time & Reach Breakdown Bars */
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  {
                    metric: "Time Spent per Campaign",
                    beforeLabel: "42 Minutes (Manual Design & Copy)",
                    afterLabel: "38 Seconds (SnapPost AI)",
                    beforePct: 95,
                    afterPct: 8,
                    improvement: "98% Faster Workflow",
                  },
                  {
                    metric: "Average Feed Impressions",
                    beforeLabel: "1,100 Views (Plain Screenshot)",
                    afterLabel: "14,800+ Views (Framed Story Card)",
                    beforePct: 18,
                    afterPct: 92,
                    improvement: "+340% Higher Reach",
                  },
                  {
                    metric: "Supported Social Formats per Run",
                    beforeLabel: "1 Size (Manual Resize Needed)",
                    afterLabel: "All 8 Social Sizes Ready",
                    beforePct: 14,
                    afterPct: 100,
                    improvement: "8x Format Coverage",
                  },
                ].map((row) => (
                  <div
                    key={row.metric}
                    className="rounded-2xl border border-white/10 bg-[#0B0D14] p-6"
                  >
                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
                      {row.improvement}
                    </span>
                    <h3 className="mt-3 text-base font-extrabold text-white">
                      {row.metric}
                    </h3>

                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Without SnapPost</span>
                          <span>{row.beforeLabel}</span>
                        </div>
                        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            style={{ width: `${row.beforePct}%` }}
                            className="h-full rounded-full bg-red-500/60"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-emerald-300">
                          <span>With SnapPost AI</span>
                          <span>{row.afterLabel}</span>
                        </div>
                        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            style={{ width: `${row.afterPct}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CREATIVE VISUAL BENEFIT BENTO GRID */}
      <section className="relative border-y border-white/10 bg-[#090C15] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
              <Zap className="h-3.5 w-3.5 text-violet-400" />
              <span>6 KEY BENEFITS AT A GLANCE</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built to Save Hours and Grow Your Audience
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Every feature in SnapPost AI is designed to remove design friction
              and help your product updates stand out.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                badge: "98% Time Saved",
                title: "From 45 Minutes to 38 Seconds",
                description:
                  "Stop manually cropping screenshots, aligning background gradients, and resizing canvases for every social platform.",
                visualStat: "38 sec",
                visualSub: "Average time from upload to download",
                accent: "from-violet-600 to-indigo-600",
              },
              {
                icon: TrendingUp,
                badge: "+340% Feed Reach",
                title: "Stop the Scroll on Busy Feeds",
                description:
                  "Visual cards with clear headlines and highlighted metrics consistently earn 3x to 4x more views and clicks than plain screenshots.",
                visualStat: "3.4x",
                visualSub: "Higher click-through rate on LinkedIn & X",
                accent: "from-emerald-500 to-teal-600",
              },
              {
                icon: ShieldCheck,
                badge: "100% Real Product UI",
                title: "Your Actual Screenshot, Never Fake Art",
                description:
                  "Your customers want to see your real product. SnapPost keeps your UI crystal clear while framing it like a professional launch card.",
                visualStat: "100%",
                visualSub: "Sharp, unaltered product screenshot",
                accent: "from-cyan-500 to-blue-600",
              },
              {
                icon: Palette,
                badge: "Brand Consistency",
                title: "Every Post Matches Your Brand Kit",
                description:
                  "Lock in your brand colors, fonts, logo, and call-to-action button once so every team member ships cohesive graphics.",
                visualStat: "1-Click",
                visualSub: "Brand Kit application across all designs",
                accent: "from-fuchsia-600 to-pink-600",
              },
              {
                icon: Layers,
                badge: "5 Layouts per Run",
                title: "Multiple Visual Angles Instantly",
                description:
                  "Compare Split Hero, Angled Frame, Floating Highlights, and Top Banner layouts side-by-side without extra work.",
                visualStat: "5 Layouts",
                visualSub: "Generated automatically from 1 upload",
                accent: "from-amber-500 to-orange-600",
              },
              {
                icon: BarChart3,
                badge: "Captions Included",
                title: "Platform-Specific Copy & Hooks",
                description:
                  "Get 5 headline options, 3 opening hooks, and complete post captions written for the exact social network you choose.",
                visualStat: "8 Networks",
                visualSub: "Tailored captions & aspect ratios",
                accent: "from-blue-600 to-violet-600",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: idx * 0.05 }}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#121520] p-7 shadow-card transition hover:-translate-y-1 hover:border-violet-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-violet-300">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B0D14] p-4">
                    <div className="text-2xl font-extrabold text-white">
                      {item.visualStat}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {item.visualSub}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TIME & BUDGET SAVINGS CALCULATOR */}
      <section className="relative border-b border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-[#131728] via-[#101320] to-[#17132B] p-8 shadow-2xl sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300">
                  <Calculator className="h-3.5 w-3.5 text-violet-400" />
                  <span>INTERACTIVE TIME &amp; COST CALCULATOR</span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
                  Calculate Your Monthly Time &amp; Design Savings
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Adjust the sliders below based on how many product updates,
                  launch graphics, or client posts you publish each week.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-200 sm:text-sm">
                      <span>Social Posts Published per Week</span>
                      <span className="font-mono text-violet-300">
                        {postsPerWeek} posts / week
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      value={postsPerWeek}
                      onChange={(e) => setPostsPerWeek(Number(e.target.value))}
                      className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-violet-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-200 sm:text-sm">
                      <span>Estimated Hourly Design / Team Value ($)</span>
                      <span className="font-mono text-violet-300">
                        ${designerHourlyRate} / hour
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={150}
                      step={5}
                      value={designerHourlyRate}
                      onChange={(e) =>
                        setDesignerHourlyRate(Number(e.target.value))
                      }
                      className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-violet-500"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-[#0B0D14] p-7 text-center shadow-glow lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Your Estimated Monthly Savings
                </span>
                <div className="mt-3 text-5xl font-extrabold text-white">
                  ${monthlyDollarSavings.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  in design &amp; production time saved every month
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <div className="text-xl font-extrabold text-violet-300">
                      {hoursSavedPerMonth} hrs
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Saved per Month
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <div className="text-xl font-extrabold text-emerald-300">
                      {postsPerWeek * 4} Posts
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Shipped Monthly
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard/create"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-glow transition hover:bg-violet-500 sm:text-sm"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Start Saving Time Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOVING CAROUSEL OF GENERATED RESULTS */}
      <MovingResultsCarousel />

      {/* 5. VISUALLY SHOW TARGET CUSTOMERS & PLATFORMS */}
      <div className="py-24">
        <TargetCustomersAndPlatforms />
      </div>

      {/* 6. MOVING REALISTIC CUSTOMER REVIEWS CAROUSEL */}
      <ReviewCarouselSection />

      {/* Shared Footer */}
      <SiteFooter />
    </div>
  );
}
