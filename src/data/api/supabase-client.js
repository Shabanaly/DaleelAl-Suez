/**
 * Supabase Client Initialization (User-facing)
 * Pattern: Global object attached to window.
 */
(function() {
    let supabaseClient = null;

    window.getSupabaseClient = function() {
        if (supabaseClient) return supabaseClient;

        // Check if SDK is loaded
        if (typeof supabase === 'undefined') {
            return null;
        }

        // Get config values from window (populated by config.js)
        const url = (window.GUIDE_CONFIG && window.GUIDE_CONFIG.URL) || 
                    (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url);
        const key = (window.GUIDE_CONFIG && window.GUIDE_CONFIG.ANON_KEY) || 
                    (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.anonKey);

        if (!url || !key) {
            return null;
        }

        // Create the Supabase client
        supabaseClient = supabase.createClient(url, key);
        
        // Maintain global access for legacy code
        window.sb = supabaseClient;
        
        console.log('Supabase client initialized via src/data/api/supabase-client.js');
        return supabaseClient;
    };

    // Auto-init
    if (typeof supabase !== 'undefined') {
        window.getSupabaseClient();
    }
})();
