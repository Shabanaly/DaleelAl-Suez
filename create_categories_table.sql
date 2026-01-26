-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, -- e.g. 'restaurants'
    name_ar TEXT NOT NULL,
    name_en TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);


-- Create SubCategories Table
CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY, -- e.g. 'burger'
    main_cat_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read SubCategories" ON subcategories FOR SELECT USING (true);


-- Populate Categories (Based on previous static list)
INSERT INTO categories (id, name_ar, icon) VALUES
('restaurants', 'مطاعم', 'utensils'),
('cafes', 'كافيهات', 'coffee'),
('shops', 'محلات وتسوق', 'shopping-bag'),
('doctors', 'أطباء وعيادات', 'stethoscope'),
('pharmacies', 'صيدليات', 'pill'),
('services', 'خدمات وصنايعية', 'wrench'),
('education', 'تعليم وكورسات', 'graduation-cap'),
('emergency', 'طوارئ', 'alert-circle'),
('events', 'مناسبات وأفراح', 'cake'),
('government', 'خدمات حكومية', 'landmark'),
('home-living', 'منزل ومعيشة', 'home'),
('jobs', 'وظائف وأعمال', 'briefcase'),
('tourism', 'سياحة وسفر', 'palmtree'),
('cars', 'خدمات السيارات', 'car'),
('entertainment', 'ترفيه وخروجات', 'clapperboard')
ON CONFLICT (id) DO NOTHING;

-- Populate SubCategories (Sample)
INSERT INTO subcategories (id, main_cat_id, name_ar) VALUES
('grill', 'restaurants', 'مشويات'),
('seafood', 'restaurants', 'مأكولات بحرية'),
('pizza', 'restaurants', 'بيتزا وفطائر'),
('burger', 'restaurants', 'برجر'),
('fried_chicken', 'restaurants', 'فرايد تشيكن'),
('youth', 'cafes', 'شبابي'),
('family', 'cafes', 'عائلي');
-- (User can add more later via dashboard or imports)
