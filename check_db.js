
const { createClient } = require('@supabase/supabase-js');

const URL = "https://vzvozvlnnufakkgmzrxh.supabase.co";
const ANON_KEY = "sb_publishable_XC-WUiZW4nu0jtXAKz7dYQ_DdIzLnZi";

const supabase = createClient(URL, ANON_KEY);

async function check() {
    console.log("Checking 'categories' table...");
    const { data, error } = await supabase.from('categories').select('*');
    
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Success! Found", data.length, "categories.");
        console.log(data.slice(0, 3)); // Show first 3
    }

    console.log("Checking 'subcategories' table (if separate)...");
     const { data: subData, error: subError } = await supabase.from('subcategories').select('*');
     if (subError) {
         console.log("Subcategories check failed/not found:", subError.message);
     } else {
         console.log("Found", subData.length, "subcategories.");
     }
}

check();
