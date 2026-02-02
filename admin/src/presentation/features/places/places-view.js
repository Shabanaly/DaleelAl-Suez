/**
 * @file: admin/src/presentation/features/places/places-view.js
 * @layer: Presentation Layer
 * @responsibility: Places UI Renderer.
 */

const PlacesView = {
    renderLayout: (categories = [], initialStat = 0) => {
        return `
            <!-- Header Card -->
            <div class="card mb-3">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">إدارة الأماكن</h2>
                        <p class="text-muted">عرض وإدارة جميع الأماكن في الدليل</p>
                    </div>
                    <div class="flex-center">
                        <a href="#/places/add" class="btn btn-primary">
                            <i data-lucide="plus"></i> إضافة مكان
                        </a>
                    </div>
                </div>
            </div>

            <!-- Enhanced Toolbar -->
            <div class="table-toolbar flex-wrap gap-3 mb-3" style="display:block; padding:0; background:transparent;">
                
                <!-- 1. Top Row: Search & View Toggle -->
                <div style="display:flex; gap: 12px; margin-bottom: 12px; align-items: center;" class="search-flex">
                    <div class="search-container" style="flex:1;">
                        <input type="text" class="form-control form-control-lg" placeholder="ابحث عن مكان (الاسم، العنوان...)" 
                               oninput="PlacesController.handleSearch(this.value)">
                        <i data-lucide="search" class="search-icon-lg"></i>
                    </div>
                </div>

                <!-- 2. Chips Row: Categories -->
                <div class="filter-scroll-container">
                    <div class="filter-chip active" onclick="PlacesController.handleFilterCategory('', this)">الكل</div>
                    ${(categories || []).map(c => `
                        <div class="filter-chip" onclick="PlacesController.handleFilterCategory('${c.id}', this)" data-cat-id="${c.id}">
                            ${c.name_ar}
                        </div>
                    `).join('')}
                </div>

                <!-- 3. Stats & Toggle Row -->
                <div class="flex-between stats-flex" style="align-items: flex-end;">
                    <div class="text-muted fs-13">عدد الأماكن: <span class="fw-bold text-main" id="places-count">${initialStat}</span></div>
                    
                    <div class="view-toggle">
                        <button class="view-btn active" id="btn-view-list" onclick="PlacesController.switchView('list')" title="قائمة"><i data-lucide="list"></i></button>
                        <button class="view-btn" id="btn-view-grid" onclick="PlacesController.switchView('grid')" title="شبكة"><i data-lucide="grid"></i></button>
                    </div>
                </div>
            </div>

            <!-- Content Container -->
            <div id="places-list-container"></div>
        `;
    },

    renderContent: (places, viewMode = 'list') => {
        const isGrid = viewMode === 'grid';
        return isGrid ? PlacesView._renderGrid(places) : PlacesView._renderTable(places);
    },

    _renderTable: (places) => {
        return `
            <div class="card p-0 overflow-hidden">
                <div class="table-responsive">
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
                            ${places.length ? places.map(p => PlacesView._renderRow(p)).join('') : 
                            `<tr><td colspan="4" class="text-center">لا توجد أماكن</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    _renderGrid: (places) => {
        if (!places.length) return '<div class="text-center p-4">لا توجد أماكن</div>';
        return `
            <div class="grid-3">
                ${places.map(p => PlacesView._renderCard(p)).join('')}
            </div>
        `;
    },

    _renderRow: (place) => {
        const image = place.image_url || 'https://placehold.co/40x40?text=IMG';
        
        return `
            <tr>
                <td>
                    <div class="flex-center">
                        <img src="${image}" class="table-img">
                        <div>
                            <div class="fw-bold">${place.name_ar}</div>
                            <small class="text-muted">${place.address_ar || '-'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-neutral">${place.main_cat_id || '-'}</span></td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${place.is_active ? 'checked' : ''} onchange="PlacesController.toggleStatus('${place.id}', this.checked)">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <div class="actions">
                        <a href="#/places/edit?id=${place.id}" class="btn-soft-primary" title="تعديل">
                            <i data-lucide="edit-3" style="width:18px;"></i>
                        </a>
                        <button onclick="PlacesController.delete('${place.id}')" class="btn-soft-danger" title="حذف">
                            <i data-lucide="trash-2" style="width:18px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    _renderCard: (place) => {
         const image = place.image_url || 'https://placehold.co/300x200?text=IMG';
         return `
            <div class="card p-0 overflow-hidden">
                <img src="${image}" style="width:100%; height:160px; object-fit:cover;">
                <div class="p-3">
                    <div class="flex-between mb-2">
                        <h3 class="fw-bold fs-16 mb-0 text-truncate" style="max-width: 150px;">${place.name_ar}</h3>
                        <label class="switch" style="position: relative; z-index: 5;">
                            <input type="checkbox" ${place.is_active ? 'checked' : ''} onchange="PlacesController.toggleStatus('${place.id}', this.checked)">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <p class="text-muted fs-13 mb-3">${place.address_ar || 'بدون عنوان'}</p>
                    <div class="flex-end gap-2">
                         <a href="#/places/edit?id=${place.id}" class="btn-soft-primary" title="تعديل">
                            <i data-lucide="edit-3" style="width:18px;"></i>
                        </a>
                        <button onclick="PlacesController.delete('${place.id}')" class="btn-soft-danger" title="حذف">
                            <i data-lucide="trash-2" style="width:18px;"></i>
                        </button>
                    </div>
                </div>
            </div>
         `;
    },

    renderGallery: (placeId, images = []) => {
        if (!images || !images.length) return '<p class="text-muted fs-13">لا توجد صور إضافية</p>';
        return `
            <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
                ${images.map((imgUrl, index) => `
                    <div class="position-relative" style="aspect-ratio: 1;">
                        <img src="${imgUrl}" class="w-100 h-100 rounded object-cover border">
                        <button type="button" class="btn-icon btn-danger position-absolute top-0 start-0 m-1" 
                                style="width: 24px; height: 24px; padding: 0;"
                                onclick="PlacesController.deleteImage('${placeId}', '${imgUrl}')">
                            <i data-lucide="x" style="width: 14px;"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderTempGallery: (urls = []) => {
        if (!urls.length) return '';
        return `
            <div class="gallery-grid mt-2" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
                ${urls.map((url, index) => `
                    <div class="position-relative" style="aspect-ratio: 1;">
                        <img src="${url}" class="w-100 h-100 rounded object-cover border">
                        <button type="button" class="btn-icon btn-danger position-absolute top-0 start-0 m-1" 
                                style="width: 24px; height: 24px; padding: 0;"
                                onclick="PlacesController.removeTempImage(${index})">
                            <i data-lucide="x" style="width: 14px;"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderForm: (place = {}) => {
        const isEdit = !!place.id;
        
        return `
            <div class="card mb-3">
                <div class="page-header mb-0 flex-between">
                    <div class="d-flex align-items-center gap-3">
                        <button onclick="window.location.hash='#/places'" class="btn-icon">
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <div>
                            <h2 class="page-title mb-0">${isEdit ? 'تعديل مكان' : 'إضافة مكان جديد'}</h2>
                            <p class="text-muted fs-13 mb-0">${isEdit ? 'تحديث بيانات المكان الحالية' : 'إضافة معلم أو نشاط جديد للدليل'}</p>
                        </div>
                    </div>
                </div>
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
                            <select name="main_cat_id" id="p_main_cat" class="form-control" required>
                                <option value="">اختر...</option>
                                <!-- Populated by Controller -->
                            </select>
                        </div>
                        <div class="form-group">
                             <!-- Spacer or other field -->
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

                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">الوصف (عربي)</label>
                            <textarea name="desc_ar" class="form-control" rows="3" onblur="PlacesController.autoTranslate('desc_ar', 'desc_en')">${place.desc_ar || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">الوصف (إنجليزي)</label>
                            <textarea name="desc_en" class="form-control" rows="3">${place.desc_en || ''}</textarea>
                        </div>
                    </div>

                    <!-- Toggles Section: Trending, Featured, etc -->
                    <div class="mb-4">
                        <label class="form-label mb-3">خصائص العرض والتميز</label>
                        <div class="feature-toggles-grid">
                             <!-- Trending -->
                             <label class="feature-toggle-btn">
                                <input type="checkbox" name="is_trending" ${place.is_trending ? 'checked' : ''}>
                                <div class="feature-toggle-icon">🔥</div>
                                <div class="feature-toggle-info">
                                    <span class="feature-title">تريند (Trending)</span>
                                    <span class="feature-desc">يظهر في قائمة الأكثر تداولاً</span>
                                </div>
                            </label>
                            
                            <!-- Featured -->
                            <label class="feature-toggle-btn">
                                <input type="checkbox" name="is_featured" ${place.is_featured ? 'checked' : ''}>
                                <div class="feature-toggle-icon">⭐</div>
                                <div class="feature-toggle-info">
                                    <span class="feature-title">مميز (Featured)</span>
                                    <span class="feature-desc">يظهر في البانر الرئيسي والعروض</span>
                                </div>
                            </label>

                            <!-- Hidden Gem -->
                             <label class="feature-toggle-btn">
                                <input type="checkbox" name="is_hidden_gem" ${place.is_hidden_gem ? 'checked' : ''}>
                                <div class="feature-toggle-icon">💎</div>
                                <div class="feature-toggle-info">
                                    <span class="feature-title">جوهرة مخفية</span>
                                    <span class="feature-desc">أماكن مميزة غير معروفة للجميع</span>
                                </div>
                            </label>
                            
                            <!-- Urgent / Active (Optional extra) -->
                             <label class="feature-toggle-btn">
                                <input type="checkbox" name="is_active" ${place.is_active !== false ? 'checked' : ''}>
                                <div class="feature-toggle-icon">✅</div>
                                <div class="feature-toggle-info">
                                    <span class="feature-title">نشط (Active)</span>
                                    <span class="feature-desc">المكان مفعل ويظهر للمستخدمين</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Offers Section -->
                    <div class="card p-3 mb-3" style="border: 1px dashed var(--primary);">
                        <div class="flex-between mb-3" onclick="document.getElementById('offers_panel').classList.toggle('d-none')" style="cursor:pointer">
                            <h4 class="fs-14 fw-bold text-primary mb-0"><i data-lucide="tag"></i> إضافة عرض خاص (Offers)</h4>
                            <i data-lucide="chevron-down"></i>
                        </div>
                        
                        <div id="offers_panel" class="${place.has_offer ? '' : ''}">
                            <div class="form-group mb-2">
                                <label class="d-flex align-items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" name="has_offer" id="has_offer_check" style="width:18px; height:18px;" 
                                           ${place.has_offer ? 'checked' : ''}
                                           onchange="document.getElementById('offer_inputs').style.display = this.checked ? 'block' : 'none'">
                                    <span class="fs-14 fw-600">تفعيل العرض</span>
                                </label>
                            </div>

                            <div id="offer_inputs" style="display: ${place.has_offer ? 'block' : 'none'};">
                                <div class="grid-2">
                                    <div class="form-group">
                                        <label class="form-label">عنوان العرض (عربي)</label>
                                        <input name="offer_text_ar" class="form-control" value="${place.offer_text_ar || ''}" placeholder="مثال: خصم 20%"
                                               onblur="PlacesController.autoTranslate('offer_text_ar', 'offer_text_en')">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">عنوان العرض (إنجليزي)</label>
                                        <input name="offer_text_en" class="form-control" value="${place.offer_text_en || ''}" placeholder="Ex: 20% OFF">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid-2">
                        <!-- Main Image -->
                        <div class="form-group">
                            <label class="form-label">الصورة الرئيسية</label>
                            <input type="hidden" name="image_url" id="main_image_url" value="${place.image_url || ''}">
                            <div class="image-upload-box text-center p-3 border rounded border-dashed" 
                                 onclick="document.getElementById('main_img_input').click()"
                                 style="cursor: pointer; background: var(--bg-body);">
                                
                                <img id="main_img_preview" src="${place.image_url || 'assets/images/placeholder.png'}" 
                                     style="max-height: 150px; display: ${place.image_url ? 'block' : 'none'}; margin: 0 auto;" class="mb-2 rounded">
                                
                                <div id="main_img_placeholder" style="display: ${place.image_url ? 'none' : 'block'};">
                                    <i data-lucide="image" class="text-muted mb-2" style="width: 32px; height: 32px;"></i>
                                    <p class="fs-13 text-muted mb-0">اضغط لرفع صورة</p>
                                </div>

                                <input type="file" id="main_img_input" hidden accept="image/*" 
                                       onchange="PlacesController.handleMainImage(this)">
                            </div>
                        </div>

                        <!-- Gallery -->
                        <div class="form-group">
                             <label class="form-label">صور المعرض (Gallery)</label>
                             <div class="p-3 border rounded border-dashed bg-body">
                                <button type="button" class="btn btn-outline btn-sm w-100 mb-3" onclick="document.getElementById('gallery_input').click()">
                                    <i data-lucide="upload-cloud"></i> رفع صور إضافية
                                </button>
                                <input type="file" id="gallery_input" hidden multiple accept="image/*" 
                                       onchange="PlacesController.handleGalleryUpload(this)">
                                
                                <!-- Existing Images (Edit Mode) -->
                                <div id="existing_gallery" class="mb-2">
                                     ${place.images ? PlacesView.renderGallery(place.id, place.images) : ''}
                                </div>

                                <!-- New Uploads Preview -->
                                <h6 class="fs-12 text-muted mb-2">صور جديدة:</h6>
                                <div id="temp_gallery"></div>
                             </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="btn-save">
                            <i data-lucide="save"></i> حفظ البيانات
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
};

window.PlacesView = PlacesView;
