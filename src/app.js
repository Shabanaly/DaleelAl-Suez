/**
 * Suez Guide - Unified App Entry Point (Non-Module)
 * Responsibility: Application initialization and routing.
 */
(function() {
    window.App = {
        async init() {
            console.log("🚀 App Initializing (Clean Architecture - Non-Module)...");

            // 1. Identify current page
            const path = window.location.pathname;
            let page = 'home';
            if (path.includes('place.html')) page = 'place';
            else if (path.includes('category.html')) page = 'category';
            else if (path.includes('categories.html')) page = 'categories';
            else if (path.includes('search.html')) page = 'search';
            else if (path.includes('favorites.html')) page = 'favorites';

            // 2. Initialize Common UI
            this.initCommonUI(page);

            // 3. Initialize Page-Specific Logic
            try {
                switch(page) {
                    case 'home':
                        if (window.HomePageController) await window.HomePageController.init();
                        break;
                    case 'place':
                        if (window.PlacePageController) await window.PlacePageController.init();
                        break;
                    case 'category':
                        if (window.CategoryPageController) await window.CategoryPageController.init();
                        break;
                    case 'categories':
                        if (window.CategoriesPageController) await window.CategoriesPageController.init();
                        break;
                    case 'search':
                        if (window.initSearchPage) await window.initSearchPage(); // If it's a function
                        else if (window.SearchPageController) await window.SearchPageController.init();
                        break;
                    case 'favorites':
                        if (window.initFavoritesPage) await window.initFavoritesPage();
                        else if (window.FavoritesPageController) await window.FavoritesPageController.init();
                        break;
                }
            } catch (err) {
                console.error("Page Init Error:", err);
            }

            // 4. Hide Preloader
            if (window.hidePreloader) window.hidePreloader();
            
            // 5. Finalize Icons
            if (window.lucide) window.lucide.createIcons();
        },

        initCommonUI(page) {
            // Render Bottom Nav
            if (window.renderBottomNav) {
                window.renderBottomNav(page === 'home', window.location.pathname);
            }
        }
    };

    // Auto-run on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        window.App.init();
    });
})();
