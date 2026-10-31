"use client";

import React, { useState } from "react";
import {
  Palette,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  Star,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { FONT_FAMILIES, WRITING_TONES } from "@/lib/constants";
import { WritingTone } from "@/types";

export default function BrandKitPage() {
  const { brandKits, saveBrandKit, deleteBrandKit, setDefaultBrandKit } =
    useAppStore();

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState("#1E293B");
  const [accentColor, setAccentColor] = useState("#3B82F6");
  const [headingFont, setHeadingFont] = useState("Inter");
  const [bodyFont, setBodyFont] = useState("Inter");
  const [brandDescription, setBrandDescription] = useState("");
  const [defaultCta, setDefaultCta] = useState("Try It Free Today →");
  const [brandVoice, setBrandVoice] = useState<WritingTone>("Founder-style");
  const [isDefault, setIsDefault] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleLoadKitForEdit = (kitId: string) => {
    const kit = brandKits.find((b) => b.id === kitId);
    if (!kit) return;
    setEditingId(kit.id);
    setBrandName(kit.brandName);
    setLogoUrl(kit.logoUrl || "");
    setPrimaryColor(kit.primaryColor);
    setSecondaryColor(kit.secondaryColor);
    setAccentColor(kit.accentColor);
    setHeadingFont(kit.headingFont);
    setBodyFont(kit.bodyFont);
    setBrandDescription(kit.brandDescription);
    setDefaultCta(kit.defaultCta);
    setBrandVoice(kit.brandVoice);
    setIsDefault(kit.isDefault);
  };

  const handleResetForm = () => {
    setEditingId(undefined);
    setBrandName("");
    setLogoUrl("");
    setPrimaryColor("#7C3AED");
    setSecondaryColor("#1E293B");
    setAccentColor("#3B82F6");
    setHeadingFont("Inter");
    setBodyFont("Inter");
    setBrandDescription("");
    setDefaultCta("Start Free Trial →");
    setBrandVoice("Professional");
    setIsDefault(false);
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    saveBrandKit({
      id: editingId,
      brandName: brandName.trim(),
      logoUrl: logoUrl || undefined,
      primaryColor,
      secondaryColor,
      accentColor,
      headingFont,
      bodyFont,
      brandDescription,
      defaultCta,
      brandVoice,
      isDefault,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    handleResetForm();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Multi-Brand Identity Manager
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Brand Kits ({brandKits.length})
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure your brand colors, logos, fonts, default CTAs, and voice
            to automatically style future AI generations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Brand Kit</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left 5 cols: Saved Brand Kits */}
        <div className="space-y-4 lg:col-span-5">
          <h2 className="text-base font-bold text-white">
            Saved Brand Profiles
          </h2>
          {brandKits.map((kit) => (
            <div
              key={kit.id}
              className={`rounded-2xl border p-5 transition ${
                kit.isDefault
                  ? "border-violet-500/50 bg-[#15192B]"
                  : "border-white/10 bg-[#121520]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {kit.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={kit.logoUrl}
                      alt={kit.brandName}
                      className="h-10 w-10 rounded-lg object-contain bg-[#0B0D14] p-1 border border-white/10"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
                      style={{ backgroundColor: kit.primaryColor }}
                    >
                      {kit.brandName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {kit.brandName}
                      </h3>
                      {kit.isDefault && (
                        <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Voice: {kit.brandVoice} • Font: {kit.headingFont}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!kit.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultBrandKit(kit.id)}
                      title="Set as Default"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-amber-300"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteBrandKit(kit.id)}
                    title="Delete Brand Kit"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-300">
                {kit.brandDescription || "No description provided."}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  {[kit.primaryColor, kit.secondaryColor, kit.accentColor].map(
                    (c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 rounded border border-white/10 bg-[#0B0D14] px-2 py-1 font-mono text-[10px] text-slate-300"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                        <span>{c}</span>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadKitForEdit(kit.id)}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                >
                  Edit Kit →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right 7 cols: Brand Kit Editor Form */}
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Brand Kit" : "Create New Brand Kit"}
              </h2>
            </div>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Brand Kit Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme Cloud AI"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Brand Logo Upload
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleLogoUpload(f);
                    }}
                    className="w-full text-xs text-slate-400"
                  />
                  {logoUrl && (
                    <Upload className="h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Primary, Secondary, Accent Colors */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Primary Color
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-11 cursor-pointer rounded border border-white/10 bg-[#0B0D14]"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Secondary Color
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-9 w-11 cursor-pointer rounded border border-white/10 bg-[#0B0D14]"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Accent Color
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-11 cursor-pointer rounded border border-white/10 bg-[#0B0D14]"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Brand Fonts & Voice */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Heading Font
                </label>
                <select
                  value={headingFont}
                  onChange={(e) => setHeadingFont(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2.5 text-xs text-white"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Body Font
                </label>
                <select
                  value={bodyFont}
                  onChange={(e) => setBodyFont(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2.5 text-xs text-white"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Brand Voice
                </label>
                <select
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value as WritingTone)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2.5 text-xs text-white"
                >
                  {WRITING_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Default Call-To-Action (CTA)
              </label>
              <input
                type="text"
                value={defaultCta}
                onChange={(e) => setDefaultCta(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs text-white"
                placeholder="Start Your 14-Day Free Trial →"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Brand Description &amp; Positioning
              </label>
              <textarea
                rows={3}
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-xs text-white"
                placeholder="Describe your product positioning and audience..."
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <span>
                Automatically apply this Brand Kit to all new social post
                generations
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-glow transition hover:bg-violet-500"
            >
              {editingId ? "Update Brand Kit" : "Save Brand Kit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
