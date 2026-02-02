/**
 * Profile Page Controller
 * Handles user session, data rendering, and logout
 */

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    initProfilePage();
    
    // Re-render on language change
    window.addEventListener('languageChanged', () => {
        if (currentUser) renderProfile(currentUser);
    });
});

async function initProfilePage() {
    const card = document.getElementById('profile-card');
    if (!card) return;

    // Check Service
    if (!window.AuthService) {
        console.error("AuthService not initialized");
        setTimeout(initProfilePage, 500); 
        return;
    }

    try {
        // Get User through Business Layer
        const user = await window.AuthService.getUser();

        if (!user) {
            // Not logged in -> Redirect to login
            window.location.href = 'login.html';
            return;
        }
        
        currentUser = user;

        // Render Profile
        renderProfile(user);

    } catch (err) {
        console.error("Profile Error:", err);
        card.innerHTML = `<p style="color:red">Error loading profile</p>`;
    }
}

function renderProfile(user) {
    const card = document.getElementById('profile-card');
    
    // Extract metadata
    const meta = user.user_metadata || {};
    const name = meta.full_name || meta.name || user.email.split('@')[0];
    const email = user.email;
    const avatar = meta.avatar_url || meta.picture || 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=' + encodeURIComponent(name);

    // Get Lang for static labels
    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    card.innerHTML = `
        <div class="avatar-container">
            <img src="${avatar}" alt="Avatar" class="profile-avatar">
        </div>
        
        <div class="profile-welcome">
            ${I18n.t('profile_welcome')}
        </div>
        
        <h2 class="profile-name">${name}</h2>
        <div class="profile-email">${email}</div>
        
        <div class="info-grid">
            <div class="info-row">
                <span class="info-label">${I18n.t('profile_provider')}</span>
                <span class="info-value">${user.app_metadata.provider || 'Email'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">${I18n.t('profile_last_login')}</span>
                <span class="info-value">${new Date(user.last_sign_in_at).toLocaleDateString()}</span>
            </div>
        </div>
        
        <button class="logout-btn" onclick="handleLogout()">
            <i data-lucide="log-out"></i>
            <span>${I18n.t('profile_logout')}</span>
        </button>
    `;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Global Logout Handler
window.handleLogout = async () => {
    const btn = document.querySelector('.logout-btn');
    if (btn) {
        btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    await window.AuthService.signOut();
    window.location.href = '../index.html'; // Go Home after logout
};
