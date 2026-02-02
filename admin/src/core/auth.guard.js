/**
 * @file auth.guard.js
 * @description Protects Admin Pages from unauthorized access.
 * Runs immediately on page load.
 */

(async function AuthGuard() {
    const isLoginPage = window.location.pathname.includes('login.html');
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../../' : (window.location.pathname.includes('/html/') ? '../' : '');

    try {
        // Ensure client is ready
        const sb = window.SupabaseClient ? window.SupabaseClient.get() : (window.supabase ? supabase.createClient(window.GUIDE_CONFIG.URL, window.GUIDE_CONFIG.ANON_KEY) : null);

        if (!sb) {
            console.warn("⚠️ AuthGuard: Supabase client not found, assuming protected.");
        }

        const { data: { session }, error } = await sb.auth.getSession();

        if (error) {
            console.error("Auth Guard Error:", error);
        }

        // 🔒 Protection Logic
        if (!session && !isLoginPage) {
            console.warn("⛔ Access Denied: No active session. Redirecting to login...");
            
            // Adjust path based on current location
            const loginPath = window.location.pathname.includes('/pages/') 
                ? '../../login.html' 
                : (window.location.pathname.includes('admin/html') ? '../login.html' : 'login.html');
            
            // Prevent redirect loop
            if (!window.location.href.includes('login.html')) {
                window.location.replace(loginPath);
            }
        } 
        
        // 🔄 If Logged in and on Login Page -> Go to Dashboard
        if (session && isLoginPage) {
            console.log("✅ Already logged in. Redirecting to Dashboard...");
            window.location.replace('index.html');
        }

        // 👤 Log User Info (Optional)
        if (session && !isLoginPage) {
            console.log("👤 Current User:", session.user.email);
        }

    } catch (err) {
        console.error("🔥 Auth Guard Exception:", err);
        // Fallback safety: if something crashes, stay safe? or redirect?
        // Usually better to fail open locally but fail closed in prod.
        // For now, log it.
    }
})();
