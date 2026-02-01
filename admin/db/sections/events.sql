-- Events Module Schema

-- 1. Events Table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    location_name TEXT,
    image_url TEXT,
    type TEXT, -- 'party', 'opening', 'sports', 'culture'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Security Policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active events" 
ON public.events FOR SELECT 
USING (is_active = TRUE AND end_time > NOW());

CREATE POLICY "Admins can manage events" 
ON public.events FOR ALL 
USING (auth.role() = 'authenticated');
