"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { CONTENT_STYLES, SOCIAL_PLATFORMS } from "@/lib/constants";
import { SocialPlatformId } from "@/types";

export default function TemplatesPage() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatformId>("linkedin-post");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Studio Archetype Library
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Social Design Templates ({CONTENT_STYLES.length})
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Choose a target platform and launch any studio design archetype with
            your own screenshot.
          </p>
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) =>
            setSelectedPlatform(e.target.value as SocialPlatformId)
          }
          aria-label="Target Platform"
          className="rounded-xl border border-white/15 bg-[#121520] px-4 py-2.5 text-xs font-semibold text-white"
        >
          {SOCIAL_PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.width}×{p.height})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_STYLES.map((style) => (
          <div
            key={style.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121520] p-6 transition hover:border-violet-500/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: style.accentHex }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {style.badge}
                  </span>
                </div>
                <LayoutTemplate className="h-4 w-4 text-slate-500" />
              </div>

              {/* Visual style miniature mockup */}
              <div
                className="mt-4 flex h-36 flex-col justify-between rounded-xl border border-white/10 p-4"
                style={{
                  background: `radial-gradient(circle at 80% 20%, ${style.accentHex}33 0%, #090B10 85%)`,
                }}
              >
                <div className="h-2.5 w-24 rounded-full bg-white/80" />
                <div className="mx-auto h-20 w-4/5 rounded-lg border border-white/15 bg-[#121624] p-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div
                    className="mt-2 h-8 w-full rounded opacity-40"
                    style={{ backgroundColor: style.accentHex }}
                  />
                </div>
              </div>

              <h2 className="mt-4 text-lg font-bold text-white">
                {style.name}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {style.description}
              </p>
            </div>

            <Link
              href={`/dashboard/create?style=${encodeURIComponent(
                style.id
              )}&platform=${selectedPlatform}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600/20 border border-violet-500/30 py-2.5 text-xs font-bold text-violet-200 transition hover:bg-violet-600 hover:text-white"
            >
              <span>Use {style.name} Template</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
