/**
 * Places UI Renderer
 * Purely handles HTML generation. No business logic.
 */
const PlacesUI = {
    renderList: (places) => {
        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">إدارة الأماكن</h2>
                    <p class="text-muted">عرض وإدارة جميع الأماكن في الدليل</p>
                </div>
                <a href="#/places/add" class="btn btn-primary">
                    <i data-lucide="plus"></i> إضافة مكان
                </a>
            </div>

            <div class="card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>المكان</th>
                            <th>القسم</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${places.length ? places.map(p => PlacesUI._renderRow(p)).join('') : 
                        `<tr><td colspan="4" class="text-center">لا توجد أماكن</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;
    },

    _renderRow: (place) => {
        const image = place.image_url || 'https://via.placeholder.com/40';
        const statusClass = place.is_active ? 'badge-success' : 'badge-danger';
        const statusText = place.is_active ? 'مفعل' : 'مغلق';

        return `
            <tr>
                <td>
                    <div class="flex-center">
                        <img src="${image}" class="table-img">
                        <div>
                            <div class="fw-bold">${place.name_ar}</div>
                            <small class="text-muted">${place.address_ar || place.address || '-'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge">${place.sub_cat_id || '-'}</span></td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="actions">
                        <a href="#/places/edit?id=${place.id}" class="btn-icon" title="تعديل">
                            <i data-lucide="edit-2"></i>
                        </a>
                        <button onclick="PlacesController.delete('${place.id}')" class="btn-icon text-danger" title="حذف">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderForm: (place = {}) => {
        const isEdit = !!place.id;
        
        return `
            <div class="page-header">
                <a href="#/places" class="btn-icon"><i data-lucide="arrow-right"></i></a>
                <h2 class="page-title">${isEdit ? 'تعديل مكان' : 'إضافة مكان جديد'}</h2>
            </div>

            <div class="card form-card">
                <form id="places-form" onsubmit="PlacesController.save(event)">
                    <input type="hidden" name="id" value="${place.id || ''}">
                    
                     <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">الاسم بالعربية *</label>
                            <input name="name_ar" class="form-control" required value="${place.name_ar || ''}" 
                                   onblur="PlacesController.autoTranslate('name_ar', 'name_en')">
                        </div>
                        <div class="form-group">
                             <label class="form-label">الاسم بالإنجليزية</label>
                             <input name="name_en" id="name_en" class="form-control" value="${place.name_en || ''}">
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">القسم الرئيسي *</label>
                            <select name="main_cat_id" id="p_main_cat" class="form-control" required onchange="PlacesController.loadSubCats(this.value)">
                                <option value="">اختر...</option>
                                <!-- Populated by Controller -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">القسم الفرعي *</label>
                            <select name="sub_cat_id" id="p_sub_cat" class="form-control" required>
                                <option value="">اختر القسم الرئيسي أولاً</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid-2">
                         <div class="form-group">
                            <label class="form-label">العنوان (عربي)</label>
                            <input name="address_ar" class="form-control" value="${place.address_ar || ''}"
                                   onblur="PlacesController.autoTranslate('address_ar', 'address_en')">
                        </div>
                        <div class="form-group">
                             <label class="form-label">العنوان (إنجليزي)</label>
                             <input name="address_en" id="address_en" class="form-control" value="${place.address_en || ''}">
                        </div>
                    </div>

                    <!-- Additional Fields -->
                    <div class="grid-3">
                         <div class="form-group">
                            <label class="form-label">الهاتف</label>
                            <input name="phone" class="form-control" value="${place.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">واتساب</label>
                            <input name="whatsapp" class="form-control" value="${place.whatsapp || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">ساعات العمل</label>
                            <input name="working_hours" class="form-control" placeholder="9:00 AM - 10:00 PM" value="${place.working_hours || ''}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">الوصف</label>
                        <textarea name="desc_ar" class="form-control" rows="3">${place.desc_ar || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">رابط الصورة الرئيسية</label>
                        <input name="image_url" class="form-control" value="${place.image_url || ''}" placeholder="https://...">
                        <small>سنضيف زر رفع الصور لاحقاً (Feature pending logic migration)</small>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i data-lucide="save"></i> حفظ البيانات
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
};

window.PlacesUI = PlacesUI;
