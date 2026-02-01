-- Places Updates (Incremental Changes)

-- 1. Hidden Gems Feature
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS is_hidden_gem BOOLEAN DEFAULT FALSE;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_places_hidden_gem ON public.places(is_hidden_gem) WHERE is_hidden_gem = TRUE;
