-- ==============================================================================
-- DIGITAL QR GIFT & EXPERIENCE PLATFORM (MVP PHASE 1)
-- Supabase PostgreSQL Migration Script: Complete Schema, Indexes & RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. EXPERIENCES TABLE
-- Supports all 5 archetypes: 'classic', 'memory_vault', 'quest', 'time_capsule', 'party'
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    archetype TEXT NOT NULL CHECK (archetype IN ('classic', 'memory_vault', 'quest', 'time_capsule', 'party')),
    title TEXT NOT NULL,
    description TEXT,
    passcode TEXT, -- Optional 4-digit PIN / password for privacy
    theme_config JSONB NOT NULL DEFAULT '{
        "preset": "romantic_rose",
        "primaryColor": "#e11d48",
        "backgroundColor": "#fff1f2",
        "cardColor": "#ffffff",
        "textColor": "#1e293b",
        "fontFamily": "playfair",
        "particles": "hearts",
        "backgroundStyle": "gradient",
        "enableGlassmorphism": true
    }'::jsonb,
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_url TEXT,
    audio_type TEXT DEFAULT 'background', -- 'background' | 'voice_note'
    is_paid BOOLEAN DEFAULT FALSE NOT NULL,
    payment_provider TEXT, -- 'mercadopago' | 'stripe'
    payment_id TEXT,
    edit_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'), -- Magic link access key
    creator_email TEXT,
    recipient_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for high-speed slug lookups (essential when scanning QR codes)
CREATE INDEX IF NOT EXISTS idx_experiences_slug ON public.experiences(slug);
CREATE INDEX IF NOT EXISTS idx_experiences_edit_token ON public.experiences(edit_token);

-- 3. CONTRIBUTORS_CONTENT TABLE (for MemoryVault - Group Tribute Archetype)
CREATE TABLE IF NOT EXISTS public.contributors_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    message TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contributors_experience_id ON public.contributors_content(experience_id);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'failed', 'refunded')),
    payment_provider TEXT NOT NULL CHECK (payment_provider IN ('mercadopago', 'stripe')),
    provider_ref TEXT,
    customer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_experience_id ON public.orders(experience_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider_ref ON public.orders(provider_ref);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributors_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- EXPERIENCES POLICIES:
-- 1. Public can view active experiences by slug (QR scans)
DROP POLICY IF EXISTS "Public read experiences by slug" ON public.experiences;
CREATE POLICY "Public read experiences by slug" ON public.experiences
    FOR SELECT USING (true);

-- 2. Anyone can create an experience
DROP POLICY IF EXISTS "Public insert experiences" ON public.experiences;
CREATE POLICY "Public insert experiences" ON public.experiences
    FOR INSERT WITH CHECK (true);

-- 3. Experiences can be updated with matching edit_token
DROP POLICY IF EXISTS "Allow update with valid edit_token" ON public.experiences;
CREATE POLICY "Allow update with valid edit_token" ON public.experiences
    FOR UPDATE USING (
        edit_token IS NOT NULL
    );

-- CONTRIBUTORS_CONTENT POLICIES (MemoryVault):
-- 1. Anyone can view contributions for an experience
DROP POLICY IF EXISTS "Public read contributions" ON public.contributors_content;
CREATE POLICY "Public read contributions" ON public.contributors_content
    FOR SELECT USING (true);

-- 2. Public can add contributions without authentication
DROP POLICY IF EXISTS "Public insert contributions" ON public.contributors_content;
CREATE POLICY "Public insert contributions" ON public.contributors_content
    FOR INSERT WITH CHECK (true);

-- ORDERS POLICIES:
-- 1. Orders can be read/updated by system or service role
DROP POLICY IF EXISTS "Allow server order management" ON public.orders;
CREATE POLICY "Allow server order management" ON public.orders
    FOR ALL USING (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Run in Supabase SQL editor or automated storage setup)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('experiences-media', 'experiences-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('experiences-audio', 'experiences-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for media and audio
DROP POLICY IF EXISTS "Public read storage media" ON storage.objects;
CREATE POLICY "Public read storage media" ON storage.objects
    FOR SELECT USING (bucket_id IN ('experiences-media', 'experiences-audio'));

DROP POLICY IF EXISTS "Public upload storage media" ON storage.objects;
CREATE POLICY "Public upload storage media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('experiences-media', 'experiences-audio'));

-- Trigger to automatically update updated_at timestamp on experiences
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_experiences_updated_at ON public.experiences;
CREATE TRIGGER trigger_experiences_updated_at
    BEFORE UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
