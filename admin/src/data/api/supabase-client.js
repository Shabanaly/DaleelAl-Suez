/**
 * @file: src/data/api/supabase-client.js
 * @layer: Data Layer
 * @responsibility: Manage Supabase connection. Direct DB access.
 */

// This assumes global `supabase` and `GUIDE_CONFIG` are loaded via script tags in HTML.
// In a module system, these would be imports.

const SupabaseClient = (() => {
    let instance = null;

    const init = () => {
        if (!window.GUIDE_CONFIG) {
            throw new Error("Critical: GUIDE_CONFIG is missing. Ensure config.js is loaded.");
        }
        if (typeof supabase === 'undefined') {
            throw new Error("Critical: Supabase JS SDK not loaded.");
        }

        try {
            // Check for existing global instance (legacy compat)
            if (window.sb) return window.sb;

            const client = supabase.createClient(
                window.GUIDE_CONFIG.URL,
                window.GUIDE_CONFIG.ANON_KEY,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true
                    }
                }
            );
            
            // Expose globally for legacy
            window.sb = client;
            return client;
        } catch (error) {
            console.error("Supabase Init Failed:", error);
            throw error;
        }
    };

    return {
        get: () => instance || (instance = init())
    };
})();

// Provide global access for services
window.AppSupabase = SupabaseClient;
