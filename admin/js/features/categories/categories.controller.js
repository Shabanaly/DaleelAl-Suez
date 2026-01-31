/**
 * Categories Controller
 */
const CategoriesController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        await CategoriesController.loadList(container);
    },

    loadList: async (container) => {
        try {
            const categories = await CategoriesService.getAll();
            container.innerHTML = CategoriesUI.renderList(categories);
            lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل الأقسام</p>';
        }
    },

    openModal: async (catId = null) => {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        if (!modal) return;

        let cat = {};
        if (catId) {
            // Fetch single if needed, or find from local list if we stored it?
            // For safety, let's just fetch or assume we have it. 
            // CategoriesService usually syncs all. 
            // We'll refetch all to be safe or efficient?
            // Let's rely on getAll cache usage in service if exists, or just fetch again. 
            // Or simpler: We can pass the object if we had it. 
            // We'll fetch fresh for edit.
            // Actually there is no getById in the common service usually? Let's check.
            // Assuming we can find it from the list logic. 
            const all = await CategoriesService.getAll();
            cat = all.find(c => c.id === catId) || {};
            title.innerText = 'تعديل قسم';
        } else {
            title.innerText = 'إضافة قسم جديد';
        }

        body.innerHTML = CategoriesUI.renderForm(cat);
        modal.style.display = 'flex';
        // Focus first input
        const input = body.querySelector('input');
        if(input) input.focus();
    },

    closeModal: () => {
        const modal = document.getElementById('category-modal');
        if (modal) modal.style.display = 'none';
    },

    save: async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const isEdit = !!data.old_id;

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'جاري الحفظ...';

        try {
            // Note: CategoriesService usually has create/update
            // But common service might vary. Let's assume standard names.
            // Also ID editing is disallowed in update usually.
            
            if (isEdit) {
                // We don't change ID. 'old_id' helps us know which to update if we allowed renaming (danger).
                // But generally prompt uses ID as Key.
                await CategoriesService.update(data.old_id, data);
                if (typeof Toast !== 'undefined') Toast.success("تم التعديل");
                else alert("تم التعديل بنجاح");
            } else {
                await CategoriesService.create(data);
                if (typeof Toast !== 'undefined') Toast.success("تم الإضافة");
                else alert("تم الإضافة بنجاح");
            }
            
            CategoriesController.closeModal();
            // Refresh List
            const container = document.getElementById('app-content');
            await CategoriesController.loadList(container);

        } catch (e) {
            alert("خطأ: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },

    edit: (id) => {
        CategoriesController.openModal(id);
    },

    delete: async (id) => {
        if (!confirm(`هل أنت متأكد من حذف القسم (${id})؟ قد يؤثر هذا على الأماكن المرتبطة به.`)) return;
        
        try {
            await CategoriesService.delete(id);
            if (typeof Toast !== 'undefined') Toast.success("تم الحذف");
            // Refresh
            const container = document.getElementById('app-content');
            await CategoriesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    }
};

window.CategoriesController = CategoriesController;
