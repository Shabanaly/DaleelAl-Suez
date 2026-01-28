/**
 * Theme Module (Bridge)
 * Re-exports theme functions from common module for ES module compatibility
 */

export function initTheme() {
    // Theme is already initialized by common/theme/theme.js loaded in HTML
    // This is a no-op to prevent errors
    if (typeof window.initTheme === 'function') {
        window.initTheme();
    }
}

export function toggleTheme() {
    if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
    }
}
