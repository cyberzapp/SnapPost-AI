"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function ForgotPasswordPage() {
  const { resetPasswordRequest } = useAppStore();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await resetPasswordRequest(email);
    setStatusMessage(res.message);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#0B0D14] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            SnapPost <span className="text-violet-400">AI</span>
          </span>
        </Link>
        <h1 className="mt-6 text-center text-2xl font-extrabold text-white">
          Reset your password
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter your account email and we will send you a password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#121520] px-6 py-8 shadow-2xl sm:px-10">
          {statusMessage ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-200">{statusMessage}</p>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/auth/reset-password"
                  className="rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
                >
                  Open Password Reset Form →
                </Link>
                <Link
                  href="/auth/login"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Account Email
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

              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-500"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
