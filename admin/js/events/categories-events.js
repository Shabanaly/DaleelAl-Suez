/**
 * Categories Event Handlers
 * Handles user interactions for categories management
 */

import { categoriesState } from '../core/categories-state.js';
import * as CategoriesData from '../data/categories-data.js';
import { renderCategoriesGrid } from '../renderers/categories-grid-renderer.js';
import * as ModalRenderer from '../renderers/category-modal-renderer.js';

/**
 * Attach category action event listeners
 */
export function attachCategoryActionListeners() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    // Remove existing listener
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);

    newContainer.addEventListener('click', handleCategoryAction);
}

/**
 * Handle category action clicks
 */
async function handleCategoryAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const categoryId = btn.dataset.categoryId;

    if (action === 'edit') {
        await handleEdit(categoryId);
    } else if (action === 'delete') {
        await handleDelete(categoryId);
    }
}

/**
 * Handle edit category
 */
async function handleEdit(catId) {
    categoriesState.setEditingId(catId);
    
    // Load category data
    let cat = categoriesState.findCategory(catId);
    if (!cat) {
        const cats = await CategoriesData.getAllCategories();
        cat = cats.find(c => c.id === catId);
    }

    if (cat) {
        ModalRenderer.openModal(true);
        ModalRenderer.loadCategoryIntoForm(cat);
        ModalRenderer.renderSubcategoriesList(cat.subs || []);
        attachSubcategoryListeners();
    }
}

/**
 * Handle delete category
 */
async function handleDelete(catId) {
    const confirmed = await window.UIUtils.confirm(
        'هل أنت متأكد من حذف هذا القسم؟\n\nسيتم حذف جميع الأقسام الفرعية والأماكن المرتبطة به.'
    );
    if (!confirmed) return;

    try {
        await CategoriesData.deleteCategory(catId);
        categoriesState.removeCategory(catId);
        renderCategoriesGrid(categoriesState.getCategories());
        window.Toast.success('تم الحذف بنجاح');
    } catch (error) {
        console.error(error);
        window.Toast.error('حدث خطأ: ' + error.message);
    }
}

/**
 * Handle save category (form submit)
 */
export async function handleSave(e) {
    e.preventDefault();

    if (categoriesState.isSavingNow()) {
        console.warn('⏳ Save in progress...');
        return;
    }

    const categoryData = ModalRenderer.getFormData();
    const submitBtn = document.querySelector('#category-form button[type="submit"]');
    const editingId = categoriesState.getEditingId();

    try {
        console.log('📝 Starting save...', categoryData);
        categoriesState.setSaving(true);
        window.UIUtils.setButtonLoading(submitBtn, true);

        if (editingId) {
            // Update existing
            console.log('🔄 Updating existing category:', editingId);
            categoriesState.updateCategory(editingId, {
                name_ar: categoryData.name_ar,
                name_en: categoryData.name_en,
                icon: categoryData.icon,
                label: categoryData.name_ar
            });
            
            console.log('🔄 Re-rendering grid (update)...');
            renderCategoriesGrid(categoriesState.getCategories());

            console.log('☁️ Sending API update...');
            await CategoriesData.updateCategory(editingId, {
                name_ar: categoryData.name_ar,
                name_en: categoryData.name_en,
                icon: categoryData.icon
            });
            window.Toast.success('تم تحديث القسم');
        } else {
            // Create new
            console.log('➕ Adding new category locally...');
            categoriesState.addCategory(categoryData);
            
            console.log('🔄 Re-rendering grid (create)...');
            renderCategoriesGrid(categoriesState.getCategories());

            console.log('☁️ Sending API create...');
            await CategoriesData.createCategory(categoryData);
            window.Toast.success('تم إضافة القسم');
        }

        console.log('✅ Save complete. Closing modal.');
        ModalRenderer.closeModal();
        // NOTE: Icons are created in renderCategoriesGrid, redundancy removed.

    } catch (error) {
        console.error('❌ Error during save:', error);
        window.Toast.error('حدث خطأ: ' + error.message);
    } finally {
        categoriesState.setSaving(false);
        window.UIUtils.setButtonLoading(submitBtn, false);
    }
}

/**
 * Handle add subcategory
 */
export async function handleAddSub() {
    const idInput = document.getElementById('new-sub-id');
    const nameInput = document.getElementById('new-sub-name');
    const addBtn = document.getElementById('add-sub-btn');

    const id = idInput.value.trim();
    const name = nameInput.value.trim();

    if (!id || !name) {
        window.Toast.warning('يرجى إدخال المعرف والاسم');
        return;
    }

    const editingId = categoriesState.getEditingId();

    try {
        window.UIUtils.setButtonLoading(addBtn, true);

        // Optimistic update
        const newSub = { id, name_ar: name, main_cat_id: editingId, label: name };
        categoriesState.updateSubcategory(editingId, null, 'add', newSub);
        
        const category = categoriesState.findCategory(editingId);
        if (category) {
            ModalRenderer.renderSubcategoriesList(category.subs);
            attachSubcategoryListeners();
        }

        // API call
        await CategoriesData.createSubcategory({ id, name_ar: name, main_cat_id: editingId });

        idInput.value = '';
        nameInput.value = '';
        window.Toast.success('تم إضافة القسم الفرعي');
    } catch (error) {
        console.error(error);
        window.Toast.error('خطأ في إضافة القسم الفرعي: ' + error.message);
    } finally {
        window.UIUtils.setButtonLoading(addBtn, false);
    }
}

/**
 * Handle delete subcategory
 */
async function handleDeleteSub(subId) {
    const confirmed = await window.UIUtils.confirm('هل أنت متأكد من حذف هذا القسم الفرعي؟');
    if (!confirmed) return;

    const editingId = categoriesState.getEditingId();

    try {
        // Optimistic update
        categoriesState.updateSubcategory(editingId, subId, 'remove');
        
        const category = categoriesState.findCategory(editingId);
        if (category) {
            ModalRenderer.renderSubcategoriesList(category.subs);
            attachSubcategoryListeners();
        }

        // API call
        await CategoriesData.deleteSubcategory(subId);
        window.Toast.success('تم حذف القسم الفرعي');
    } catch (error) {
        console.error(error);
        window.Toast.error('خطأ في حذف القسم الفرعي: ' + error.message);
    }
}

/**
 * Attach subcategory delete listeners
 */
function attachSubcategoryListeners() {
    const container = document.getElementById('modal-subs-list');
    if (!container) return;

    container.querySelectorAll('[data-sub-id]').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteSub(btn.dataset.subId));
    });
}

/**
 * Handle open new category modal
 */
export function handleOpenNewModal() {
    categoriesState.setEditingId(null);
    ModalRenderer.openModal(false);
    const form = document.getElementById('category-form');
    if (form) form.reset();
}

/**
 * Handle close modal
 */
export function handleCloseModal() {
    ModalRenderer.closeModal();
    categoriesState.setEditingId(null);
}
