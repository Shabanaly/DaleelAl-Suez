/**
 * theme.js - Strict Single Source of Truth Theme System
 * Handles Theme State and UI Updates without Flicker
 */

/**
 * Validates and sanitizes theme preference
 */
function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    // Default to Dark if no preference, or respect system preference
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * Core Theme State Manager
 */
function setThemeState(theme) {
    if (theme !== "dark" && theme !== "light") return;
    
    // 1. Update DOM
    document.documentElement.setAttribute("data-theme", theme);
    
    // 2. Persist
    localStorage.setItem("theme", theme);
    
    // 3. Update UI
    updateThemeUI(theme);
}

/**
 * Updates all theme-related UI elements (icons)
 */
function updateThemeUI(theme) {
    const icons = document.querySelectorAll(".theme-toggle-icon, #theme-toggle-icon");
    icons.forEach(icon => {
        // Remove old icon attribute to force refresh if needed, roughly
        // But lucide just needs the data-lucide attribute updated
        if (theme === "light") {
            icon.setAttribute("data-lucide", "moon");
        } else {
            icon.setAttribute("data-lucide", "sun");
        }
    });
    
    // Refresh icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

/**
 * Public Toggle Function
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setThemeState(next);
}

// =========================================================
// Initialization (Blocking)
// =========================================================
(function() {
    const theme = getPreferredTheme();
    document.documentElement.setAttribute("data-theme", theme);
})();

// Re-apply on DOM Ready to update icons
document.addEventListener("DOMContentLoaded", () => {
    updateThemeUI(document.documentElement.getAttribute("data-theme"));
});

// Expose globally for onclick handlers
window.toggleTheme = toggleTheme;
