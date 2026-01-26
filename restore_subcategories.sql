-- Ensure 'restaurants' Main Category Exists
INSERT INTO categories (id, name_ar, name_en, icon)
VALUES ('restaurants', 'مطاعم', 'Restaurants', 'utensils')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;

-- Insert Subcategories for Restaurants
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
