export type SocialPlatformId =
  | "instagram-post"
  | "instagram-portrait"
  | "instagram-story"
  | "linkedin-post"
  | "linkedin-landscape"
  | "twitter-post"
  | "facebook-post"
  | "pinterest-pin";

export interface SocialPlatformSpec {
  id: SocialPlatformId;
  name: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  iconName: string;
  maxHashtags: number;
}

export type ContentStyleId =
  | "Minimal SaaS"
  | "Premium Product Launch"
  | "Bold Typography"
  | "Modern Editorial"
  | "Developer Showcase"
  | "Startup Announcement"
  | "Feature Highlight"
  | "Product Update"
  | "Before & After"
  | "App Showcase"
  | "Promotional Campaign"
  | "Clean Corporate";

export type WritingTone =
  | "Professional"
  | "Friendly"
  | "Founder-style"
  | "Technical"
  | "Promotional"
  | "Storytelling"
  | "Casual";

export type BackgroundStyleType =
  | "solid-obsidian"
  | "radial-violet"
  | "mesh-cyber"
  | "editorial-slate"
  | "emerald-aurora"
  | "sunset-blaze"
  | "clean-light"
  | "custom-brand";

export interface ScreenshotContextInput {
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  brandName?: string;
  desiredTone?: WritingTone;
  mainObjective?: string;
}

export interface DetectedFeature {
  name: string;
  description: string;
  confidence: "high" | "medium" | "uncertain";
}

export interface ScreenshotAnalysisResult {
  screenshotRepresents: string;
  category: string;
  mainPurpose: string;
  productSummary: string;
  visibleFeatures: DetectedFeature[];
  uiElements: string[];
  brandColors: string[];
  designStyle: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  marketingAngles: string[];
  recommendedPlatforms: SocialPlatformId[];
  suggestedHeadline: string;
  suggestedSubheadline: string;
  suggestedCta: string;
  analyzedBy: "gemini-vision" | "openai-vision" | "heuristic-vision-engine";
}

export interface PlatformCaptionsResult {
  platformId: SocialPlatformId;
  tone: WritingTone;
  headlines: string[]; // 5 options
  openingHooks: string[]; // 3 options
  captions: {
    title: string;
    body: string;
    characterCount: number;
  }[]; // 3 variations
  hashtags: string[];
  ctaSuggestions: string[];
  shortPromoDescriptions: string[];
}

export type CanvasElementType = "text" | "screenshot" | "shape" | "badge" | "logo";

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  name: string;
  x: number; // percentage 0-100 of canvas width
  y: number; // percentage 0-100 of canvas height
  width: number; // percentage 5-100 of canvas width
  height?: number; // percentage of canvas height (optional for auto-height text)
  zIndex: number;
  opacity: number; // 0 to 1
  rotation?: number;
  // Text properties
  text?: string;
  fontFamily?: string;
  fontSize?: number; // base px at 1080w
  fontWeight?: "400" | "500" | "600" | "700" | "800";
  color?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number; // em
  lineHeight?: number; // unitless
  // Box / Shape / Badge / Screenshot properties
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "glow";
  // Image / Screenshot specific
  imageUrl?: string;
  browserFrame?: "macos-dark" | "macos-light" | "minimal-glass" | "phone-frame" | "none";
  scale?: number;
}

export interface CanvasDocument {
  backgroundType: BackgroundStyleType;
  backgroundColor: string;
  backgroundGradient: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  accentColor: string;
  showGridPattern: boolean;
  showAmbientGlow: boolean;
  showWatermark: boolean;
  elements: CanvasElement[];
}

export interface DesignVariation {
  id: string;
  projectId: string;
  variationIndex: number;
  name: string;
  layoutArchetype: string;
  platformId: SocialPlatformId;
  width: number;
  height: number;
  stylePreset: ContentStyleId;
  document: CanvasDocument;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKit {
  id: string;
  userId: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  brandDescription: string;
  defaultCta: string;
  brandVoice: WritingTone;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  userId: string;
  name: string;
  screenshotUrl: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  brandName: string;
  desiredTone: WritingTone;
  mainObjective: string;
  platformId: SocialPlatformId;
  contentStyle: ContentStyleId;
  analysis: ScreenshotAnalysisResult | null;
  captions: PlatformCaptionsResult | null;
  variations: DesignVariation[];
  activeVariationId?: string;
  brandKitId?: string;
  status: "draft" | "analyzed" | "generated" | "exported";
  createdAt: string;
  updatedAt: string;
}

export type CreditActionType =
  | "screenshot_analysis"
  | "copy_generation"
  | "design_generation"
  | "design_regeneration"
  | "monthly_allocation"
  | "plan_upgrade"
  | "admin_adjustment";

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  actionType: CreditActionType;
  description: string;
  projectId?: string;
  createdAt: string;
}

export type PlanTier = "FREE" | "PRO" | "BUSINESS";

export interface UserAccountState {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: "user" | "admin";
  planTier: PlanTier;
  subscriptionStatus: "active" | "canceled" | "past_due" | "trialing";
  creditsBalance: number;
  monthlyAllowance: number;
  totalConsumed: number;
  createdAt: string;
}

export interface GenerationHistoryItem {
  id: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  generationType: "analysis" | "copy" | "designs" | "regeneration";
  platformId?: SocialPlatformId;
  stylePreset?: ContentStyleId;
  creditsUsed: number;
  providerUsed: string;
  latencyMs: number;
  status: "completed" | "failed";
  createdAt: string;
}
