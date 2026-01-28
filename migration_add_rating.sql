-- Add rating columns to places table

ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0;

-- Optional: Add check constraint to ensure rating is between 0 and 5
ALTER TABLE public.places 
DROP CONSTRAINT IF EXISTS places_rating_check;

ALTER TABLE public.places 
ADD CONSTRAINT places_rating_check CHECK (rating >= 0 AND rating <= 5);
