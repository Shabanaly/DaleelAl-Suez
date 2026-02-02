/**
 * @file: admin/src/business/services/auth-service.js
 * @layer: Business Logic Layer
 * @responsibility: Authentication Logic.
 */

const AppAuthService = {
    
    async login(email, password) {
        const client = window.AppSupabase.get();
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        return data.user;
    },

    async logout() {
        const client = window.AppSupabase.get();
        const { error } = await client.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    },

    getUserData() {
        // Synchronous check if possible, or async
        const client = window.AppSupabase.get();
        // Supabase client maintains session in local storage
        // We can get user from session
        // But getSession is async usually.
        // However, if we need synchronous access for UI init, we might rely on localStorage directly or just async init.
        // For now, let's expose async method or check session.
        return null; // Placeholder. Usually we need async session check.
    },

    async checkAuth() {
        const client = window.AppSupabase.get();
        const { data: { session } } = await client.auth.getSession();
        
        if (!session) {
            window.location.href = 'login.html';
            return null;
        }
        return session.user;
    },

    // Legacy support for synchronous user data (if stored manually)
    // We will stick to standard Supabase patterns.
};

window.AppAuthService = AppAuthService;
