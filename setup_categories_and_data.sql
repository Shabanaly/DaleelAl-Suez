-- 1. Create Main Categories Table (if not exists)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, -- Unique ID (e.g., 'smart_phones')
    name_ar TEXT NOT NULL, -- Arabic Name
    name_en TEXT, -- English Name
    icon TEXT DEFAULT 'folder', -- Lucide Icon Name
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Subcategories Table (if not exists)
CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY, -- Unique ID (e.g., 'iphone')
    main_cat_id TEXT REFERENCES categories(id) ON DELETE CASCADE, -- Link to Main Category
    name_ar TEXT NOT NULL, -- Arabic Name
    name_en TEXT, -- English Name
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Security (RLS) - Optional but recommended
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access (So users can see them)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read SubCategories" ON subcategories FOR SELECT USING (true);


-- ==========================================
-- Example: Inserting Data (Main + Sub)
-- ==========================================

-- A. Insert a Main Category (Electronics)
INSERT INTO categories (id, name_ar, name_en, icon)
VALUES 
    ('electronics', 'إلكترونيات', 'Electronics', 'cpu')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;

-- B. Insert Subcategories for Electronics
INSERT INTO subcategories (id, main_cat_id, name_ar, name_en)
VALUES 
    ('mobiles', 'electronics', 'موبايلات', 'Mobile Phones'),
    ('laptops', 'electronics', 'لابتوب وكمبيوتر', 'Laptops & PCs'),
    ('cameras', 'electronics', 'كاميرات', 'Cameras')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;


-- ==========================================
-- Example 2: Fashion
-- ==========================================
INSERT INTO categories (id, name_ar, name_en, icon)
VALUES 
    ('fashion', 'موضة وأزياء', 'Fashion', 'shirt')
ON CONFLICT (id) DO NOTHING;

INSERT INTO subcategories (id, main_cat_id, name_ar, name_en)
VALUES 
    ('men_fashion', 'fashion', 'ملابس رجالي', 'Men Clothing'),
    ('women_fashion', 'fashion', 'ملابس حريمي', 'Women Clothing')
ON CONFLICT (id) DO NOTHING;
