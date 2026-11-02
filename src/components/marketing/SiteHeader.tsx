"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  CreditCard,
  Gauge,
  LayoutTemplate,
  LifeBuoy,
  Map,
  Megaphone,
  Menu,
  MessageSquareQuote,
  MousePointer2,
  Palette,
  PenLine,
  PlayCircle,
  Receipt,
  Rocket,
  Smartphone,
  Sparkles,
  Terminal,
  TrendingUp,
  Upload,
  X,
  LayoutGrid,
} from "lucide-react";
import { LogoIcon } from "@/components/Logo";
import { useAppStore } from "@/lib/store";

type IconType = React.ComponentType<{ className?: string }>;

interface MenuLink {
  label: string;
  description: string;
  href: string;
  icon: IconType;
}

interface MenuGroup {
  id: string;
  label: string;
  links: MenuLink[];
  featured?: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    cta: string;
    icon: IconType;
  };
}

const MENU: MenuGroup[] = [
  {
    id: "product",
    label: "Product",
    links: [
      {
        label: "Create a Post",
        description: "Upload a screenshot and get finished designs",
        href: "/dashboard/create",
        icon: Upload,
      },
      {
        label: "Design Editor",
        description: "Adjust text, colors and layout with drag and drop",
        href: "/dashboard/editor",
        icon: MousePointer2,
      },
      {
        label: "Templates",
        description: "Start from styles made for social media",
        href: "/dashboard/templates",
        icon: LayoutTemplate,
      },
      {
        label: "Brand Kit",
        description: "Save your logo, colors and fonts once",
        href: "/dashboard/brand-kit",
        icon: Palette,
      },
      {
        label: "Captions & Hashtags",
        description: "Ready-to-use copy for every platform",
        href: "/dashboard/content-library",
        icon: PenLine,
      },
    ],
    featured: {
      eyebrow: "Product tour",
      title: "See it in action",
      description:
        "Watch a plain screenshot turn into polished posts for every platform.",
      href: "/app",
      cta: "Take the tour",
      icon: PlayCircle,
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    links: [
      {
        label: "Startup Founders",
        description: "Share milestones and product updates",
        href: "/app#customers",
        icon: Rocket,
      },
      {
        label: "Agencies",
        description: "Create on-brand posts for every client",
        href: "/app#customers",
        icon: Building2,
      },
      {
        label: "Developer Tools",
        description: "Show releases, code and performance",
        href: "/app#customers",
        icon: Terminal,
      },
      {
        label: "Marketing Teams",
        description: "Launch campaigns without design delays",
        href: "/app#customers",
        icon: Megaphone,
      },
      {
        label: "Mobile Apps",
        description: "Turn app screens into stories and pins",
        href: "/app#customers",
        icon: Smartphone,
      },
    ],
    featured: {
      eyebrow: "8 platforms",
      title: "The right size, every time",
      description:
        "LinkedIn, Instagram, X, Facebook and Pinterest sizes built in.",
      href: "/app#platforms",
      cta: "View platforms",
      icon: LayoutGrid,
    },
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      {
        label: "Benefits",
        description: "How better visuals grow your reach",
        href: "/benefits",
        icon: TrendingUp,
      },
      {
        label: "Customer Stories",
        description: "Results from teams using SnapPost AI",
        href: "/app#reviews",
        icon: MessageSquareQuote,
      },
      {
        label: "What's Coming",
        description: "Upcoming features you can vote on",
        href: "/app#roadmap",
        icon: Map,
      },
      {
        label: "Help & FAQ",
        description: "Answers to common questions",
        href: "/#faq",
        icon: LifeBuoy,
      },
    ],
    featured: {
      eyebrow: "Guide",
      title: "How it works",
      description: "Upload, review, edit and download in four simple steps.",
      href: "/#how-it-works",
      cta: "Read the guide",
      icon: BookOpen,
    },
  },
  {
    id: "pricing",
    label: "Pricing",
    links: [
      {
        label: "Plans",
        description: "Free, Pro and Agency plans compared",
        href: "/#pricing",
        icon: CreditCard,
      },
      {
        label: "Credits & Usage",
        description: "See how credits work and track usage",
        href: "/dashboard/usage",
        icon: Gauge,
      },
      {
        label: "Billing",
        description: "Manage your subscription and invoices",
        href: "/dashboard/billing",
        icon: Receipt,
      },
    ],
    featured: {
      eyebrow: "Free to start",
      title: "25 free credits every month",
      description: "No credit card needed. Upgrade only when you need more.",
      href: "/auth/register",
      cta: "Create free account",
      icon: Sparkles,
    },
  },
];

