"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Shield, User, KeyRound, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

const GEMINI_KEY_STORAGE = "snappost_gemini_api_key_v1";

export default function SettingsPage() {
  const { user, updateProfile, updatePassword } = useAppStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [newPassword, setNewPassword] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = sessionStorage.getItem(GEMINI_KEY_STORAGE) || "";
    setGeminiKey(storedKey);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, companyName });
    setSavedMsg("Profile settings updated successfully.");
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updatePassword(newPassword);
    setSavedMsg(res.message);
    setNewPassword("");
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      sessionStorage.setItem(GEMINI_KEY_STORAGE, geminiKey.trim());
      setSavedMsg(
        "Google Gemini API Key saved for this session. Live Gemini 3.8 Flash Vision & Copywriting is active!"
      );
    } else {
      sessionStorage.removeItem(GEMINI_KEY_STORAGE);
      setSavedMsg("Cleared session Gemini API key (using server .env.local).");
    }
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Account &amp; AI Provider Preferences
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          Workspace Settings
        </h1>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Google Gemini AI Configuration Card */}
      <form
        onSubmit={handleSaveGeminiKey}
        className="rounded-2xl border border-violet-500/30 bg-[#121520] p-6 space-y-4 shadow-glow"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-bold text-white">
              Google Gemini AI Engine (gemini-3.8-flash)
            </h2>
          </div>
          <span className="rounded bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-violet-300">
            Primary AI Provider
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          SnapPost AI uses <strong>Google Gemini 3.8 Flash</strong> (
          <code className="font-mono text-violet-300">gemini-3.8-flash</code>) via
          the <code className="font-mono text-violet-300">@google/genai</code>{" "}
          Interactions API for multimodal screenshot analysis and
          platform-native copywriting. Set{" "}
          <code className="font-mono text-slate-200">GEMINI_API_KEY</code> in{" "}
          <code className="font-mono text-slate-200">.env.local</code> on the
          server, or provide a session key below for immediate testing:
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy... (Optional session override if GEMINI_API_KEY is not in .env.local)"
            className="flex-1 rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 font-mono text-xs text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
          >
            Save Gemini Key
          </button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Form */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="h-4 w-4 text-violet-400" />
            <h2 className="text-base font-bold text-white">Profile Details</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="mt-1 w-full rounded-xl border border-white/5 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Company / Studio Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
          >
            Save Profile Changes
          </button>
        </form>

        {/* Security & Role Settings */}
        <div className="space-y-6">
          <form
            onSubmit={handlePasswordChange}
            className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <KeyRound className="h-4 w-4 text-violet-400" />
              <h2 className="text-base font-bold text-white">
                Update Password
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                New Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10"
            >
              Update Password
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                Integration &amp; Access Status
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              AI Engine:{" "}
              <strong className="text-violet-300">
                Google Gemini 3.8 Flash (gemini-3.8-flash)
              </strong>
            </p>
            <p className="text-xs text-slate-400">
              Database Mode:{" "}
              <strong className="text-white">
                {isSupabaseConfigured
                  ? "Supabase Cloud Connected"
                  : "Local + Server Persistent Hybrid Store"}
              </strong>
            </p>
            <p className="text-xs text-slate-400">
              Current Role:{" "}
              <strong className="uppercase text-violet-300">
                {user?.role}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
