-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ads_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slot_id text NOT NULL UNIQUE,
  slot_label text NOT NULL,
  ad_code text,
  is_active boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ads_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id text NOT NULL,
  name_ar text NOT NULL,
  name_en text,
  icon text DEFAULT 'folder'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.places (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  main_cat_id text,
  sub_cat_id text,
  address text,
  desc_ar text,
  desc_en text,
  image_url text,
  images ARRAY DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  map_url text,
  phone text,
  whatsapp text,
  working_hours text,
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_urgent boolean DEFAULT false,
  has_offer boolean DEFAULT false,
  offer_text_ar text,
  offer_text_en text,
  rating numeric DEFAULT '0'::numeric CHECK (rating >= 0::numeric AND rating <= 5::numeric),
  reviews_count integer DEFAULT 0,
  CONSTRAINT places_pkey PRIMARY KEY (id),
  CONSTRAINT places_main_cat_id_fkey FOREIGN KEY (main_cat_id) REFERENCES public.categories(id),
  CONSTRAINT places_sub_cat_id_fkey FOREIGN KEY (sub_cat_id) REFERENCES public.subcategories(id)
);
CREATE TABLE public.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  place_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT reviews_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id)
);
CREATE TABLE public.subcategories (
  id text NOT NULL,
  main_cat_id text,
  name_ar text NOT NULL,
  name_en text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subcategories_pkey PRIMARY KEY (id),
  CONSTRAINT subcategories_main_cat_id_fkey FOREIGN KEY (main_cat_id) REFERENCES public.categories(id)
);
CREATE TABLE public.user_favorites (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  place_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_favorites_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id)
);