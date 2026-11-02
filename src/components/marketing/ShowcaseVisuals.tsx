"use client";

import React, { useId, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  TrendingUp,
  Star,
  Zap,
  Bell,
  Moon,
  Users,
  Gauge,
  Pause,
  Play,
  Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */

const GROWTH_VALUES = [18, 22, 21, 27, 31, 30, 38, 44, 49, 58, 66, 78];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildPath(
  values: number[],
  x0: number,
  x1: number,
  yTop: number,
  yBottom: number,
  max: number
) {
  const step = (x1 - x0) / (values.length - 1);
  const pts = values.map((v, i) => [x0 + i * step, yBottom - (v / max) * (yBottom - yTop)]);
  // Smooth curve (Catmull-Rom to Bezier)
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${d} L ${pts[pts.length - 1][0]} ${yBottom} L ${pts[0][0]} ${yBottom} Z`;
  return { line: d, area, last: pts[pts.length - 1] };
}

/* ------------------------------------------------------------------ */
/* Plain "raw" product screenshot (the input)                          */
/* ------------------------------------------------------------------ */

export function GrowthDashboardShot({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const { line, area, last } = buildPath(GROWTH_VALUES, 290, 830, 290, 492, 80);
  const nav = ["Overview", "Revenue", "Customers", "Churn", "Reports", "Settings"];
  const stats = [
    { label: "Monthly revenue", value: "$148,290", delta: "+38.4% vs last year", up: true },
    { label: "Active customers", value: "2,481", delta: "+412 this quarter", up: true },
    { label: "Churn rate", value: "1.9%", delta: "-0.6% vs last month", up: true },
  ];

  return (
    <svg
      viewBox="0 0 880 540"
      className={className}
      role="img"
      aria-label="Plain revenue dashboard screenshot showing steady monthly growth"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <defs>
        <linearGradient id={`area-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect width="880" height="540" rx="14" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <rect width="880" height="540" fill="#F5F6FA" />

        {/* Browser bar */}
        <rect width="880" height="36" fill="#E8EAF0" />
        <circle cx="20" cy="18" r="5" fill="#FF5F57" />
        <circle cx="38" cy="18" r="5" fill="#FEBC2E" />
        <circle cx="56" cy="18" r="5" fill="#28C840" />
        <rect x="300" y="9" width="280" height="18" rx="9" fill="#FFFFFF" />
        <text x="440" y="22" fontSize="10" fill="#6B7280" textAnchor="middle">
          app.pulsemetrics.io/revenue
        </text>

        {/* Sidebar */}
        <rect x="0" y="36" width="200" height="504" fill="#FFFFFF" />
        <line x1="200" y1="36" x2="200" y2="540" stroke="#E5E7EB" />
        <rect x="20" y="56" width="22" height="22" rx="6" fill="#4F46E5" />
        <text x="50" y="72" fontSize="13" fontWeight="700" fill="#111827">
          PulseMetrics
        </text>
        {nav.map((item, i) => {
          const y = 104 + i * 34;
          const active = item === "Revenue";
          return (
            <g key={item}>
              {active && <rect x="12" y={y} width="176" height="26" rx="6" fill="#EEF2FF" />}
              <rect x="24" y={y + 8} width="10" height="10" rx="2" fill={active ? "#4F46E5" : "#D1D5DB"} />
              <text
                x="44"
                y={y + 17}
                fontSize="12"
                fontWeight={active ? 600 : 400}
                fill={active ? "#4338CA" : "#4B5563"}
              >
                {item}
              </text>
            </g>
          );
        })}

        {/* Page header */}
        <text x="230" y="76" fontSize="18" fontWeight="700" fill="#111827">
          Revenue
        </text>
        <text x="230" y="96" fontSize="11" fill="#6B7280">
          Last 12 months
        </text>
        <rect x="740" y="58" width="110" height="28" rx="6" fill="#FFFFFF" stroke="#E5E7EB" />
        <text x="795" y="76" fontSize="11" fill="#374151" textAnchor="middle">
          Export CSV
        </text>

        {/* Stat cards */}
        {stats.map((s, i) => {
          const x = 230 + i * 207;
          return (
            <g key={s.label}>
              <rect x={x} y="116" width="196" height="78" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
              <text x={x + 16} y="140" fontSize="11" fill="#6B7280">
                {s.label}
              </text>
              <text x={x + 16} y="167" fontSize="20" fontWeight="700" fill="#111827">
                {s.value}
              </text>
              <text x={x + 16} y="184" fontSize="10" fill="#059669">
                {s.delta}
              </text>
            </g>
          );
        })}

        {/* Chart card */}
        <rect x="230" y="210" width="620" height="312" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
        <text x="250" y="238" fontSize="12" fontWeight="600" fill="#111827">
          Monthly recurring revenue
        </text>
        <text x="830" y="238" fontSize="10" fill="#6B7280" textAnchor="end">
          USD
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 492 - i * 50.5;
          return (
            <g key={i}>
              <line x1="290" y1={y} x2="830" y2={y} stroke="#F0F1F5" />
              <text x="280" y={y + 3} fontSize="9" fill="#9CA3AF" textAnchor="end">
                {`$${i * 40}K`}
              </text>
            </g>
          );
        })}
        <path d={area} fill={`url(#area-${uid})`} />
        <path d={line} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={last[0]} cy={last[1]} r="5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
        <rect x={last[0] - 62} y={last[1] - 36} width="56" height="22" rx="5" fill="#111827" />
        <text x={last[0] - 34} y={last[1] - 21} fontSize="10" fontWeight="600" fill="#FFFFFF" textAnchor="middle">
          $148K
        </text>
        {MONTHS.map((m, i) => (
          <text key={m} x={290 + i * (540 / 11)} y="510" fontSize="9" fill="#9CA3AF" textAnchor="middle">
            {m}
          </text>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mini chart used inside designed posts                              */
/* ------------------------------------------------------------------ */

export function MiniChart({
  color = "#A78BFA",
  className = "",
  dashedForecast = false,
}: {
  color?: string;
  className?: string;
  dashedForecast?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const { line, area, last } = buildPath(GROWTH_VALUES, 4, 196, 8, 76, 80);
  return (
    <svg viewBox="0 0 200 80" className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`mc-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#mc-${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {dashedForecast && (
        <path
          d={`M ${last[0]} ${last[1]} L 200 2`}
          stroke={color}
          strokeWidth="2"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <circle cx={last[0]} cy={last[1]} r="3" fill="#fff" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Designed results (the output)                                       */
/* ------------------------------------------------------------------ */

type PlatformKey = "linkedin" | "instagram" | "x" | "facebook";

const PLATFORM_LABEL: Record<PlatformKey, { name: string; Icon: React.ComponentType<{ className?: string }> }> = {
  linkedin: { name: "LinkedIn", Icon: Linkedin },
  instagram: { name: "Instagram", Icon: Instagram },
  x: { name: "X", Icon: Twitter },
  facebook: { name: "Facebook", Icon: Facebook },
};

function PlatformTag({ platform, dark = true }: { platform: PlatformKey; dark?: boolean }) {
  const { name, Icon } = PLATFORM_LABEL[platform];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold backdrop-blur ${
        dark ? "bg-black/35 text-white/90" : "bg-slate-900/5 text-slate-600"
      }`}
    >
      <Icon className="h-2.5 w-2.5" />
      {name}
    </span>
  );
}

function BrowserFrame({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-lg shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ${
        light ? "bg-white ring-slate-200" : "bg-[#0F1220] ring-white/15"
      }`}
    >
      {children}
    </div>
  );
}

export interface ResultCardDef {
  id: string;
  title: string;
  platform: PlatformKey;
  render: () => React.ReactNode;
}

export const RESULT_CARDS: ResultCardDef[] = [
  {
    id: "milestone",
    title: "Revenue milestone",
    platform: "linkedin",
    render: () => (
      <div className="relative flex h-full flex-col bg-[#0E0B24] p-4">
        <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-violet-600/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-blue-600/35 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-indigo-500" />
            <span className="text-[9px] font-semibold text-white/80">PulseMetrics</span>
          </div>
          <PlatformTag platform="linkedin" />
        </div>
        <h4 className="relative mt-3 text-[17px] font-extrabold leading-[1.15] tracking-tight text-white">
          We just crossed <span className="text-violet-300">$148K</span> in monthly revenue
        </h4>
        <div className="relative mt-auto">
          <BrowserFrame light>
            <GrowthDashboardShot className="block h-auto w-full" />
          </BrowserFrame>
          <div className="absolute -right-1 -top-3 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-bold text-emerald-950 shadow-lg">
            <TrendingUp className="h-2.5 w-2.5" />
            +38.4% this year
          </div>
        </div>
        <div className="relative mt-3 flex items-center justify-between">
          <span className="text-[9px] text-white/60">Thank you to every customer</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#0E0B24]">See how</span>
        </div>
      </div>
    ),
  },
  {
    id: "launch",
    title: "Product launch",
    platform: "instagram",
    render: () => (
      <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-[#FB923C] via-[#DB2777] to-[#6D28D9] p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            New
          </span>
          <PlatformTag platform="instagram" />
        </div>
        <h4 className="mt-2.5 text-[22px] font-black leading-none tracking-tight text-white">
          Meet
          <br />
          Insights 2.0
        </h4>
        <p className="mt-1.5 text-[9.5px] leading-snug text-white/85">Forecasts, alerts and reports in one place.</p>
        <div className="relative mx-auto mt-auto w-[120px] translate-y-6 rounded-[20px] border-[3px] border-[#111] bg-[#0B0D14] p-2 shadow-2xl">
          <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/20" />
          <div className="text-[8px] text-white/60">Revenue</div>
          <div className="text-[13px] font-bold text-white">$148,290</div>
          <MiniChart color="#F472B6" className="mt-1 h-10 w-full" />
          <div className="mt-2 grid grid-cols-2 gap-1">
            <div className="rounded-md bg-white/5 p-1">
              <div className="text-[7px] text-white/50">Customers</div>
              <div className="text-[9px] font-bold text-white">2,481</div>
            </div>
            <div className="rounded-md bg-white/5 p-1">
              <div className="text-[7px] text-white/50">Churn</div>
              <div className="text-[9px] font-bold text-emerald-300">1.9%</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "feature",
    title: "Feature spotlight",
    platform: "x",
    render: () => (
      <div className="flex h-full flex-col bg-[#F8FAFC] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-600">Feature spotlight</span>
          <PlatformTag platform="x" dark={false} />
        </div>
        <h4 className="mt-2.5 font-serif text-[21px] font-semibold leading-[1.1] text-slate-900">
          Forecast next quarter in one click.
        </h4>
        <div className="mt-auto rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_-14px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-slate-500">Projected revenue</span>
            <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold text-violet-700">Q1 forecast</span>
          </div>
          <div className="mt-1 text-[15px] font-bold text-slate-900">$182K</div>
          <MiniChart color="#7C3AED" dashedForecast className="mt-1 h-12 w-full" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[8px] font-bold text-white">P</span>
          <span className="text-[9px] font-medium text-slate-600">@pulsemetrics</span>
        </div>
      </div>
    ),
  },
  {
    id: "release",
    title: "Developer release",
    platform: "x",
    render: () => (
      <div className="relative flex h-full flex-col bg-[#070A13] p-4">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[9px] text-cyan-300">v2.4.0</span>
          <PlatformTag platform="x" />
        </div>
        <h4 className="relative mt-2.5 font-mono text-[18px] font-bold leading-tight text-white">
          Our SDK is now
          <br />
          <span className="text-cyan-300">3x faster.</span>
        </h4>
        <div className="relative mt-auto overflow-hidden rounded-lg border border-white/10 bg-[#0D1220]">
          <div className="flex items-center gap-1 border-b border-white/5 px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="ml-1.5 font-mono text-[7.5px] text-white/40">terminal</span>
          </div>
          <div className="space-y-1 p-2.5 font-mono text-[8.5px] leading-relaxed">
            <div className="text-white/50">
              <span className="text-cyan-300">$</span> npm install @pulse/sdk
            </div>
            <div className="text-emerald-300">added 1 package in 0.8s</div>
            <div className="text-white/50">
              <span className="text-cyan-300">$</span> pulse bench
            </div>
            <div className="text-white">
              p99 latency <span className="text-cyan-300">1.8ms</span>
            </div>
          </div>
        </div>
        <div className="relative mt-3 flex items-center gap-1.5 text-[9px] text-white/60">
          <Zap className="h-3 w-3 text-cyan-300" />
          Read the release notes
        </div>
      </div>
    ),
  },
  {
    id: "results",
    title: "Customer results",
    platform: "linkedin",
    render: () => (
      <div className="relative flex h-full flex-col bg-gradient-to-b from-[#053B2F] to-[#071410] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">Case study</span>
          <PlatformTag platform="linkedin" />
        </div>
        <h4 className="mt-2.5 text-[17px] font-extrabold leading-[1.15] text-white">
          How Northwind cut churn by 41% in 90 days
        </h4>
        <div className="mt-auto grid grid-cols-2 gap-1.5">
          {[
            { v: "41%", l: "Less churn" },
            { v: "3.2x", l: "More demos" },
            { v: "12 hrs", l: "Saved weekly" },
            { v: "4.9", l: "Team rating" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] p-2">
              <div className="text-[15px] font-extrabold text-white">{s.v}</div>
              <div className="text-[8.5px] text-emerald-200/80">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1 text-[9px] text-white/70">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
          ))}
          <span className="ml-1">&ldquo;A clear win for our team.&rdquo;</span>
        </div>
      </div>
    ),
  },
  {
    id: "before-after",
    title: "Before and after",
    platform: "instagram",
    render: () => (
      <div className="flex h-full flex-col bg-[#0B0D14]">
        <div className="relative h-1/2 bg-[#E5E7EB] p-3">
          <span className="absolute left-2 top-2 z-10 rounded bg-slate-900/80 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
            Before
          </span>
          <div className="absolute right-2 top-2 z-10">
            <PlatformTag platform="instagram" />
          </div>
          <GrowthDashboardShot className="mt-3 block h-auto w-full opacity-80 grayscale" />
        </div>
        <div className="relative flex h-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-900 p-3">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-fuchsia-500/40 blur-2xl" />
          <span className="relative w-fit rounded bg-white px-1.5 py-0.5 text-[8px] font-bold uppercase text-violet-800">After</span>
          <div className="relative mt-1.5 text-[13px] font-extrabold leading-tight text-white">Revenue up 38% this year</div>
          <div className="relative mt-1.5 rounded-md bg-white/10 p-1.5 ring-1 ring-white/20">
            <MiniChart color="#C4B5FD" className="h-9 w-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "app",
    title: "App showcase",
    platform: "facebook",
    render: () => (
      <div className="relative flex h-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#1E3A8A] via-[#172554] to-[#0B0D14] p-4 text-center">
        <div className="flex w-full items-center justify-between">
          <span className="text-[9px] font-semibold text-blue-200">Habitly</span>
          <PlatformTag platform="facebook" />
        </div>
        <h4 className="mt-2 text-[16px] font-extrabold leading-tight text-white">Build habits that actually stick</h4>
        <div className="relative mt-auto w-[118px] translate-y-5 rounded-[20px] border-[3px] border-[#0a0a0a] bg-[#0F172A] px-2.5 pb-4 pt-3 shadow-2xl">
          <div className="text-[8px] text-white/60">Today</div>
          <div className="relative mx-auto mt-1.5 h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#60A5FA" strokeWidth="3.5" strokeDasharray="86.7 94.2" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[12px] font-bold text-white">92%</span>
              <span className="text-[6.5px] text-white/50">of goal</span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {["Morning run", "Read 20 pages"].map((h) => (
              <div key={h} className="flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-1 text-left">
                <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-400">
                  <Check className="h-2 w-2 text-blue-950" />
                </span>
                <span className="text-[7.5px] text-white/80">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "changelog",
    title: "Weekly update",
    platform: "linkedin",
    render: () => (
      <div className="relative flex h-full flex-col bg-[#14110B] p-4">
        <div className="pointer-events-none absolute -right-10 top-10 h-36 w-36 rounded-full bg-amber-500/25 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-amber-300">Week 42</span>
          <PlatformTag platform="linkedin" />
        </div>
        <h4 className="relative mt-2.5 text-[18px] font-extrabold leading-[1.1] text-white">What we shipped this week</h4>
        <ul className="relative mt-auto space-y-1.5">
          {[
            { t: "Exports are 3x faster", I: Zap },
            { t: "Dark mode for reports", I: Moon },
            { t: "Slack alerts for churn", I: Bell },
            { t: "New team roles", I: Users },
            { t: "Faster dashboard loading", I: Gauge },
          ].map(({ t, I }) => (
            <li key={t} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-2 py-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-400/15 text-amber-300">
                <I className="h-2.5 w-2.5" />
              </span>
              <span className="text-[9.5px] font-medium text-white/85">{t}</span>
            </li>
          ))}
        </ul>
        <div className="relative mt-3 flex items-center gap-1 text-[9px] font-semibold text-amber-300">
          Full changelog <ArrowUpRight className="h-3 w-3" />
        </div>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Smooth Animated Moving Carousel of Generated App Results            */
/* ------------------------------------------------------------------ */

const PLATFORM_DIMENSIONS: Record<PlatformKey, string> = {
  linkedin: "LinkedIn • 1200 x 1200",
  instagram: "Instagram • 1080 x 1350",
  x: "X / Twitter • 1600 x 900",
  facebook: "Facebook • 1200 x 630",
};

export function MovingResultsCarousel() {
  const [paused, setPaused] = useState(false);
  const trackCards = [...RESULT_CARDS, ...RESULT_CARDS];

  return (
    <section
      id="results-carousel"
      className="relative overflow-hidden border-y border-white/10 bg-[#080B13] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300">
              <Layers className="h-3.5 w-3.5 text-violet-400" />
              <span>GENERATED SOCIAL POST GALLERY</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Real Posts Created from One Growth Screenshot
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
              Every card below was generated from the same dashboard screenshot,
              automatically styled and sized for each social network.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play results carousel" : "Pause results carousel"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {paused ? (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Play Carousel</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause Carousel</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="carousel-edge-mask mt-10 overflow-hidden py-3">
        <div
          className={`animate-marquee-left gap-6 px-4 ${
            paused ? "marquee-paused" : ""
          }`}
        >
          {trackCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="group w-[290px] shrink-0 rounded-2xl border border-white/10 bg-[#121520] p-3.5 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-500/40"
            >
              <div className="h-[310px] w-full overflow-hidden rounded-xl border border-white/10 shadow-inner">
                {card.render()}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <div className="text-xs font-bold text-white">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {PLATFORM_DIMENSIONS[card.platform]}
                  </div>
                </div>
                <span className="rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-300">
                  Ready to Post
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
