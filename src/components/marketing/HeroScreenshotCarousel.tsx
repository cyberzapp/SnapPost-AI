"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Pause,
  Play,
  RotateCcw,
  Upload,
  ScanSearch,
  LayoutGrid,
  TrendingUp,
  Linkedin,
} from "lucide-react";
import {
  GrowthDashboardShot,
  RESULT_CARDS,
} from "@/components/marketing/ShowcaseVisuals";

type Phase = "screen" | "zoom" | "fit" | "carousel";

const CARD_W = 232;
const CARD_H = 290;
const RADIUS = 360;
const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { phase: "screen", label: "Your screenshot", Icon: Upload },
  { phase: "zoom", label: "We read and design", Icon: ScanSearch },
  { phase: "carousel", label: "Posts ready to share", Icon: LayoutGrid },
];

export function HeroScreenshotCarousel() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("screen");
  const [runId, setRunId] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("carousel");
      return;
    }
    setPhase("screen");
    const t1 = setTimeout(() => setPhase("zoom"), 1800);
    const t2 = setTimeout(() => setPhase("fit"), 4200);
    const t3 = setTimeout(() => setPhase("carousel"), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [runId, reduceMotion]);

  const angle = 360 / RESULT_CARDS.length;
  const activeStep =
    phase === "screen" ? 0 : phase === "zoom" ? 1 : 2;
  const spinning = phase === "carousel" && !paused && !hovering;

  return (
    <div className="relative">
      {/* Hero Visual Transformation Stage */}
      <div
        className="relative h-[440px] overflow-hidden sm:h-[540px] lg:h-[620px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Ambient floor glow */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 h-28 w-[72%] -translate-x-1/2 rounded-[50%] bg-violet-600/20 blur-3xl" />

        {/* 3D Perspective Stage Container */}
        <div
          className="relative flex h-full w-full items-center justify-center scale-[0.62] sm:scale-[0.82] lg:scale-100"
          style={{ perspective: 1500 }}
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(-7deg)",
            }}
          >
            <div
              className={`ring-spin ${spinning ? "" : "ring-spin-paused"}`}
              style={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
                transformStyle: "preserve-3d",
              }}
            >
              {RESULT_CARDS.map((card, i) => {
                if (i === 0) {
                  // Card 0: Front card that zooms down, automatically fits into the social card, and then joins the rotating carousel
                  return (
                    <div
                      key={card.id}
                      className="absolute inset-0"
                      style={{
                        transform: `rotateY(0deg) translateZ(${RADIUS}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {/* Card Shell (dark indigo background, headline, branding) */}
                      <motion.div
                        className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#0E0B24] p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
                        initial={false}
                        animate={{
                          opacity: phase === "screen" ? 0 : 1,
                        }}
                        transition={{
                          duration: phase === "zoom" ? 2.0 : 0.4,
                          delay: phase === "zoom" ? 0.35 : 0,
                          ease: EASE,
                        }}
                      >
                        <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-violet-600/50 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-blue-600/35 blur-3xl" />

                        {/* Top Row: PulseMetrics + LinkedIn badge */}
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="h-3.5 w-3.5 rounded bg-indigo-500" />
                            <span className="text-[9px] font-semibold text-white/80">
                              PulseMetrics
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[9px] font-semibold text-white/90 backdrop-blur">
                            <Linkedin className="h-2.5 w-2.5" />
                            LinkedIn
                          </span>
                        </div>

                        {/* Headline */}
                        <h4 className="relative mt-3 text-[17px] font-extrabold leading-[1.15] tracking-tight text-white">
                          We just crossed{" "}
                          <span className="text-violet-300">$148K</span> in
                          monthly revenue
                        </h4>

                        {/* Bottom slot reservation for the framed screenshot */}
                        <div className="relative mt-auto h-[123px] w-full" />

                        {/* Card Footer */}
                        <div className="relative mt-3 flex items-center justify-between">
                          <span className="text-[9px] text-white/60">
                            Thank you to every customer
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#0E0B24]">
                            See how
                          </span>
                        </div>
                      </motion.div>

                      {/* The Growth Graph Screenshot that Zooms Out and Automatically Fits into the Slot */}
                      <motion.div
                        className="pointer-events-none absolute left-4 right-4 bottom-[46px] z-20 origin-center"
                        initial={false}
                        animate={
                          phase === "screen"
                            ? {
                                scale: 3.7,
                                y: -58,
                                opacity: 1,
                              }
                            : {
                                scale: 1,
                                y: 0,
                                opacity: 1,
                              }
                        }
                        transition={{
                          duration: phase === "zoom" ? 2.4 : 0.6,
                          ease: EASE,
                        }}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-slate-200">
                          <GrowthDashboardShot className="block h-auto w-full" />
                        </div>

                        {/* +38.4% highlight badge that smoothly appears when zoomed into card */}
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: phase === "screen" ? 0 : 1,
                            scale: phase === "screen" ? 0.5 : 1,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: phase === "zoom" ? 1.5 : 0,
                          }}
                          className="absolute -right-1 -top-3 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-bold text-emerald-950 shadow-lg"
                        >
                          <TrendingUp className="h-2.5 w-2.5" />
                          +38.4% this year
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                }

                // Cards 1 through 7: Hidden during screen & zoom; smoothly fade in during fit & carousel
                return (
                  <motion.div
                    key={card.id}
                    className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
                    style={{
                      transform: `rotateY(${i * angle}deg) translateZ(${RADIUS}px)`,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    initial={false}
                    animate={{
                      opacity:
                        phase === "screen" || phase === "zoom" ? 0 : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    aria-label={`${card.title} post example`}
                  >
                    {card.render()}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator and Controls (Dividing lines removed for a clean, seamless look) */}
      <div className="mx-auto mt-4 flex max-w-3xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <ol className="flex flex-wrap items-center justify-center gap-2.5">
          {STEPS.map((step, i) => {
            const done = i <= activeStep;
            return (
              <li key={step.phase} className="flex items-center">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-500 ${
                    i === activeStep
                      ? "border-violet-500/60 bg-violet-500/15 text-white shadow-glow"
                      : done
                      ? "border-white/10 bg-white/[0.04] text-slate-300"
                      : "border-white/5 text-slate-500"
                  }`}
                >
                  <step.Icon
                    className={`h-3.5 w-3.5 ${
                      i === activeStep ? "text-violet-300" : ""
                    }`}
                  />
                  <span>{step.label}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            disabled={phase !== "carousel"}
            aria-label={paused ? "Play carousel" : "Pause carousel"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            {paused ? (
              <Play className="h-4 w-4 text-emerald-400" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused(false);
              setRunId((r) => r + 1);
            }}
            aria-label="Replay animation"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
