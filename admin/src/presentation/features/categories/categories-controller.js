/**
 * @file: admin/src/presentation/features/categories/categories-controller.js
 * @layer: Presentation Layer
 * @responsibility: Categories SPA Controller.
 */

const CategoriesController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        await CategoriesController.loadList(container);
    },

    loadList: async (container) => {
        try {
            const categories = await window.AppCategoryService.getAllCategories();
            container.innerHTML = CategoriesView.renderList(categories);
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل الأقسام</p>';
        }
    },

    loadForm: async (catId = null) => {
        const container = document.getElementById('app-content');
        container.innerHTML = '<div class="spinner"></div>';

        let cat = {};
        if (catId) {
            const all = await window.AppCategoryService.getAllCategories();
            cat = all.find(c => c.id === catId) || {};
        }

        container.innerHTML = CategoriesView.renderForm(cat);
        if (window.lucide) window.lucide.createIcons();
    },

    save: async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const isEdit = !!data.old_id; // old_id hidden field in view

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'جاري الحفظ...';

        try {
            if (isEdit) {
                // name_ar, name_en are mapped in Service from data
                await window.AppCategoryService.updateCategory(data.old_id, data.name_ar, data.name_en);
                if (typeof Toast !== 'undefined') window.Toast.success("تم التعديل");
                else alert("تم التعديل بنجاح");
            } else {
                // Auto-generate ID from English name if not provided (for Create)
                let id = data.id;
                if (!id && data.name_en) {
                    id = data.name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                }
                
                await window.AppCategoryService.createCategory(data.name_ar, data.name_en, id);
                if (typeof Toast !== 'undefined') window.Toast.success("تم الإضافة");
                else alert("تم الإضافة بنجاح");
            }
            
            const container = document.getElementById('app-content');
            await CategoriesController.loadList(container);

        } catch (e) {
            alert("خطأ: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },


    delete: async (id) => {
        if (!confirm(`هل أنت متأكد من حذف القسم (${id})؟ قد يؤثر هذا على الأماكن المرتبطة به.`)) return;
        
        try {
            await window.AppCategoryService.deleteCategory(id);
            if (typeof Toast !== 'undefined') window.Toast.success("تم الحذف");
            // Refresh
            const container = document.getElementById('app-content');
            await CategoriesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    },

    autoTranslate: async (sourceEl, targetEl) => {
        if (!sourceEl || !sourceEl.value || !targetEl) return;
        
        // Don't overwrite if target has value already (unless it was auto-filled? No, safer to respect user input)
        if (targetEl.value && targetEl.value.trim() !== '') return;

        try {
            targetEl.setAttribute('placeholder', 'جاري الترجمة...');
            const translated = await window.TranslationService.translateArToEn(sourceEl.value);
            if (translated) {
                // Return Title Case (First letter of each word capitalized)
                targetEl.value = translated
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
        } catch (e) {
            console.error("Translation failed:", e);
        } finally {
            targetEl.setAttribute('placeholder', 'Ex: restaurants');
        }
    }
};

window.CategoriesController = CategoriesController;
