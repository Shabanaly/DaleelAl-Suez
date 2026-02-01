-- MASTER DATABASE SCHEMA INDEX
-- 
-- This file serves as a map to the modular SQL files in the 'sections' directory.
-- To apply the full schema, run the files in the following order:

/* 
   -------------------------------------------------------
   1. CORE MODULES
   -------------------------------------------------------
*/

-- Events Module (Table + Policies)
-- Source: sections/events.sql

-- Stories Module (Table + Policies)
-- Source: sections/stories.sql

-- Home Features (Trending Tags, Quick Services)
-- Source: sections/home_features.sql

/* 
   -------------------------------------------------------
   2. UPDATES & MIGRATIONS
   -------------------------------------------------------
*/

-- Places Table Enhancements (Hidden Gems)
-- Source: sections/places_updates.sql

/* 
   -------------------------------------------------------
   3. SECURITY & POLICIES
   -------------------------------------------------------
*/

-- Categories RLS Policy Fixes
-- Source: sections/categories_policies.sql

-- Note: The original 'my_database.sql' content should be integrated into these modules 
-- or kept here if it contains the base schema (users, places, categories tables).
-- Assuming base schema exists, the above files add features on top.
