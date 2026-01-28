/**
 * Supabase Client Initialization (User-facing)
 * Creates the global window.sb Supabase client instance
 * Must be loaded AFTER config.js and Supabase SDK
 */

(function initSupabaseClient() {
    // Check if SDK is loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase SDK not loaded');
        return;
    }

    // Check if config exists
    if (typeof SUPABASE_CONFIG === 'undefined' && typeof window.GUIDE_CONFIG === 'undefined') {
        console.error('Supabase config not found');
        return;
    }

    // Get config values
    const url = (window.GUIDE_CONFIG && window.GUIDE_CONFIG.URL) || 
                (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url);
    const key = (window.GUIDE_CONFIG && window.GUIDE_CONFIG.ANON_KEY) || 
                (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.anonKey);

    if (!url || !key) {
        console.error('Supabase URL or Key not configured');
        return;
    }

    // Create the Supabase client
    window.sb = supabase.createClient(url, key);
    
    console.log('Supabase client initialized for user pages');
})();
