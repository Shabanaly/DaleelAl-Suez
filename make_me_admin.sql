-- REPLACE 'YOUR_EMAIL_HERE' WITH YOUR ACTUAL LOGIN EMAIL
-- This grants admin capability to your user.

UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'sa676185@gmailcom'
);

-- Verify the change
SELECT * FROM public.profiles WHERE role = 'admin';
