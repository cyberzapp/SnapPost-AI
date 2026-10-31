"use client";

import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  FolderKanban,
  Sparkles,
  Coins,
  ArrowRight,
  Sliders,
  Download,
  UploadCloud,
  Eye,
  Wand2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CONTENT_STYLES, SOCIAL_PLATFORMS } from "@/lib/constants";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import { downloadSingleVariation } from "@/lib/export-engine";

export default function DashboardOverviewPage() {
  const { user, projects, brandKits } = useAppStore();

  const totalProjects = projects.length;
  const totalVariationsGenerated = projects.reduce(
    (acc, p) => acc + (p.variations?.length || 0),
    0
  );
  const recentProjects = projects.slice(0, 4);
  const recentTemplates = CONTENT_STYLES.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-[#141829] via-[#171C30] to-[#121520] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <span>Workspace Active • {user?.planTier} Plan</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
            Welcome back, {user?.fullName || "Creator"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Transform your latest product screenshot into scroll-stopping social
            posts and platform captions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Post</span>
          </Link>
          <Link
            href="/dashboard/brand-kit"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <span>Brand Kits ({brandKits.length})</span>
          </Link>
        </div>
      </div>

      {/* Real Database Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Projects
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            {totalProjects}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Saved in your workspace with editable layers
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Posts &amp; Variations Generated
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            {totalVariationsGenerated}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Multi-platform social assets &amp; caption sets
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Remaining AI Credits
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-400">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            {user?.creditsBalance ?? 0}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {user?.totalConsumed ?? 0} credits consumed this cycle
          </p>
        </div>
      </div>

      {/* Quick-Start Workflow Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            Quick-Start Screenshot-to-Social Workflow
          </h2>
          <Link
            href="/dashboard/create"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300"
          >
            Launch Studio →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {[
            {
              step: "1. Upload Screenshot",
              desc: "Drop any PNG, JPG, or WebP app capture.",
              icon: UploadCloud,
              href: "/dashboard/create",
            },
            {
              step: "2. AI Vision Analysis",
              desc: "Extract visible UI features & marketing hooks.",
              icon: Eye,
              href: "/dashboard/create",
            },
            {
              step: "3. Generate Variations",
              desc: "Create 3–5 designs + platform-native copy.",
              icon: Wand2,
              href: "/dashboard/create",
            },
            {
              step: "4. Customize & Export",
              desc: "Fine-tune layers & download Ultra-HD PNG/ZIP.",
              icon: Sliders,
              href: "/dashboard/editor",
            },
          ].map((w) => {
            const Icon = w.icon;
            return (
              <Link
                key={w.step}
                href={w.href}
                className="group rounded-xl border border-white/10 bg-[#0B0D14] p-4 transition hover:border-violet-500/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400 group-hover:bg-violet-600 group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-white">{w.step}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{w.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Projects</h2>
            <p className="text-xs text-slate-400">
              Continue editing your generated social designs or export directly.
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recentProjects.map((project) => {
            const activeVar =
              project.variations.find(
                (v) => v.id === project.activeVariationId
              ) || project.variations[0];
            const platformSpec =
              SOCIAL_PLATFORMS.find((p) => p.id === project.platformId) ||
              SOCIAL_PLATFORMS[0];

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121520] p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {platformSpec.name} ({platformSpec.width}×
                        {platformSpec.height}) • {project.contentStyle}
                      </p>
                    </div>
                    <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-300">
                      {project.variations.length} Variations
                    </span>
                  </div>

                  {activeVar && (
                    <div className="mt-4 flex justify-center overflow-hidden rounded-xl border border-white/5 bg-[#090B10] p-3">
                      <DesignCanvasRenderer
                        width={activeVar.width}
                        height={activeVar.height}
                        document={activeVar.document}
                        scale={0.25}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                  <Link
                    href={`/dashboard/editor?projectId=${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Customize in Editor</span>
                  </Link>

                  {activeVar && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadSingleVariation(
                          activeVar,
                          "png",
                          user?.planTier !== "FREE"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export PNG</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Used Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Popular Design Style Presets
            </h2>
            <p className="text-xs text-slate-400">
              Launch a new post directly with a pre-configured studio style.
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300"
          >
            Browse All 12 Styles →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentTemplates.map((style) => (
            <Link
              key={style.id}
              href={`/dashboard/create?style=${encodeURIComponent(style.id)}`}
              className="group rounded-xl border border-white/10 bg-[#121520] p-4 transition hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: style.accentHex }}
                />
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  {style.badge}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white group-hover:text-violet-300">
                {style.name}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{style.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
