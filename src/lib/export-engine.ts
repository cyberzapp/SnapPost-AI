import JSZip from "jszip";
import { DesignVariation } from "@/types";

export type ExportFormat = "png" | "jpeg" | "webp";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function renderVariationToBlob(
  variation: DesignVariation,
  format: ExportFormat = "png",
  isPaidPlan = true
): Promise<Blob> {
  const { width, height, document: doc } = variation;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // 1. Background Fill
  ctx.fillStyle = doc.backgroundColor || "#090B10";
  ctx.fillRect(0, 0, width, height);

  // Radial/Linear Gradient simulation matching preset
  const grad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.2,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.85
  );
  grad.addColorStop(0, `${doc.primaryBrandColor}44`);
  grad.addColorStop(0.55, doc.backgroundColor || "#090B10");
  grad.addColorStop(1, doc.backgroundColor || "#090B10");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Grid pattern
  if (doc.showGridPattern) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // 3. Sort and draw elements in zIndex order
  const sorted = [...doc.elements].sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sorted) {
    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;

    const ex = (el.x / 100) * width;
    const ey = (el.y / 100) * height;
    const ew = (el.width / 100) * width;
    const eh = el.height ? (el.height / 100) * height : 100;

    if (el.type === "shape") {
      drawRoundedRect(ctx, ex, ey, ew, eh, el.borderRadius ?? 16);
      ctx.fillStyle = el.backgroundColor || "rgba(124, 58, 237, 0.25)";
      ctx.fill();
      if (el.borderWidth) {
        ctx.lineWidth = el.borderWidth;
        ctx.strokeStyle = el.borderColor || doc.primaryBrandColor;
        ctx.stroke();
      }
    } else if (el.type === "badge") {
      const fontSize = el.fontSize || 16;
      ctx.font = `${el.fontWeight || "700"} ${fontSize}px ${
        el.fontFamily || "Inter"
      }, sans-serif`;
      const badgeHeight = fontSize + 28;
      drawRoundedRect(ctx, ex, ey, ew, badgeHeight, el.borderRadius ?? 999);
      ctx.fillStyle = el.backgroundColor || doc.primaryBrandColor;
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (el.borderWidth) {
        ctx.lineWidth = el.borderWidth;
        ctx.strokeStyle = el.borderColor || "rgba(255,255,255,0.25)";
        ctx.stroke();
      }

      ctx.fillStyle = el.color || "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.textAlign = el.textAlign || "center";
      const textX =
        el.textAlign === "left"
          ? ex + 20
          : el.textAlign === "right"
          ? ex + ew - 20
          : ex + ew / 2;
      ctx.fillText(el.text || "", textX, ey + badgeHeight / 2);
    } else if (el.type === "text") {
      const fontSize = el.fontSize || 36;
      const lineHeight = (el.lineHeight ?? 1.18) * fontSize;
      ctx.font = `${el.fontWeight || "700"} ${fontSize}px ${
        el.fontFamily || "Inter"
      }, sans-serif`;
      ctx.fillStyle = el.color || "#F8FAFC";
      ctx.textBaseline = "top";
      ctx.textAlign = el.textAlign || "left";

      const lines = wrapTextLines(ctx, el.text || "", ew);
      const textX =
        el.textAlign === "center"
          ? ex + ew / 2
          : el.textAlign === "right"
          ? ex + ew
          : ex;

      lines.forEach((line, idx) => {
        ctx.fillText(line, textX, ey + idx * lineHeight);
      });
    } else if (el.type === "screenshot" && el.imageUrl) {
      const radius = el.borderRadius ?? 16;
      ctx.shadowColor = "rgba(0,0,0,0.65)";
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = 20;
      drawRoundedRect(ctx, ex, ey, ew, eh, radius);
      ctx.fillStyle =
        el.browserFrame === "macos-light" ? "#F1F5F9" : "#0D111C";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.save();
      drawRoundedRect(ctx, ex, ey, ew, eh, radius);
      ctx.clip();

      let headerOffset = 0;
      if (
        el.browserFrame === "macos-dark" ||
        el.browserFrame === "macos-light"
      ) {
        headerOffset = 34;
        ctx.fillStyle =
          el.browserFrame === "macos-light" ? "#E2E8F0" : "#161C2E";
        ctx.fillRect(ex, ey, ew, headerOffset);

        const dots = ["#EF4444", "#F59E0B", "#10B981"];
        dots.forEach((c, idx) => {
          ctx.beginPath();
          ctx.arc(ex + 18 + idx * 18, ey + 17, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
        });
      } else if (el.browserFrame === "minimal-glass") {
        headerOffset = 10;
        ctx.fillStyle = doc.primaryBrandColor;
        ctx.fillRect(ex, ey, ew, headerOffset);
      }

      try {
        const img = await loadImage(el.imageUrl);
        const imgAreaW = ew;
        const imgAreaH = eh - headerOffset;
        const scaleRatio = Math.max(
          imgAreaW / img.width,
          imgAreaH / img.height
        );
        const drawW = img.width * scaleRatio;
        const drawH = img.height * scaleRatio;
        const drawX = ex + (imgAreaW - drawW) / 2;
        const drawY = ey + headerOffset;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        ctx.fillStyle = "#1E293B";
        ctx.fillRect(ex, ey + headerOffset, ew, eh - headerOffset);
      }

      ctx.restore();

      // Frame border
      drawRoundedRect(ctx, ex, ey, ew, eh, radius);
      ctx.lineWidth = el.borderWidth ?? 1.5;
      ctx.strokeStyle = el.borderColor || "rgba(255,255,255,0.18)";
      ctx.stroke();
    }

    ctx.restore();
  }

  // Watermark only if FREE plan and doc.showWatermark is true
  if (!isPaidPlan && doc.showWatermark) {
    ctx.save();
    const wmW = 190;
    const wmH = 34;
    const wmX = width - wmW - 20;
    const wmY = height - wmH - 18;
    drawRoundedRect(ctx, wmX, wmY, wmW, wmH, 999);
    ctx.fillStyle = "rgba(9, 11, 16, 0.82)";
    ctx.fill();
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Built with SnapPost AI", wmX + wmW / 2, wmY + wmH / 2);
    ctx.restore();
  }

  const mimeType =
    format === "jpeg"
      ? "image/jpeg"
      : format === "webp"
      ? "image/webp"
      : "image/png";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode image blob"));
      },
      mimeType,
      0.95
    );
  });
}

export async function downloadSingleVariation(
  variation: DesignVariation,
  format: ExportFormat = "png",
  isPaidPlan = true
) {
  const blob = await renderVariationToBlob(variation, format, isPaidPlan);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = variation.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  a.href = url;
  a.download = `${safeName}-${variation.width}x${variation.height}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllVariationsAsZip(
  projectName: string,
  variations: DesignVariation[],
  format: ExportFormat = "png",
  isPaidPlan = true
) {
  const zip = new JSZip();
  const folderName =
    projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "snappost-designs";

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];
    const blob = await renderVariationToBlob(v, format, isPaidPlan);
    const fileName = `variation-${i + 1}-${v.platformId}-${v.width}x${v.height}.${format}`;
    zip.file(fileName, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}-${variations.length}-variations.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
