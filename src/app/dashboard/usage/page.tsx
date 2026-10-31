"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  ArrowUpRight,
  History,
  Activity,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CREDIT_COSTS } from "@/lib/constants";

export default function UsageAndCreditsPage() {
  const { user, transactions, generationHistory } = useAppStore();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Metered AI Telemetry
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Usage &amp; AI Credits
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track your real-time credit balance, transaction ledger, and AI
            generation history.
          </p>
        </div>

        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow hover:bg-violet-500"
        >
          <span>Upgrade Monthly Allowance</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Balance & Cost Schedule */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Credit Balance
            </span>
            <Coins className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">
              {user?.creditsBalance ?? 0}
            </span>
            <span className="text-sm text-slate-400">
              / {user?.monthlyAllowance ?? 25} monthly credits
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    ((user?.creditsBalance ?? 0) /
                      Math.max(1, user?.monthlyAllowance ?? 25)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Total consumed this billing period:{" "}
            <strong className="text-white">{user?.totalConsumed ?? 0}</strong>{" "}
            credits.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 lg:col-span-7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Standard AI Credit Cost Schedule
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Screenshot Vision Analysis",
                cost: CREDIT_COSTS.screenshot_analysis,
              },
              {
                label: "Platform AI Copy Generation",
                cost: CREDIT_COSTS.copy_generation,
              },
              {
                label: "Generate Design Variations",
                cost: CREDIT_COSTS.design_generation,
              },
              {
                label: "Regenerate Design Pack",
                cost: CREDIT_COSTS.design_regeneration,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-[#0B0D14] p-3.5"
              >
                <div className="font-mono text-lg font-extrabold text-violet-400">
                  {item.cost} {item.cost === 1 ? "Credit" : "Credits"}
                </div>
                <div className="mt-1 text-xs text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Transactions Ledger */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <History className="h-4 w-4 text-violet-400" />
          <h2 className="text-base font-bold text-white">
            Credit Transaction Ledger ({transactions.length})
          </h2>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Action Type</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Credits Delta</th>
                <th className="pb-3 font-semibold">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="text-slate-200">
                  <td className="py-3 font-mono text-[11px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-violet-300">
                      {tx.actionType}
                    </span>
                  </td>
                  <td className="py-3">{tx.description}</td>
                  <td
                    className={`py-3 font-mono font-bold ${
                      tx.amount >= 0 ? "text-emerald-400" : "text-amber-300"
                    }`}
                  >
                    {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    {tx.balanceAfter} cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation History */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            AI Generation History ({generationHistory.length})
          </h2>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Platform / Style</th>
                <th className="pb-3 font-semibold">Engine</th>
                <th className="pb-3 font-semibold">Latency</th>
                <th className="pb-3 font-semibold">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {generationHistory.map((item) => (
                <tr key={item.id} className="text-slate-200">
                  <td className="py-3 font-mono text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 font-semibold text-white">
                    {item.projectName || "Project"}
                  </td>
                  <td className="py-3 uppercase text-violet-300">
                    {item.generationType}
                  </td>
                  <td className="py-3 text-slate-400">
                    {item.platformId} • {item.stylePreset}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-violet-400" />
                      {item.providerUsed}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">
                    {item.latencyMs}ms
                  </td>
                  <td className="py-3 font-mono font-bold text-amber-300">
                    {item.creditsUsed} cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
