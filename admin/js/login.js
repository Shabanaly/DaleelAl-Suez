/**
 * login.js
 * Handles login form submission using Supabase Auth
 */

(function initLogin() {
    lucide.createIcons();
    
    // Ensure Supabase is ready or wait for it? 
    // We assume the HTML will be updated to include supabase.client.js
    
    // UI Elements
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('error-box');

    if (!form || !emailInput || !passwordInput || !loginBtn) {
        console.error("Login elements not found!");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) return;

        // Reset UI
        errorBox.style.display = 'none';
        loginBtn.disabled = true;
        const originalBtnText = loginBtn.innerHTML;
        loginBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> جاري التسجيل...`;
        lucide.createIcons();

        try {
            // Check if SupabaseClient is available
            let sb;
            if (window.SupabaseClient) {
                sb = window.SupabaseClient.get();
            } else if (window.supabase && window.GUIDE_CONFIG) {
                // Fallback direct init
                sb = window.supabase.createClient(window.GUIDE_CONFIG.URL, window.GUIDE_CONFIG.ANON_KEY);
            } else {
                throw new Error("نظام الاتصال غير متوفر (Supabase Client Missing)");
            }

            const { data, error } = await sb.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            console.log("✅ Login success:", data.user);
            
            // Redirect to dashboard
            window.location.replace('index.html');

        } catch (err) {
            console.error("Login Error:", err);
            errorBox.style.display = 'flex';
            errorBox.innerText = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
            
            // Restore Button
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
            lucide.createIcons();
        }
    });

    // Check if simple logout param is present to show message?
    // Not critical for now.
})();
