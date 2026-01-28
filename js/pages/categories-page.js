/**
 * Categories Page Controller
 * Handles event listeners for language and theme toggles
 */

(function() {
    'use strict';
    
    /**
     * Initialize page event listeners
     */
    function initEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                if (typeof toggleLanguage === 'function') {
                    toggleLanguage();
                }
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (typeof toggleTheme === 'function') {
                    toggleTheme();
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEventListeners);
    } else {
        initEventListeners();
    }
})();
