-- DANGER: This allows ANYONE with your Anon Key to edit your data.
-- Use this ONLY for development.

-- 1. Places Table
DROP POLICY IF EXISTS "Public Write Access" ON places;
CREATE POLICY "Public Write Access" ON places
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Offers Table
DROP POLICY IF EXISTS "Public Write Access" ON offers;
CREATE POLICY "Public Write Access" ON offers
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. Site Settings Table
DROP POLICY IF EXISTS "Public Write Access" ON site_settings;
CREATE POLICY "Public Write Access" ON site_settings
FOR ALL
USING (true)
WITH CHECK (true);
