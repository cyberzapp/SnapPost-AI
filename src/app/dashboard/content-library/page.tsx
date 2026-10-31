"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Copy, Check, Search, PlusCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function ContentLibraryPage() {
  const { projects } = useAppStore();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const projectsWithCaptions = projects.filter(
    (p) =>
      p.captions &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.productName.toLowerCase().includes(search.toLowerCase()))
  );

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Generated Copy Repository
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            AI Content Library
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Access and copy all headlines, hooks, platform captions, and
            hashtags generated across your projects.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow hover:bg-violet-500"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Generate New Copy</span>
        </Link>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter content library by project or product name..."
          className="w-full rounded-xl border border-white/10 bg-[#121520] py-2.5 pl-10 pr-4 text-xs text-white"
        />
      </div>

      {projectsWithCaptions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-500" />
          <h3 className="mt-3 text-base font-bold text-white">
            No AI Copy Entries Found
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Generate a social post in Create New Post to populate your AI
            Content Library.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projectsWithCaptions.map((proj) => {
            const cap = proj.captions!;
            return (
              <div
                key={proj.id}
                className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {proj.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Platform: {cap.platformId} • Tone: {cap.tone}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cap.hashtags.map((h) => (
                      <span
                        key={h}
                        className="rounded bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {cap.captions.map((c, idx) => {
                    const cid = `${proj.id}-c-${idx}`;
                    return (
                      <div
                        key={cid}
                        className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0B0D14] p-4"
                      >
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-violet-300">
                              {c.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {c.characterCount}c
                            </span>
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">
                            {c.body}
                          </pre>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyText(cid, c.body)}
                          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10"
                        >
                          {copiedId === cid ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-300">
                                Copied to Clipboard
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Caption</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
