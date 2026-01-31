-- Add is_hidden_gem column to places table
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS is_hidden_gem BOOLEAN DEFAULT FALSE;

-- Create policy for public read (already covered by generic places policy usually, but ensuring)
-- No extra policy needed if 'places' is already public readable.

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_places_hidden_gem ON public.places(is_hidden_gem) WHERE is_hidden_gem = TRUE;
