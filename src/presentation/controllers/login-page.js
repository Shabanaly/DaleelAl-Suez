/**
 * Login Page Controller
 * Handles Social Login via Supabase
 */

document.addEventListener("DOMContentLoaded", async () => {
    // Icons are created by layout loader usually, but safety check
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    // Check if already logged in
    // Check if already logged in (via Business Layer)
    try {
        if (window.AuthService) {
            const sessionData = await window.AuthService.getSession();
            if (sessionData && sessionData.session) {
                window.location.replace('profile.html');
            }
        }
    } catch (e) {
        console.warn("Login status check failed", e);
    }
});

async function handleSocialLogin(provider) {
    if (!window.AuthService) {
        alert("System error: AuthService not initialized");
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
        await window.AuthService.signInWithOAuth(provider);
        // Supabase will handle redirect
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
