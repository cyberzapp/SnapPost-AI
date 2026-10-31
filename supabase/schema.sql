-- ============================================================================
-- SNAPPOST AI — PRODUCTION SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  company_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  plan_tier TEXT NOT NULL DEFAULT 'FREE' CHECK (plan_tier IN ('FREE', 'PRO', 'BUSINESS')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  provider TEXT DEFAULT 'stripe' CHECK (provider IN ('stripe', 'razorpay', 'manual')),
  external_customer_id TEXT,
  external_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CREDIT BALANCES
CREATE TABLE IF NOT EXISTS public.credit_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 25 CHECK (balance >= 0),
  monthly_allowance INTEGER NOT NULL DEFAULT 25,
  total_consumed INTEGER NOT NULL DEFAULT 0,
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CREDIT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- negative for deduction, positive for allocation
  balance_after INTEGER NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('screenshot_analysis', 'copy_generation', 'design_generation', 'design_regeneration', 'monthly_allocation', 'plan_upgrade', 'admin_adjustment')),
  description TEXT NOT NULL,
  idempotency_key TEXT UNIQUE,
  project_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BRAND KITS
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#7C3AED',
  secondary_color TEXT NOT NULL DEFAULT '#1E293B',
  accent_color TEXT NOT NULL DEFAULT '#3B82F6',
  heading_font TEXT NOT NULL DEFAULT 'Inter',
  body_font TEXT NOT NULL DEFAULT 'Inter',
  brand_description TEXT DEFAULT '',
  default_cta TEXT DEFAULT 'Try It Free Today →',
  brand_voice TEXT NOT NULL DEFAULT 'Professional',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  product_name TEXT DEFAULT '',
  product_description TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  brand_name TEXT DEFAULT '',
  desired_tone TEXT DEFAULT 'Professional',
  main_objective TEXT DEFAULT 'Drive signups & product awareness',
  platformId TEXT NOT NULL DEFAULT 'instagram-post',
  content_style TEXT NOT NULL DEFAULT 'Minimal SaaS',
  analysis_json JSONB,
  captions_json JSONB,
  active_design_id UUID,
  brand_kit_id UUID REFERENCES public.brand_kits(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzed', 'generated', 'exported')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DESIGNS
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  variation_index INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  style_preset TEXT NOT NULL,
  canvas_document JSONB NOT NULL, -- Structured editable layers, background, frame settings
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DESIGN VERSIONS
CREATE TABLE IF NOT EXISTS public.design_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  canvas_document JSONB NOT NULL,
  change_summary TEXT DEFAULT 'Saved checkpoint',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. GENERATION HISTORY
CREATE TABLE IF NOT EXISTS public.generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  generation_type TEXT NOT NULL CHECK (generation_type IN ('analysis', 'copy', 'designs', 'regeneration')),
  platform_id TEXT,
  style_preset TEXT,
  credits_used INTEGER NOT NULL DEFAULT 1,
  provider_used TEXT NOT NULL DEFAULT 'openai',
  latency_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_platform ON public.projects(user_id, platformId);
CREATE INDEX IF NOT EXISTS idx_designs_project_id ON public.designs(project_id);
CREATE INDEX IF NOT EXISTS idx_design_versions_design_id ON public.design_versions(design_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_brand_kits_user_id ON public.brand_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON public.generation_history(user_id, created_at DESC);

-- ============================================================================
-- ATOMIC CREDIT DEDUCTION FUNCTION (PREVENTS RACE CONDITIONS & DUPLICATES)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_action_type TEXT,
  p_description TEXT,
  p_idempotency_key TEXT DEFAULT NULL,
  p_project_id UUID DEFAULT NULL
) RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_existing_tx UUID;
BEGIN
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_existing_tx FROM public.credit_transactions WHERE idempotency_key = p_idempotency_key;
    IF v_existing_tx IS NOT NULL THEN
      SELECT balance INTO v_current_balance FROM public.credit_balances WHERE user_id = p_user_id;
      RETURN QUERY SELECT true, v_current_balance, 'Duplicate request ignored via idempotency key'::TEXT;
      RETURN;
    END IF;
  END IF;

  SELECT balance INTO v_current_balance
  FROM public.credit_balances
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN QUERY SELECT false, 0, 'Credit balance record not found'::TEXT;
    RETURN;
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT false, v_current_balance, 'Insufficient AI credits'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  UPDATE public.credit_balances
  SET balance = v_new_balance,
      total_consumed = total_consumed + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions (
    user_id, amount, balance_after, action_type, description, idempotency_key, project_id
  ) VALUES (
    p_user_id, -p_amount, v_new_balance, p_action_type, p_description, p_idempotency_key, p_project_id
  );

  RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles: Users can view own role
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions: Users can view own subscription
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Credit Balances: Users can view own credits
CREATE POLICY "Users can view own credit balance" ON public.credit_balances FOR SELECT USING (auth.uid() = user_id);

-- Credit Transactions: Users can view own transactions
CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Brand Kits: Full CRUD for owner
CREATE POLICY "Users manage own brand kits" ON public.brand_kits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Projects: Full CRUD for owner
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Designs: Full CRUD for owner
CREATE POLICY "Users manage own designs" ON public.designs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Design Versions: Full CRUD for owner
CREATE POLICY "Users manage own design versions" ON public.design_versions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Generation History: Users can view own generation history
CREATE POLICY "Users view own generation history" ON public.generation_history FOR SELECT USING (auth.uid() = user_id);
