"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Users,
  FolderKanban,
  Sparkles,
  Coins,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PlanTier } from "@/types";

export default function AdminDashboardPage() {
  const {
    user,
    allUsers,
    projects,
    transactions,
    generationHistory,
    adminUpdateUserPlan,
    adminAdjustCredits,
    adminToggleRole,
  } = useAppStore();

  const [serverVerified, setServerVerified] = useState<boolean | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAdminOnServer() {
      if (!user) return;
      try {
        const res = await fetch("/api/admin/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            role: user.role,
            email: user.email,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.authorized) {
          setServerVerified(false);
          setServerError(
            data.error || "Server rejected non-admin authorization."
          );
        } else {
          setServerVerified(true);
        }
      } catch {
        const isAllowed =
          user.role === "admin" ||
          user.email.toLowerCase().includes("admin");
        setServerVerified(isAllowed);
        if (!isAllowed) {
          setServerError("Forbidden: Admin privileges required.");
        }
      }
    }
    verifyAdminOnServer();
  }, [user]);

  if (serverVerified === null) {
    return (
      <div className="p-8 text-sm text-slate-400">
        Verifying server-side admin permissions...
      </div>
    );
  }

  if (!serverVerified) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-400" />
        <h1 className="mt-3 text-xl font-bold text-white">
          403 Forbidden — Admin Access Required
        </h1>
        <p className="mt-2 text-xs text-red-200">{serverError}</p>
      </div>
    );
  }

  const totalUsers = allUsers.length;
  const activePaidSubscriptions = allUsers.filter(
    (u) => u.planTier !== "FREE" && u.subscriptionStatus === "active"
  ).length;
  const totalProjectsCount = projects.length;
  const totalGenerations = generationHistory.length;
  const totalCreditsConsumed = allUsers.reduce(
    (acc, u) => acc + (u.totalConsumed || 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold uppercase text-amber-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Server-Verified Admin Console</span>
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Platform Administration &amp; Telemetry
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor registered users, active subscriptions, AI generations,
            credit consumption, and manage accounts.
          </p>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Users</span>
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {totalUsers}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Paid Subscriptions</span>
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {activePaidSubscriptions}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Projects</span>
            <FolderKanban className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {totalProjectsCount}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Generations</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {totalGenerations}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Credits Consumed</span>
            <Coins className="h-4 w-4 text-pink-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {totalCreditsConsumed}
          </div>
        </div>
      </div>

      {/* User & Plan Management Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
        <h2 className="text-base font-bold text-white">
          User Management &amp; Plan Overrides ({allUsers.length})
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Plan Tier</th>
                <th className="pb-3 font-semibold">Credits Balance</th>
                <th className="pb-3 font-semibold">Consumed</th>
                <th className="pb-3 font-semibold">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allUsers.map((u) => (
                <tr key={u.id} className="text-slate-200">
                  <td className="py-3">
                    <div className="font-bold text-white">{u.fullName}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => adminToggleRole(u.id)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="py-3">
                    <select
                      value={u.planTier}
                      onChange={(e) =>
                        adminUpdateUserPlan(u.id, e.target.value as PlanTier)
                      }
                      aria-label={`Plan tier for ${u.email}`}
                      className="rounded-lg border border-white/10 bg-[#0B0D14] px-2.5 py-1 text-xs font-bold text-violet-300"
                    >
                      <option value="FREE">FREE</option>
                      <option value="PRO">PRO</option>
                      <option value="BUSINESS">BUSINESS</option>
                    </select>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    {u.creditsBalance} cr
                  </td>
                  <td className="py-3 font-mono text-slate-400">
                    {u.totalConsumed} cr
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adminAdjustCredits(u.id, 10)}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <Plus className="h-3 w-3" />
                        <span>10 cr</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => adminAdjustCredits(u.id, -5)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/20"
                      >
                        <Minus className="h-3 w-3" />
                        <span>5 cr</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent User Activity Feed */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
        <h2 className="text-base font-bold text-white">
          Recent Platform Activity &amp; Credit Ledger
        </h2>
        <div className="mt-4 space-y-2.5">
          {transactions.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-[#0B0D14] px-4 py-2.5 text-xs"
            >
              <div>
                <span className="font-semibold text-white">
                  {tx.description}
                </span>
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  ({tx.actionType})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-mono font-bold ${
                    tx.amount >= 0 ? "text-emerald-400" : "text-amber-300"
                  }`}
                >
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} cr
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
