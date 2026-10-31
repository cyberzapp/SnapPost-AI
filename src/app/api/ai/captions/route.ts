import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import {
  PlatformCaptionsResult,
  ScreenshotAnalysisResult,
  SocialPlatformId,
  WritingTone,
} from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      analysis,
      platformId = "linkedin-post",
      tone = "Founder-style",
      productName = "Our Product",
      geminiApiKeyClient,
    }: {
      analysis: ScreenshotAnalysisResult;
      platformId: SocialPlatformId;
      tone: WritingTone;
      productName?: string;
      geminiApiKeyClient?: string;
    } = body;

    if (!analysis) {
      return NextResponse.json(
        { error: "Screenshot analysis data is required to generate captions." },
        { status: 400 }
      );
    }

    const platform =
      SOCIAL_PLATFORMS.find((p) => p.id === platformId) || SOCIAL_PLATFORMS[0];

    const prompt = `You are a world-class social media copywriter for SaaS and tech products powered by Google Gemini 3.8 Flash.
Generate platform-native social copy for:
- Platform: ${platform.name} (${platform.label})
- Writing Tone: ${tone}
- Product Name: ${productName}
- Product Summary: ${analysis.productSummary}
- Key Visible Features: ${analysis.visibleFeatures.map((f) => f.name).join(", ")}
- Target Audience: ${analysis.targetAudience}
- Marketing Angles: ${analysis.marketingAngles.join(" | ")}

Platform rules:
- LinkedIn: Structured thought-leadership, short scannable lines, strong founder/operator hook, value-driven insights, max 5 targeted hashtags.
- X / Twitter: High-signal, zero fluff, punchy hook, thread-starter feel, max 2-3 hashtags.
- Instagram: Visual storytelling, relatable builder/creator energy, clear CTA in bio/link, up to 10 relevant hashtags.
- Pinterest / Facebook: Benefit-led, discovery-optimized copy.`;

    const captionsSchema = {
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
        shortPromoDescriptions: { type: "array", items: { type: "string" } },
      },
      required: [
        "headlines",
        "openingHooks",
        "captions",
        "hashtags",
        "ctaSuggestions",
        "shortPromoDescriptions",
      ],
    };

    // 1. Primary Engine: Google Gemini 3.8 Flash via Interactions API (@google/genai)
    const geminiKey =
      geminiApiKeyClient?.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    if (geminiKey && !geminiKey.includes("your-")) {
      const client = new GoogleGenAI({ apiKey: geminiKey });
      const interaction = await client.interactions.create({
        model: geminiModel,
        input: prompt,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: captionsSchema,
        },
      });

      const parsed = JSON.parse(interaction.output_text || "{}");
      const captionsList = (parsed.captions || []).map(
        (c: { title?: string; body?: string }, i: number) => ({
          title: c.title || `Variation ${i + 1}`,
          body: c.body || "",
          characterCount: (c.body || "").length,
        })
      );

      const result: PlatformCaptionsResult = {
        platformId,
        tone,
        headlines: parsed.headlines?.slice(0, 5) || [],
        openingHooks: parsed.openingHooks?.slice(0, 3) || [],
        captions: captionsList,
        hashtags: parsed.hashtags || [],
        ctaSuggestions: parsed.ctaSuggestions || [],
        shortPromoDescriptions: parsed.shortPromoDescriptions || [],
      };

      return NextResponse.json({
        captions: result,
        aiProvider: "gemini-3.8-flash",
        geminiConfigured: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // 2. Secondary Engine: OpenAI if OPENAI_API_KEY is configured
    const openAiKey = process.env.OPENAI_API_KEY;
    const openAiModel = process.env.OPENAI_VISION_MODEL || "gpt-4o";

    if (openAiKey && !openAiKey.includes("your-")) {
      const openai = new OpenAI({ apiKey: openAiKey });
      const completion = await openai.chat.completions.create({
        model: openAiModel,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
        temperature: 0.65,
      });

      const parsed = JSON.parse(
        completion.choices[0]?.message?.content || "{}"
      );
      const captionsList = (parsed.captions || []).map(
        (c: { title?: string; body?: string }, i: number) => ({
          title: c.title || `Variation ${i + 1}`,
          body: c.body || "",
          characterCount: (c.body || "").length,
        })
      );

      const result: PlatformCaptionsResult = {
        platformId,
        tone,
        headlines: parsed.headlines?.slice(0, 5) || [],
        openingHooks: parsed.openingHooks?.slice(0, 3) || [],
        captions: captionsList,
        hashtags: parsed.hashtags || [],
        ctaSuggestions: parsed.ctaSuggestions || [],
        shortPromoDescriptions: parsed.shortPromoDescriptions || [],
      };

      return NextResponse.json({
        captions: result,
        aiProvider: "openai",
        geminiConfigured: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // 3. Platform-aware copy generator when GEMINI_API_KEY is not configured
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

    const caption2Body = isTwitter
      ? `Unpopular opinion: Your dashboard shouldn't require a certification to read.\n\nHere's a look at the new ${productName} interface 👇\n\n✓ ${feat1}\n✓ ${feat2}\n\nLive today — ${analysis.suggestedCta}`
      : `Before ${productName}: Jumping between 6 browser tabs just to answer a single status question.\n\nAfter ${productName}: ${analysis.mainPurpose}\n\nWhat changed?\n• ${feat1} right on the home canvas\n• ${feat2} with one click\n• Designed for ${analysis.targetAudience}\n\nTry the live workflow today — ${analysis.suggestedCta}`;

    const caption3Body = `Shipping day! 🚀\n\nWe just rolled out a major upgrade to ${productName}.\n\n${analysis.productSummary}\n\nHighlights in this release:\n→ ${feat1}\n→ ${feat2}\n→ ${analysis.uniqueSellingPoints[0] || "Faster performance across every view"}\n\nWe'd love your feedback. ${analysis.suggestedCta}`;

    const result: PlatformCaptionsResult = {
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

    return NextResponse.json({
      captions: result,
      aiProvider: "heuristic",
      geminiConfigured: false,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to generate captions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
