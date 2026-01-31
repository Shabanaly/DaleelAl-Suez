/**
 * Places Controller
 * Glue between PlacesService (Data) and PlacesUI (View).
 */
const PlacesController = {
    init: async (container) => {
        // Default View: List
        await PlacesController.loadList(container);
    },

    loadList: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        try {
            const places = await PlacesService.getAll();
            container.innerHTML = PlacesUI.renderList(places);
            lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل الأماكن</p>';
        }
    },

    loadForm: async (container, params = {}) => {
        container.innerHTML = '<div class="spinner"></div>';
        let place = {};
        
        try {
            // Load Categories for Select
            const categories = await CategoriesService.getAll();
            
            // If Edit Mode
            if (params.id) {
                place = await PlacesService.getById(params.id);
            }

            container.innerHTML = PlacesUI.renderForm(place);
            lucide.createIcons();

            // Populate Categories Select
            const mainSelect = document.getElementById('p_main_cat');
            if (mainSelect) {
                mainSelect.innerHTML = '<option value="">اختر...</option>' + 
                    categories.map(c => `<option value="${c.id}" ${place.main_cat_id === c.id ? 'selected' : ''}>${c.name_ar}</option>`).join('');
                
                // If editing, trigger subcat load
                if (place.main_cat_id) {
                    await PlacesController.loadSubCats(place.main_cat_id, place.sub_cat_id);
                }
            }

        } catch (e) {
            console.error(e);
            container.innerHTML = `<p class="text-danger">Error: ${e.message}</p>`;
        }
    },

    loadSubCats: async (mainId, selectedId = null) => {
        const subSelect = document.getElementById('p_sub_cat');
        if (!subSelect) return;
        
        subSelect.innerHTML = '<option>جاري التحميل...</option>';
        try {
            const subs = await CategoriesService.getSubs(mainId);
            subSelect.innerHTML = '<option value="">اختر...</option>' + 
                subs.map(s => `<option value="${s.id}" ${selectedId === s.id ? 'selected' : ''}>${s.name_ar}</option>`).join('');
        } catch (e) {
            subSelect.innerHTML = '<option>فشل التحميل</option>';
        }
    },

    save: async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle Checkboxes/Special fields manually if needed
        // (Form inputs match schema names roughly)

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'جاري الحفظ...';

        try {
            if (data.id) {
                await PlacesService.update(data.id, data);
                if (typeof Toast !== 'undefined') Toast.success("تم التعديل بنجاح");
                else alert("تم التعديل بنجاح");
            } else {
                delete data.id; // Remove empty ID
                await PlacesService.create(data);
                if (typeof Toast !== 'undefined') Toast.success("تم الإضافة بنجاح");
                else alert("تم الإضافة بنجاح");
            }
            window.location.hash = '#/places';
        } catch (e) {
            alert("خطأ: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },

    delete: async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await PlacesService.delete(id);
            // Refresh List
            const container = document.getElementById('app-content');
            PlacesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    },

    autoTranslate: async (sourceId, targetId) => {
        // Note: In UI we passed 'name_ar' as string name, but to get value we need selector
        // We can check if element exists by Name or ID. 
        // In UI I used `name="name_ar"` and sometimes `id="name_en"`.
        // Let's refine logic based on arguments.
        
        // Actually, the UI calls: autoTranslate('name_ar', 'name_en')
        // We get elements by Name attribute for simplicity
        const sourceEl = document.querySelector(`[name="${sourceId}"]`);
        const targetEl = document.querySelector(`[name="${targetId}"]`) || document.getElementById(targetId);
        
        if (sourceEl && targetEl && sourceEl.value && !targetEl.value) {
            try {
                // Assuming TranslationService is globally available
                if (typeof TranslationService !== 'undefined') {
                    targetEl.value = 'جاري الترجمة...';
                    const text = await TranslationService.translateArToEn(sourceEl.value);
                    targetEl.value = text || '';
                }
            } catch (e) {
                targetEl.value = '';
            }
        }
    }
};

window.PlacesController = PlacesController;
