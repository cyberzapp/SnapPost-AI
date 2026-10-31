import { GoogleGenAI } from "@google/genai";
import {
  PlatformCaptionsResult,
  ScreenshotAnalysisResult,
  ScreenshotContextInput,
  SocialPlatformId,
  WritingTone,
} from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

function parseDataUrlBrowser(
  dataUrl: string
): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  const utf8Match = dataUrl.match(/^data:([^;,]+);utf8,(.+)$/);
  if (utf8Match) {
    const decoded = decodeURIComponent(utf8Match[2]);
    const base64 =
      typeof window !== "undefined"
        ? window.btoa(unescape(encodeURIComponent(decoded)))
        : Buffer.from(decoded, "utf-8").toString("base64");
    return {
      mimeType: utf8Match[1],
      data: base64,
    };
  }
  return null;
}

export async function runScreenshotAnalysis({
  imageDataUrl,
  extractedColors = [],
  context = {},
  geminiApiKey,
}: {
  imageDataUrl: string;
  extractedColors?: string[];
  context?: ScreenshotContextInput;
  geminiApiKey?: string;
}): Promise<{
  analysis: ScreenshotAnalysisResult;
  configNotice?: string;
  latencyMs: number;
}> {
  const startTime = Date.now();

  // First try server API route if running on Node server
  try {
    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl,
        extractedColors,
        geminiApiKeyClient: geminiApiKey,
        context,
      }),
    });
    if (
      res.ok &&
      res.headers.get("content-type")?.includes("application/json")
    ) {
      const data = await res.json();
      if (data.analysis) {
        return {
          analysis: data.analysis,
          configNotice: data.configNotice,
          latencyMs: data.latencyMs || Date.now() - startTime,
        };
      }
    }
  } catch {
    // Fallback to client-side Gemini 3.8 Flash / Heuristic execution (e.g. on Firebase static hosting)
  }

  const activeGeminiKey =
    geminiApiKey?.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (activeGeminiKey && !activeGeminiKey.includes("your-")) {
    try {
      const client = new GoogleGenAI({ apiKey: activeGeminiKey });
      const parsedImage = parseDataUrlBrowser(imageDataUrl);

      const systemPrompt = `You are an elite SaaS product marketer and UI/UX vision analyst powered by Google Gemini 3.8 Flash.
Analyze the uploaded screenshot and any user-supplied context.
CRITICAL RULE: Do NOT invent product features that are not visible in the screenshot or explicitly supplied by the user. Mark any inferred or less-certain observations with confidence: "uncertain" or "medium".`;

      const userContextText = `User Supplied Context:
- Product Name: ${context.productName || "Not specified"}
- Product Description: ${context.productDescription || "Not specified"}
- Target Audience: ${context.targetAudience || "Not specified"}
- Brand Name: ${context.brandName || context.productName || "Not specified"}
- Desired Tone: ${context.desiredTone || "Professional"}
- Main Objective: ${context.mainObjective || "Drive product awareness & signups"}`;

      const inputParts: Array<
        | { type: "text"; text: string }
        | { type: "image"; data: string; mime_type: string }
      > = [{ type: "text", text: `${systemPrompt}\n\n${userContextText}` }];

      if (parsedImage && parsedImage.mimeType !== "image/svg+xml") {
        inputParts.push({
          type: "image",
          data: parsedImage.data,
          mime_type: parsedImage.mimeType,
        });
      }

      const interaction = await client.interactions.create({
        model: "gemini-3.8-flash",
        input: inputParts,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: {
            type: "object",
            properties: {
              screenshotRepresents: { type: "string" },
              category: { type: "string" },
              mainPurpose: { type: "string" },
              productSummary: { type: "string" },
              visibleFeatures: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    confidence: {
                      type: "string",
                      enum: ["high", "medium", "uncertain"],
                    },
                  },
                  required: ["name", "description", "confidence"],
                },
              },
              uiElements: { type: "array", items: { type: "string" } },
              brandColors: { type: "array", items: { type: "string" } },
              designStyle: { type: "string" },
              targetAudience: { type: "string" },
              uniqueSellingPoints: { type: "array", items: { type: "string" } },
              marketingAngles: { type: "array", items: { type: "string" } },
              recommendedPlatforms: {
                type: "array",
                items: { type: "string" },
              },
              suggestedHeadline: { type: "string" },
              suggestedSubheadline: { type: "string" },
              suggestedCta: { type: "string" },
            },
            required: [
              "screenshotRepresents",
              "category",
              "mainPurpose",
              "productSummary",
              "visibleFeatures",
              "uiElements",
              "brandColors",
              "designStyle",
              "targetAudience",
              "uniqueSellingPoints",
              "marketingAngles",
              "recommendedPlatforms",
              "suggestedHeadline",
              "suggestedSubheadline",
              "suggestedCta",
            ],
          },
        },
      });

      const parsed = JSON.parse(interaction.output_text || "{}");
      return {
        analysis: {
          screenshotRepresents:
            parsed.screenshotRepresents || "Web Application Interface",
          category: parsed.category || "SaaS Web Application",
          mainPurpose:
            parsed.mainPurpose ||
            "Streamline workflows and surface actionable metrics",
          productSummary:
            parsed.productSummary ||
            "A modern digital interface designed for high-velocity teams.",
          visibleFeatures: Array.isArray(parsed.visibleFeatures)
            ? parsed.visibleFeatures
            : [],
          uiElements: Array.isArray(parsed.uiElements) ? parsed.uiElements : [],
          brandColors:
            Array.isArray(parsed.brandColors) && parsed.brandColors.length > 0
              ? parsed.brandColors
              : extractedColors,
          designStyle: parsed.designStyle || "Modern Dark SaaS UI",
          targetAudience:
            parsed.targetAudience ||
            context.targetAudience ||
            "SaaS Founders & Product Teams",
          uniqueSellingPoints: Array.isArray(parsed.uniqueSellingPoints)
            ? parsed.uniqueSellingPoints
            : [],
          marketingAngles: Array.isArray(parsed.marketingAngles)
            ? parsed.marketingAngles
            : [],
          recommendedPlatforms: (Array.isArray(parsed.recommendedPlatforms)
            ? parsed.recommendedPlatforms
            : [
                "linkedin-post",
                "twitter-post",
                "instagram-post",
              ]) as SocialPlatformId[],
          suggestedHeadline:
            parsed.suggestedHeadline ||
            "Turn Complex Workflows Into Instant Clarity",
          suggestedSubheadline:
            parsed.suggestedSubheadline ||
            "Real-time visibility, automated insights, and zero configuration overhead.",
          suggestedCta: parsed.suggestedCta || "Start Free Trial →",
          analyzedBy: "gemini-vision",
        },
        latencyMs: Date.now() - startTime,
      };
    } catch {
      // Fall through to heuristic engine if key invalid
    }
  }

  const prodName =
    context.productName?.trim() ||
    context.brandName?.trim() ||
    "PulseMetrics AI";
  const prodDesc =
    context.productDescription?.trim() ||
    "Real-time analytics and automated workflow intelligence interface.";
  const audience =
    context.targetAudience?.trim() ||
    "SaaS Founders, Product Managers, Developers & Growth Teams";
  const objective =
    context.mainObjective?.trim() || "Drive product signups and demo requests";
  const palette =
    extractedColors.length >= 2
      ? extractedColors
      : ["#7C3AED", "#3B82F6", "#10B981"];

  return {
    analysis: {
      screenshotRepresents: `High-contrast product interface for ${prodName}`,
      category: "B2B SaaS & Product Intelligence",
      mainPurpose: prodDesc,
      productSummary: `${prodName} provides a streamlined command center built for ${audience.toLowerCase()} to monitor KPIs, eliminate manual reporting, and act on live insights.`,
      visibleFeatures: [
        {
          name: `${prodName} Core Workspace`,
          description:
            "Primary interactive dashboard view displaying structured metrics and navigation controls.",
          confidence: "high",
        },
        {
          name: "Real-Time Telemetry & KPI Cards",
          description:
            "Visual data summaries with trend indicators and clean typographic hierarchy.",
          confidence: "high",
        },
        {
          name: "Automated Workflow Actions",
          description:
            "Inferred action triggers and export/reporting controls visible in the header layout.",
          confidence: context.productDescription ? "high" : "uncertain",
        },
      ],
      uiElements: [
        "Sidebar navigation rail",
        "KPI metric cards with delta badges",
        "Primary time-series visualization",
        "Action CTA button in header",
      ],
      brandColors: palette,
      designStyle: "Modern Dark-Mode SaaS Editorial UI",
      targetAudience: audience,
      uniqueSellingPoints: [
        `Built specifically for ${audience}`,
        "Zero-clutter interface that surfaces key decisions in seconds",
        `Engineered to ${objective.toLowerCase()}`,
      ],
      marketingAngles: [
        `How ${prodName} cuts weekly reporting time by 10x`,
        `Stop guessing: Real-time product clarity for ${audience.split(",")[0]}`,
        `Inside the new ${prodName} experience — faster, cleaner, smarter`,
      ],
      recommendedPlatforms: [
        "linkedin-post",
        "twitter-post",
        "instagram-post",
        "instagram-portrait",
      ],
      suggestedHeadline: `${prodName}: Real-Time Clarity Without The Busywork`,
      suggestedSubheadline: prodDesc,
      suggestedCta: "Try It Free Today →",
      analyzedBy: "heuristic-vision-engine",
    },
    configNotice:
      "Add your Google Gemini API Key in Dashboard → Settings to run live Gemini 3.8 Flash (gemini-3.8-flash) Vision inspection.",
    latencyMs: Date.now() - startTime,
  };
}

