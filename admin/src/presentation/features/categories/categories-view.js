/**
 * Categories UI Renderer
 * Handles HTML generation for Categories management.
 */
const CategoriesView = {
    renderList: (categories) => {
        return `
            <div class="card mb-3">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">إدارة الأقسام</h2>
                        <p class="text-muted">إدارة التصنيفات الرئيسية</p>
                    </div>
                    <div class="flex-center">
                        <button onclick="CategoriesController.loadForm()" class="btn btn-primary">
                            <i data-lucide="plus"></i> إضافة قسم جديد
                        </button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>الأيقونة</th>
                                <th>الاسم بالعربية</th>
                                <th>الاسم بالإنجليزية</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${categories.length ? categories.map(c => {
                                // Hotfix for legacy data with invalid icon 'travel'
                                const iconName = (c.icon === 'travel') ? 'plane' : (c.icon || 'folder');
                                return CategoriesView._renderRow({ ...c, icon: iconName });
                            }).join('') : 
                            `<tr><td colspan="5" class="text-center">لا توجد أقسام</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

        `;
    },

    _renderRow: (cat) => {
        // Count subcategories (assuming 'subcategories' array might be joined via query or we fetch separately)
        // For simplicity, we just list icons or basic info. 
        // Real implementations might need a separate count logic.
        
        return `
            <tr>
                <td><i data-lucide="${cat.icon || 'folder'}" style="color: var(--primary);"></i></td>
                <td class="fw-bold">${cat.name_ar}</td>
                <td>${cat.name_en || '-'}</td>
                <td>
                    <div class="actions">
                        <button onclick="CategoriesController.loadForm('${cat.id}')" class="btn-soft-primary" title="تعديل">
                            <i data-lucide="edit-3" style="width:18px;"></i>
                        </button>
                        <button onclick="CategoriesController.delete('${cat.id}')" class="btn-soft-danger" title="حذف">
                            <i data-lucide="trash-2" style="width:18px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderForm: (cat = {}) => {
        const isEdit = !!cat.id;
        return `
            <div class="card mb-3">
                <div class="page-header mb-0">
                    <div class="d-flex align-items-center gap-3">
                        <button onclick="CategoriesController.loadList(document.getElementById('app-content'))" class="btn-icon">
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <div>
                            <h2 class="page-title mb-0">${isEdit ? 'تعديل قسم' : 'إضافة قسم جديد'}</h2>
                            <p class="text-muted fs-13 mb-0">${isEdit ? 'تعديل بيانات التصنيف الحالي' : 'إنشاء تصنيف رئيسي جديد للأماكن'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <form onsubmit="CategoriesController.save(event)">
                    <input type="hidden" name="old_id" value="${cat.id || ''}">
                    
                    <!-- ID is auto-generated from English Name -->
                    
                    <!-- ID is auto-generated from English Name -->
                    
                    <div>
                        <div class="form-group" style="max-width: 50%; min-width: 300px;">
                            <label class="form-label">الاسم بالعربية *</label>
                            <input name="name_ar" class="form-control" required value="${cat.name_ar || ''}" placeholder="مثال: مطاعم"
                                   onblur="CategoriesController.autoTranslate(this, document.querySelector('[name=name_en]'))">
                        </div>
                        <div class="form-group" style="max-width: 50%; min-width: 300px;">
                            <label class="form-label">الاسم بالإنجليزية</label>
                            <input name="name_en" class="form-control" value="${cat.name_en || ''}" placeholder="Ex: restaurants">
                        </div>
                    </div>

                    <div class="form-group" style="max-width: 50%; min-width: 300px;">
                        <label class="form-label">الأيقونة (Lucide Icon Name)</label>
                        <input name="icon" class="form-control" value="${cat.icon || 'folder'}" placeholder="Ex: utensils, car, home..." style="margin-bottom: 8px;">
                        <a href="https://lucide.dev/icons" target="_blank" class="btn btn-secondary" style="width: 100%; justify-content: center;">
                            <i data-lucide="external-link"></i> تصفح مكتبة الأيقونات
                        </a>
                    </div>

                    <div class="form-actions" style="display: flex; flex-direction: column; gap: 10px; max-width: 50%; min-width: 300px;">
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">${isEdit ? 'حفظ التعديلات' : 'إنشاء القسم'}</button>
                        <button type="button" onclick="CategoriesController.loadList(document.getElementById('app-content'))" class="btn btn-secondary" style="width: 100%; justify-content: center;">إلغاء</button>
                    </div>
                </form>
            </div>
        `;
    }
};

window.CategoriesView = CategoriesView;
