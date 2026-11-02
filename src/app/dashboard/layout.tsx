"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  LayoutTemplate,
  Palette,
  BookOpen,
  Coins,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sliders,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LogoIcon } from "@/components/Logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoadingAuth, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0D14] text-slate-300">
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Loading SnapPost AI Workspace...</span>
        </div>
      </div>
    );
  }

  // Protected route check
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0D14] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-white/10 bg-[#121520] p-8 shadow-2xl">
          <LogoIcon size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">
            Authentication Required
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please sign in to access your SnapPost AI dashboard, saved projects,
            and AI generation credits.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-violet-500"
            >
              Sign In to Workspace →
            </Link>
            <Link
              href="/auth/register"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create New Post", href: "/dashboard/create", icon: PlusCircle },
    { name: "Visual Editor", href: "/dashboard/editor", icon: Sliders },
    { name: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
    { name: "Brand Kit", href: "/dashboard/brand-kit", icon: Palette },
    {
      name: "AI Content Library",
      href: "/dashboard/content-library",
      icon: BookOpen,
    },
    { name: "Usage & Credits", href: "/dashboard/usage", icon: Coins },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0B0D14] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0F121C] lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={32} />
            <span className="text-base font-bold tracking-tight text-white">
              SnapPost <span className="text-violet-400">AI</span>
            </span>
          </Link>
          <span className="rounded-md bg-violet-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-300">
            {user.planTier}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-4 px-2">
            <Link
              href="/dashboard/create"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow transition hover:bg-violet-500"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Post</span>
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-violet-600/20 text-white border border-violet-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-violet-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user.role === "admin" && (
              <Link
                href="/dashboard/admin"
                className={`mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  pathname.startsWith("/dashboard/admin")
                    ? "border border-amber-500/40 bg-amber-500/15 text-amber-200"
                    : "text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-300"
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Credits Meter & User Footer */}
        <div className="border-t border-white/10 p-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-[#141826] p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">AI Credits</span>
              <span className="font-mono font-bold text-violet-400">
                {user.creditsBalance} / {user.monthlyAllowance}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (user.creditsBalance /
                        Math.max(1, user.monthlyAllowance)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
            <Link
              href="/dashboard/billing"
              className="mt-2.5 block text-center text-[11px] font-semibold text-violet-400 hover:text-violet-300"
            >
              Upgrade Plan or Top Up →
            </Link>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-white">
                {user.fullName}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {user.email}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0F121C] px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={30} />
            <span className="text-base font-bold text-white">SnapPost AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-violet-300">
              {user.creditsBalance} cr
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/5"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#0F121C] px-4 py-4 lg:hidden">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200"
                  >
                    <Icon className="h-4 w-4 text-violet-400" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {user.role === "admin" && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Console</span>
                </Link>
              )}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-xs font-semibold text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
