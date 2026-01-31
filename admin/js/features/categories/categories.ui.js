/**
 * Categories UI Renderer
 * Handles HTML generation for Categories management.
 */
const CategoriesUI = {
    renderList: (categories) => {
        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">إدارة الأقسام</h2>
                    <p class="text-muted">إدارة التصنيفات الرئيسية والفرعية</p>
                </div>
                <button onclick="CategoriesController.openModal()" class="btn btn-primary">
                    <i data-lucide="plus"></i> إضافة قسم جديد
                </button>
            </div>

            <div class="card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>الأيقونة</th>
                            <th>الاسم بالعربية</th>
                            <th>الاسم بالإنجليزية</th>
                            <th>الأقسام الفرعية</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categories.length ? categories.map(c => CategoriesUI._renderRow(c)).join('') : 
                        `<tr><td colspan="5" class="text-center">لا توجد أقسام</td></tr>`}
                    </tbody>
                </table>
            </div>

            <!-- Modal Container (Hidden by default) -->
            <div id="category-modal" class="modal-backdrop" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title">إضافة قسم</h3>
                        <button onclick="CategoriesController.closeModal()" class="btn-icon"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="modal-body">
                        <!-- Form Rendered Here -->
                    </div>
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
                    <button class="btn-sm btn-outline" onclick="window.location.hash='#/subcategories?parent=${cat.id}'">
                        عرض الأقسام الفرعية
                    </button>
                </td>
                <td>
                    <div class="actions">
                        <button onclick="CategoriesController.edit('${cat.id}')" class="btn-icon">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button onclick="CategoriesController.delete('${cat.id}')" class="btn-icon text-danger">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderForm: (cat = {}) => {
        const isEdit = !!cat.id;
        return `
            <form onsubmit="CategoriesController.save(event)">
                <input type="hidden" name="old_id" value="${cat.id || ''}">
                
                <div class="form-group">
                    <label class="form-label">معرف القسم (ID) *</label>
                    <input name="id" class="form-control" required value="${cat.id || ''}" ${isEdit ? 'readonly' : ''} placeholder="Ex: restaurants">
                    ${isEdit ? '<small class="text-muted">لا يمكن تغيير المعرف بعد الإنشاء</small>' : ''}
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">الاسم بالعربية *</label>
                        <input name="name_ar" class="form-control" required value="${cat.name_ar || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">الاسم بالإنجليزية</label>
                        <input name="name_en" class="form-control" value="${cat.name_en || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">الأيقونة (Lucide Icon Name)</label>
                    <input name="icon" class="form-control" value="${cat.icon || 'folder'}" placeholder="Ex: utentils, car, home...">
                    <small><a href="https://lucide.dev/icons" target="_blank">تصفح الأيقونات</a></small>
                </div>

                <div class="form-actions inverted">
                    <button type="button" onclick="CategoriesController.closeModal()" class="btn btn-secondary">إلغاء</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ التعديلات' : 'إنشاء القسم'}</button>
                </div>
            </form>
        `;
    }
};

window.CategoriesUI = CategoriesUI;
