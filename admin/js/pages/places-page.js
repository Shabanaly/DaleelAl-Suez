
/**
 * Places Page Controller
 * Handles List/Grid View and Places Management
 */

import { renderPlacesGrid } from '../renderers/places-grid-renderer.js';

const PlacesPageController = {
    allPlaces: [],
    viewMode: 'list', // 'list' | 'grid'
    currentCategory: '',
    
    init: async function() {
        // Initialize Layout
        if (typeof Sidebar !== 'undefined') document.getElementById('sidebar-container').innerHTML = Sidebar.render('places');
        if (typeof Topbar !== 'undefined') document.getElementById('topbar-container').innerHTML = Topbar.render('الأماكن');

        // Initial Load
        await this.loadPlaces();
        await this.loadCategories();

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    loadPlaces: async function() {
        const tbody = document.getElementById('places-table-body');
        const gridView = document.getElementById('places-grid-view');
        
        const loadingHtml = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">جاري التحميل...</div>`;
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 40px;">جاري التحميل...</td></tr>`;
        if (gridView) gridView.innerHTML = loadingHtml;

        try {
            this.allPlaces = await PlacesService.getAll();
            this.renderPlaces(this.allPlaces);
        } catch (error) {
            console.error('Failed to load places:', error);
            const errorMsg = `خطأ في التحميل: ${error.message}`;
            if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">${errorMsg}</td></tr>`;
            if (gridView) gridView.innerHTML = `<div style="text-align: center; color: red; grid-column: 1/-1;">${errorMsg}</div>`;
        }
    },

    loadCategories: async function() {
        try {
            const categories = await CategoriesService.getAll();
            const chipsContainer = document.getElementById('category-chips');
            if (!chipsContainer) return;

            // Keep "All" button
            const allBtn = chipsContainer.querySelector('[data-category=""]');
            chipsContainer.innerHTML = '';
            if (allBtn) chipsContainer.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'filter-chip';
                btn.dataset.category = cat.id;
                btn.textContent = cat.name_ar;
                btn.onclick = () => this.selectCategory(cat.id);
                chipsContainer.appendChild(btn);
            });
        } catch (error) {
            console.error('Failed to load categories for filter:', error);
        }
    },

    renderPlaces: function(places) {
        // Filter first
        // (If simple client-side search is needed, use filterPlaces logic. Here we just render passed array)
        
        if (this.viewMode === 'list') {
            document.getElementById('places-table-view').style.display = 'block';
            document.getElementById('places-grid-view').style.display = 'none';
            this.renderListView(places);
        } else {
            document.getElementById('places-table-view').style.display = 'none';
            document.getElementById('places-grid-view').style.display = 'grid'; // grid-3 class handles cols
            renderPlacesGrid(places, 'places-grid-view');
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    renderListView: function(places) {
        const tbody = document.getElementById('places-table-body');
        if (!tbody) return;

        if (!places || places.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px;">لا توجد أماكن مضافة</td></tr>`;
            return;
        }

        tbody.innerHTML = places.map(place => {
            const isChecked = place.is_active ? 'checked' : '';
            const statusLabel = place.is_active ? 'مفتوح' : 'مغلق';
            // Image handling
            const imageSrc = place.logo || place.thumbnail || place.image_url || 'https://placehold.co/40x40?text=P';

            return `
                <tr>
                    <td>
                        <div class="place-item-flex">
                            <img src="${imageSrc}" class="place-list-img">
                            <div>
                                <div class="place-info-name">${place.name_ar}</div>
                                <div class="place-info-sub">${place.address || '-'}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge category-badge">
                            ${place.main_cat_id || 'غير مصنف'}
                        </span>
                    </td>
                    <td>
                        <div class="rating-badge">
                            <i data-lucide="star"></i>
                            ${place.rating || '0.0'} 
                            <span class="reviews-count">(${place.reviews_count || 0})</span>
                        </div>
                    </td>
                    <td>
                        <label class="status-toggle" title="تغيير الحالة">
                            <input type="checkbox" onchange="togglePlaceStatus('${place.id}', ${place.is_active})" ${isChecked}>
                            <span class="slider"></span>
                            <span class="status-text">${statusLabel}</span>
                        </label>
                    </td>
                    <td>
                        <div class="table-actions-group">
                            <a href="places-form.html?id=${place.id}" class="btn btn-outline btn-icon" title="تعديل">
                                <i data-lucide="edit-2" style="width: 18px; height: 18px;"></i>
                            </a>
                            <button class="btn btn-danger btn-icon" onclick="deletePlace('${place.id}')" title="حذف">
                                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: tbody });
    },

    toggleStatus: async function(id, currentStatus) {
        try {
            const newStatus = await PlacesService.toggleStatus(id, currentStatus);
            // Updating local state
            const placeIndex = this.allPlaces.findIndex(p => p.id === id);
            if (placeIndex !== -1) {
                this.allPlaces[placeIndex].is_active = newStatus;
                this.renderPlaces(this.allPlaces); // Re-render to update UI (list/grid)
                if (typeof Toast !== 'undefined') Toast.success(`تم تغيير الحالة إلى ${newStatus ? 'مفتوح' : 'مغلق'}`);
            }
        } catch (error) {
            console.error('Toggle status failed', error);
            alert('فشل تغيير الحالة: ' + error.message);
            // Revert UI if needed (re-render)
            this.renderPlaces(this.allPlaces);
        }
    },

    toggleView: function(mode) {
        this.viewMode = mode;
        
        // Update Buttons
        document.getElementById('view-list-btn').classList.toggle('active', mode === 'list');
        document.getElementById('view-grid-btn').classList.toggle('active', mode === 'grid');
        
        // Re-render (filtering applied)
        this.filterPlaces();
    },

    filterPlaces: function() {
        const searchInput = document.getElementById('search-input');
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const category = this.currentCategory;

        const filtered = this.allPlaces.filter(place => {
            const nameSearch = (place.name_ar && place.name_ar.toLowerCase().includes(term)) || 
                               (place.name_en && place.name_en.toLowerCase().includes(term)) ||
                               (place.name && place.name.toLowerCase().includes(term));
                               
            const matchesSearch = !term || nameSearch ||
                (place.address && place.address.toLowerCase().includes(term));
            
            const matchesCategory = !category || place.main_cat_id === category;
            
            return matchesSearch && matchesCategory;
        });

        this.renderPlaces(filtered);
    },

    selectCategory: function(catId) {
        this.currentCategory = catId;
        
        // Update Chips UI
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === catId);
        });

        this.filterPlaces();
    },

    deletePlace: async function(id) {
        if (!confirm('⚠️ هل أنت متأكد من حذف هذا المكان؟')) return;
        
        try {
            await PlacesService.delete(id);
            await this.loadPlaces();
            if (typeof Toast !== 'undefined') Toast.success('تم الحذف بنجاح');
        } catch (error) {
            alert('خطأ: ' + error.message);
        }
    }
};

// Expose Globals
window.toggleView = (mode) => PlacesPageController.toggleView(mode);
window.filterPlaces = () => PlacesPageController.filterPlaces();
window.selectCategory = (id) => PlacesPageController.selectCategory(id);
window.deletePlace = (id) => PlacesPageController.deletePlace(id);
window.togglePlaceStatus = (id, current) => PlacesPageController.toggleStatus(id, current);

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PlacesPageController.init());
} else {
    PlacesPageController.init();
}
