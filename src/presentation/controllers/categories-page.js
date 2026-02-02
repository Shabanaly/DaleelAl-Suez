/**
 * Categories Page Controller
 * Handles rendering of global categories and UI events
 */

(function() {
    'use strict';
    
    window.CategoriesPageController = {
        /**
         * Initialize the page
         */
        async init() {
            console.log("📂 CategoriesPageController Initializing (Clean Architecture)...");
            
            // 1. Fetch data through Business Logic (Service)
            let categories = [];
            if (window.UserCategoriesService) {
                try {
                    categories = await window.UserCategoriesService.getMainCategories();
                } catch (err) {
                    console.error("Failed to fetch categories:", err);
                }
            }

            // 2. Pass data to Presentation Layer (Renderer)
            if (window.renderGlobalCategories) {
                window.renderGlobalCategories(categories, window.location.pathname);
            }
            
            // 3. Initialize events
            this.initEventListeners();
        },

        /**
         * Initialize page event listeners
         */
        initEventListeners() {
            // Language toggle
            const langToggle = document.getElementById('lang-toggle');
            if (langToggle) {
                langToggle.onclick = () => {
                    if (typeof window.toggleLanguage === 'function') {
                        window.toggleLanguage();
                    }
                };
            }
            
            // Theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.onclick = () => {
                    if (typeof window.toggleTheme === 'function') {
                        window.toggleTheme();
                    }
                };
            }
        }
    };
})();
