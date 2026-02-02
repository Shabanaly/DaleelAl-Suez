/**
 * @file: src/presentation/features/events/events-view.js
 * @layer: Presentation Layer
 * @responsibility: Render Events UI (List & Form).
 */

const EventsView = {
    
    renderList(events) {
        if (!events || events.length === 0) {
            return `
                <div class="card mb-4">
                    <div class="page-header mb-0 flex-between">
                        <div>
                            <h2 class="page-title">إدارة الفعاليات (Events)</h2>
                            <p class="text-muted">نشر الأحداث والمناسبات في المدينة</p>
                        </div>
                        <div class="flex-center">
                            <button onclick="EventsController.loadForm()" class="btn btn-primary">
                                <i data-lucide="plus"></i> إضافة فعالية
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="text-center p-5">
                    <div class="mb-3">
                        <div style="width:80px; height:80px; background:var(--bg-body); border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
                            <i data-lucide="calendar" style="width:40px; height:40px; color:var(--text-muted);"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-2">لا توجد فعاليات حالياً</h3>
                    <p class="text-muted mb-4">أضف فعاليات جديدة لإعلام المستخدمين بما يحدث في السويس.</p>
                </div>
            `;
        }

        return `
            <div class="card mb-4">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">إدارة الفعاليات (Events)</h2>
                        <p class="text-muted">نشر الأحداث والمناسبات في المدينة</p>
                    </div>
                    <div class="flex-center">
                        <button onclick="EventsController.loadForm()" class="btn btn-primary">
                            <i data-lucide="plus"></i> إضافة فعالية
                        </button>
                    </div>
                </div>
            </div>

            <div class="card overflow-hidden">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 70px;">الصورة</th>
                                <th>اسم الفعالية</th>
                                <th>التاريخ</th>
                                <th>الموقع</th>
                                <th>النوع</th>
                                <th class="text-end">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${events.map(event => this._renderRow(event)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    _renderRow(event) {
        const startDate = new Date(event.start_time).toLocaleDateString('ar-EG');
        const endDate = event.end_time ? new Date(event.end_time).toLocaleDateString('ar-EG') : null;
        const dateStr = endDate ? `${startDate} - ${endDate}` : startDate;
        
        const typeBadge = event.type === 'offer' 
            ? '<span class="badge bg-warning-subtle text-warning">عروض</span>'
            : '<span class="badge bg-primary-subtle text-primary">عام</span>';

        return `
            <tr>
                <td>
                    <img src="${event.image_url || 'assets/images/placeholder.png'}" 
                         style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border);">
                </td>
                <td>
                    <span class="fw-bold d-block text-truncate" style="max-width: 200px;">${event.title}</span>
                </td>
                <td class="text-muted fs-13">
                    <div class="d-flex align-items-center gap-1">
                        <i data-lucide="calendar" style="width: 14px;"></i> ${dateStr}
                    </div>
                </td>
                <td class="text-truncate" style="max-width: 150px;">
                    ${event.location_name || '-'}
                </td>
                <td>${typeBadge}</td>
                <td>
                    <div class="actions">
                        <button class="btn-soft-primary" 
                                onclick="EventsController.loadForm('${event.id}')" 
                                title="تعديل">
                            <i data-lucide="edit-3" style="width: 16px;"></i>
                        </button>
                        <button class="btn-soft-danger" 
                                onclick="EventsController.delete('${event.id}')" 
                                title="حذف">
                            <i data-lucide="trash-2" style="width: 16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderForm(event = {}) {
        const isEdit = !!event.id;
        const startDateVal = event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '';
        const endDateVal = event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '';

        return `
            <!-- Header Card -->
            <div class="card mb-3">
                <div class="page-header mb-0 flex-between">
                    <div class="d-flex align-items-center gap-3">
                        <button onclick="EventsController.loadList()" class="btn-icon">
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <div>
                            <h2 class="page-title mb-0">${isEdit ? 'تعديل فعالية' : 'إضافة فعالية جديدة'}</h2>
                            <p class="text-muted fs-13 mb-0">${isEdit ? 'تحديث بيانات الفعالية الحالية' : 'نشر حدث أو عرض جديد في الدليل'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card form-card">
                <form onsubmit="EventsController.save(event)">
                    <input type="hidden" name="id" value="${event.id || ''}">
                    <input type="hidden" name="existing_image" value="${event.image_url || ''}">

                    <div class="form-group mb-4">
                        <label class="form-label">عنوان الفعالية *</label>
                        <input type="text" name="title" class="form-control" required value="${event.title || ''}" placeholder="مثال: مهرجان السويس السينمائي">
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">تاريخ البدء *</label>
                            <input type="datetime-local" name="start_time" class="form-control" required value="${startDateVal}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">تاريخ الانتهاء</label>
                            <input type="datetime-local" name="end_time" class="form-control" value="${endDateVal}">
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">اسم المكان / الموقع</label>
                            <input type="text" name="location_name" class="form-control" value="${event.location_name || ''}" placeholder="مثال: كورنيش السويس الجديد">
                        </div>
                        <div class="form-group">
                            <label class="form-label">نوع الفعالية</label>
                            <select name="type" class="form-control">
                                <option value="general" ${event.type === 'general' ? 'selected' : ''}>فعالية عامة (General)</option>
                                <option value="offer" ${event.type === 'offer' ? 'selected' : ''}>عرض ترويجي (Offer)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group mb-4">
                        <label class="form-label">الوصف</label>
                        <textarea name="description" class="form-control" rows="4" placeholder="تفاصيل الفعالية (اختياري)">${event.description || ''}</textarea>
                    </div>

                    <div class="form-group mb-4">
                        <label class="form-label">صورة الفعالية</label>
                        <div class="image-upload-box text-center p-3 border rounded border-dashed" 
                             onclick="document.getElementById('event-image').click()"
                             style="cursor: pointer; background: var(--bg-body); min-height: 180px;">
                            
                            <input type="file" id="event-image" name="image" hidden accept="image/*" onchange="EventsView.previewImage(this)">
                            
                            <div id="image-preview">
                                ${event.image_url ? 
                                    `<img src="${event.image_url}" style="max-height: 200px; display: block; margin: 0 auto;" class="rounded shadow-sm mb-2">` : 
                                    `<div class="text-center text-muted p-4">
                                        <i data-lucide="image" class="mb-2" style="width: 32px; height: 32px;"></i>
                                        <p class="fs-13 mb-0">اضغط لرفع صورة العرض</p>
                                    </div>`
                                }
                            </div>
                        </div>
                    </div>

                    <div class="form-actions mt-4 pt-4 border-top">
                        <button type="submit" class="btn btn-primary" id="save-btn">
                            <i data-lucide="save"></i> ${isEdit ? 'حفظ التعديلات' : 'نشر الفعالية'}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('image-preview').innerHTML = `
                    <img src="${e.target.result}" style="max-height: 200px; display: block; margin: 0 auto;" class="rounded shadow-sm">
                `;
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
};

window.EventsView = EventsView;
