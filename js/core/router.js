/**
 * App Router
 * Handles page-specific initialization based on current path
 */

/**
 * Route to appropriate page initializer
 */
export function routePage() {
    const path = window.location.pathname;
    
    // Import page controllers dynamically
    if (path.includes('index.html') || path.endsWith('/')) {
        import('../pages/home-page.js').then(module => module.initHomePage());
    } else if (path.includes('place.html')) {
        import('../pages/place-page.js').then(module => module.initPlacePage());
    } else if (path.includes('category.html')) {
        import('../pages/category-page.js').then(module => module.initCategoryPage());
    } else if (path.includes('favorites.html')) {
        import('../pages/favorites-page.js').then(module => module.initFavoritesPage());
    }
}

/**
 * Get current page type
 */
export function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/')) return 'home';
    if (path.includes('place.html')) return 'place';
    if (path.includes('category.html')) return 'category';
    if (path.includes('favorites.html')) return 'favorites';
    return 'other';
}
