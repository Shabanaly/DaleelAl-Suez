/**
 * Category Page Renderer
 * Responsibility: Updating the UI for the single category results page.
 */
window.CategoryRenderer = {
    /**
     * Render the category page header (Title and Document Title)
     * @param {Object} category - Category data
     */
    renderHeader(category) {
        if (!category) return;

        const titleEl = document.getElementById('cat-page-title');
        const lang = localStorage.getItem('lang') || 'ar';
        const label = lang === 'ar' ? (category.name_ar || category.id) : (category.name_en || category.name_ar || category.id);

        if (titleEl) {
            titleEl.innerText = label;
        }
        
        document.title = `${label} - دليل السويس`;
    }
};
