
/**
 * Subcategory Events Helper
 * Handles events related to subcategory management
 */

import { SubModalRenderer } from '../renderers/subcategory-modal-renderer.js';
import * as CategoriesData from '../data/categories-data.js';
import { renderCategoriesGrid } from '../renderers/categories-grid-renderer.js';
import { categoriesState } from '../core/categories-state.js';

export async function handleSaveSubcategory(e) {
    e.preventDefault();

    const formData = SubModalRenderer.getFormData();
    const submitBtn = document.querySelector('#subcategory-form button[type="submit"]');

    if (!formData.main_cat_id || !formData.id || !formData.name_ar) {
        window.Toast.warning('يجب ملء جميع الحقول');
        return;
    }

    try {
        window.UIUtils.setButtonLoading(submitBtn, true);

        // Update local state first (Optimistic UI)
        // We need to fetch FRESH data or update state manually.
        // categoriesState.allCategories is the source of truth.
        // We need to find the parent and push to its subs.
        const parent = categoriesState.allCategories.find(c => c.id === formData.main_cat_id);
        if (parent) {
            if (!parent.subs) parent.subs = [];
            parent.subs.push({
                id: formData.id,
                main_cat_id: formData.main_cat_id,
                name_ar: formData.name_ar,
                label: formData.name_ar // For renderer
            });
            console.log('🔄 Optimistic update (Subcategory)', parent);
            renderCategoriesGrid(categoriesState.getCategories());
        }

        // Call API
        await CategoriesData.createSubcategory(formData);
        
        window.Toast.success('تم إضافة القسم الفرعي بنجاح');
        SubModalRenderer.closeModal();

        // Optional: Re-fetch ensuring consistency
        // const freshData = await CategoriesData.getAllCategories();
        // categoriesState.setCategories(freshData);

    } catch (error) {
        console.error('❌ Error adding subcategory:', error);
        window.Toast.error('حدث خطأ: ' + error.message);
        
        // Rollback state if desired, or just reload on next visit
    } finally {
        window.UIUtils.setButtonLoading(submitBtn, false);
    }
}
