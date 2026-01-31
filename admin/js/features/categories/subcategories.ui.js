/**
 * SubCategories UI Renderer
 */
const SubCategoriesUI = {
    renderList: (parentId, mainCategoryName, subcategories) => {
        return `
            <div class="page-header">
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <a href="#/categories" class="text-muted text-decoration-none">الأقسام</a>
                        <i data-lucide="chevron-left" style="width:16px; color:#9ca3af;"></i>
                        <h2 class="page-title m-0">${mainCategoryName}</h2>
                    </div>
                    <p class="text-muted mt-1">إدارة الأقسام الفرعية التابعة لهذا القسم</p>
                </div>
                <button onclick="SubCategoriesController.openModal()" class="btn btn-primary">
                    <i data-lucide="plus"></i> إضافة قسم فرعي
                </button>
            </div>

            <div class="card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>الاسم بالعربية</th>
                            <th>الاسم بالإنجليزية</th>
                            <th>عدد الأماكن</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subcategories.length ? subcategories.map(s => SubCategoriesUI._renderRow(s)).join('') : 
                        `<tr><td colspan="4" class="text-center">لا توجد أقسام فرعية</td></tr>`}
                    </tbody>
                </table>
            </div>

            <div id="subcat-modal" class="modal-backdrop" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="submodal-title">إضافة قسم فرعي</h3>
                        <button onclick="SubCategoriesController.closeModal()" class="btn-icon"><i data-lucide="x"></i></button>
                    </div>
                    <div class="modal-body" id="submodal-body"></div>
                </div>
            </div>
        `;
    },

    _renderRow: (sub) => {
        return `
            <tr>
                <td class="fw-bold">${sub.name_ar}</td>
                <td>${sub.name_en || '-'}</td>
                <td><span class="badge badge-secondary">0</span></td> <!-- Placeholder for count -->
                <td>
                    <div class="actions">
                        <button onclick="SubCategoriesController.edit('${sub.id}')" class="btn-icon">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button onclick="SubCategoriesController.delete('${sub.id}')" class="btn-icon text-danger">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderForm: (sub = {}, parentId) => {
        const isEdit = !!sub.id;
        return `
            <form onsubmit="SubCategoriesController.save(event)">
                <input type="hidden" name="old_id" value="${sub.id || ''}">
                <input type="hidden" name="parent_id" value="${parentId}">
                
                <div class="form-group">
                    <label class="form-label">معرف القسم الفرعي (ID) *</label>
                    <input name="id" class="form-control" required value="${sub.id || ''}" ${isEdit ? 'readonly' : ''} placeholder="Ex: burger">
                </div>

                <div class="form-group">
                    <label class="form-label">الاسم بالعربية *</label>
                    <input name="name_ar" class="form-control" required value="${sub.name_ar || ''}">
                </div>

                <div class="form-group">
                    <label class="form-label">الاسم بالإنجليزية</label>
                    <input name="name_en" class="form-control" value="${sub.name_en || ''}">
                </div>

                <div class="form-actions inverted">
                    <button type="button" onclick="SubCategoriesController.closeModal()" class="btn btn-secondary">إلغاء</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ التعديلات' : 'إضافة'}</button>
                </div>
            </form>
        `;
    }
};

window.SubCategoriesUI = SubCategoriesUI;
