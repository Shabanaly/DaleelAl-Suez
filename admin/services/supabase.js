// Supabase Client Service
// Assumes config.js and supabase-js are loaded globally

const SupabaseService = {
    client: null,

    init: () => {
        if (SupabaseService.client || window.sb) {
            SupabaseService.client = SupabaseService.client || window.sb;
            return;
        }

        if (typeof supabase === 'undefined') {
            console.error('Supabase JS SDK not loaded.');
            return;
        }

        if (!window.GUIDE_CONFIG) {
            console.error('GUIDE_CONFIG not found. Ensure js/config.js is loaded.');
            return;
        }

        SupabaseService.client = supabase.createClient(
            window.GUIDE_CONFIG.URL, 
            window.GUIDE_CONFIG.ANON_KEY
        );
        window.sb = SupabaseService.client;
    },

    getClient: () => {
        if (!SupabaseService.client) SupabaseService.init();
        return SupabaseService.client;
    }
};

window.SupabaseService = SupabaseService;
