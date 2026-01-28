/**
 * Places Events Handler
 * Handles user interactions
 */

import { placesState } from '../core/places-state.js';
import * as PlacesData from '../data/places-data.js';
import * as PlacesRenderer from '../renderers/places-renderer.js';

/**
 * Handle Place Actions (Edit, Delete, Toggle) via Delegation
 */
export async function handlePlaceAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'toggle') {
        const currentStatus = btn.dataset.status === 'true';
        await toggleActive(id, currentStatus);
    } else if (action === 'edit') {
        window.location.href = `places-form.html?id=${id}`;
    } else if (action === 'delete') {
        await deletePlace(id);
    }
}

/**
 * Toggle Active Status
 */
async function toggleActive(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        // Optimistic update
        placesState.updatePlace(id, { is_active: newStatus });
        refreshTable();
        
        // API call
        await PlacesData.updatePlace(id, { is_active: newStatus });
        
        if (window.Toast) window.Toast.success(`تم ${newStatus ? 'تفعيل' : 'إلغاء تفعيل'} المكان`);
    } catch (error) {
        console.error(error);
        // Revert on error
        placesState.updatePlace(id, { is_active: currentStatus });
        refreshTable();
        if (window.Toast) window.Toast.error('حدث خطأ: ' + error.message);
    }
}

/**
 * Delete Place
 */
async function deletePlace(id) {
    if (!window.UIUtils || !await window.UIUtils.confirm('هل أنت متأكد من حذف هذا المكان؟')) return;

    try {
        await PlacesData.deletePlace(id);
        placesState.removePlace(id);
        refreshTable();
        if (window.Toast) window.Toast.success('تم الحذف بنجاح');
    } catch (error) {
        console.error(error);
        if (window.Toast) window.Toast.error('حدث خطأ: ' + error.message);
    }
}

/**
 * Handle Search Input
 */
export function handleSearch(e) {
    refreshTable();
}

/**
 * Refresh table based on current state and search
 */
function refreshTable() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const categoryId = placesState.getSelectedCategory();
    const allPlaces = placesState.getPlaces();

    let filtered = allPlaces;

    if (categoryId) {
        filtered = filtered.filter(p => p.main_cat_id === categoryId);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => 
            (p.name_ar && p.name_ar.toLowerCase().includes(searchTerm)) ||
            (p.name_en && p.name_en.toLowerCase().includes(searchTerm)) ||
            (p.address && p.address.toLowerCase().includes(searchTerm))
        );
    }

    PlacesRenderer.renderPlacesTable(filtered);
}
