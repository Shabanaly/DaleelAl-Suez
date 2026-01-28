/**
 * Login Page Controller
 * Handles Social Login via Supabase
 */

document.addEventListener("DOMContentLoaded", async () => {
    // Icons are created by layout loader usually, but safety check
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    // Check if already logged in
    if (window.sb) {
        const { data } = await window.sb.auth.getSession();
        if (data.session) {
            window.location.replace('profile.html');
        }
    }
});

export async function handleSocialLogin(provider) {
    if (!window.sb) {
        console.error("Supabase not initialized");
        alert("System error: Supabase not initialized");
        return;
    }
    
    // UI Feedback
    const btn = document.querySelector(`.btn-${provider}`);
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i>`;
    if (typeof lucide !== "undefined") lucide.createIcons();
    btn.disabled = true;
    
    try {
        // Determine redirect URL dynamically based on current environment
        // This ensures it works on localhost:8080, 192.168.x.x, or production
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        
        // If we are in /pages/login.html, we want to go back to root index or current path
        // For simplicity, let's redirect to the root index page
        // We need to handle if we are in a subdirectory
        
        let redirectUrl = origin;
        if (pathname.includes('/suez_guide/')) {
            // Github Pages or subfolder deployment support
            redirectUrl += '/suez_guide/';
        }
        redirectUrl += '/index.html';
        
        // Clean double slashes just in case
        redirectUrl = redirectUrl.replace(/([^:]\/)\/+/g, "$1");

        const { data, error } = await window.sb.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl
            }
        });
        
        if (error) throw error;
        
        // Supabase will handle the redirect
        
    } catch (err) {
        console.error("Login Error:", err);
        alert("Login failed: " + (err.message || "Unknown error"));
        
        // Reset UI
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (typeof lucide !== "undefined") lucide.createIcons();
    }
}

// Expose globally for onclick
window.handleSocialLogin = handleSocialLogin;
