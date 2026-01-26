-- Migration: Add main_cat_id to places
-- Execute this in Supabase SQL Editor

ALTER TABLE places ADD COLUMN IF NOT EXISTS main_cat_id TEXT;

-- Update existing policies if needed (usually not needed if policy is "true")
