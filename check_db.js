
const { createClient } = require('@supabase/supabase-js');

const URL = "https://vzvozvlnnufakkgmzrxh.supabase.co";
const ANON_KEY = "sb_publishable_XC-WUiZW4nu0jtXAKz7dYQ_DdIzLnZi";

const supabase = createClient(URL, ANON_KEY);

async function check() {
    console.log("Checking ads_settings...");
    
    const { data: ads, error } = await supabase.from('ads_settings').select('*');
    if (error) console.error("Ads Settings Error:", error.message);
    else {
        console.log("Ads Slots Found:", ads ? ads.length : 0);
        console.log("Sample:", ads);
    }
}

check();
