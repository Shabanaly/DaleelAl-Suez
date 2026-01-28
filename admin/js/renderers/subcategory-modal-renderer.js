
/**
 * Subcategory Modal Renderer
 * Handles the display and interaction of the Subcategory creation modal
 */

export const SubModalRenderer = {
    /**
     * Open the subcategory modal
     * @param {Array} categories - List of parent categories to populate dropdown
     */
    openModal: (categories) => {
        const modal = document.getElementById('subcategory-modal');
        const form = document.getElementById('subcategory-form');
        const select = document.getElementById('sub-parent-select');
        
        if (!modal || !select) return;

        // Populate Dropdown
        select.innerHTML = '<option value="">اختر القسم الرئيسي...</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name_ar || cat.label || cat.id;
            select.appendChild(option);
        });

        modal.classList.add('active');
        if (form) form.reset();
    },

    /**
     * Close the subcategory modal
     */
    closeModal: () => {
        const modal = document.getElementById('subcategory-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * Get form data from the subcategory modal
     * @returns {Object} Subcategory data
     */
    getFormData: () => {
        return {
            main_cat_id: document.getElementById('sub-parent-select').value,
            id: document.getElementById('sub-id').value.trim(),
            name_ar: document.getElementById('sub-name').value.trim(),
            name_en: document.getElementById('sub-name-en').value.trim() || null
        };
    }
};
