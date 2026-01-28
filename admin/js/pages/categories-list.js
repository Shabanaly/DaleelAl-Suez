
// Categories List Page Controller
// Supports Grid/List View Toggle

import { renderCategoriesGrid } from '../renderers/categories-grid-renderer.js';

const CategoriesListController = {
    allCategories: [],
    viewMode: 'list', // 'list' | 'grid'
    
    init: async function() {
        // Setup UI Components
        if (typeof Sidebar !== 'undefined') document.getElementById('sidebar-container').innerHTML = Sidebar.render('categories');
        if (typeof Topbar !== 'undefined') document.getElementById('topbar-container').innerHTML = Topbar.render('الأقسام');

        // Initial Load
        await this.loadCategories();
        
        // Setup Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCategories());
        }

        // Setup Sub Form Submit
        const subForm = document.getElementById('subcategory-form');
        if (subForm) {
            subForm.addEventListener('submit', (e) => this.handleSaveSubcategory(e));
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    loadCategories: async function() {
        // Show Loading in both containers
        const tbody = document.getElementById('categories-table-body');
        const gridView = document.getElementById('categories-grid-view');
        
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">جاري التحميل...</td></tr>';
        if (gridView) gridView.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 40px;">جاري التحميل...</div>';

        try {
            this.allCategories = await CategoriesService.getAll();
            this.renderCategories(this.allCategories);
        } catch (error) {
            console.error('Failed to load categories:', error);
            const errorMsg = `فشل التحميل: ${error.message}`;
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">${errorMsg}</td></tr>`;
            if (gridView) gridView.innerHTML = `<div style="text-align: center; color: red; grid-column: 1/-1;">${errorMsg}</div>`;
        }
    },

    renderCategories: function(categories) {
        // Based on View Mode
        if (this.viewMode === 'list') {
            this.renderListView(categories);
            document.getElementById('categories-table-view').style.display = 'block';
            document.getElementById('categories-grid-view').style.display = 'none';
        } else {
            renderCategoriesGrid(categories, 'categories-grid-view'); // Using imported renderer with correct ID
            document.getElementById('categories-table-view').style.display = 'none';
            document.getElementById('categories-grid-view').style.display = 'grid'; // grid-3 class handles columns
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    renderListView: function(categories) {
        const tbody = document.getElementById('categories-table-body');
        if (!tbody) return;

        if (!categories.length) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">لا توجد أقسام</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(cat => {
            const subs = cat.subs || [];
            
            return `
                <tr>
                    <td>
                        <strong>${cat.name_ar}</strong>
                        ${cat.name_en ? `<br><small style="color: var(--text-muted);">${cat.name_en}</small>` : ''}
                    </td>
                    <td><code style="background: var(--bg-body); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${cat.id}</code></td>
                    <td>
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: var(--primary-soft); border-radius: 8px; color: var(--primary);">
                            <i data-lucide="${cat.icon || 'folder'}" style="width: 18px; height: 18px;"></i>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                            ${subs.map(sub => `
                                <span class="subcategories-badge" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: var(--bg-body); border-radius: 4px; border: 1px solid var(--border); font-size: 12px;">
                                    <span>${sub.name_ar}</span>
                                    <i onclick="deleteSubCategory('${sub.id}')" data-lucide="x" style="width: 12px; height: 12px; cursor: pointer; opacity: 0.5;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.5"></i>
                                </span>
                            `).join('')}
                            ${subs.length === 0 ? '<span style="color: var(--text-muted); font-size: 12px;">-</span>' : ''}
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <a href="categories-form.html?id=${cat.id}" class="btn btn-outline btn-icon" title="تعديل">
                                <i data-lucide="edit-2" style="width: 18px; height: 18px;"></i>
                            </a>
                            <button class="btn btn-danger btn-icon" onclick="deleteCategory('${cat.id}')" title="حذف">
                                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterCategories: function() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        const term = searchInput.value.toLowerCase();
        const filtered = this.allCategories.filter(cat => 
            (cat.name_ar && cat.name_ar.toLowerCase().includes(term)) ||
            (cat.name_en && cat.name_en.toLowerCase().includes(term)) ||
            (cat.id && cat.id.toLowerCase().includes(term))
        );
        this.renderCategories(filtered);
    },

    toggleView: function(mode) {
        this.viewMode = mode;
        this.renderCategories(this.allCategories); // Re-render with current data

        // Update Buttons Active State
        document.getElementById('view-list-btn').classList.toggle('active', mode === 'list');
        document.getElementById('view-grid-btn').classList.toggle('active', mode === 'grid');
        
        // Ensure Grid View uses correct CSS
        const gridView = document.getElementById('categories-grid-view');
        if (mode === 'grid' && gridView) {
            if (typeof lucide !== 'undefined') lucide.createIcons({ root: gridView }); 
        }
    },

    // Subcategory Modal Logic
    openSubModal: function() {
        const modal = document.getElementById('subcategory-modal');
        const select = document.getElementById('sub-parent-select');
        const form = document.getElementById('subcategory-form');

        if (!modal || !select) return;

        // Populate Parent Dropdown
        select.innerHTML = '<option value="">اختر القسم الرئيسي...</option>';
        this.allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name_ar;
            select.appendChild(option);
        });

        if (form) form.reset();
        modal.classList.add('active');
    },

    closeSubModal: function() {
        const modal = document.getElementById('subcategory-modal');
        if (modal) modal.classList.remove('active');
    },

    handleSaveSubcategory: async function(e) {
        e.preventDefault();
        const submitBtn = document.querySelector('#subcategory-form button[type="submit"]');
        
        const formData = {
            main_cat_id: document.getElementById('sub-parent-select').value,
            id: document.getElementById('sub-id').value.trim(),
            name_ar: document.getElementById('sub-name').value.trim()
        };

        if (!formData.main_cat_id || !formData.id || !formData.name_ar) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'جاري الحفظ...';
            }

            await CategoriesService.createSub(formData);
            await this.loadCategories();
            this.closeSubModal();
            if (typeof Toast !== 'undefined') Toast.success('تم إضافة القسم الفرعي بنجاح');
            
        } catch (error) {
            console.error(error);
            alert('خطأ: ' + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="plus"></i> إضافة القسم الفرعي';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    },

    deleteCategory: async function(catId) {
        if (!confirm('⚠️ هل أنت متأكد من حذف هذا القسم؟\nسيتم حذف جميع محتوياته!')) return;
        
        try {
            await CategoriesService.delete(catId);
            await this.loadCategories();
            if (typeof Toast !== 'undefined') Toast.success('تم الحذف بنجاح');
        } catch (error) {
            alert('خطأ: ' + error.message);
        }
    },

    deleteSubCategory: async function(subId) {
        if (!confirm('هل أنت متأكد من حذف هذا القسم الفرعي؟')) return;

        try {
            await CategoriesService.deleteSub(subId);
            await this.loadCategories();
            if (typeof Toast !== 'undefined') Toast.success('تم حذف القسم الفرعي');
        } catch (error) {
            alert('خطأ: ' + error.message);
        }
    }
};

// Expose Globals
window.toggleView = (mode) => CategoriesListController.toggleView(mode);
window.openSubModal = () => CategoriesListController.openSubModal();
window.closeSubModal = () => CategoriesListController.closeSubModal();
window.deleteCategory = (id) => CategoriesListController.deleteCategory(id);
window.deleteSubCategory = (id) => CategoriesListController.deleteSubCategory(id);

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CategoriesListController.init());
} else {
    CategoriesListController.init();
}

// Subcategory Global Handlers
window.handleSubNameTranslation = async function() {
    const arName = document.getElementById('sub-name').value;
    const enNameInput = document.getElementById('sub-name-en');
    const enGroup = document.getElementById('group_sub_name_en');
    
    if (arName && !enNameInput.value) {
        try {
            const translated = await window.TranslationService.translateArToEn(arName);
            if (translated) {
                enNameInput.value = translated;
                enGroup.style.display = 'block';
            }
        } catch (e) {
            console.error("Translation error", e);
        }
    }
};

window.toggleSubEnField = function() {
    const el = document.getElementById('group_sub_name_en');
    if (el) {
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }
};

window.generateSubIdFromEn = function() {
    const enName = document.getElementById('sub-name-en').value;
    const idInput = document.getElementById('sub-id');
    
    if (enName && !idInput.value) {
        const id = enName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        idInput.value = id;
    } else if (!enName) {
        window.Toast.warning('يرجى كتابة الاسم بالإنجليزي أولاً');
    }
};

// Add listener to sub-name input
document.addEventListener('DOMContentLoaded', () => {
    const subNameInput = document.getElementById('sub-name');
    if (subNameInput) {
        subNameInput.addEventListener('blur', window.handleSubNameTranslation);
    }
});
