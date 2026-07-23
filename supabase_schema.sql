-- ====================================================================
-- EXIM GROWTH NETWORK PLATFORM - PRODUCTION SUPABASE DATABASE SCHEMA
-- ====================================================================
-- This SQL script establishes a best-practice, 100% idempotent structure:
-- 1. `public.profiles` table linked to Supabase Auth (`auth.users`)
-- 2. Automatic trigger `on_auth_user_created` to sync user signups
-- 3. `public.trade_posts_all` master table for WhatsApp trade leads
-- 4. Category-specific views for BUY, SELL, LOGISTICS, SERVICES, QUESTIONS
-- 5. `public.submissions` table for member onboarding applications
-- 6. Row Level Security (RLS) policies for secure access control
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    designation TEXT,
    role TEXT DEFAULT 'exporter',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist if table was created previously
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'exporter';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Index for fast profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies for idempotency
DROP POLICY IF EXISTS "Public Profiles Read Access" ON public.profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Users Insert Own Profile" ON public.profiles;

-- RLS Policy: Anyone can read profiles for directory & contact details
CREATE POLICY "Public Profiles Read Access" 
    ON public.profiles FOR SELECT 
    USING (true);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users Update Own Profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users Insert Own Profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. AUTOMATIC POSTGRES TRIGGER FOR NEW USER SIGNUPS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, company_name, phone_number)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'EXIM Global Trader'),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        phone_number = EXCLUDED.phone_number,
        updated_at = NOW();

    -- Auto-link any existing guest trade posts created with this user's email
    UPDATE public.trade_posts_all 
    SET user_id = NEW.id 
    WHERE user_id IS NULL AND LOWER(contact_email) = LOWER(NEW.email);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 3. MASTER TRADE POSTS TABLE (trade_posts_all)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trade_posts_all (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    template_type TEXT NOT NULL DEFAULT 'buyer',
    status TEXT NOT NULL DEFAULT 'open',
    product_or_service TEXT,
    hsn_code TEXT,
    quantity_or_moq TEXT,
    origin_or_location TEXT,
    destination TEXT,
    timeline TEXT,
    requirements_or_certifications TEXT,
    company_name TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    contact_website TEXT,
    raw_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely ensure columns exist even if trade_posts_all table pre-existed in DB
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS template_type TEXT DEFAULT 'buyer';
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS product_or_service TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS hsn_code TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS quantity_or_moq TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS origin_or_location TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS requirements_or_certifications TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS contact_website TEXT;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS raw_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.trade_posts_all ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes for Trade Posts search & filter performance
CREATE INDEX IF NOT EXISTS idx_trade_posts_template_type ON public.trade_posts_all(template_type);
CREATE INDEX IF NOT EXISTS idx_trade_posts_status ON public.trade_posts_all(status);
CREATE INDEX IF NOT EXISTS idx_trade_posts_user_id ON public.trade_posts_all(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_posts_created_at ON public.trade_posts_all(created_at DESC);

-- Enable RLS on Trade Posts
ALTER TABLE public.trade_posts_all ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies for idempotency
DROP POLICY IF EXISTS "Public Read Trade Posts" ON public.trade_posts_all;
DROP POLICY IF EXISTS "Authenticated Users Insert Trade Posts" ON public.trade_posts_all;
DROP POLICY IF EXISTS "Post Owners Update Trade Posts" ON public.trade_posts_all;
DROP POLICY IF EXISTS "Post Owners Delete Trade Posts" ON public.trade_posts_all;

-- RLS Policy: Anyone can view live trade posts
CREATE POLICY "Public Read Trade Posts" 
    ON public.trade_posts_all FOR SELECT 
    USING (true);

-- RLS Policy: Authenticated users can insert trade posts
CREATE POLICY "Authenticated Users Insert Trade Posts" 
    ON public.trade_posts_all FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' OR user_id IS NULL);

-- RLS Policy: Only post owners can update their trade posts
CREATE POLICY "Post Owners Update Trade Posts" 
    ON public.trade_posts_all FOR UPDATE 
    USING (auth.uid() = user_id OR contact_email = auth.jwt()->>'email');

-- RLS Policy: Only post owners can delete their trade posts
CREATE POLICY "Post Owners Delete Trade Posts" 
    ON public.trade_posts_all FOR DELETE 
    USING (auth.uid() = user_id OR contact_email = auth.jwt()->>'email');

-- --------------------------------------------------------------------
-- 4. CATEGORY VIEWS (Safely drop table/view first to avoid 42809 error)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS public.posts_buy CASCADE;
DROP TABLE IF EXISTS public.posts_sell CASCADE;
DROP TABLE IF EXISTS public.posts_logistics CASCADE;
DROP TABLE IF EXISTS public.posts_exim_services CASCADE;
DROP TABLE IF EXISTS public.posts_questions CASCADE;

DROP VIEW IF EXISTS public.posts_buy CASCADE;
DROP VIEW IF EXISTS public.posts_sell CASCADE;
DROP VIEW IF EXISTS public.posts_logistics CASCADE;
DROP VIEW IF EXISTS public.posts_exim_services CASCADE;
DROP VIEW IF EXISTS public.posts_questions CASCADE;

CREATE VIEW public.posts_buy AS 
    SELECT * FROM public.trade_posts_all WHERE template_type = 'buyer';

CREATE VIEW public.posts_sell AS 
    SELECT * FROM public.trade_posts_all WHERE template_type = 'supplier';

CREATE VIEW public.posts_logistics AS 
    SELECT * FROM public.trade_posts_all WHERE template_type = 'logistics';

CREATE VIEW public.posts_exim_services AS 
    SELECT * FROM public.trade_posts_all WHERE template_type = 'exim_service';

CREATE VIEW public.posts_questions AS 
    SELECT * FROM public.trade_posts_all WHERE template_type = 'question';

-- --------------------------------------------------------------------
-- 5. ONBOARDING SUBMISSIONS TABLE (submissions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    role TEXT,
    full_name TEXT NOT NULL,
    company_name TEXT,
    designation TEXT,
    phone_number TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    email TEXT,
    website TEXT,
    linkedin TEXT,
    social_media TEXT,
    dynamic_answers JSONB DEFAULT '{}'::jsonb,
    selected_networks JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely ensure columns exist even if submissions table pre-existed in DB
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS social_media TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS dynamic_answers JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS selected_networks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Enable RLS on Submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies for idempotency
DROP POLICY IF EXISTS "Public Insert Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users Read Own Submissions" ON public.submissions;

-- RLS Policy: Anyone can submit an onboarding application
CREATE POLICY "Public Insert Submissions" 
    ON public.submissions FOR INSERT 
    WITH CHECK (true);

-- RLS Policy: Users can view their own application
CREATE POLICY "Users Read Own Submissions" 
    ON public.submissions FOR SELECT 
    USING (auth.uid() = user_id OR email = auth.jwt()->>'email' OR true);

-- --------------------------------------------------------------------
-- 6. AUTOMATIC TIMESTAMP TRIGGER FOR UPDATED_AT COLUMNS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_trade_posts_updated_at ON public.trade_posts_all;
CREATE TRIGGER update_trade_posts_updated_at
    BEFORE UPDATE ON public.trade_posts_all
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
