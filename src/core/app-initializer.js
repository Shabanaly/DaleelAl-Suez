/**
 * App Initializer
 * Main app initialization logic
 */

 // import { initTheme } from '../ui/theme.js';
 // import { initI18n } from '../i18n/i18n-manager.js';
 // import { routePage } from './router.js';

/**
 * Initialize the application
 */
async function initApp() {
    try {
        // Initialize theme
        initTheme();
        
        // Initialize internationalization
        await initI18n();
        
        // Setup global event listeners
        setupGlobalListeners();
        
        // Route to appropriate page
        routePage();
        
    } catch (error) {
        console.error('App initialization error:', error);
    }
}

/**
 * Setup global event listeners
 */
/**
 * Setup global event listeners
 */
function setupGlobalListeners() {
    // Listeners are handled via inline onclick in HTML or global scripts
    // Removing duplicate listeners to prevent double-toggling
}

/**
 * Toggle language (will be imported from i18n)
 */
function toggleLanguage() {
    // Import dynamically to avoid circular dependency
    import('../i18n/i18n-manager.js').then(module => {
        module.toggleLanguage();
    });
}

/**
 * Toggle theme (will be imported from theme)
 */
function toggleTheme() {
    import('../ui/theme.js').then(module => {
        module.toggleTheme();
    });
}
