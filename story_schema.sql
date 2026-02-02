-- Add missing columns to the existing table
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Ensure RLS is enabled
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Clean up old policies
DROP POLICY IF EXISTS "Public can view active stories" ON public.stories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.stories;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.stories;
DROP POLICY IF EXISTS "Enable update for all users" ON public.stories;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.stories;

-- Re-create Policies covering all columns
CREATE POLICY "Public can view active stories" 
ON public.stories FOR SELECT 
USING (
    is_active = true 
    AND expires_at > now()
);

-- Admin/Dev Access
CREATE POLICY "Enable read access for all users" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.stories FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.stories FOR DELETE USING (true);
