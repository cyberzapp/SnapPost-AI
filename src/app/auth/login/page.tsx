"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    sendMagicEmailLink,
    completeMagicEmailLinkSignIn,
    loginWithGoogle,
  } = useAppStore();

  const [authMode, setAuthMode] = useState<"password" | "email-link">(
    "password"
  );
  const [email, setEmail] = useState("admin@snappost.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSentTo, setMagicLinkSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingMagicLink, setVerifyingMagicLink] = useState(false);

  // Automatically complete Firebase Email Link (Passwordless) sign-in when returning from email link
  useEffect(() => {
    async function checkIncomingEmailLink() {
      if (typeof window === "undefined") return;
      if (
        window.location.href.includes("apiKey=") &&
        window.location.href.includes("oobCode=")
      ) {
        setVerifyingMagicLink(true);
        const res = await completeMagicEmailLinkSignIn(window.location.href);
        setVerifyingMagicLink(false);
        if (res.error) {
          setError(res.error);
        } else if (res.completed) {
          router.push("/dashboard");
        }
      }
    }
    checkIncomingEmailLink();
  }, [completeMagicEmailLinkSignIn, router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.push("/dashboard");
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkSentTo(null);
    setLoading(true);
    const res = await sendMagicEmailLink(email);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setMagicLinkSentTo(email.trim());
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#0B0D14] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            SnapPost <span className="text-violet-400">AI</span>
          </span>
        </Link>
        <h1 className="mt-6 text-center text-2xl font-extrabold text-white">
          Sign in to your workspace
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Powered by Firebase Authentication (`snappost-si`) •{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#121520] px-6 py-8 shadow-2xl sm:px-10">
          {/* Mode Switcher: Email & Password vs Passwordless Email Link */}
          <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-[#0B0D14] p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("password");
                setError(null);
                setMagicLinkSentTo(null);
              }}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                authMode === "password"
                  ? "bg-violet-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("email-link");
                setError(null);
              }}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                authMode === "email-link"
                  ? "bg-violet-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email Link (Passwordless)
            </button>
          </div>

          {verifyingMagicLink && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-xs text-violet-200">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              <span>Verifying your Firebase passwordless sign-in link...</span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {magicLinkSentTo && authMode === "email-link" && (
            <div className="mb-5 space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Passwordless Sign-In Link Sent!</span>
              </div>
              <p className="leading-relaxed">
                We dispatched a secure Firebase sign-in link to{" "}
                <strong>{magicLinkSentTo}</strong> and saved{" "}
                <code className="font-mono">emailForSignIn</code> in local
                storage. Click the link in your inbox to sign in automatically.
              </p>
            </div>
          )}

          {authMode === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Work Email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-violet-400 hover:text-violet-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500 disabled:opacity-50"
              >
                <span>
                  {loading ? "Signing in..." : "Sign In with Email & Password"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLinkSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="magic-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Work Email for Passwordless Link
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Uses Firebase <code className="font-mono">sendSignInLinkToEmail</code>{" "}
                  to email you a one-click passwordless sign-in link.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                <span>
                  {loading
                    ? "Sending Magic Link..."
                    : "Send Passwordless Sign-In Link"}
                </span>
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121520] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <span>Continue with Google (Firebase Auth)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
