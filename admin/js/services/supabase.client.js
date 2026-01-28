/**
 * @file supabase.client.js
 * @description Centralized Supabase Client for Admin Panel.
 * Uses ES Modules only.
 */

// Global config validation will ensure we don't init multiple times or without config
if (!window.GUIDE_CONFIG) {
    console.error("❌ Critical: GUIDE_CONFIG is missing. Ensure config.js is loaded first.");
}

// Ensure supabase-js is loaded
if (typeof supabase === 'undefined') {
    console.error("❌ Critical: Supabase JS SDK not loaded.");
}

// Singleton pattern for Supabase client
const SupabaseClient = (() => {
    let clientInstance = null;

    const init = () => {
        if (!clientInstance) {
            try {
                if (window.sb) {
                    clientInstance = window.sb;
                    return clientInstance;
                }

                clientInstance = supabase.createClient(
                    window.GUIDE_CONFIG.URL,
                    window.GUIDE_CONFIG.ANON_KEY,
                    {
                        auth: {
                            persistSession: true, // Auto-save session to localStorage
                            storageKey: 'suez_guide_admin_auth', // Custom key to avoid conflicts
                            autoRefreshToken: true,
                            detectSessionInUrl: true
                        }
                    }
                );
                
                // Expose globally for legacy scripts compatibility
                window.sb = clientInstance;
                console.log("✅ Supabase Client Initialized");
            } catch (error) {
                console.error("❌ Failed to initialize Supabase client:", error);
                throw error;
            }
        }
        return clientInstance;
    };

    return {
        get: () => clientInstance || init()
    };
})();

// Export for ES Module usage (if allowed) or Global
window.SupabaseClient = SupabaseClient;
