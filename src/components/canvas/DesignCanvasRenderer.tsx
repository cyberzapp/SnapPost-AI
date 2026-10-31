"use client";

import React, { useRef, useState } from "react";
import { CanvasDocument, CanvasElement } from "@/types";
import { Move } from "lucide-react";

interface DesignCanvasRendererProps {
  width: number;
  height: number;
  document: CanvasDocument;
  scale?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateElementPosition?: (id: string, x: number, y: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export function DesignCanvasRenderer({
  width,
  height,
  document: doc,
  scale = 0.45,
  interactive = false,
  selectedElementId = null,
  onSelectElement,
  onUpdateElementPosition,
  canvasRef,
}: DesignCanvasRendererProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = canvasRef || internalRef;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({ startX: 0, startY: 0, origX: 0, origY: 0 });

  const clampPercentage = (val: number, min = 0, max = 92) =>
    Math.max(min, Math.min(max, Math.round(val * 10) / 10));

  const getShadowStyle = (
    shadow?: CanvasElement["shadow"],
    brandColor = "#7C3AED"
  ) => {
    switch (shadow) {
      case "sm":
        return "0 4px 12px rgba(0,0,0,0.22)";
      case "md":
        return "0 10px 25px -5px rgba(0,0,0,0.4)";
      case "lg":
        return "0 20px 40px -12px rgba(0,0,0,0.55)";
      case "xl":
        return "0 30px 65px -15px rgba(0,0,0,0.72)";
      case "glow":
        return `0 18px 50px -10px ${brandColor}66, 0 10px 30px -10px rgba(0,0,0,0.6)`;
      default:
        return "none";
    }
  };

  const sortedElements = [...doc.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        position: "relative",
        overflow: "hidden",
      }}
      className="select-none rounded-lg shadow-2xl"
    >
      <div
        ref={containerRef}
        onClick={(e) => {
          if (interactive && e.target === e.currentTarget && onSelectElement) {
            onSelectElement(null);
          }
        }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundColor: doc.backgroundColor || "#090B10",
          backgroundImage: doc.backgroundGradient || "none",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Subtle Architectural Grid Overlay */}
        {doc.showGridPattern && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Ambient Radial Brand Spotlight */}
        {doc.showAmbientGlow && (
          <div
            style={{
              position: "absolute",
              width: `${width * 0.7}px`,
              height: `${height * 0.55}px`,
              left: "15%",
              top: "20%",
              background: `radial-gradient(circle, ${doc.primaryBrandColor}38 0%, transparent 70%)`,
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Render Editable Canvas Layers */}
        {sortedElements.map((el) => {
          const isSelected = interactive && selectedElementId === el.id;
          const isDragging = draggingId === el.id;

          return (
            <div
              key={el.id}
              onClick={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                onSelectElement?.(el.id);
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}%`,
                height: el.height ? `${el.height}%` : "auto",
                zIndex: el.zIndex,
                opacity: el.opacity ?? 1,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                outline: isSelected
                  ? "3px solid #8B5CF6"
                  : interactive
                  ? "1px dashed transparent"
                  : "none",
                outlineOffset: "4px",
                borderRadius: el.borderRadius ? `${el.borderRadius}px` : "6px",
                transition: isDragging ? "none" : "outline 0.15s ease",
              }}
              className={
                interactive ? "group hover:outline-violet-500/50" : undefined
              }
            >
              {/* Dedicated Accessible Drag Handle per modern-web-guidance `drag` spec */}
              {interactive && isSelected && onUpdateElementPosition && (
                <button
                  type="button"
                  aria-label={`Move ${el.name} layer with pointer or arrow keys`}
                  tabIndex={0}
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    event.stopPropagation();
                    dragOffset.current = {
                      startX: event.clientX,
                      startY: event.clientY,
                      origX: el.x,
                      origY: el.y,
                    };
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDraggingId(el.id);
                  }}
                  onPointerMove={(event) => {
                    if (!event.currentTarget.hasPointerCapture(event.pointerId))
                      return;
                    const dxPx = (event.clientX - dragOffset.current.startX) / scale;
                    const dyPx = (event.clientY - dragOffset.current.startY) / scale;
                    const dxPct = (dxPx / width) * 100;
                    const dyPct = (dyPx / height) * 100;
                    onUpdateElementPosition(
                      el.id,
                      clampPercentage(dragOffset.current.origX + dxPct, 0, 95),
                      clampPercentage(dragOffset.current.origY + dyPct, 0, 95)
                    );
                  }}
                  onLostPointerCapture={() => {
                    setDraggingId(null);
                  }}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 3 : 1;
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      onUpdateElementPosition(
                        el.id,
                        clampPercentage(el.x - step, 0, 95),
                        el.y
                      );
                    } else if (event.key === "ArrowRight") {
                      event.preventDefault();
                      onUpdateElementPosition(
                        el.id,
                        clampPercentage(el.x + step, 0, 95),
                        el.y
                      );
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      onUpdateElementPosition(
                        el.id,
                        el.x,
                        clampPercentage(el.y - step, 0, 95)
                      );
                    } else if (event.key === "ArrowDown") {
                      event.preventDefault();
                      onUpdateElementPosition(
                        el.id,
                        el.x,
                        clampPercentage(el.y + step, 0, 95)
                      );
                    }
                  }}
                  className={`drag-handle ${
                    isDragging ? "dragging" : ""
                  } absolute -top-9 left-0 z-50 flex items-center gap-1.5 rounded-md bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg`}
                  style={{
                    transform: `scale(${Math.max(1, 0.75 / scale)})`,
                    transformOrigin: "bottom left",
                  }}
                >
                  <Move className="h-3.5 w-3.5" />
                  <span>{el.name}</span>
                </button>
              )}

              {/* TEXT ELEMENT */}
              {el.type === "text" && (
                <div
                  style={{
                    fontFamily: el.fontFamily || "Inter, sans-serif",
                    fontSize: `${el.fontSize || 36}px`,
                    fontWeight: el.fontWeight || "700",
                    color: el.color || "#F8FAFC",
                    textAlign: el.textAlign || "left",
                    letterSpacing: `${el.letterSpacing ?? -0.02}em`,
                    lineHeight: el.lineHeight ?? 1.2,
                    backgroundColor: el.backgroundColor || "transparent",
                    padding: el.backgroundColor ? "12px 18px" : "0px",
                    borderRadius: el.borderRadius ? `${el.borderRadius}px` : "0px",
                    wordBreak: "break-word",
                  }}
                >
                  {el.text}
                </div>
              )}

              {/* BADGE / CTA ELEMENT */}
              {el.type === "badge" && (
                <div
                  style={{
                    fontFamily: el.fontFamily || "Inter, sans-serif",
                    fontSize: `${el.fontSize || 16}px`,
                    fontWeight: el.fontWeight || "700",
                    color: el.color || "#FFFFFF",
                    textAlign: el.textAlign || "center",
                    letterSpacing: `${el.letterSpacing ?? 0.02}em`,
                    backgroundColor: el.backgroundColor || doc.primaryBrandColor,
                    border: el.borderWidth
                      ? `${el.borderWidth}px solid ${el.borderColor || "#ffffff33"}`
                      : "none",
                    borderRadius: `${el.borderRadius ?? 999}px`,
                    padding: "14px 26px",
                    boxShadow: getShadowStyle(el.shadow, doc.primaryBrandColor),
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      el.textAlign === "left"
                        ? "flex-start"
                        : el.textAlign === "right"
                        ? "flex-end"
                        : "center",
                  }}
                >
                  {el.text}
                </div>
              )}

              {/* SHAPE ELEMENT */}
              {el.type === "shape" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "60px",
                    backgroundColor:
                      el.backgroundColor || "rgba(124, 58, 237, 0.25)",
                    border: el.borderWidth
                      ? `${el.borderWidth}px solid ${
                          el.borderColor || doc.primaryBrandColor
                        }`
                      : "1px solid rgba(255,255,255,0.14)",
                    borderRadius: `${el.borderRadius ?? 16}px`,
                    boxShadow: getShadowStyle(el.shadow, doc.primaryBrandColor),
                    backdropFilter: "blur(12px)",
                  }}
                />
              )}

              {/* SCREENSHOT SHOWCASE ELEMENT */}
              {el.type === "screenshot" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: `${el.borderRadius ?? 16}px`,
                    overflow: "hidden",
                    boxShadow: getShadowStyle(
                      el.shadow || "xl",
                      doc.primaryBrandColor
                    ),
                    border: `${el.borderWidth ?? 1}px solid ${
                      el.borderColor || "rgba(255,255,255,0.16)"
                    }`,
                    backgroundColor:
                      el.browserFrame === "macos-light" ? "#F1F5F9" : "#0D111C",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Browser / Window Header Bar */}
                  {(el.browserFrame === "macos-dark" ||
                    el.browserFrame === "macos-light") && (
                    <div
                      style={{
                        height: "34px",
                        backgroundColor:
                          el.browserFrame === "macos-light"
                            ? "#E2E8F0"
                            : "#161C2E",
                        borderBottom:
                          el.browserFrame === "macos-light"
                            ? "1px solid #CBD5E1"
                            : "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "11px",
                          height: "11px",
                          borderRadius: "999px",
                          backgroundColor: "#EF4444",
                        }}
                      />
                      <span
                        style={{
                          width: "11px",
                          height: "11px",
                          borderRadius: "999px",
                          backgroundColor: "#F59E0B",
                        }}
                      />
                      <span
                        style={{
                          width: "11px",
                          height: "11px",
                          borderRadius: "999px",
                          backgroundColor: "#10B981",
                        }}
                      />
                      <div
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          padding: "3px 28px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 500,
                          color:
                            el.browserFrame === "macos-light"
                              ? "#475569"
                              : "#94A3B8",
                          backgroundColor:
                            el.browserFrame === "macos-light"
                              ? "#F8FAFC"
                              : "rgba(255,255,255,0.05)",
                        }}
                      >
                        app.product-workspace.ai
                      </div>
                    </div>
                  )}

                  {el.browserFrame === "minimal-glass" && (
                    <div
                      style={{
                        height: "10px",
                        background: `linear-gradient(90deg, ${doc.primaryBrandColor}, ${doc.accentColor})`,
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Uploaded Product Screenshot — Never distorted */}
                  <div
                    style={{
                      position: "relative",
                      flex: 1,
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      backgroundColor: "#0B0E17",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={el.imageUrl}
                      alt={el.name || "Uploaded Product Screenshot"}
                      crossOrigin="anonymous"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Subtle Watermark ONLY on FREE plan */}
        {doc.showWatermark && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              bottom: "16px",
              zIndex: 50,
              backgroundColor: "rgba(9, 11, 16, 0.78)",
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#CBD5E1",
              pointerEvents: "none",
            }}
          >
            Built with SnapPost AI
          </div>
        )}
      </div>
    </div>
  );
}
