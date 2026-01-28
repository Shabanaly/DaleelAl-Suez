/**
 * Account Handler (Smart Router)
 * Routes to Profile (if logged in) or Login (if guest)
 */

export async function openAccountModal(e) {
    if (e) e.preventDefault();
    
    // Safety check
    if (!window.sb) {
        console.error("Supabase not initialized");
        window.location.href = 'pages/login.html'; // Fallback
        return;
    }
    
    try {
        // Check Session
        const { data } = await window.sb.auth.getSession();
        const isLoggedIn = !!data.session;
        
        // Determine path base
        const path = window.location.pathname;
        const isPagesDir = path.includes('/pages/');
        
        // Route
        const page = isLoggedIn ? 'profile.html' : 'login.html';
        const target = isPagesDir ? page : `pages/${page}`;
        
        window.location.href = target;
        
    } catch (err) {
        console.error("Routing Error:", err);
        // Fallback to login on error
        window.location.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html'; 
    }
}

// Legacy stubs to prevent errors if called
export function closeAccountModal() {}
export function createAccountModal() {}

// Make globally accessible for onclick handlers
window.openAccountModal = openAccountModal;
window.closeAccountModal = closeAccountModal;
