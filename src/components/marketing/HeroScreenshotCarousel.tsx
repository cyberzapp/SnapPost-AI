"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, Upload, ScanSearch, LayoutGrid } from "lucide-react";
import { GrowthDashboardShot, RESULT_CARDS } from "@/components/marketing/ShowcaseVisuals";

type Phase = "screen" | "zoom" | "carousel";

const CARD_W = 232;
const CARD_H = 290;
const RADIUS = 360;
const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS: { phase: Phase; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
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
    const t1 = setTimeout(() => setPhase("zoom"), 1600);
    const t2 = setTimeout(() => setPhase("carousel"), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [runId, reduceMotion]);

  const angle = 360 / RESULT_CARDS.length;
  const activeStep = STEPS.findIndex((s) => s.phase === phase);
  const spinning = phase === "carousel" && !paused && !hovering;

  return (
    <div className="relative">
      {/* Stage */}
      <div
        className="relative h-[420px] overflow-hidden sm:h-[540px] lg:h-[600px]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Floor glow */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] bg-violet-600/25 blur-3xl" />

        {/* Layer A: plain screenshot that slowly zooms out */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
          <motion.div
            className="w-full max-w-[880px]"
            initial={false}
            animate={
              phase === "screen"
                ? { scale: 1, opacity: 1, y: 0 }
                : phase === "zoom"
                ? { scale: 0.34, opacity: 1, y: 0 }
                : { scale: 0.34, opacity: 0, y: 0 }
            }
            transition={
              phase === "zoom"
                ? { duration: 2.4, ease: EASE }
                : { duration: 0.7, ease: "easeOut" }
            }
          >
            <div className="overflow-hidden rounded-[14px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              <GrowthDashboardShot className="block h-auto w-full" />
            </div>
          </motion.div>
        </div>

        {/* Layer B: 3D carousel of generated results */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          initial={false}
          animate={
            phase === "screen"
              ? { opacity: 0, scale: 0.86 }
              : phase === "zoom"
              ? { opacity: 0.55, scale: 0.94 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: phase === "zoom" ? 2.4 : 0.9, ease: EASE }}
        >
          <div className="scale-[0.58] sm:scale-[0.82] lg:scale-100" style={{ perspective: 1500 }}>
            <div style={{ transformStyle: "preserve-3d", transform: "rotateX(-7deg)" }}>
              <div
                className={`ring-spin ${spinning ? "" : "ring-spin-paused"}`}
                style={{
                  position: "relative",
                  width: CARD_W,
                  height: CARD_H,
                  transformStyle: "preserve-3d",
                }}
              >
                {RESULT_CARDS.map((card, i) => (
                  <div
                    key={card.id}
                    className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                    style={{
                      transform: `rotateY(${i * angle}deg) translateZ(${RADIUS}px)`,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    aria-label={`${card.title} post example`}
                  >
                    {card.render()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Step indicator and controls */}
      <div className="mx-auto mt-2 flex max-w-3xl flex-col items-center justify-between gap-4 sm:flex-row">
        <ol className="flex flex-wrap items-center justify-center gap-2">
          {STEPS.map((step, i) => {
            const done = i <= activeStep;
            return (
              <li key={step.phase} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-500 ${
                    i === activeStep
                      ? "border-violet-500/60 bg-violet-500/15 text-white"
                      : done
                      ? "border-white/10 bg-white/[0.04] text-slate-300"
                      : "border-white/5 text-slate-500"
                  }`}
                >
                  <step.Icon className={`h-3.5 w-3.5 ${i === activeStep ? "text-violet-300" : ""}`} />
                  {step.label}
                </span>
                {i < STEPS.length - 1 && <span className="hidden h-px w-5 bg-white/10 sm:block" />}
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:text-white disabled:opacity-40"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused(false);
              setRunId((r) => r + 1);
            }}
            aria-label="Replay animation"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
