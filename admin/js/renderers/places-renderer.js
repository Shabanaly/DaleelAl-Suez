/**
 * Places Renderer
 * Handles DOM updates for the places table and filter chips
 */

/**
 * Render places table
 * @param {Array} places 
 */
export function renderPlacesTable(places) {
    const tbody = document.getElementById('places-table-body');
    if (!tbody) return;
    
    if (!places.length) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">لا توجد أماكن</td></tr>';
        return;
    }

    tbody.innerHTML = places.map(place => `
        <tr>
            <td>
                <strong>${place.name_ar}</strong>
                ${place.name_en ? `<br><small style="color: var(--text-muted);">${place.name_en}</small>` : ''}
            </td>
            <td><span class="badge">${place.main_cat_id || '-'}</span></td>
            <td>
                <button class="btn ${place.is_active ? 'btn-success' : 'btn-danger'}" 
                        data-action="toggle" 
                        data-id="${place.id}"
                        data-status="${place.is_active}"
                        style="padding: 6px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; transition: all 0.3s;"
                        title="اضغط لتبديل الحالة">
                    <i data-lucide="${place.is_active ? 'check-circle' : 'x-circle'}" style="width: 14px; height: 14px; margin-left: 4px;"></i>
                    ${place.is_active ? 'نشط' : 'غير نشط'}
                </button>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-icon" data-action="edit" data-id="${place.id}" title="تعديل">
                        <i data-lucide="edit-2" style="width: 18px; height: 18px;"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" data-action="delete" data-id="${place.id}" title="حذف">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
}

/**
 * Render category filter chips
 * @param {Array} categories 
 * @param {string} selectedId 
 * @param {Function} onSelect 
 */
export function renderFilterChips(categories, selectedId, onSelect) {
    const chipsContainer = document.getElementById('category-chips');
    if (!chipsContainer) return;
    
    // Clear existing (except "All" if it was hardcoded? assuming we rebuild all or append)
    // The original code appended to existing container which presumably had "All" static?
    // Let's check original places.html: lines 45-49 showing "All" button static.
    // So we should append or just clear dynamically added ones.
    // Ideally we keep "All" and append others.
    
    // Clear dynamic chips only (simplest way: remove all except first child, or clear all and re-add 'All')
    chipsContainer.innerHTML = '';
    
    // Add "All" chip
    const allChip = document.createElement('button');
    allChip.className = `filter-chip ${selectedId === '' ? 'active' : ''}`;
    allChip.textContent = 'الكل';
    allChip.onclick = () => onSelect('');
    chipsContainer.appendChild(allChip);

    categories.forEach(c => {
        const chip = document.createElement('button');
        chip.className = `filter-chip ${c.id === selectedId ? 'active' : ''}`;
        chip.onclick = () => onSelect(c.id);
        chip.textContent = c.label;
        chipsContainer.appendChild(chip);
    });
}

export function showLoading() {
    const tbody = document.getElementById('places-table-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">جاري التحميل...</td></tr>';
}

export function showError(message) {
    const tbody = document.getElementById('places-table-body');
    if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--danger);">${message || 'حدث خطأ في التحميل'}</td></tr>`;
}
