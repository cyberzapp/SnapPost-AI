# SnapPost AI — Screenshot-to-Social-Post Generator SaaS

SnapPost AI transforms ordinary product screenshots into studio-designed social media posts and platform-native copy.

## Core Capabilities

1. **Conversion-Focused Marketing Homepage (`/`)**:
   - Interactive Before-and-After Screenshot Transformation Showcase.
   - Live multi-variation preview, supported social platform specs, 5-step workflow, USD/INR pricing toggle, and FAQ.
2. **Authentication (`/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`)**:
   - Email/password registration & sign-in, Google OAuth support via Supabase Auth, password reset workflow, and protected dashboard routes.
3. **Screenshot Upload & AI Vision Analysis (`/dashboard/create` & `/api/ai/analyze`)**:
   - Drag-and-drop PNG, JPG, JPEG, and WebP upload with file-size & MIME validation and dominant color palette extraction.
   - Server-side OpenAI Vision (`gpt-4o`) integration + Heuristic Vision fallback when `OPENAI_API_KEY` is not configured.
   - Editable product summary, visible feature detection with confidence tags, marketing angles, and headline suggestions.
4. **Multi-Platform Design & AI Copy Generator (`/dashboard/create` & `/api/ai/captions`)**:
   - Supports 8 social platforms (`1080×1080`, `1080×1350`, `1080×1920`, `1200×1200`, `1200×627`, `1600×900`, `1200×630`, `1000×1500`).
   - 12 Content Styles (`Minimal SaaS`, `Premium Product Launch`, `Bold Typography`, `Modern Editorial`, `Developer Showcase`, etc.).
   - Generates 3–5 editable multi-layer design variations alongside 5 headlines, 3 opening hooks, 3 platform-specific captions, hashtags, and CTAs.
5. **Visual Design Editor (`/dashboard/editor`)**:
   - Interactive canvas with pointer & keyboard drag handles, zoom controls, platform resizing, undo/redo history stack, layer ordering, typography & frame inspector, and Brand Kit application.
6. **High-Resolution Export System (`src/lib/export-engine.ts`)**:
   - Exports individual variations in lossless **PNG**, **JPEG**, or **WebP** at native platform dimensions, or packages all variations into a **ZIP archive**.
7. **Brand Kits, Projects, Credit Ledger, Billing & Admin Console**:
   - Multi-Brand Kit management (`/dashboard/brand-kit`), Project repository (`/dashboard/projects`), Credit Ledger (`/dashboard/usage`), Stripe & Razorpay Checkout integration (`/dashboard/billing` & `/api/billing/checkout`), and Server-Verified Admin Console (`/dashboard/admin` & `/api/admin/metrics`).
   - Full PostgreSQL schema and Row Level Security policies in [`supabase/schema.sql`](./supabase/schema.sql).
# -SnapPost-AI
