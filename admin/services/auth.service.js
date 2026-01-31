// Updated AuthService wrapper for Supabase Auth
const AuthService = {
    // Legacy credentials property kept to prevent errors if referenced, but unused
    CREDENTIALS: { email: "", password: "" },

    getUserData: () => {
        // Try to get from Supabase session storage first if possible, 
        // but since getUser is async, we return a basic shape from localStorage if strictly needed sync.
        // However, best practice: return null and let AuthGuard handle session.
        // OR try to read the persisted session key manually.
        const key = 'suez_guide_admin_auth'; // Must match supabase.client.js storageKey
        try {
            const sessionStr = localStorage.getItem(key);
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                return session.user ? {
                    email: session.user.email,
                    name: session.user.email.split('@')[0], // derived
                    lastActivity: new Date().toISOString()
                } : null;
            }
        } catch(e) { console.error(e); }
        return null;
    },

    isAuthenticated: () => {
        return !!AuthService.getUserData();
    },

    logout: async () => {
        if (window.SupabaseClient) {
            const sb = window.SupabaseClient.get();
            await sb.auth.signOut();
        } else if (window.supabase) {
             // Fallback
             await supabase.auth.signOut();
        }
        
        const isPage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/html/');
        window.location.href = isPage ? '../../login.html' : 'login.html';
    },

    checkAuth: () => {
        // Now handled by auth.guard.js primarily.
        // This is kept empty or just a pass-through to avoid breaking legacy calls.
        // auth.guard.js runs automatically.
        console.log("🔒 Auth check delegated to AuthGuard.");
    },
    
    updateActivity: () => {}
};

window.AuthService = AuthService;
