-- 1. Ensure the column exists in 'places' table
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- 2. Sync the count: Calculate total views from 'place_views' and update 'places'
-- This fixes the counter if it was 0 or out of sync.
WITH view_counts AS (
    SELECT place_id, count(*) as total
    FROM public.place_views
    GROUP BY place_id
)
UPDATE public.places
SET views = view_counts.total
FROM view_counts
WHERE places.id = view_counts.place_id;

-- 3. Confirm Trigger setup (for future views)
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.places
  SET views = COALESCE(views, 0) + 1
  WHERE id = NEW.place_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_view_logged ON place_views;
CREATE TRIGGER on_view_logged
AFTER INSERT ON place_views
FOR EACH ROW
EXECUTE FUNCTION update_daily_stats();