export function SiteHeader() {
  const { user } = useAppStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenId(id);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), 140);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenId(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D14]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={closeAll}>
          <LogoIcon size={34} priority />
          <span className="text-lg font-bold tracking-tight text-white">
            SnapPost <span className="text-violet-400">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={scheduleClose}
        >
          {MENU.map((group) => {
            const isOpen = openId === group.id;
            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => openMenu(group.id)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`menu-${group.id}`}
                  onClick={() => setOpenId(isOpen ? null : group.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isOpen
                      ? "bg-white/[0.06] text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-violet-400" : "text-slate-500"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`menu-${group.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      onMouseEnter={() => openMenu(group.id)}
                      className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3"
                    >
                      <div className="grid grid-cols-[1fr_220px] gap-2 overflow-hidden rounded-2xl border border-white/10 bg-[#111421] p-2 shadow-2xl shadow-black/50">
                        <ul className="grid gap-0.5 p-1">
                          {group.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={closeAll}
                                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05] focus-visible:outline-none"
                                >
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-violet-300 transition-colors group-hover:border-violet-500/40 group-hover:bg-violet-500/10">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <span>
                                    <span className="block text-sm font-semibold text-white">
                                      {link.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                                      {link.description}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>

                        {group.featured && (
                          <Link
                            href={group.featured.href}
                            onClick={closeAll}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-600/20 via-[#151833] to-[#111421] p-5"
                          >
                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/25 blur-2xl" />
                            <div className="relative">
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                                <group.featured.icon className="h-4 w-4" />
                              </span>
                              <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                                {group.featured.eyebrow}
                              </div>
                              <div className="mt-1 text-base font-bold text-white">
                                {group.featured.title}
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                                {group.featured.description}
                              </p>
                            </div>
                            <span className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 group-hover:text-white">
                              {group.featured.cta}
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
              >
                Create Post
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:bg-white/5 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-y-auto border-t border-white/10 bg-[#0B0D14] lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {MENU.map((group) => {
                const isOpen = mobileSection === group.id;
                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02]"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setMobileSection(isOpen ? null : group.id)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base font-semibold text-white"
                    >
                      {group.label}
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-violet-400" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden px-2 pb-2"
                        >
                          {group.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={closeAll}
                                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <span>
                                    <span className="block text-sm font-medium text-white">
                                      {link.label}
                                    </span>
                                    <span className="block text-xs text-slate-400">
                                      {link.description}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="grid gap-2 pt-4">
                {user ? (
                  <Link
                    href="/dashboard/create"
                    onClick={closeAll}
                    className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white"
                  >
                    Create Post
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/register"
                      onClick={closeAll}
                      className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white"
                    >
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={closeAll}
                      className="flex items-center justify-center rounded-xl border border-white/15 py-3 text-sm font-semibold text-slate-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Create a Post", href: "/dashboard/create" },
        { label: "Design Editor", href: "/dashboard/editor" },
        { label: "Templates", href: "/dashboard/templates" },
        { label: "Product Tour", href: "/app" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Startup Founders", href: "/app#customers" },
        { label: "Agencies", href: "/app#customers" },
        { label: "Marketing Teams", href: "/app#customers" },
        { label: "Supported Platforms", href: "/app#platforms" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Benefits", href: "/benefits" },
        { label: "Customer Stories", href: "/app#reviews" },
        { label: "What's Coming", href: "/app#roadmap" },
        { label: "Help & FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Pricing",
      links: [
        { label: "Plans", href: "/#pricing" },
        { label: "Credits & Usage", href: "/dashboard/usage" },
        { label: "Billing", href: "/dashboard/billing" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#090B10]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={30} />
            <span className="text-base font-bold text-white">
              SnapPost <span className="text-violet-400">AI</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Turn product screenshots into polished social media posts, with
            captions written for every platform.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold text-white">{col.title}</div>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SnapPost AI. All rights reserved.
      </div>
    </footer>
  );
}
