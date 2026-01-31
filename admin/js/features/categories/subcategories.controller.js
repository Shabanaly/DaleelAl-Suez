/**
 * SubCategories Controller
 */
const SubCategoriesController = {
    currentParentId: null,

    init: async (container, params = {}) => {
        if (!params.parent) {
            container.innerHTML = '<p class="text-danger">مطلوب معرف القسم الرئيسي (parent id)</p>';
            return;
        }

        SubCategoriesController.currentParentId = params.parent;
        container.innerHTML = '<div class="spinner"></div>';
        await SubCategoriesController.loadList(container);
    },

    loadList: async (container) => {
        try {
            const parentId = SubCategoriesController.currentParentId;
            
            // Get Parent Info (for Title)
            // Assuming we can fetch single, or find in all
            const allCats = await CategoriesService.getAll();
            const parent = allCats.find(c => c.id === parentId);

            if (!parent) {
                container.innerHTML = '<p class="text-danger">القسم الرئيسي غير موجود</p>';
                return;
            }

            // Get Subcategories
            const subs = await CategoriesService.getSubs(parentId);

            container.innerHTML = SubCategoriesUI.renderList(parentId, parent.name_ar, subs);
            lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل البيانات</p>';
        }
    },

    openModal: async (subId = null) => {
        const modal = document.getElementById('subcat-modal');
        const title = document.getElementById('submodal-title');
        const body = document.getElementById('submodal-body');
        
        if (!modal) return;

        let sub = {};
        if (subId) {
            const subs = await CategoriesService.getSubs(SubCategoriesController.currentParentId);
            sub = subs.find(s => s.id === subId) || {};
            title.innerText = 'تعديل قسم فرعي';
        } else {
            title.innerText = 'إضافة قسم فرعي جديد';
        }

        body.innerHTML = SubCategoriesUI.renderForm(sub, SubCategoriesController.currentParentId);
        modal.style.display = 'flex';
        const input = body.querySelector('input');
        if(input) input.focus();
    },

    closeModal: () => {
        const modal = document.getElementById('subcat-modal');
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
            if (isEdit) {
                await CategoriesService.updateSub(data.parent_id, data.old_id, data);
                 if (typeof Toast !== 'undefined') Toast.success("تم التعديل");
                else alert("تم التعديل بنجاح");
            } else {
                await CategoriesService.createSub(data.parent_id, data);
                 if (typeof Toast !== 'undefined') Toast.success("تم الإضافة");
                else alert("تم الإضافة بنجاح");
            }
            
            SubCategoriesController.closeModal();
            const container = document.getElementById('app-content');
            await SubCategoriesController.loadList(container);

        } catch (e) {
            alert("خطأ: " + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },

    edit: (id) => {
        SubCategoriesController.openModal(id);
    },

    delete: async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await CategoriesService.deleteSub(SubCategoriesController.currentParentId, id);
            // Refresh
            const container = document.getElementById('app-content');
            await SubCategoriesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    }
};

window.SubCategoriesController = SubCategoriesController;
