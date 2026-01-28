
/**
 * Places Grid Renderer
 * Renders the places grid display
 */

export function renderPlacesGrid(places, containerId = 'places-grid-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!places || places.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i data-lucide="map-pin-off" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                <h3>لا توجد أماكن بعد</h3>
                <p>ابدأ بإضافة مكان جديد</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: container });
        return;
    }

    container.innerHTML = places.map(place => {
        // Determine Status Badge
        const isOpen = place.is_active ? 'مفتوح' : 'مغلق';

        // Image handling
        const imageSrc = place.image_url || place.logo || place.thumbnail || 'https://via.placeholder.com/400x225?text=No+Image';

        return `
            <div class="place-card">
                <div class="place-image-wrapper">
                    <img src="${imageSrc}" alt="${place.name_ar}" class="place-image" loading="lazy">
                    <div style="position: absolute; top: 12px; left: 12px;">
                        <label class="status-toggle small" title="تغيير الحالة" onclick="event.stopImmediatePropagation()">
                            <input type="checkbox" onchange="togglePlaceStatus('${place.id}', ${place.is_active})" ${place.is_active ? 'checked' : ''}>
                            <span class="slider"></span>
                            <span class="status-text" style="display: none;">${isOpen}</span>
                        </label>
                    </div>
                </div>

                <h3 class="place-title" title="${place.name_ar}">${place.name_ar}</h3>
                
                <div class="place-grid-category">
                    <i data-lucide="tag" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i>
                    ${place.category_id || 'غير مصنف'}
                </div>

                <div class="place-grid-info">
                    <span>
                        <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                        ${place.address || 'لا يوجد عنوان'}
                    </span>
                    <span>
                        <i data-lucide="star" style="width: 14px; height: 14px; color: gold;"></i>
                        ${place.rating || '0.0'} (${place.reviews_count || 0})
                    </span>
                </div>

                <div class="place-actions">
                    <a href="places-form.html?id=${place.id}" class="btn btn-outline" style="flex: 1; padding: 8px; justify-content: center;">
                        <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
                        تعديل
                    </a>
                    <button class="btn btn-danger" onclick="deletePlace('${place.id}')" style="flex: 1; padding: 8px; justify-content: center;">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                        حذف
                    </button>
                    ${place.id ? 
                        `<a href="../../place-details.html?id=${place.id}" target="_blank" class="btn btn-outline" style="width: 36px; padding: 0; display: flex; align-items: center; justify-content: center;" title="عرض">
                            <i data-lucide="external-link" style="width: 16px;"></i>
                        </a>` : ''
                    }
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: container });
}
