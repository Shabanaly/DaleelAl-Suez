/**
 * Account Handler (Smart Router)
 * Routes to Profile (if logged in) or Login (if guest)
 */

async function openAccountModal(e) {
    if (e) e.preventDefault();
    
    // Safety check
    if (!window.AuthService) {
        console.error("AuthService not initialized");
        window.location.href = 'pages/login.html'; // Fallback
        return;
    }
    
    try {
        // Check Session (Business Layer)
        const isLoggedIn = await window.AuthService.isLoggedIn();
        
        // Determine path base
        const path = window.location.pathname;
        const isPagesDir = path.includes('/pages/');
        
        // Route
        const page = isLoggedIn ? 'profile.html' : 'login.html';
        const target = isPagesDir ? page : `pages/${page}`;
        
        window.location.href = target;
        
    } catch (err) {
        console.error("Routing Error:", err);
        window.location.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html'; 
    }
}

// Legacy stubs to prevent errors if called
function closeAccountModal() {}
function createAccountModal() {}

// Make globally accessible for onclick handlers
window.openAccountModal = openAccountModal;
window.closeAccountModal = closeAccountModal;
