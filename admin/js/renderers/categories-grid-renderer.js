/**
 * Categories Grid Renderer
 * Renders the main categories grid display
 */

/**
 * Render categories grid
 * @param {Array} categories - Array of category objects
 * @param {string} containerId - Container element ID
 */
export function renderCategoriesGrid(categories, containerId = 'categories-container') {
    console.log('🔄 Rendering categories grid:', categories?.length);
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!categories || categories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="inbox"></i>
                <h3>لا توجد أقسام بعد</h3>
                <p>ابدأ بإضافة قسم جديد من الزر أعلاه</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: container });
        return;
    }

    container.innerHTML = categories
        .filter(cat => cat && cat.id) // Safety filter
        .map(cat => {
            const subs = cat.subs || [];
            return `
            <div class="category-card">
                <div class="category-icon-wrapper">
                    <i data-lucide="${cat.icon || 'folder'}"></i>
                </div>
                <h3 class="category-title">${cat.label || cat.name_ar}</h3>
                <div class="category-id">${cat.id}</div>

                <div class="subcategories-section">
                    <div class="subcategories-label">الأقسام الفرعية (${subs.length})</div>
                    <div class="subcategories-list">
                        ${subs.length ? subs.slice(0, 3).map(s => `<span class="sub-badge">${s.label || s.name_ar}</span>`).join('') : '<span style="color: var(--text-muted); font-size: 13px;">لا توجد أقسام فرعية</span>'}
                        ${subs.length > 3 ? `<span class="sub-badge">+${subs.length - 3}</span>` : ''}
                    </div>
                </div>

                <div class="category-actions">
                    <a href="categories-form.html?id=${cat.id}" class="btn btn-outline" style="flex: 1; padding: 8px; display: flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;">
                        <i data-lucide="edit-2" style="width: 18px; height: 18px; margin-left: 6px;"></i>
                        تعديل
                    </a>
                    <button class="btn btn-danger" style="flex: 1; padding: 8px;" data-category-id="${cat.id}" data-action="delete">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                        حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons({ root: container });
        } catch (e) {
            console.error('Icon creation error:', e);
        }
    }
}

/**
 * Show loading state
 * @param {string} containerId - Container element ID
 */
export function showLoadingState(containerId = 'categories-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
            <i data-lucide="loader" style="width: 48px; height: 48px; animation: spin 1s linear infinite;"></i>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Show error state
 * @param {string} message - Error message
 * @param {string} containerId - Container element ID
 */
export function showErrorState(message, containerId = 'categories-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i data-lucide="alert-circle" style="color: #dc2626;"></i>
            <h3>حدث خطأ</h3>
            <p>${message}</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}
