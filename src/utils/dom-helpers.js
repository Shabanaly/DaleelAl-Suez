/**
 * DOM Helper Utilities
 * Common DOM manipulation functions
 * @namespace DOMHelpers
 */
const DOMHelpers = {
    /**
     * Update container content safely with icon initialization
     * @param {string} containerId - Container element ID
     * @param {string} htmlContent - HTML content to insert
     * @returns {boolean} Success status
     */
    updateContainer(containerId, htmlContent) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container #${containerId} not found`);
            return false;
        }
        
        container.innerHTML = htmlContent;
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Sync favorite icons if available
        if (typeof syncFavoriteIcons === 'function') {
            syncFavoriteIcons();
        }
        
        return true;
    },

    /**
     * Set loading state for container
     * @param {string} containerId - Container element ID
     * @param {boolean} isLoading - Loading state
     */
    setLoading(containerId, isLoading) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (isLoading) {
            container.innerHTML = '<div class="loading" style="text-align: center; padding: 40px; color: var(--text-muted);">جاري التحميل...</div>';
        }
    },

    /**
     * Show/hide element by ID
     * @param {string} elementId - Element ID
     * @param {boolean} show - Show or hide
     */
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * Get current language preference
     * @returns {string} Language code (ar/en)
     */
    getCurrentLanguage() {
        return localStorage.getItem('lang') || 'ar';
    },

    /**
     * Check if current language is Arabic
     * @returns {boolean} True if Arabic
     */
    isArabic() {
        return this.getCurrentLanguage() === 'ar';
    }
};

window.DOMHelpers = DOMHelpers;
