
const { createClient } = require('@supabase/supabase-js');

const URL = "https://vzvozvlnnufakkgmzrxh.supabase.co";
const ANON_KEY = "sb_publishable_XC-WUiZW4nu0jtXAKz7dYQ_DdIzLnZi";

const supabase = createClient(URL, ANON_KEY);

async function check() {
    console.log("Checking 'categories' table with ANON KEY...");
    
    // 1. categories
    const { data: cats, error: err1 } = await supabase.from('categories').select('*');
    if (err1) console.error("Categories Error:", err1.message);
    else console.log("Categories Found:", cats ? cats.length : 0);

    // 2. subcategories
    const { data: subs, error: err2 } = await supabase.from('subcategories').select('*').limit(5);
    if (err2) console.error("SubCategories Error:", err2.message);
    else console.log("SubCategories Found:", subs ? subs.length : 0);
}

check();
