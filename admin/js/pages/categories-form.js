
/**
 * Categories Form Controller
 * Handles create/update logic for Main Categories
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Components
    if (typeof Sidebar !== 'undefined') document.getElementById('sidebar-container').innerHTML = Sidebar.render('categories');
    if (typeof Topbar !== 'undefined') document.getElementById('topbar-container').innerHTML = Topbar.render('الأقسام');

    // Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const form = document.getElementById('category-form');
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    // Load data if editing
    if (editId) {
        document.getElementById('form-title').innerHTML = '<i data-lucide="edit"></i> تعديل قسم';
        document.getElementById('c_old_id').value = editId;
        // Disable ID editing in edit mode to prevent breaking relations
        const idInput = document.getElementById('c_id');
        idInput.disabled = true;
        idInput.title = "لا يمكن تعديل المعرف لارتباطه بأماكن وأقسام فرعية";
        
        await loadCategoryData(editId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Handle Submit
    form.addEventListener('submit', handleSave);
});

// Translation & UI Helpers
window.handleCatNameTranslation = async function() {
    const arName = document.getElementById('c_name_ar').value;
    const enNameInput = document.getElementById('c_name_en');
    const enGroup = document.getElementById('group_name_en');
    
    if (arName && !enNameInput.value) {
        try {
            const translated = await window.TranslationService.translateArToEn(arName);
            if (translated) {
                enNameInput.value = translated;
                enGroup.style.display = 'block'; // Auto reveal
            }
        } catch (e) {
            console.error("Translation error", e);
        }
    }
};

window.toggleEnField = function(type) {
    const id = `group_${type}_en`;
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }
};

window.generateIdFromEn = function() {
    const enName = document.getElementById('c_name_en').value;
    const idInput = document.getElementById('c_id');
    
    if (enName && !idInput.value) {
        const id = enName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
            .replace(/^-+|-+$/g, '');   // Trim hyphens
        idInput.value = id;
    } else if (!enName) {
        window.Toast.warning('يرجى كتابة الاسم بالإنجليزي أولاً');
    }
};


/**
 * Load existing category data
 * @param {string} id 
 */
async function loadCategoryData(id) {
    try {
        window.UIUtils.setLoading(true); // Assuming global UI utils has this or we simulate it
        
        // We can use getAll and find, or if specific getById exists.
        // CategoriesService.getAll() returns list with subs.
        // Ideally we should have getById. But getAll is fine for now (cached/small list).
        const categories = await window.CategoriesService.getAll();
        const category = categories.find(c => c.id === id);

        if (!category) {
            window.Toast.error('القسم غير موجود');
            setTimeout(() => window.location.href = 'categories.html', 2000);
            return;
        }

        // Populate Form
        document.getElementById('c_name_ar').value = category.name_ar || '';
        document.getElementById('c_name_en').value = category.name_en || '';
        
        // Handle English field visibility
        if (category.name_en) {
            document.getElementById('group_name_en').style.display = 'block';
        }
        
        document.getElementById('c_id').value = category.id || '';
        document.getElementById('c_icon').value = category.icon || '';

    } catch (error) {
        console.error(error);
        window.Toast.error('خطأ في تحميل البيانات');
    } finally {
        window.UIUtils.setLoading(false);
    }
}

/**
 * Handle Form Save
 * @param {Event} e 
 */
async function handleSave(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('save-btn');
    const oldId = document.getElementById('c_old_id').value;
    const isEdit = !!oldId;

    const formData = {
        id: document.getElementById('c_id').value.trim(),
        name_ar: document.getElementById('c_name_ar').value.trim(),
        name_en: document.getElementById('c_name_en').value.trim() || null,
        icon: document.getElementById('c_icon').value.trim() || 'folder'
    };

    if (!formData.id || !formData.name_ar) {
        window.Toast.warning('يرجى ملء الحقول الإجبارية');
        return;
    }

    try {
        window.UIUtils.setButtonLoading(submitBtn, true);

        if (isEdit) {
            // Update
            // We pass oldId in case ID was changeable (but we disabled it).
            // Logic: update(id, data). 
            // Note: If we allowed ID change, we'd need a backend function to update FKs.
            // For now, ID is consistent.
            
            await window.CategoriesService.update(oldId, {
                name_ar: formData.name_ar,
                name_en: formData.name_en,
                icon: formData.icon
            });
            
            window.Toast.success('تم تحديث القسم بنجاح');
        } else {
            // Create
            await window.CategoriesService.create(formData);
            window.Toast.success('تم إضافة القسم بنجاح');
        }

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'categories-list.html';
        }, 1500);

    } catch (error) {
        console.error(error);
        window.Toast.error('حدث خطأ: ' + (error.message || 'فشل الحفظ'));
        window.UIUtils.setButtonLoading(submitBtn, false);
    }
}
