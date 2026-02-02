-- 1. Create the table for logging views
CREATE TABLE IF NOT EXISTS public.place_views (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  place_id uuid NULL,
  user_id uuid NULL,
  session_hash text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT place_views_pkey PRIMARY KEY (id),
  CONSTRAINT place_views_place_id_fkey FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE,
  CONSTRAINT place_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- 2. Create a unique index to prevent duplicate views from the same user/session per day
CREATE UNIQUE INDEX IF NOT EXISTS place_views_dedup_idx ON public.place_views USING btree (
  place_id,
  COALESCE((user_id)::text, session_hash),
  (((created_at AT TIME ZONE 'UTC'::text))::date)
);

-- 3. Function to update stats (e.g., increment views count on places table)
-- This assumes 'places' table has a 'views' column. If not, you might need to add it or relying on count(*) from this table.
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the legacy views counter on the places table if it exists
  UPDATE public.places
  SET views = COALESCE(views, 0) + 1
  WHERE id = NEW.place_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to call the function after a new view is logged
DROP TRIGGER IF EXISTS on_view_logged ON place_views;

CREATE TRIGGER on_view_logged
AFTER INSERT ON place_views
FOR EACH ROW
EXECUTE FUNCTION update_daily_stats();

-- 5. Grant permissions
GRANT SELECT, INSERT ON public.place_views TO authenticated;
GRANT SELECT, INSERT ON public.place_views TO anon;
