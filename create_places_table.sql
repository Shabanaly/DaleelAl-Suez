-- ==========================================
-- Places Table Schema
-- ==========================================

CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info (Bilingual)
    name_ar TEXT NOT NULL,
    name_en TEXT,
    
    -- Description (Bilingual)
    desc_ar TEXT,
    desc_en TEXT,
    
    -- Location
    address TEXT,
    map_url TEXT, -- Google Maps link or coordinates
    
    -- Categories
    main_cat_id TEXT REFERENCES categories(id),
    sub_cat_id TEXT REFERENCES subcategories(id),
    
    -- Images (Array of URLs)
    images TEXT[], -- Array: ['url1.jpg', 'url2.jpg', 'url3.jpg']
    featured_image TEXT, -- Main image to show in listings
    
    -- Metadata
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Places" ON places 
FOR SELECT USING (is_active = true);

-- Admin Write Access (You'll configure this in Supabase dashboard)
CREATE POLICY "Admin Write Places" ON places 
FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for Performance
CREATE INDEX idx_places_main_cat ON places(main_cat_id);
CREATE INDEX idx_places_sub_cat ON places(sub_cat_id);
CREATE INDEX idx_places_featured ON places(is_featured) WHERE is_featured = true;
CREATE INDEX idx_places_created ON places(created_at DESC);

-- ==========================================
-- Example: Insert Sample Place
-- ==========================================

INSERT INTO places (
    name_ar, 
    name_en, 
    desc_ar, 
    desc_en,
    address,
    map_url,
    main_cat_id,
    sub_cat_id,
    images,
    featured_image,
    is_featured
) VALUES (
    'مطعم البحر الأحمر',
    'Red Sea Restaurant',
    'مطعم متخصص في المأكولات البحرية الطازجة مع إطلالة رائعة على البحر',
    'Specialized seafood restaurant with amazing sea view',
    'كورنيش السويس، بجوار فندق النيل',
    'https://maps.google.com/?q=29.9668,32.5498',
    'restaurants',
    'restaurants-seafood',
    ARRAY[
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg'
    ],
    'https://example.com/image1.jpg',
    true
);

-- ==========================================
-- Helper: Update Timestamp Trigger
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_places_updated_at 
BEFORE UPDATE ON places
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Notes for Usage
-- ==========================================

/*
1. Images Array:
   - First image (images[1]) is the main/featured image
   - Remaining images shown in place details page
   - Use 'featured_image' for quick access to main image

2. Map URL:
   - Can be Google Maps link: https://maps.google.com/?q=LAT,LONG
   - Or coordinates: "29.9668,32.5498"
   - Or full address URL

3. Bilingual Fields:
   - name_ar/name_en: Required for display
   - desc_ar/desc_en: Optional descriptions
   - Frontend will choose based on user language preference

4. Categories:
   - main_cat_id: Required (e.g., 'restaurants')
   - sub_cat_id: Optional (e.g., 'restaurants-seafood')
*/
