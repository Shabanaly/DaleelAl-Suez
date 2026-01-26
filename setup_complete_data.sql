-- ==========================================
-- Step 1: Insert Main Categories First
-- ==========================================

INSERT INTO categories (id, name_ar, name_en, icon) VALUES
('restaurants', 'مطاعم', 'Restaurants', 'utensils'),
('cafes', 'كافيهات', 'Cafes', 'coffee'),
('doctors', 'أطباء', 'Doctors', 'stethoscope'),
('pharmacies', 'صيدليات', 'Pharmacies', 'pill'),
('shops', 'محلات', 'Shops', 'shopping-bag'),
('services', 'خدمات', 'Services', 'briefcase'),
('tourism', 'سياحة', 'Tourism', 'camera'),
('education', 'تعليم', 'Education', 'book'),
('entertainment', 'ترفيه', 'Entertainment', 'film'),
('emergency', 'طوارئ', 'Emergency', 'alert-triangle'),
('government', 'حكومي', 'Government', 'landmark'),
('cars', 'سيارات', 'Cars', 'car'),
('home-living', 'منزل ومعيشة', 'Home & Living', 'home'),
('events', 'فعاليات', 'Events', 'calendar'),
('jobs', 'وظائف', 'Jobs', 'briefcase'),
('selection', 'مختارات', 'Selection', 'star')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, icon = EXCLUDED.icon;

-- ==========================================
-- Step 2: Insert Subcategories for Restaurants
-- ==========================================

INSERT INTO subcategories (id, main_cat_id, name_ar, name_en) VALUES
('restaurants-popular', 'restaurants', 'أكل شعبي', 'Popular Food'),
('restaurants-homemade', 'restaurants', 'أكل بيتي', 'Homemade'),
('restaurants-grill', 'restaurants', 'مشويات', 'Grill'),
('restaurants-seafood', 'restaurants', 'أسماك', 'Seafood'),
('restaurants-traditional', 'restaurants', 'فول وطعمية', 'Traditional'),
('restaurants-pizza', 'restaurants', 'بيتزا', 'Pizza'),
('restaurants-burger', 'restaurants', 'برجر', 'Burger'),
('restaurants-fried-chicken', 'restaurants', 'فرايد تشيكن', 'Fried Chicken'),
('restaurants-shawarma', 'restaurants', 'شاورما', 'Shawarma'),
('restaurants-international', 'restaurants', 'عالمي', 'International'),
('restaurants-family', 'restaurants', 'عائلي', 'Family'),
('restaurants-budget', 'restaurants', 'اقتصادي', 'Budget'),
('restaurants-luxury', 'restaurants', 'فاخر', 'Luxury'),
('restaurants-delivery-only', 'restaurants', 'توصيل فقط', 'Delivery Only'),
('restaurants-open-24h', 'restaurants', '24 ساعة', 'Open 24h')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;

-- ==========================================
-- Step 3: Now You Can Insert Places
-- ==========================================

-- Example place (run this AFTER steps 1 and 2)
INSERT INTO places (
    name_ar, 
    name_en, 
    desc_ar, 
    desc_en,
    address,
    map_url,
    main_cat_id,
    sub_cat_id,
    images,
    featured_image,
    is_featured
) VALUES (
    'مطعم البحر الأحمر',
    'Red Sea Restaurant',
    'مطعم متخصص في المأكولات البحرية الطازجة مع إطلالة رائعة على البحر',
    'Specialized seafood restaurant with amazing sea view',
    'كورنيش السويس، بجوار فندق النيل',
    'https://maps.google.com/?q=29.9668,32.5498',
    'restaurants',
    'restaurants-seafood',
    ARRAY[
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    ],
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    true
);

-- ==========================================
-- IMPORTANT: Run in Order
-- ==========================================
/*
1. Run Step 1 first (categories)
2. Run Step 2 second (subcategories) 
3. Run Step 3 last (places)

This ensures foreign key constraints are satisfied.
*/
