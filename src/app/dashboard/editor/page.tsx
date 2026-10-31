"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Undo2,
  Redo2,
  Save,
  Download,
  Type,
  Image as ImageIcon,
  Square,
  Palette,
  Layers,
  Sparkles,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  Check,
  Archive,
} from "lucide-react";
import {
  BACKGROUND_PRESETS,
  FONT_FAMILIES,
  SOCIAL_PLATFORMS,
} from "@/lib/constants";
import {
  CanvasDocument,
  CanvasElement,
  DesignVariation,
  SocialPlatformId,
} from "@/types";
import { useAppStore } from "@/lib/store";
import { DesignCanvasRenderer } from "@/components/canvas/DesignCanvasRenderer";
import {
  downloadAllVariationsAsZip,
  downloadSingleVariation,
  ExportFormat,
} from "@/lib/export-engine";

type LeftTab =
  | "templates"
  | "text"
  | "images"
  | "shapes"
  | "backgrounds"
  | "brand";

function VisualDesignEditorInner() {
  const searchParams = useSearchParams();
  const { user, projects, brandKits, updateProject } = useAppStore();
  const fileReplaceRef = useRef<HTMLInputElement | null>(null);

  const requestedProjectId = searchParams.get("projectId");
  const requestedVariationId = searchParams.get("variationId");

  const activeProject =
    projects.find((p) => p.id === requestedProjectId) || projects[0];

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    activeProject?.id || ""
  );
  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [variations, setVariations] = useState<DesignVariation[]>(
    currentProject?.variations || []
  );
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(0);

  // Sync when project changes
  useEffect(() => {
    if (!currentProject) return;
    setVariations(currentProject.variations);
    if (requestedVariationId) {
      const idx = currentProject.variations.findIndex(
        (v) => v.id === requestedVariationId
      );
      if (idx >= 0) setActiveVariationIndex(idx);
    } else {
      setActiveVariationIndex(0);
    }
  }, [currentProject, requestedVariationId]);

  const activeVariation = variations[activeVariationIndex] || variations[0];

  // Undo / Redo History Stack for active variation document
  const [history, setHistory] = useState<CanvasDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    if (activeVariation?.document) {
      const cloned = JSON.parse(JSON.stringify(activeVariation.document));
      setHistory([cloned]);
      setHistoryIndex(0);
    }
  }, [activeVariationIndex, selectedProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [leftTab, setLeftTab] = useState<LeftTab>("templates");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    activeVariation?.document?.elements?.[0]?.id || null
  );
  const [zoom, setZoom] = useState<number>(0.42);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentDoc = activeVariation?.document;
  const selectedElement =
    currentDoc?.elements.find((e) => e.id === selectedElementId) || null;

  const commitDocumentChange = (
    nextDoc: CanvasDocument,
    pushHistory = true
  ) => {
    if (!activeVariation) return;
    const updatedVar: DesignVariation = {
      ...activeVariation,
      document: nextDoc,
      updatedAt: new Date().toISOString(),
    };
    const nextVars = variations.map((v, idx) =>
      idx === activeVariationIndex ? updatedVar : v
    );
    setVariations(nextVars);

    if (pushHistory) {
      const sliced = history.slice(0, historyIndex + 1);
      const nextStack = [
        ...sliced,
        JSON.parse(JSON.stringify(nextDoc)),
      ].slice(-25);
      setHistory(nextStack);
      setHistoryIndex(nextStack.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevDoc = JSON.parse(JSON.stringify(history[historyIndex - 1]));
      setHistoryIndex(historyIndex - 1);
      commitDocumentChange(prevDoc, false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextDoc = JSON.parse(JSON.stringify(history[historyIndex + 1]));
      setHistoryIndex(historyIndex + 1);
      commitDocumentChange(nextDoc, false);
    }
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!currentDoc || !selectedElementId) return;
    const nextElements = currentDoc.elements.map((el) =>
      el.id === selectedElementId ? { ...el, ...updates } : el
    );
    commitDocumentChange({ ...currentDoc, elements: nextElements });
  };

  const handlePositionDrag = (id: string, x: number, y: number) => {
    if (!currentDoc) return;
    const nextElements = currentDoc.elements.map((el) =>
      el.id === id ? { ...el, x, y } : el
    );
    commitDocumentChange({ ...currentDoc, elements: nextElements }, false);
  };

  const handleAddElement = (type: "text" | "badge" | "shape") => {
    if (!currentDoc) return;
    const id = `el-${type}-${Date.now()}`;
    const maxZ = Math.max(1, ...currentDoc.elements.map((e) => e.zIndex));

    const newElement: CanvasElement =
      type === "text"
        ? {
            id,
            type: "text",
            name: "Custom Text Layer",
            x: 15,
            y: 20,
            width: 70,
            zIndex: maxZ + 1,
            opacity: 1,
            text: "Double down on what works.",
            fontFamily: "Inter",
            fontSize: 36,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
            letterSpacing: -0.02,
            lineHeight: 1.2,
          }
        : type === "badge"
        ? {
            id,
            type: "badge",
            name: "Callout Pill Badge",
            x: 28,
            y: 12,
            width: 44,
            zIndex: maxZ + 1,
            opacity: 1,
            text: "✦ NEW RELEASE 2.0",
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: "700",
            color: "#FFFFFF",
            textAlign: "center",
            backgroundColor: currentDoc.primaryBrandColor || "#7C3AED",
            borderRadius: 999,
            shadow: "lg",
          }
        : {
            id,
            type: "shape",
            name: "Accent Glass Card",
            x: 15,
            y: 25,
            width: 70,
            height: 25,
            zIndex: Math.max(1, maxZ - 1),
            opacity: 0.85,
            backgroundColor: "rgba(124, 58, 237, 0.18)",
            borderColor: currentDoc.primaryBrandColor || "#7C3AED",
            borderWidth: 1,
            borderRadius: 20,
            shadow: "md",
          };

    commitDocumentChange({
      ...currentDoc,
      elements: [...currentDoc.elements, newElement],
    });
    setSelectedElementId(id);
  };

  const handleDuplicateSelected = () => {
    if (!currentDoc || !selectedElement) return;
    const dupId = `${selectedElement.id}-copy-${Date.now()}`;
    const copyEl: CanvasElement = {
      ...selectedElement,
      id: dupId,
      name: `${selectedElement.name} (Copy)`,
      x: Math.min(88, selectedElement.x + 4),
      y: Math.min(88, selectedElement.y + 4),
      zIndex: selectedElement.zIndex + 1,
    };
    commitDocumentChange({
      ...currentDoc,
      elements: [...currentDoc.elements, copyEl],
    });
    setSelectedElementId(dupId);
  };

  const handleDeleteSelected = () => {
    if (!currentDoc || !selectedElementId) return;
    const nextElements = currentDoc.elements.filter(
      (e) => e.id !== selectedElementId
    );
    commitDocumentChange({ ...currentDoc, elements: nextElements });
    setSelectedElementId(nextElements[0]?.id || null);
  };

  const handleResizeCanvasPlatform = (newPlatformId: SocialPlatformId) => {
    if (!activeVariation) return;
    const spec =
      SOCIAL_PLATFORMS.find((p) => p.id === newPlatformId) ||
      SOCIAL_PLATFORMS[0];
    const updatedVar: DesignVariation = {
      ...activeVariation,
      platformId: spec.id,
      width: spec.width,
      height: spec.height,
    };
    setVariations((prev) =>
      prev.map((v, i) => (i === activeVariationIndex ? updatedVar : v))
    );
  };

  const handleReplaceScreenshotFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      if (!currentDoc) return;
      const nextElements = currentDoc.elements.map((el) =>
        el.type === "screenshot" ? { ...el, imageUrl: dataUrl } : el
      );
      commitDocumentChange({ ...currentDoc, elements: nextElements });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProjectEdits = () => {
    if (!currentProject) return;
    updateProject(currentProject.id, {
      variations,
      activeVariationId: activeVariation?.id,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (!currentProject || !activeVariation || !currentDoc) {
    return (
      <div className="p-8 text-center text-sm text-slate-400">
        No design project found. Create your first post in Create New Post.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Studio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#121520] px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            aria-label="Select Project"
            className="rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs font-bold text-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Canvas Resizing / Platform Dimension Selector */}
          <select
            value={activeVariation.platformId}
            onChange={(e) =>
              handleResizeCanvasPlatform(e.target.value as SocialPlatformId)
            }
            aria-label="Canvas Platform Dimensions"
            className="rounded-xl border border-white/10 bg-[#0B0D14] px-3 py-2 text-xs font-medium text-slate-200"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.width}×{p.height})
              </option>
            ))}
          </select>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0B0D14] p-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-30"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-30"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0B0D14] px-2.5 py-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.22, +(z - 0.06).toFixed(2)))}
              className="text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(0.75, +(z + 0.06).toFixed(2)))}
              className="text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Save & Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveProjectEdits}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            {saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Edits</span>
              </>
            )}
          </button>

          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            aria-label="Export image format"
            className="rounded-xl border border-white/15 bg-[#0B0D14] px-2.5 py-2 text-xs font-bold uppercase text-white"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>

          <button
            type="button"
            onClick={() =>
              downloadSingleVariation(
                activeVariation,
                exportFormat,
                user?.planTier !== "FREE"
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-violet-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export {exportFormat.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              downloadAllVariationsAsZip(
                currentProject.name,
                variations,
                exportFormat,
                user?.planTier !== "FREE"
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3.5 py-2 text-xs font-bold text-violet-200 hover:bg-violet-500/25"
          >
            <Archive className="h-3.5 w-3.5" />
            <span>ZIP All</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Editor Workspace */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT TOOLBAR & ASSET DRAWER (3 cols) */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-[#121520] lg:col-span-3">
          {/* Tool Tabs */}
          <div className="grid grid-cols-3 gap-1 border-b border-white/10 p-2 sm:grid-cols-6 lg:grid-cols-3">
            {[
              { id: "templates", label: "Variations", icon: Layers },
              { id: "text", label: "Text", icon: Type },
              { id: "images", label: "Screenshot", icon: ImageIcon },
              { id: "shapes", label: "Shapes", icon: Square },
              { id: "backgrounds", label: "Backdrops", icon: Palette },
              { id: "brand", label: "Brand Kit", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = leftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLeftTab(tab.id as LeftTab)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition ${
                    active
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Drawer Content */}
          <div className="flex-1 space-y-4 p-4">
            {leftTab === "templates" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Generated Variation ({variations.length})
                </h3>
                {variations.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setActiveVariationIndex(idx);
                      setSelectedElementId(v.document.elements[0]?.id || null);
                    }}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      activeVariationIndex === idx
                        ? "border-violet-500 bg-violet-600/20 text-white"
                        : "border-white/10 bg-[#0B0D14] text-slate-300 hover:border-white/25"
                    }`}
                  >
                    <div className="text-xs font-bold">
                      Variation {idx + 1}: {v.layoutArchetype}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {v.name} ({v.width}×{v.height})
                    </div>
                  </button>
                ))}
              </div>
            )}

            {leftTab === "text" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Add Typography Layer
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddElement("text")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3.5 text-left transition hover:border-violet-500/50"
                >
                  <div className="text-sm font-extrabold text-white">
                    + Add Display Headline
                  </div>
                  <div className="text-xs text-slate-400">
                    Bold 36px high-impact text node
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("badge")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3.5 text-left transition hover:border-violet-500/50"
                >
                  <div className="text-xs font-bold text-violet-300">
                    + Add Callout Pill / CTA Button
                  </div>
                  <div className="text-xs text-slate-400">
                    Rounded pill badge with brand background
                  </div>
                </button>
              </div>
            )}

            {leftTab === "images" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Screenshot &amp; Window Frame
                </h3>
                <input
                  ref={fileReplaceRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleReplaceScreenshotFile(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileReplaceRef.current?.click()}
                  className="w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
                >
                  Replace Uploaded Screenshot
                </button>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Browser / Device Window Frame
                  </label>
                  {(
                    [
                      { id: "macos-dark", label: "macOS Dark Studio Bar" },
                      { id: "macos-light", label: "macOS Light Frame" },
                      { id: "minimal-glass", label: "Minimal Brand Accent Top" },
                      { id: "none", label: "Frameless Clean Crop" },
                    ] as const
                  ).map((fr) => (
                    <button
                      key={fr.id}
                      type="button"
                      onClick={() => {
                        const nextElements = currentDoc.elements.map((el) =>
                          el.type === "screenshot"
                            ? { ...el, browserFrame: fr.id }
                            : el
                        );
                        commitDocumentChange({
                          ...currentDoc,
                          elements: nextElements,
                        });
                      }}
                      className="block w-full rounded-lg border border-white/10 bg-[#0B0D14] px-3 py-2 text-left text-xs text-slate-200 hover:border-violet-500"
                    >
                      {fr.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftTab === "shapes" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Add Shapes &amp; Callouts
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddElement("shape")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-left text-xs font-semibold text-white hover:border-violet-500"
                >
                  + Add Frosted Glass Card Shape
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("badge")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-left text-xs font-semibold text-white hover:border-violet-500"
                >
                  + Add Feature Highlight Pill
                </button>
              </div>
            )}

            {leftTab === "backgrounds" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Canvas Background Presets
                </h3>
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() =>
                      commitDocumentChange({
                        ...currentDoc,
                        backgroundType: bg.id,
                        backgroundColor: bg.baseColor,
                        backgroundGradient: bg.cssGradient,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0B0D14] p-2.5 text-left text-xs font-semibold text-white hover:border-violet-500"
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-md border border-white/20"
                      style={{ background: bg.cssGradient }}
                    />
                    <span>{bg.name}</span>
                  </button>
                ))}

                <div className="space-y-2 border-t border-white/10 pt-3">
                  <label className="flex items-center justify-between text-xs text-slate-300">
                    <span>Show Architectural Grid</span>
                    <input
                      type="checkbox"
                      checked={currentDoc.showGridPattern}
                      onChange={(e) =>
                        commitDocumentChange({
                          ...currentDoc,
                          showGridPattern: e.target.checked,
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs text-slate-300">
                    <span>Show Ambient Brand Glow</span>
                    <input
                      type="checkbox"
                      checked={currentDoc.showAmbientGlow}
                      onChange={(e) =>
                        commitDocumentChange({
                          ...currentDoc,
                          showAmbientGlow: e.target.checked,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            )}

            {leftTab === "brand" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Apply Brand Kit Identity
                </h3>
                {brandKits.map((bk) => (
                  <button
                    key={bk.id}
                    type="button"
                    onClick={() => {
                      const nextElements = currentDoc.elements.map((el) => {
                        if (el.type === "badge") {
                          return {
                            ...el,
                            backgroundColor: bk.primaryColor,
                            fontFamily: bk.headingFont,
                          };
                        }
                        if (el.type === "text") {
                          return { ...el, fontFamily: bk.headingFont };
                        }
                        return el;
                      });
                      commitDocumentChange({
                        ...currentDoc,
                        primaryBrandColor: bk.primaryColor,
                        secondaryBrandColor: bk.secondaryColor,
                        accentColor: bk.accentColor,
                        elements: nextElements,
                      });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0D14] p-3 text-left hover:border-violet-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {bk.brandName}
                      </span>
                      <div className="flex gap-1">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: bk.primaryColor }}
                        />
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: bk.accentColor }}
                        />
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Font: {bk.headingFont} • CTA: {bk.defaultCta}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER INTERACTIVE DESIGN CANVAS (6 cols) */}
        <div className="flex min-h-[540px] flex-col items-center justify-center overflow-auto rounded-2xl border border-white/10 bg-[#080A10] p-6 lg:col-span-6">
          <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
            <span>
              Click any layer on canvas to inspect • Drag handle or use Arrow
              keys to reposition
            </span>
          </div>

          <DesignCanvasRenderer
            width={activeVariation.width}
            height={activeVariation.height}
            document={currentDoc}
            scale={zoom}
            interactive={true}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElementPosition={handlePositionDrag}
          />
        </div>

        {/* RIGHT PROPERTIES INSPECTOR PANEL (3 cols) */}
        <div className="rounded-2xl border border-white/10 bg-[#121520] p-4 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Layer Properties
            </h3>
            {selectedElement && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDuplicateSelected}
                  title="Duplicate Layer"
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  title="Delete Layer"
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/15"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Layer Selector List */}
          <div className="mt-3 space-y-1 border-b border-white/10 pb-3">
            <div className="text-[11px] font-semibold text-slate-400">
              Canvas Layers ({currentDoc.elements.length})
            </div>
            <div className="max-h-32 space-y-1 overflow-y-auto pr-1">
              {currentDoc.elements.map((el) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => setSelectedElementId(el.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                    selectedElementId === el.id
                      ? "bg-violet-600/25 font-bold text-violet-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{el.name}</span>
                  <span className="font-mono text-[10px] uppercase opacity-75">
                    z:{el.zIndex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedElement ? (
            <div className="mt-4 space-y-3.5 text-xs">
              {/* Text Content */}
              {(selectedElement.type === "text" ||
                selectedElement.type === "badge") && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-300">
                      Text Content
                    </label>
                    <textarea
                      rows={2}
                      value={selectedElement.text || ""}
                      onChange={(e) =>
                        updateSelectedElement({ text: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-300">
                        Font Family
                      </label>
                      <select
                        value={selectedElement.fontFamily || "Inter"}
                        onChange={(e) =>
                          updateSelectedElement({ fontFamily: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300">
                        Font Weight
                      </label>
                      <select
                        value={selectedElement.fontWeight || "700"}
                        onChange={(e) =>
                          updateSelectedElement({
                            fontWeight:
                              e.target.value as CanvasElement["fontWeight"],
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                      >
                        <option value="400">400 Regular</option>
                        <option value="500">500 Medium</option>
                        <option value="600">600 SemiBold</option>
                        <option value="700">700 Bold</option>
                        <option value="800">800 ExtraBold</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-300">
                        Font Size (px)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={selectedElement.fontSize || 32}
                        onChange={(e) =>
                          updateSelectedElement({
                            fontSize: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300">
                        Text Color
                      </label>
                      <div className="mt-1 flex items-center gap-1.5">
                        <input
                          type="color"
                          value={selectedElement.color || "#FFFFFF"}
                          onChange={(e) =>
                            updateSelectedElement({ color: e.target.value })
                          }
                          className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-[#0B0D14]"
                        />
                        <input
                          type="text"
                          value={selectedElement.color || "#FFFFFF"}
                          onChange={(e) =>
                            updateSelectedElement({ color: e.target.value })
                          }
                          className="w-full rounded-lg border border-white/10 bg-[#0B0D14] p-1.5 font-mono text-[11px] text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alignment, Letter Spacing & Line Height */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-300">
                        Align
                      </label>
                      <div className="mt-1 flex rounded-lg border border-white/10 bg-[#0B0D14] p-1">
                        {(["left", "center", "right"] as const).map((al) => (
                          <button
                            key={al}
                            type="button"
                            onClick={() =>
                              updateSelectedElement({ textAlign: al })
                            }
                            className={`flex-1 rounded py-1 flex justify-center ${
                              selectedElement.textAlign === al
                                ? "bg-violet-600 text-white"
                                : "text-slate-400"
                            }`}
                          >
                            {al === "left" && (
                              <AlignLeft className="h-3.5 w-3.5" />
                            )}
                            {al === "center" && (
                              <AlignCenter className="h-3.5 w-3.5" />
                            )}
                            {al === "right" && (
                              <AlignRight className="h-3.5 w-3.5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300">
                        Tracking
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={selectedElement.letterSpacing ?? -0.02}
                        onChange={(e) =>
                          updateSelectedElement({
                            letterSpacing: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300">
                        Line H.
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={selectedElement.lineHeight ?? 1.15}
                        onChange={(e) =>
                          updateSelectedElement({
                            lineHeight: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Background Color, Border Radius, Shadow, Opacity */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300">
                    Fill / Background
                  </label>
                  <input
                    type="text"
                    value={selectedElement.backgroundColor || "transparent"}
                    onChange={(e) =>
                      updateSelectedElement({ backgroundColor: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 font-mono text-[11px] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300">
                    Corner Radius (px)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={selectedElement.borderRadius ?? 12}
                    onChange={(e) =>
                      updateSelectedElement({
                        borderRadius: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300">
                    Elevation Shadow
                  </label>
                  <select
                    value={selectedElement.shadow || "none"}
                    onChange={(e) =>
                      updateSelectedElement({
                        shadow: e.target.value as CanvasElement["shadow"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                  >
                    <option value="none">None</option>
                    <option value="sm">Subtle (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Deep (lg)</option>
                    <option value="xl">Studio (xl)</option>
                    <option value="glow">Brand Glow</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300">
                    Opacity ({Math.round((selectedElement.opacity ?? 1) * 100)}
                    %)
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={selectedElement.opacity ?? 1}
                    onChange={(e) =>
                      updateSelectedElement({
                        opacity: Number(e.target.value),
                      })
                    }
                    className="mt-2.5 w-full"
                  />
                </div>
              </div>

              {/* Position X, Y, Width & Layer Order */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300">
                    X (%)
                  </label>
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) =>
                      updateSelectedElement({ x: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300">
                    Y (%)
                  </label>
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) =>
                      updateSelectedElement({ y: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300">
                    Width (%)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={selectedElement.width}
                    onChange={(e) =>
                      updateSelectedElement({ width: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0D14] p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSelectedElement({
                      zIndex: selectedElement.zIndex + 1,
                    })
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[#0B0D14] py-2 text-slate-200 hover:bg-white/5"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  <span>Bring Forward</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSelectedElement({
                      zIndex: Math.max(1, selectedElement.zIndex - 1),
                    })
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[#0B0D14] py-2 text-slate-200 hover:bg-white/5"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                  <span>Send Backward</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-center text-xs text-slate-500">
              Select any layer on the canvas or from the layer list above to
              customize its typography, colors, frame, and position.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VisualEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-slate-400">
          Loading Visual Design Editor...
        </div>
      }
    >
      <VisualDesignEditorInner />
    </Suspense>
  );
}
