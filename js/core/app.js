/**
 * App Core Module
 * Core Application Initialization
 * Handles Supabase setup, routing, and component rendering
 */

console.log("DEBUG: app.js execution started");

/**
 * Initialize Supabase client and attach to window
 * @global
 */
function initializeSupabase() {
    if (window.supabase && window.GUIDE_CONFIG) {
        window.sb = window.supabase.createClient(window.GUIDE_CONFIG.URL, window.GUIDE_CONFIG.ANON_KEY);
    }
}

/**
 * Render global components present on all pages
 * Includes category navigation and bottom navigation bar
 */
function renderGlobalComponents(isHome, path) {
    if (typeof renderGlobalCategories === 'function') {
        renderGlobalCategories(isHome, path);
    }
    if (typeof renderBottomNav === 'function') {
        renderBottomNav(isHome, path);
    }
}

/**
 * Initialize page-specific logic based on body element ID
 * Routes to appropriate init function for each page type
 */
function initPageLogic(bodyId, path, isHome) {
    if (isHome) {
        if (typeof initHomepage === 'function') {
            initHomepage();
        }
    } else if (bodyId === 'categories-page') {
        // Categories list logic is already handled by renderGlobalCategories
    } else if (bodyId === 'dynamic-cat-page') {
        if (typeof initCategoryPage === 'function') {
            initCategoryPage(path);
        }
    } else if (bodyId === 'place-details-page') {
        if (typeof initPlaceDetailsPage === 'function') {
            initPlaceDetailsPage();
        }
    }
}

/**
 * Main application entry point
 * Orchestrates the initialization of the application
 */
function initializeApp() {
    // تحديد الصفحة الحالية بناءً على الـ ID الخاص بـ body
    const bodyId = document.body.id;
    const path = window.location.pathname;
    const isHome = bodyId === 'home-page';

    // 0. Initialize Dynamic Backend (Supabase)
    initializeSupabase();

    // 1. Initial Global Render (Universal)
    renderGlobalComponents(isHome, path);

    // 2. Route Page Specific Logic
    initPageLogic(bodyId, path, isHome);

    // 3. Global Ads Rendering
    if (typeof renderAds === 'function') {
        renderAds();
    }
}

/**
 * Main application entry point
 * Initializes app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Show preloader immediately
    if (typeof injectPreloader === 'function') {
        injectPreloader();
    }
    
    // Initialize the application
    initializeApp();
});

// Make functions globally accessible
window.initializeApp = initializeApp;
