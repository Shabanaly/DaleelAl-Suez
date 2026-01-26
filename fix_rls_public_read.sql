-- Enable RLS on tables (Best Practice)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Places: Public Read
DROP POLICY IF EXISTS "Public Read Places" ON places;
CREATE POLICY "Public Read Places" ON places FOR SELECT USING (true);

-- 2. Offers: Public Read
DROP POLICY IF EXISTS "Public Read Offers" ON offers;
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);

-- 3. Categories: Public Read
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);

-- 4. SubCategories: Public Read
DROP POLICY IF EXISTS "Public Read SubCategories" ON subcategories;
CREATE POLICY "Public Read SubCategories" ON subcategories FOR SELECT USING (true);

-- 5. Site Settings: Public Read
DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);

-- 6. Grant Usage (Just in case)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
