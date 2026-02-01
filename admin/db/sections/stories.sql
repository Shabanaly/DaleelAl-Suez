-- Stories Module Schema

-- 1. Stories Table
CREATE TABLE public.stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    caption TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 2. Security Policies
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active stories" 
ON public.stories FOR SELECT 
USING (expires_at > NOW());

CREATE POLICY "Admins can insert stories" 
ON public.stories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
