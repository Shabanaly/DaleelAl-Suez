
const { createClient } = require('@supabase/supabase-js');

const URL = "https://vzvozvlnnufakkgmzrxh.supabase.co";
const ANON_KEY = "sb_publishable_XC-WUiZW4nu0jtXAKz7dYQ_DdIzLnZi";

const supabase = createClient(URL, ANON_KEY);

async function check() {
    console.log("Checking subcategories for 'restaurants'...");
    
    // 2. subcategories
    const { data: subs, error: err2 } = await supabase.from('subcategories').select('*').eq('main_cat_id', 'restaurants');
    if (err2) console.error("SubCategories Error:", err2.message);
    else {
        console.log("SubCategories Found:", subs ? subs.length : 0);
        console.log("Sample:", subs);
    }
}

check();
