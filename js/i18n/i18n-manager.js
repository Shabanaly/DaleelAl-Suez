/**
 * I18n Manager Module (Bridge)
 * Re-exports i18n functions from common module for ES module compatibility
 */

export async function initI18n() {
    // I18n is already initialized by common/i18n/i18n.js loaded in HTML
    // This is a no-op to prevent errors, but we can call applyLanguage if available
    if (typeof window.applyLanguage === 'function') {
        window.applyLanguage();
    }
}

export function toggleLanguage() {
    if (typeof window.toggleLanguage === 'function') {
        window.toggleLanguage();
    }
}
