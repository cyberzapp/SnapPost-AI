"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sliders,
  Download,
  Copy,
  Trash2,
  Edit3,
  Check,
  PlusCircle,
  Archive,
  FolderKanban,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import {
  downloadAllVariationsAsZip,
  downloadSingleVariation,
} from "@/lib/export-engine";

export default function MyProjectsPage() {
  const {
    user,
    projects,
    updateProject,
    duplicateProject,
    deleteProject,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const filteredProjects = projects
    .filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contentStyle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform =
        platformFilter === "all" || p.platformId === platformFilter;
      return matchesQuery && matchesPlatform;
    })
    .sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return dateFilter === "newest" ? tB - tA : tA - tB;
    });

  const handleRenameSubmit = (id: string) => {
    if (editingName.trim()) {
      updateProject(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Workspace Repository
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            My Projects ({projects.length})
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Search, filter, rename, duplicate, edit, or export your saved social
            post projects.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow hover:bg-violet-500"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#121520] p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, product, or style..."
            className="w-full rounded-xl border border-white/10 bg-[#0B0D14] py-2.5 pl-10 pr-4 text-xs text-white focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            aria-label="Filter by Social Platform"
            className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2.5 text-xs font-medium text-white"
          >
            <option value="all">All Platforms</option>
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value as "newest" | "oldest")
            }
            aria-label="Sort by Creation Date"
            className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2.5 text-xs font-medium text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#121520] p-12 text-center">
          <FolderKanban className="h-10 w-10 text-slate-500" />
          <h3 className="mt-4 text-base font-bold text-white">
            No matching projects found
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Try clearing your search filter or create a new screenshot-to-social
            project.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
          >
            Create New Post →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const activeVar =
              project.variations.find(
                (v) => v.id === project.activeVariationId
              ) || project.variations[0];
            const platform =
              SOCIAL_PLATFORMS.find((p) => p.id === project.platformId) ||
              SOCIAL_PLATFORMS[0];

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121520] p-5"
              >
                <div>
                  {/* Title & Inline Rename */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {editingId === project.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full rounded-lg border border-violet-500 bg-[#0B0D14] px-2.5 py-1 text-sm font-bold text-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameSubmit(project.id)}
                            className="rounded-lg bg-emerald-600 p-1.5 text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-base font-bold text-white">
                            {project.name}
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(project.id);
                              setEditingName(project.name);
                            }}
                            title="Rename Project"
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        {platform.name} ({platform.width}×{platform.height}) •{" "}
                        {project.contentStyle} • Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateProject(project.id)}
                        title="Duplicate Project"
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        title="Delete Project"
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Canvas Preview */}
                  {activeVar && (
                    <div className="mt-4 flex justify-center overflow-hidden rounded-xl border border-white/5 bg-[#090B10] p-3">
                      <DesignCanvasRenderer
                        width={activeVar.width}
                        height={activeVar.height}
                        document={activeVar.document}
                        scale={0.26}
                      />
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                  <Link
                    href={`/dashboard/editor?projectId=${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Open &amp; Edit</span>
                  </Link>

                  <div className="flex items-center gap-2">
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
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PNG</span>
                      </button>
                    )}

                    {project.variations.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadAllVariationsAsZip(
                            project.name,
                            project.variations,
                            "png",
                            user?.planTier !== "FREE"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        <span>ZIP ({project.variations.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
