-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: ads_settings
CREATE TABLE IF NOT EXISTS public.ads_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slot_id text NOT NULL UNIQUE,
  slot_label text NOT NULL,
  ad_code text,
  is_active boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ads_settings_pkey PRIMARY KEY (id)
);

-- 2. Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id text NOT NULL,
  name_ar text NOT NULL,
  name_en text,
  icon text DEFAULT 'folder'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 3. Table: places (Core table, referenced by many)
CREATE TABLE IF NOT EXISTS public.places (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  desc_ar text,
  desc_en text,
  address text,
  image_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  address_ar text,
  address_en text,
  phone text,
  whatsapp text,
  working_hours text,
  is_trending boolean DEFAULT false,
  is_urgent boolean DEFAULT false,
  has_offer boolean DEFAULT false,
  offer_text_ar text,
  offer_text_en text,
  is_hidden_gem boolean DEFAULT false,
  images jsonb DEFAULT '[]'::jsonb,
  main_cat_id text,
  views integer DEFAULT 0,
  CONSTRAINT places_pkey PRIMARY KEY (id)
);

-- 4. Table: analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  place_id uuid,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT analytics_events_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id)
);

-- 5. Table: events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(), -- Changed to default gen_random_uuid for safety
  title text NOT NULL,
  description text,
  start_time timestamp without time zone NOT NULL,
  end_time timestamp without time zone,
  location_name text,
  image_url text,
  type text,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

-- 6. Table: offers
CREATE TABLE IF NOT EXISTS public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  desc_ar text,
  desc_en text,
  bg_color text DEFAULT 'var(--primary)'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id)
);

-- 7. Table: place_stats_daily
CREATE TABLE IF NOT EXISTS public.place_stats_daily (
  place_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  contact_clicks integer DEFAULT 0,
  CONSTRAINT place_stats_daily_pkey PRIMARY KEY (place_id, date),
  CONSTRAINT place_stats_daily_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id)
);

-- 8. Table: place_views
CREATE TABLE IF NOT EXISTS public.place_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  place_id uuid,
  user_id uuid,
  session_hash text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT place_views_pkey PRIMARY KEY (id),
  CONSTRAINT place_views_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id),
  CONSTRAINT place_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- 9. Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'super_admin'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- 10. Table: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  place_id uuid,
  user_id uuid,
  rating numeric DEFAULT 0,
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- 11. Table: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);

-- 12. Table: stories
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  place_id uuid,
  media_url text NOT NULL,
  caption text,
  created_at timestamp without time zone DEFAULT now(),
  expires_at timestamp without time zone DEFAULT (now() + '24:00:00'::interval),
  is_active boolean DEFAULT true,
  media_type text DEFAULT 'image'::text,
  link_url text,
  views integer DEFAULT 0,
  CONSTRAINT stories_pkey PRIMARY KEY (id),
  CONSTRAINT stories_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id)
);

-- 13. Table: user_favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  place_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);


-- =========================================================
-- SECURITY & ADMIN ACCESS (RLS)
-- =========================================================

-- 1. Helper Function to check if user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Admin Full Access (Apply to all tables)
-- We use a DO block to generate policies to avoid repetition/errors
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'places', 'stories', 'events', 'ads_settings', 'categories', 
        'offers', 'reviews', 'place_views', 'place_stats_daily', 
        'profiles', 'site_settings'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Drop existing admin policy if exists to avoid conflict
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS "Admins Full Access" ON public.%I', t);
        EXCEPTION WHEN OTHERS THEN NULL; END;

        -- Create Admin Policy
        EXECUTE format('
            CREATE POLICY "Admins Full Access" ON public.%I
            FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin())
        ', t);
        
        -- Create Public Read Policy (Basic) - Allow reading active items
        -- Note: This is a generic fallback. Adjust per table if needed.
        IF t IN ('places', 'stories', 'events', 'offers', 'categories') THEN
            BEGIN
                EXECUTE format('DROP POLICY IF EXISTS "Public Read Active" ON public.%I', t);
            EXCEPTION WHEN OTHERS THEN NULL; END;
            
            -- Only active items for public (generic logic)
            -- Assuming 'is_active' column exists (it does for most). 
            -- If not, this might need specific handling, but strictly speaking 'places', 'stories' etc have it.
             EXECUTE format('
                CREATE POLICY "Public Read Active" ON public.%I
                FOR SELECT
                TO anon, authenticated
                USING (true) 
            ', t); -- Currently allowing ALL read for simplicity, filters handle visibility usually.
        END IF;

    END LOOP;
END$$;

-- Fixes: Ensure 'views' column exists in places (idempotent)
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Fixes: Ensure index for place_views
CREATE UNIQUE INDEX IF NOT EXISTS place_views_dedup_idx ON public.place_views USING btree (
  place_id,
  COALESCE((user_id)::text, session_hash),
  (((created_at AT TIME ZONE 'UTC'::text))::date)
);

-- Fixes: Trigger for views
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
