-- Categories RLS Policies Fix

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 1. Allow Public Read Access (Everyone can see/read categories)
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories"
ON categories FOR SELECT
TO public
USING (true);

-- 2. Allow Authenticated Users (Admins) Full Access
DROP POLICY IF EXISTS "Admin Full Access Categories" ON categories;
CREATE POLICY "Admin Full Access Categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
