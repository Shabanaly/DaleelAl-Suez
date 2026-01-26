-- Suez Guide Database Schema
-- Execute this script in your Supabase SQL Editor

-- 1. Places Table (Main content)
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_cat_id TEXT NOT NULL, -- Logical ID like 'grill', 'pediatric', etc.
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    desc_ar TEXT,
    desc_en TEXT,
    address TEXT,
    image_url TEXT, -- Primary/Cover Image (Cloudinary URL)
    is_featured BOOLEAN DEFAULT FALSE, -- For "Explore Your City"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Place Gallery Images (Unlimited)
CREATE TABLE IF NOT EXISTS place_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Offers Table
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    desc_ar TEXT,
    desc_en TEXT,
    bg_color TEXT DEFAULT 'var(--primary)',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Settings (Global Controls)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Initialize default settings
INSERT INTO site_settings (key, value) 
VALUES ('latest_additions_count', '6')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (Security First)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public READ access (Anonymous users can see the guide)
CREATE POLICY "Public Read Access" ON places FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON place_images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);

-- Note: Authenticated Admin access for INSERT/UPDATE/DELETE 
-- will be handled via the dashboard using Supabase Auth.
