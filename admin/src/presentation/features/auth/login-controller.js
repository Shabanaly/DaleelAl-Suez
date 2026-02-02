/**
 * @file: admin/src/presentation/controllers/login.js
 * @layer: Presentation Layer
 * @responsibility: Login Page Logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('error-box');

    if (!form) return;

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
        if (window.lucide) window.lucide.createIcons();

        try {
            await window.AppAuthService.login(email, password);
            console.log("✅ Login success");
            window.location.replace('index.html');
        } catch (err) {
            console.error("Login Error:", err);
            errorBox.style.display = 'flex';
            errorBox.innerText = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
            
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
            if (window.lucide) window.lucide.createIcons();
        }
    });
});
