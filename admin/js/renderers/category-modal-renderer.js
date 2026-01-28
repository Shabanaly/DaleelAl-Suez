/**
 * Category Modal Renderer
 * Renders and manages category modal UI
 */

/**
 * Render subcategories list in modal
 * @param {Array} subs - Array of subcategories
 * @param {string} containerId - Container element ID
 */
export function renderSubcategoriesList(subs, containerId = 'modal-subs-list') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!subs || subs.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 10px;">لا توجد أقسام فرعية بعد</div>';
        return;
    }

    container.innerHTML = subs.map(sub => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
            <div>
                <span style="font-weight: 700; font-size: 14px;">${sub.name_ar}</span>
                <code style="font-size: 11px; color: var(--text-muted); margin-right: 8px;">(${sub.id})</code>
            </div>
            <button type="button" class="btn btn-danger btn-icon" style="width: 32px; height: 32px;" data-sub-id="${sub.id}">
                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            </button>
        </div>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Load category data into form
 * @param {Object} category - Category object
 */
export function loadCategoryIntoForm(category) {
    if (!category) return;
    
    document.getElementById('cat-id').value = category.id;
    document.getElementById('cat-name-ar').value = category.name_ar;
    document.getElementById('cat-name-en').value = category.name_en || '';
    document.getElementById('cat-icon').value = category.icon || '';
}

/**
 *Open category modal
 * @param {boolean} isEdit - Is edit mode
 */
export function openModal(isEdit = false) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('modal-title');
    const subsSection = document.getElementById('subs-mgmt-section');
    const idField = document.getElementById('cat-id');
    
    title.innerText = isEdit ? 'تعديل القسم' : 'قسم جديد';
    subsSection.style.display = isEdit ? 'block' : 'none';
    idField.disabled = isEdit;
    
    modal.classList.add('active');
}

/**
 * Close category modal
 */
export function closeModal() {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    
    modal.classList.remove('active');
    form.reset();
}

/**
 * Get form data
 * @returns {Object} Category data from form
 */
export function getFormData() {
    return {
        id: document.getElementById('cat-id').value.trim(),
        name_ar: document.getElementById('cat-name-ar').value.trim(),
        name_en: document.getElementById('cat-name-en').value.trim() || null,
        icon: document.getElementById('cat-icon').value.trim() || 'folder'
    };
}
