/**
 * Auth Repository
 * Handles direct interaction with Supabase Auth
 */
window.AuthRepository = {
    /**
     * Get current session
     */
    async getSession() {
        const sb = window.getSupabaseClient();
        if (!sb) throw new Error("Supabase not initialized");
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        return data;
    },

    /**
     * Get current user
     */
    async getUser() {
        const sb = window.getSupabaseClient();
        if (!sb) throw new Error("Supabase not initialized");
        const { data: { user }, error } = await sb.auth.getUser();
        if (error) throw error;
        return user;
    },

    /**
     * Sign in with OAuth
     */
    async signInWithOAuth(provider, redirectUrl) {
        const sb = window.getSupabaseClient();
        if (!sb) throw new Error("Supabase not initialized");
        
        const { data, error } = await sb.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl
            }
        });
        
        if (error) throw error;
        return data;
    },

    /**
     * Sign out
     */
    async signOut() {
        const sb = window.getSupabaseClient();
        if (!sb) throw new Error("Supabase not initialized");
        const { error } = await sb.auth.signOut();
        if (error) throw error;
    }
};
