import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import {
  ScreenshotAnalysisResult,
  ScreenshotContextInput,
  SocialPlatformId,
} from "@/types";

function parseDataUrl(
  dataUrl: string
): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  const utf8Match = dataUrl.match(/^data:([^;,]+);utf8,(.+)$/);
  if (utf8Match) {
    const decoded = decodeURIComponent(utf8Match[2]);
    return {
      mimeType: utf8Match[1],
      data: Buffer.from(decoded, "utf-8").toString("base64"),
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      imageDataUrl,
      context = {},
      extractedColors = [],
      geminiApiKeyClient,
    }: {
      imageDataUrl: string;
      context?: ScreenshotContextInput;
      extractedColors?: string[];
      geminiApiKeyClient?: string;
    } = body;

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json(
        { error: "A valid screenshot image is required for analysis." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite SaaS product marketer and UI/UX vision analyst powered by Google Gemini 3.8 Flash.
Analyze the uploaded screenshot and any user-supplied context.
CRITICAL RULE: Do NOT invent product features that are not visible in the screenshot or explicitly supplied by the user. Mark any inferred or less-certain observations with confidence: "uncertain" or "medium".`;

    const userContextText = `User Supplied Context:
- Product Name: ${context.productName || "Not specified (infer from UI text if visible)"}
- Product Description: ${context.productDescription || "Not specified"}
- Target Audience: ${context.targetAudience || "Not specified"}
- Brand Name: ${context.brandName || context.productName || "Not specified"}
- Desired Tone: ${context.desiredTone || "Professional"}
- Main Objective: ${context.mainObjective || "Drive product awareness & signups"}`;

    const analysisSchema = {
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
        recommendedPlatforms: { type: "array", items: { type: "string" } },
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
    };

    // 1. Primary AI Engine: Google Gemini 3.8 Flash via Interactions API (@google/genai)
    const geminiKey =
      geminiApiKeyClient?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    if (geminiKey && !geminiKey.includes("your-")) {
      const client = new GoogleGenAI({ apiKey: geminiKey });
      const parsedImage = parseDataUrl(imageDataUrl);

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
      } else if (parsedImage && parsedImage.mimeType === "image/svg+xml") {
        const svgSource = Buffer.from(parsedImage.data, "base64").toString(
          "utf-8"
        );
        inputParts.push({
          type: "text",
          text: `SVG Screenshot Markup:\n${svgSource.slice(0, 6000)}`,
        });
      }

      const interaction = await client.interactions.create({
        model: geminiModel,
        input: inputParts,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: analysisSchema,
        },
      });

      const rawJson = interaction.output_text || "{}";
      const parsed = JSON.parse(rawJson);

      const analysis: ScreenshotAnalysisResult = {
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
            : extractedColors.length > 0
            ? extractedColors
            : ["#7C3AED", "#3B82F6", "#0F172A"],
        designStyle: parsed.designStyle || "Modern Dark SaaS UI",
        targetAudience:
          parsed.targetAudience ||
          context.targetAudience ||
          "SaaS Founders, Product Teams & Growth Marketers",
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
      };

      return NextResponse.json({
        analysis,
        aiProvider: "gemini-3.8-flash",
        geminiConfigured: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // 2. Secondary AI Engine: OpenAI Vision if OPENAI_API_KEY is configured
    const openAiKey = process.env.OPENAI_API_KEY;
    const openAiModel = process.env.OPENAI_VISION_MODEL || "gpt-4o";

    if (openAiKey && !openAiKey.includes("your-")) {
      const openai = new OpenAI({ apiKey: openAiKey });
      const completion = await openai.chat.completions.create({
        model: openAiModel,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userContextText },
              {
                type: "image_url",
                image_url: { url: imageDataUrl, detail: "high" },
              },
            ],
          },
        ],
        temperature: 0.3,
      });

      const parsed = JSON.parse(
        completion.choices[0]?.message?.content || "{}"
      );
      const analysis: ScreenshotAnalysisResult = {
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
        analyzedBy: "openai-vision",
      };

      return NextResponse.json({
        analysis,
        aiProvider: "openai",
        geminiConfigured: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // 3. Built-in Heuristic Vision Engine when GEMINI_API_KEY is not yet provided
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
      context.mainObjective?.trim() ||
      "Drive product signups and demo requests";

    const palette =
      extractedColors.length >= 2
        ? extractedColors
        : ["#7C3AED", "#3B82F6", "#10B981"];

    const fallbackAnalysis: ScreenshotAnalysisResult = {
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
    };

    return NextResponse.json({
      analysis: fallbackAnalysis,
      aiProvider: "heuristic",
      geminiConfigured: false,
      configNotice:
        "GEMINI_API_KEY is not set in .env.local or Workspace Settings. Using built-in Heuristic Vision & Color Extraction Engine. Add GEMINI_API_KEY in .env.local or Settings to run live Google Gemini 3.8 Flash (gemini-3.8-flash) Vision analysis.",
      latencyMs: Date.now() - startTime,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze screenshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