export async function runCaptionsGeneration({
  analysis,
  platformId,
  tone,
  productName,
  geminiApiKey,
}: {
  analysis: ScreenshotAnalysisResult;
  platformId: SocialPlatformId;
  tone: WritingTone;
  productName: string;
  geminiApiKey?: string;
}): Promise<PlatformCaptionsResult> {
  // First try server API route if available
  try {
    const res = await fetch("/api/ai/captions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysis,
        platformId,
        tone,
        productName,
        geminiApiKeyClient: geminiApiKey,
      }),
    });
    if (
      res.ok &&
      res.headers.get("content-type")?.includes("application/json")
    ) {
      const data = await res.json();
      if (data.captions) return data.captions;
    }
  } catch {
    // Fallback to client-side execution on static Firebase Hosting
  }

  const platform =
    SOCIAL_PLATFORMS.find((p) => p.id === platformId) || SOCIAL_PLATFORMS[0];
  const activeGeminiKey =
    geminiApiKey?.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (activeGeminiKey && !activeGeminiKey.includes("your-")) {
    try {
      const client = new GoogleGenAI({ apiKey: activeGeminiKey });
      const prompt = `You are a world-class social media copywriter for SaaS and tech products powered by Google Gemini 3.8 Flash.
Generate platform-native social copy for:
- Platform: ${platform.name} (${platform.label})
- Writing Tone: ${tone}
- Product Name: ${productName}
- Product Summary: ${analysis.productSummary}
- Key Visible Features: ${analysis.visibleFeatures.map((f) => f.name).join(", ")}
- Target Audience: ${analysis.targetAudience}
- Marketing Angles: ${analysis.marketingAngles.join(" | ")}`;

      const interaction = await client.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: {
            type: "object",
            properties: {
              headlines: { type: "array", items: { type: "string" } },
              openingHooks: { type: "array", items: { type: "string" } },
              captions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    body: { type: "string" },
                  },
                  required: ["title", "body"],
                },
              },
              hashtags: { type: "array", items: { type: "string" } },
              ctaSuggestions: { type: "array", items: { type: "string" } },
              shortPromoDescriptions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "headlines",
              "openingHooks",
              "captions",
              "hashtags",
              "ctaSuggestions",
              "shortPromoDescriptions",
            ],
          },
        },
      });

      const parsed = JSON.parse(interaction.output_text || "{}");
      return {
        platformId,
        tone,
        headlines: parsed.headlines?.slice(0, 5) || [],
        openingHooks: parsed.openingHooks?.slice(0, 3) || [],
        captions: (parsed.captions || []).map(
          (c: { title?: string; body?: string }, i: number) => ({
            title: c.title || `Variation ${i + 1}`,
            body: c.body || "",
            characterCount: (c.body || "").length,
          })
        ),
        hashtags: parsed.hashtags || [],
        ctaSuggestions: parsed.ctaSuggestions || [],
        shortPromoDescriptions: parsed.shortPromoDescriptions || [],
      };
    } catch {
      // Fall through to deterministic copy generator
    }
  }

  const feat1 = analysis.visibleFeatures[0]?.name || "Real-Time Telemetry";
  const feat2 = analysis.visibleFeatures[1]?.name || "Automated Workflows";
  const isLinkedIn = platformId.startsWith("linkedin");
  const isTwitter = platformId === "twitter-post";
  const isInstagram = platformId.startsWith("instagram");

  const tonePrefix =
    tone === "Founder-style"
      ? "We spent months obsessing over one problem:"
      : tone === "Technical"
      ? "Under the hood of our latest architecture update:"
      : tone === "Promotional"
      ? "Stop losing hours to fragmented tools."
      : tone === "Storytelling"
      ? "Every team hits that wall where spreadsheets quietly break."
      : "Here is how high-performing teams are simplifying their workflow:";

  const caption1Body = isTwitter
    ? `${tonePrefix}\n\nMost tools bury signal under 40 tabs.\n\nSo we built ${productName} to surface ${feat1} and ${feat2} in a single view.\n\n• Zero config lag\n• Built for ${analysis.targetAudience.split(",")[0]}\n• Instant clarity\n\n${analysis.suggestedCta}`
    : isLinkedIn
    ? `${tonePrefix}\n\nWhen we talked to ${analysis.targetAudience}, the #1 complaint wasn't lack of data — it was decision fatigue.\n\nHere is how we designed ${productName} to fix that:\n\n1️⃣ ${feat1}: See what matters in real time without manual exports.\n2️⃣ ${feat2}: Turn raw metrics into immediate next steps.\n3️⃣ Clean, distraction-free interface engineered for speed.\n\n${analysis.productSummary}\n\nCurious how this fits your stack? ${analysis.suggestedCta}`
    : isInstagram
    ? `${tonePrefix} ✨\n\nMeet ${productName} — designed from the ground up for ${analysis.targetAudience}.\n\n⚡ ${feat1}\n⚡ ${feat2}\n⚡ ${analysis.uniqueSellingPoints[1] || "Clean, dark-mode native interface"}\n\nDrop a "🚀" in the comments or tap the link in bio to ${analysis.suggestedCta.toLowerCase()}!`
    : `${tonePrefix}\n\n${analysis.productSummary}\n\nWith ${feat1} and ${feat2}, ${productName} helps ${analysis.targetAudience} move faster with confidence.\n\n${analysis.suggestedCta}`;

  const caption2Body = `Before ${productName}: Jumping between 6 browser tabs just to answer a single status question.\n\nAfter ${productName}: ${analysis.mainPurpose}\n\nWhat changed?\n• ${feat1} right on the home canvas\n• ${feat2} with one click\n• Designed for ${analysis.targetAudience}\n\nTry the live workflow today — ${analysis.suggestedCta}`;

  const caption3Body = `Shipping day! 🚀\n\nWe just rolled out a major upgrade to ${productName}.\n\n${analysis.productSummary}\n\nHighlights in this release:\n→ ${feat1}\n→ ${feat2}\n→ ${analysis.uniqueSellingPoints[0] || "Faster performance across every view"}\n\nWe'd love your feedback. ${analysis.suggestedCta}`;

  return {
    platformId,
    tone,
    headlines: [
      analysis.suggestedHeadline,
      `Meet ${productName}: ${feat1} Without The Friction`,
      `How Top Teams Automate ${feat2} in Minutes`,
      `The Cleaner, Faster Way to ${analysis.mainPurpose.slice(0, 48)}`,
      `Built for ${analysis.targetAudience.split(",")[0]}: Inside ${productName}`,
    ],
    openingHooks: [
      `${tonePrefix} Why do most dashboards feel like homework?`,
      `We deleted 60% of the clutter so you can focus on ${feat1.toLowerCase()}.`,
      `Here is the exact interface helping teams ${analysis.mainPurpose.toLowerCase()}.`,
    ],
    captions: [
      {
        title: `${platform.name} — Value & Feature Breakdown (${tone})`,
        body: caption1Body,
        characterCount: caption1Body.length,
      },
      {
        title: `${platform.name} — Before vs. After Contrast`,
        body: caption2Body,
        characterCount: caption2Body.length,
      },
      {
        title: `${platform.name} — Product Launch Announcement`,
        body: caption3Body,
        characterCount: caption3Body.length,
      },
    ],
    hashtags: [
      "#SaaS",
      "#ProductDesign",
      "#BuildInPublic",
      "#IndieHackers",
      "#B2BSaaS",
      "#TechStartup",
      "#UIUX",
      "#GeminiAI",
    ].slice(0, platform.maxHashtags),
    ctaSuggestions: [
      analysis.suggestedCta,
      "Start Your 14-Day Free Trial →",
      "Explore the Interactive Demo →",
      "Book a 5-Minute Walkthrough →",
    ],
    shortPromoDescriptions: [
      analysis.productSummary,
      `${productName} combines ${feat1.toLowerCase()} and ${feat2.toLowerCase()} in one unified workspace.`,
      `Stop wrestling with spreadsheets — upgrade to ${productName} today.`,
    ],
  };
}
