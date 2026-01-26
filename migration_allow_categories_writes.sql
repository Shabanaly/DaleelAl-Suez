-- Migration: Allow Public Write Access to Categories and Subcategories
-- WARNING: This allows ANYONE with your Anon Key to edit categories.
-- Use this ONLY for development. For production, use Service Role Key in admin panel.

-- 1. Categories Table - Allow Write Access
DROP POLICY IF EXISTS "Public Write Categories" ON categories;
CREATE POLICY "Public Write Categories" ON categories
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Subcategories Table - Allow Write Access
DROP POLICY IF EXISTS "Public Write SubCategories" ON subcategories;
CREATE POLICY "Public Write SubCategories" ON subcategories
FOR ALL
USING (true)
WITH CHECK (true);
