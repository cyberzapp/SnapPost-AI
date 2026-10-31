"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UploadCloud,
  Sparkles,
  Eye,
  Wand2,
  Trash2,
  RefreshCw,
  Check,
  Copy,
  Download,
  Sliders,
  AlertCircle,
  CheckCircle2,
  FileText,
  Layers,
  Archive,
} from "lucide-react";
import {
  BACKGROUND_PRESETS,
  CONTENT_STYLES,
  DEMO_SAAS_SCREENSHOT_DATA_URL,
  SOCIAL_PLATFORMS,
  WRITING_TONES,
} from "@/lib/constants";
import {
  BackgroundStyleType,
  ContentStyleId,
  DesignVariation,
  PlatformCaptionsResult,
  ScreenshotAnalysisResult,
  SocialPlatformId,
  WritingTone,
} from "@/types";
import { useAppStore } from "@/lib/store";
import { generateDesignVariations } from "@/lib/design-engine";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import {
  downloadAllVariationsAsZip,
  downloadSingleVariation,
  ExportFormat,
} from "@/lib/export-engine";
import {
  runCaptionsGeneration,
  runScreenshotAnalysis,
} from "@/lib/ai-service";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

function extractDominantColors(dataUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(["#7C3AED", "#3B82F6", "#10B981"]);
        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data;
        const hexSet = new Set<string>();
        for (let i = 0; i < data.length; i += 64) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r + g + b > 60 && r + g + b < 680) {
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
              .toString(16)
              .slice(1)
              .toUpperCase()}`;
            hexSet.add(hex);
          }
          if (hexSet.size >= 3) break;
        }
        const arr = Array.from(hexSet);
        resolve(
          arr.length >= 2 ? arr : ["#7C3AED", "#3B82F6", "#10B981"]
        );
      } catch {
        resolve(["#7C3AED", "#3B82F6", "#10B981"]);
      }
    };
    img.onerror = () => resolve(["#7C3AED", "#3B82F6", "#10B981"]);
    img.src = dataUrl;
  });
}

function CreatePostWorkspaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    user,
    brandKits,
    createProject,
    updateProject,
    deductCredits,
    recordGeneration,
  } = useAppStore();

  const defaultKit =
    brandKits.find((k) => k.isDefault) || brandKits[0] || null;

  // Step 1: Upload & Context State
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([
    "#7C3AED",
    "#3B82F6",
    "#10B981",
  ]);

  const [projectName, setProjectName] = useState("New Product Launch Post");
  const [productName, setProductName] = useState(
    defaultKit?.brandName || "PulseMetrics AI"
  );
  const [productDescription, setProductDescription] = useState(
    defaultKit?.brandDescription ||
      "Real-time ARR telemetry, cohort retention, and automated expansion insights."
  );
  const [targetAudience, setTargetAudience] = useState(
    "SaaS Founders, Product Teams, B2B Marketers"
  );
  const [brandName, setBrandName] = useState(
    defaultKit?.brandName || "PulseMetrics AI"
  );
  const [desiredTone, setDesiredTone] = useState<WritingTone>(
    defaultKit?.brandVoice || "Founder-style"
  );
  const [mainObjective, setMainObjective] = useState(
    "Drive free trial signups and showcase product UI"
  );
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>(
    defaultKit?.id || ""
  );

  // Step 2: AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScreenshotAnalysisResult | null>(
    null
  );
  const [configNotice, setConfigNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Step 3: Generation Options State
  const [platformId, setPlatformId] = useState<SocialPlatformId>(
    (searchParams.get("platform") as SocialPlatformId) || "linkedin-post"
  );
  const [contentStyle, setContentStyle] = useState<ContentStyleId>(
    (searchParams.get("style") as ContentStyleId) || "Minimal SaaS"
  );
  const [variationCount, setVariationCount] = useState<number>(4);
  const [backgroundStyle, setBackgroundStyle] =
    useState<BackgroundStyleType>("radial-violet");
  const [primaryBrandColor, setPrimaryBrandColor] = useState<string>(
    defaultKit?.primaryColor || "#7C3AED"
  );
  const [headlinePref, setHeadlinePref] = useState<string>("");
  const [ctaPref, setCtaPref] = useState<string>(
    defaultKit?.defaultCta || "Start 14-Day Free Trial →"
  );

  // Step 4: Generated Output State
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [variations, setVariations] = useState<DesignVariation[]>([]);
  const [captions, setCaptions] = useState<PlatformCaptionsResult | null>(null);
  const [isGeneratingDesigns, setIsGeneratingDesigns] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [isZipping, setIsZipping] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync Brand Kit selection
  useEffect(() => {
    const kit = brandKits.find((b) => b.id === selectedBrandKitId);
    if (kit) {
      setBrandName(kit.brandName);
      setPrimaryBrandColor(kit.primaryColor);
      setCtaPref(kit.defaultCta);
      setDesiredTone(kit.brandVoice);
    }
  }, [selectedBrandKitId, brandKits]);

  const processSelectedFile = async (file: File) => {
    setUploadError(null);
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError(
        "Unsupported file type. Please upload a PNG, JPG, JPEG, or WebP screenshot."
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(
        `File exceeds maximum size of 10 MB (Uploaded: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)} MB).`
      );
      return;
    }

    setUploadProgress(25);
    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setUploadProgress(Math.round((ev.loaded / ev.total) * 90));
      }
    };
    reader.onload = async () => {
      const resultUrl = String(reader.result);
      setScreenshotUrl(resultUrl);
      setFileName(file.name);
      setUploadProgress(100);
      const colors = await extractDominantColors(resultUrl);
      setExtractedColors(colors);
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file. Please try again.");
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleScreenshot = async () => {
    setUploadError(null);
    setUploadProgress(100);
    setScreenshotUrl(DEMO_SAAS_SCREENSHOT_DATA_URL);
    setFileName("pulsemetrics-saas-dashboard.png");
    setProjectName("PulseMetrics AI — Product Showcase");
    const colors = await extractDominantColors(DEMO_SAAS_SCREENSHOT_DATA_URL);
    setExtractedColors(colors);
  };

  const handleAnalyzeScreenshot = async () => {
    setActionError(null);
    if (!screenshotUrl) {
      setActionError("Please upload a screenshot or load the sample image first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const creditRes = await deductCredits(
        "screenshot_analysis",
        `AI Vision Screenshot Analysis (${productName || "Project"})`
      );
      if (!creditRes.success) {
        setActionError(creditRes.error || "Insufficient AI credits.");
        setIsAnalyzing(false);
        return;
      }

      const sessionGeminiKey =
        typeof window !== "undefined"
          ? sessionStorage.getItem("snappost_gemini_api_key_v1") || undefined
          : undefined;

      const data = await runScreenshotAnalysis({
        imageDataUrl: screenshotUrl,
        extractedColors,
        geminiApiKey: sessionGeminiKey,
        context: {
          productName,
          productDescription,
          targetAudience,
          brandName,
          desiredTone,
          mainObjective,
        },
      });

      const analysisResult: ScreenshotAnalysisResult = data.analysis;
      setAnalysis(analysisResult);
      setHeadlinePref(analysisResult.suggestedHeadline);
      setCtaPref(analysisResult.suggestedCta);
      if (data.configNotice) {
        setConfigNotice(data.configNotice);
      }

      recordGeneration({
        projectName,
        generationType: "analysis",
        platformId,
        stylePreset: contentStyle,
        creditsUsed: 1,
        providerUsed: analysisResult.analyzedBy,
        latencyMs: data.latencyMs || 650,
        status: "completed",
      });
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to analyze screenshot"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateDesignsAndCopy = async (isRegenerate = false) => {
    setActionError(null);
    if (!screenshotUrl || !analysis) {
      setActionError("Please upload and analyze your screenshot first.");
      return;
    }

    setIsGeneratingDesigns(true);
    setIsGeneratingCopy(true);

    try {
      // 1. Deduct 2 credits for Design Generation/Regeneration
      const designCreditRes = await deductCredits(
        isRegenerate ? "design_regeneration" : "design_generation",
        `${isRegenerate ? "Regenerated" : "Generated"} ${variationCount} ${contentStyle} variations`
      );
      if (!designCreditRes.success) {
        setActionError(designCreditRes.error || "Insufficient credits");
        setIsGeneratingDesigns(false);
        setIsGeneratingCopy(false);
        return;
      }

      const activeBrandKit =
        brandKits.find((b) => b.id === selectedBrandKitId) || null;
      const targetProjId = currentProjectId || `proj-${Date.now()}`;

      const generatedVars = generateDesignVariations({
        projectId: targetProjId,
        screenshotUrl,
        platformId,
        stylePreset: contentStyle,
        variationCount,
        backgroundStyle,
        primaryBrandColor,
        customHeadline: headlinePref,
        customCta: ctaPref,
        analysis,
        brandKit: activeBrandKit,
        isFreePlan: user?.planTier === "FREE",
      });

      setVariations(generatedVars);
      setIsGeneratingDesigns(false);

      // 2. Deduct 1 credit for AI Copy Generation & fetch platform-native copy
      const copyCreditRes = await deductCredits(
        "copy_generation",
        `Generated ${platformId} captions (${desiredTone})`
      );

      let generatedCaptions = captions;
      if (copyCreditRes.success) {
        const sessionGeminiKey =
          typeof window !== "undefined"
            ? sessionStorage.getItem("snappost_gemini_api_key_v1") || undefined
            : undefined;
        generatedCaptions = await runCaptionsGeneration({
          analysis,
          platformId,
          tone: desiredTone,
          productName: productName || brandName || "Our Product",
          geminiApiKey: sessionGeminiKey,
        });
        setCaptions(generatedCaptions);
      }
      setIsGeneratingCopy(false);

      // 3. Save or update project in persistent store
      if (!currentProjectId) {
        const saved = createProject({
          name: projectName,
          screenshotUrl,
          productName,
          productDescription,
          targetAudience,
          brandName,
          desiredTone,
          mainObjective,
          platformId,
          contentStyle,
          analysis,
          captions: generatedCaptions,
          variations: generatedVars,
          activeVariationId: generatedVars[0]?.id,
          brandKitId: selectedBrandKitId || undefined,
          status: "generated",
        });
        setCurrentProjectId(saved.id);
      } else {
        updateProject(currentProjectId, {
          name: projectName,
          platformId,
          contentStyle,
          desiredTone,
          analysis,
          captions: generatedCaptions,
          variations: generatedVars,
          activeVariationId: generatedVars[0]?.id,
          status: "generated",
        });
      }

      recordGeneration({
        projectId: currentProjectId || targetProjId,
        projectName,
        generationType: isRegenerate ? "regeneration" : "designs",
        platformId,
        stylePreset: contentStyle,
        creditsUsed: 3,
        providerUsed: "snappost-ai-engine",
        latencyMs: 520,
        status: "completed",
      });
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to generate designs"
      );
      setIsGeneratingDesigns(false);
      setIsGeneratingCopy(false);
    }
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDownloadZip = async () => {
    if (variations.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllVariationsAsZip(
        projectName,
        variations,
        exportFormat,
        user?.planTier !== "FREE"
      );
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            AI Screenshot-to-Social Studio
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Create Scroll-Stopping Social Posts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload your product screenshot, inspect with AI Vision, and generate
            multi-variation designs &amp; platform copy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            aria-label="Project Name"
            className="rounded-xl border border-white/15 bg-[#121520] px-4 py-2 text-sm font-semibold text-white focus:border-violet-500 focus:outline-none"
            placeholder="Project Name..."
          />
        </div>
      </div>

      {actionError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STEP 1: SCREENSHOT UPLOAD & OPTIONAL PRODUCT CONTEXT */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left 7 cols: Drag & Drop Upload Workspace */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              1. Upload Product Screenshot
            </h2>
            <button
              type="button"
              onClick={handleLoadSampleScreenshot}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Load Sample SaaS Screenshot</span>
            </button>
          </div>

          {!screenshotUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) processSelectedFile(droppedFile);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                isDraggingOver
                  ? "border-violet-500 bg-violet-600/10"
                  : "border-white/15 bg-[#121520] hover:border-violet-500/50 hover:bg-[#151928]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) processSelectedFile(f);
                }}
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400 shadow-glow">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">
                Drag &amp; drop your screenshot here, or click to browse
              </h3>
              <p className="mt-2 max-w-md text-xs text-slate-400">
                Supports high-resolution PNG, JPG, JPEG, and WebP up to 10 MB.
                Works with SaaS dashboards, web apps, landing pages, and mobile
                interfaces.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-glow">
                  Browse Local Files
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleScreenshot();
                  }}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  Use Demo Dashboard Screenshot
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#121520] p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    {fileName || "Uploaded Screenshot"}
                  </span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    {uploadProgress}% Ready
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Replace Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotUrl("");
                      setFileName("");
                      setAnalysis(null);
                      setVariations([]);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) processSelectedFile(f);
                    }}
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#090B10] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotUrl}
                  alt="Uploaded Screenshot Preview"
                  className="mx-auto max-h-[320px] w-auto rounded-lg object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Extracted Palette:
                  </span>
                  {extractedColors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setPrimaryBrandColor(hex)}
                      className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0B0D14] px-2 py-1 text-[11px] font-mono text-slate-200"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{hex}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleAnalyzeScreenshot}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow transition hover:bg-violet-500 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>
                    {isAnalyzing
                      ? "Analyzing Screenshot with AI..."
                      : "Analyze Screenshot (1 Credit)"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {uploadError}
            </div>
          )}
        </div>

        {/* Right 5 cols: Optional Product Context & Brand Kit */}
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 lg:col-span-5">
          <h2 className="text-base font-bold text-white">
            Product &amp; Brand Context (Optional)
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Supplying context helps the AI tailor headlines, audience hooks, and
            brand voice.
          </p>

          <div className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Apply Saved Brand Kit
              </label>
              <select
                value={selectedBrandKitId}
                onChange={(e) => setSelectedBrandKitId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="">Custom Brand Settings</option>
                {brandKits.map((bk) => (
                  <option key={bk.id} value={bk.id}>
                    {bk.brandName} ({bk.primaryColor})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                  placeholder="e.g. PulseMetrics AI"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                  placeholder="e.g. PulseMetrics Labs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Product Description
              </label>
              <textarea
                rows={2}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                placeholder="What problem does your product solve?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                placeholder="SaaS Founders, Developers, Marketers"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Desired Writing Tone
                </label>
                <select
                  value={desiredTone}
                  onChange={(e) =>
                    setDesiredTone(e.target.value as WritingTone)
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                >
                  {WRITING_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Main Objective
                </label>
                <input
                  type="text"
                  value={mainObjective}
                  onChange={(e) => setMainObjective(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-white"
                  placeholder="Drive free trials"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: AI SCREENSHOT ANALYSIS RESULTS (EDITABLE BEFORE GENERATION) */}
      {analysis && (
        <div className="rounded-2xl border border-violet-500/30 bg-[#121520] p-6 shadow-glow space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase text-violet-300">
                  Step 2 • Structured Vision Analysis
                </span>
                <span className="text-xs text-slate-400">
                  Category:{" "}
                  <strong className="text-white">{analysis.category}</strong>
                </span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-white">
                Review &amp; Edit AI Screenshot Insights Before Generating
              </h2>
            </div>

            <span className="font-mono text-xs text-emerald-400">
              ✓ {analysis.visibleFeatures.length} Visible Features Verified
            </span>
          </div>

          {configNotice && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <strong>Environment Note:</strong> {configNotice}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Editable Product Summary
                </label>
                <textarea
                  rows={2}
                  value={analysis.productSummary}
                  onChange={(e) =>
                    setAnalysis({ ...analysis, productSummary: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Suggested Primary Headline (Editable)
                </label>
                <input
                  type="text"
                  value={headlinePref}
                  onChange={(e) => {
                    setHeadlinePref(e.target.value);
                    setAnalysis({
                      ...analysis,
                      suggestedHeadline: e.target.value,
                    });
                  }}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-sm font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Suggested CTA Pill
                  </label>
                  <input
                    type="text"
                    value={ctaPref}
                    onChange={(e) => setCtaPref(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] p-2.5 text-xs font-semibold text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Recommended Platforms
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {analysis.recommendedPlatforms.map((rp) => (
                      <button
                        key={rp}
                        type="button"
                        onClick={() => setPlatformId(rp)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                          platformId === rp
                            ? "bg-violet-600 text-white"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {rp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Visible Features & Marketing Angles */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Key Visible Features Detected (Editable)
                </label>
                <div className="mt-1.5 space-y-2">
                  {analysis.visibleFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-[#0B0D14] p-2.5"
                    >
                      <input
                        type="text"
                        value={feat.name}
                        onChange={(e) => {
                          const updated = [...analysis.visibleFeatures];
                          updated[idx] = {
                            ...updated[idx],
                            name: e.target.value,
                          };
                          setAnalysis({ ...analysis, visibleFeatures: updated });
                        }}
                        className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
                      />
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          feat.confidence === "high"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {feat.confidence}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Suggested Marketing Angles (Click to use as Headline)
                </label>
                <div className="mt-1.5 space-y-1.5">
                  {analysis.marketingAngles.map((angle, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeadlinePref(angle)}
                      className="block w-full rounded-lg border border-white/5 bg-[#0B0D14] px-3 py-2 text-left text-xs text-slate-300 transition hover:border-violet-500/40 hover:text-white"
                    >
                      → {angle}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SOCIAL POST GENERATION CONFIGURATION */}
      <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Step 3 • Social Post &amp; Copy Configuration
            </span>
            <h2 className="mt-1 text-lg font-bold text-white">
              Select Platform Dimensions, Content Style &amp; Brand Aesthetics
            </h2>
          </div>

          <button
            type="button"
            disabled={isGeneratingDesigns || !analysis}
            onClick={() => handleGenerateDesignsAndCopy(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:from-violet-500 hover:to-blue-500 disabled:opacity-40"
          >
            <Wand2 className="h-4 w-4" />
            <span>
              {isGeneratingDesigns
                ? "Generating Variations & Copy..."
                : "Generate Social Posts & AI Copy (3 Credits)"}
            </span>
          </button>
        </div>

        {/* Platform Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Target Social Platform &amp; Dimensions
          </label>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            {SOCIAL_PLATFORMS.map((p) => {
              const selected = platformId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatformId(p.id)}
                  className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-violet-500 bg-violet-600/20 text-white shadow-glow"
                      : "border-white/10 bg-[#0B0D14] text-slate-300 hover:border-white/25"
                  }`}
                >
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="mt-1 font-mono text-[10px] text-slate-400">
                    {p.width}×{p.height}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Style Selector (12 Styles) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Content Design Style (12 Professional Archetypes)
          </label>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {CONTENT_STYLES.map((st) => {
              const selected = contentStyle === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setContentStyle(st.id)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-violet-500 bg-violet-600/20 text-white"
                      : "border-white/10 bg-[#0B0D14] text-slate-300 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: st.accentHex }}
                    />
                    <span className="text-[10px] font-semibold text-slate-400">
                      {st.badge}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold">{st.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variations Count, Background Preset, Brand Color */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Number of Design Variations (3–5)
            </label>
            <select
              value={variationCount}
              onChange={(e) => setVariationCount(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs font-semibold text-white"
            >
              <option value={3}>3 Variations</option>
              <option value={4}>4 Variations (Recommended)</option>
              <option value={5}>5 Variations (Full Studio Pack)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Background Atmosphere
            </label>
            <select
              value={backgroundStyle}
              onChange={(e) =>
                setBackgroundStyle(e.target.value as BackgroundStyleType)
              }
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3.5 py-2.5 text-xs font-semibold text-white"
            >
              {BACKGROUND_PRESETS.map((bg) => (
                <option key={bg.id} value={bg.id}>
                  {bg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Primary Brand Accent Color
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="color"
                value={primaryBrandColor}
                onChange={(e) => setPrimaryBrandColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-[#0B0D14] p-1"
              />
              <input
                type="text"
                value={primaryBrandColor}
                onChange={(e) => setPrimaryBrandColor(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 font-mono text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: GENERATED SOCIAL DESIGNS & AI CAPTION STUDIO */}
      {variations.length > 0 && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-[#121520] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  ✓ {variations.length} Editable Design Variations Ready
                </span>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Generated Social Post Variations
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={exportFormat}
                  onChange={(e) =>
                    setExportFormat(e.target.value as ExportFormat)
                  }
                  aria-label="Export image format"
                  className="rounded-xl border border-white/15 bg-[#0B0D14] px-3 py-2 text-xs font-semibold uppercase text-white"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpeg">JPEG (Compact)</option>
                  <option value="webp">WebP (Next-Gen)</option>
                </select>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/15 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/25"
                >
                  <Archive className="h-4 w-4" />
                  <span>
                    {isZipping
                      ? "Packaging ZIP..."
                      : `Download All (${variations.length}) as ZIP`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateDesignsAndCopy(true)}
                  disabled={isGeneratingDesigns}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Regenerate (2 Credits)</span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {variations.map((v, idx) => (
                <div
                  key={v.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0D14] p-5"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-violet-400">
                          Variation {idx + 1} • {v.layoutArchetype}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {v.name}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-slate-400">
                        {v.width}×{v.height}
                      </span>
                    </div>

                    <div className="flex justify-center overflow-hidden rounded-xl border border-white/5 bg-[#07090E] p-3">
                      <DesignCanvasRenderer
                        width={v.width}
                        height={v.height}
                        document={v.document}
                        scale={v.width > 1300 ? 0.24 : 0.28}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentProjectId) {
                          updateProject(currentProjectId, {
                            activeVariationId: v.id,
                          });
                          router.push(
                            `/dashboard/editor?projectId=${currentProjectId}&variationId=${v.id}`
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Open in Visual Editor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadSingleVariation(
                          v,
                          exportFormat,
                          user?.planTier !== "FREE"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download {exportFormat.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI CAPTION GENERATOR RESULTS */}
          {captions && (
            <div className="rounded-2xl border border-white/10 bg-[#121520] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Platform-Specific AI Copy &amp; Captions
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tailored for {captions.platformId} in{" "}
                      <strong className="text-slate-200">{captions.tone}</strong>{" "}
                      tone • One-click copy on every item
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {/* 3 Full Platform Captions */}
                <div className="space-y-4 lg:col-span-7">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3 Platform-Native Caption Variations
                  </h3>
                  {captions.captions.map((cap, i) => {
                    const key = `cap-${i}`;
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-white/10 bg-[#0B0D14] p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-violet-300">
                            {cap.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500">
                              {cap.characterCount} chars
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(key, cap.body)}
                              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                            >
                              {copiedKey === key ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">
                                    Copied
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
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                          {cap.body}
                        </pre>
                      </div>
                    );
                  })}
                </div>

                {/* Headlines, Opening Hooks, Hashtags & CTAs */}
                <div className="space-y-5 lg:col-span-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      5 Scroll-Stopping Headlines
                    </h3>
                    <div className="mt-2 space-y-2">
                      {captions.headlines.map((hl, i) => {
                        const key = `hl-${i}`;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-slate-200"
                          >
                            <span>{hl}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(key, hl)}
                              className="shrink-0 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                              title="Copy headline"
                            >
                              {copiedKey === key ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      3 Opening Hooks
                    </h3>
                    <div className="mt-2 space-y-2">
                      {captions.openingHooks.map((hk, i) => {
                        const key = `hk-${i}`;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-slate-200"
                          >
                            <span>{hk}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(key, hk)}
                              className="shrink-0 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                              {copiedKey === key ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Targeted Hashtags
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            "all-hashtags",
                            captions.hashtags.join(" ")
                          )
                        }
                        className="text-[11px] font-semibold text-violet-400 hover:text-violet-300"
                      >
                        {copiedKey === "all-hashtags"
                          ? "✓ Copied All"
                          : "Copy All Hashtags"}
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {captions.hashtags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopyText(tag, tag)}
                          className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300 hover:bg-violet-500/20"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      CTA Suggestions &amp; Short Promo Blurblets
                    </h3>
                    <div className="mt-2 space-y-2">
                      {captions.ctaSuggestions.map((cta, i) => {
                        const key = `cta-${i}`;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs text-slate-300"
                          >
                            <span>{cta}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(key, cta)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedKey === key ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-slate-400">
          Loading Create Post Studio...
        </div>
      }
    >
      <CreatePostWorkspaceInner />
    </Suspense>
  );
}
