-- Home Features Schema (Trending Tags & Quick Services)

-- 1. Trending Tags Table
CREATE TABLE public.trending_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tag TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Quick Services Table
CREATE TABLE public.quick_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    icon_name TEXT NOT NULL, -- Lucide icon name or image URL
    action_url TEXT NOT NULL, -- tel:123 or link
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- 3. Security Policies
ALTER TABLE public.trending_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read trending" ON public.trending_tags FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON public.quick_services FOR SELECT USING (is_active = true);
