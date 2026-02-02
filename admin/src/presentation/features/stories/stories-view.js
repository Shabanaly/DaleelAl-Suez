/**
 * @file: admin/src/presentation/features/stories/stories-view.js
 * @layer: Presentation Layer
 * @responsibility: Stories UI Renderer.
 */

const StoriesView = {
    renderList: (stories) => {
        let content = '';

        if (!stories || stories.length === 0) {
            content = `
                <div class="text-center p-5">
                    <div class="mb-3">
                        <div style="width:80px; height:80px; background:var(--bg-body); border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
                            <i data-lucide="image" style="width:40px; height:40px; color:var(--text-muted);"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-2">لا توجد قصص نشطة</h3>
                    <p class="text-muted mb-4">أضف قصص جديدة لتظهر للمستخدمين في التطبيق لمدة 24 ساعة.</p>
                    <a href="#/stories/add" class="btn btn-primary">
                        <i data-lucide="plus"></i> إضافة قصة جديدة
                    </a>
                </div>
            `;
        } else {
            content = `
                <div class="card overflow-hidden">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>الواجهة</th>
                                    <th>المكان</th>
                                    <th>الحالة</th>
                                    <th>المشاهدات</th>
                                    <th>تاريخ النشر</th>
                                    <th>ينتهي في</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stories.map(story => StoriesView._renderRow(story)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        return `
            <!-- Header Card -->
            <div class="card mb-4">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">قصص التطبيق (Stories)</h2>
                        <p class="text-muted">إدارة القصص والحالات التي تظهر في الصفحة الرئيسية للتطبيق</p>
                    </div>
                    ${stories && stories.length > 0 ? `
                    <div class="flex-center">
                        <a href="#/stories/add" class="btn btn-primary">
                            <i data-lucide="plus"></i> إضافة قصة
                        </a>
                    </div>` : ''}
                </div>
            </div>
            
            ${content}
        `;
    },

    _renderMobileCard: (story) => {
        const isExpired = new Date(story.expires_at) < new Date();
        const statusBadge = isExpired 
            ? '<span class="badge bg-danger-subtle text-danger">منتهية</span>' 
            : '<span class="badge bg-success-subtle text-success">نشطة</span>';
        
        const placeName = story.places ? story.places.name_ar : 'قصة عامة';
        const createdDate = new Date(story.created_at).toLocaleDateString('ar-EG');
        
        const isVideo = story.media_type === 'video' || story.media_url.match(/\.(mp4|webm|mov)$/i);
        const thumbContent = isVideo 
            ? `<video src="${story.media_url}#t=1" style="width: 100%; height: 100%; object-fit: cover;" muted></video>`
            : `<img src="${story.media_url}" style="width: 100%; height: 100%; object-fit: cover;">`;
            
        return `
            <div class="card p-3" onclick="StoriesController.preview('${story.id}')">
                <div class="d-flex gap-3">
                    <div style="width: 80px; height: 120px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #f0f0f0;">
                       ${thumbContent}
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-content-between py-1">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <h5 class="fw-bold fs-15 mb-0 text-truncate">${placeName}</h5>
                                ${statusBadge}
                            </div>
                            <p class="text-muted fs-13 line-clamp-2 mb-2">${story.caption || 'بدون وصف'}</p>
                            <div class="d-flex align-items-center gap-3 text-muted fs-12">
                                <span><i data-lucide="eye" style="width: 12px;"></i> ${story.views || 0}</span>
                                <span><i data-lucide="clock" style="width: 12px;"></i> ${createdDate}</span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end gap-2 mt-2">
                            <button class="btn btn-soft-primary btn-sm w-100" 
                                    onclick="event.stopPropagation(); StoriesController.preview('${story.id}')">
                                <i data-lucide="eye" style="width: 14px;"></i> معاينة
                            </button>
                            <button class="btn btn-soft-danger btn-sm" 
                                    onclick="event.stopPropagation(); StoriesController.delete('${story.id}')"
                                    style="width: 36px;">
                                <i data-lucide="trash-2" style="width: 16px;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    _renderRow: (story) => {
        const isExpired = new Date(story.expires_at) < new Date();
        const statusBadge = isExpired 
            ? '<span class="badge bg-danger-subtle text-danger">منتهية</span>' 
            : '<span class="badge bg-success-subtle text-success">نشطة</span>';
        
        const placeName = story.places ? story.places.name_ar : 'قصة عامة';
        const createdDate = new Date(story.created_at).toLocaleDateString('ar-EG');
        const expiresDate = new Date(story.expires_at).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        const isVideo = story.media_type === 'video' || story.media_url.match(/\.(mp4|webm|mov)$/i);
        const thumbContent = isVideo 
            ? `<video src="${story.media_url}#t=1" style="width: 100%; height: 100%; object-fit: cover;" muted></video>`
            : `<img src="${story.media_url}" style="width: 100%; height: 100%; object-fit: cover;">`;

        return `
            <tr onclick="StoriesController.preview('${story.id}')" style="cursor: pointer;">
                <td>
                    <div style="width: 48px; height: 64px; border-radius: 8px; overflow: hidden; background: #f0f0f0; border: 1px solid var(--border);">
                        ${thumbContent}
                    </div>
                </td>
                <td>
                    <h5 class="font-size-14 text-truncate fw-bold mb-1" style="max-width: 200px;">${placeName}</h5>
                    <p class="text-muted mb-0 font-size-12 text-truncate" style="max-width: 200px;">${story.caption || 'بدون عنوان'}</p>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex align-items-center gap-1 text-muted">
                        <i data-lucide="eye" style="width: 14px;"></i> ${story.views || 0}
                    </div>
                </td>
                <td class="text-muted fs-12">${createdDate}</td>
                <td class="text-warning fs-12">${expiresDate}</td>
                <td>
                    <div class="actions">
                        <button class="btn-soft-primary" 
                                onclick="event.stopPropagation(); StoriesController.preview('${story.id}')" 
                                title="معاينة">
                            <i data-lucide="eye" style="width: 16px;"></i>
                        </button>
                        <button class="btn-soft-danger" 
                                onclick="event.stopPropagation(); StoriesController.delete('${story.id}')" 
                                title="حذف">
                            <i data-lucide="trash-2" style="width: 16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    renderPreviewModal: (story) => {
        const isVideo = story.media_type === 'video' || story.media_url.match(/\.(mp4|webm|mov)$/i);
        const placeName = story.places ? story.places.name_ar : 'قصة عامة';
        const placeImg = story.places ? story.places.image_url : null;
        
        return `
            <div class="modal-backdrop-custom fade-in" id="story-preview-modal" onclick="StoriesController.closePreview(event)">
                <div class="modal-content-custom zoom-in" onclick="event.stopPropagation()">
                    <button class="close-btn" onclick="StoriesController.closePreview()"><i data-lucide="x"></i></button>
                    
                    <div class="phone-frame mx-auto" style="border: 4px solid #333; border-radius: 24px; overflow: hidden; width: 320px; height: 600px; position: relative; background: #000; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                        <!-- Dynamic Content -->
                         ${isVideo 
                            ? `<video src="${story.media_url}" style="width: 100%; height: 100%; object-fit: cover;" controls autoplay loops playsinline></video>` 
                            : `<img src="${story.media_url}" style="width: 100%; height: 100%; object-fit: cover;">`
                         }
                        
                        <!-- Overlay Gradient -->
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 20%, transparent 70%, rgba(0,0,0,0.9)); pointer-events: none;"></div>

                        <!-- Header -->
                        <div style="position: absolute; top: 20px; right: 15px; left: 15px; display: flex; align-items: center; justify-content: space-between; direction: rtl; z-index: 10;">
                            <div class="d-flex align-items-center gap-2">
                                ${placeImg ? `<img src="${placeImg}" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid white;">` : ''}
                                <span class="text-white fw-bold text-shadow fs-14">${placeName}</span>
                            </div>
                            <button class="btn-icon-sm text-white" onclick="StoriesController.closePreview()"><i data-lucide="x"></i></button>
                        </div>

                        <!-- Footer Info -->
                        <div style="position: absolute; bottom: 30px; left: 0; width: 100%; padding: 0 20px; text-align: center; z-index: 10;">
                            <h4 class="text-white fw-bold mb-2 text-shadow fs-16">${story.caption || ''}</h4>
                            ${story.link_url ? `
                                <a href="${story.link_url}" target="_blank" class="btn btn-white btn-sm rounded-pill fw-bold w-100" style="color: #000; display: block; margin-top: 10px;">
                                    مشاهدة المزيد <i data-lucide="chevron-up" style="width: 14px; vertical-align: middle;"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .modal-backdrop-custom {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                }
                .modal-content-custom {
                    position: relative;
                }
                .close-btn {
                    position: absolute; top: -40px; right: -40px;
                    background: none; border: none; color: white; cursor: pointer;
                }
                .fade-in { animation: fadeIn 0.3s ease; }
                .zoom-in { animation: zoomIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
                
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            </style>
        `;
    },

    renderForm: (placesHtml) => {
        return `
            <!-- Header Card -->
            <div class="card mb-3">
                <div class="page-header mb-0 flex-between">
                    <div class="d-flex align-items-center gap-3">
                        <button onclick="window.location.hash='#/stories'" class="btn-icon">
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <div>
                            <h2 class="page-title mb-0">إضافة قصة جديدة</h2>
                            <p class="text-muted fs-13 mb-0">نشر قصة أو حالة جديدة تظهر للمستخدمين في الصفحة الرئيسية</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-container" style="display: flex; flex-wrap: wrap; gap: 24px;">
                
                <!-- Main Form -->
                <div class="card form-card" style="flex: 1; min-width: 320px;">
                    <form id="story-form" onsubmit="StoriesController.save(event)">
                        
                        <div class="form-group mb-4">
                            <label class="form-label">المكان المرتبط بالقصة <span class="text-danger">*</span></label>
                            <select id="place-select" class="form-control" required style="height: 50px;">
                                ${placesHtml}
                            </select>
                            <small class="form-hint">اختر المكان الذي تروج له هذه القصة</small>
                        </div>

                        <!-- Custom Upload Area -->
                        <div class="form-group mb-4">
                            <label class="form-label">ملف الوسائط (صورة/فيديو) <span class="text-danger">*</span></label>
                            <div class="image-upload-box text-center p-5 border rounded border-dashed bg-body hover-border-primary transition-all" 
                                 onclick="document.getElementById('media-file').click()"
                                 style="cursor: pointer; min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                                
                                <input type="file" id="media-file" hidden accept="image/*,video/*" required onchange="StoriesController.handleFilePreview(this)">
                                
                                <div id="upload-placeholder" style="pointer-events: none;">
                                    <div style="width: 64px; height: 64px; background: var(--primary-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                                        <i data-lucide="upload-cloud" style="width: 32px; height: 32px; color: var(--primary);"></i>
                                    </div>
                                    <h5 class="fw-bold mb-1">اضغط لرفع ملف</h5>
                                    <p class="text-muted fs-13">يدعم الصور (JPG, PNG) والفيديو (MP4)</p>
                                </div>

                                <img id="image-preview" src="" style="display: none; max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                <video id="video-preview" src="" style="display: none; max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" controls></video>
                            </div>
                        </div>

                        <div class="grid-2 gap-3 mb-4">
                             <div class="form-group">
                                <label class="form-label">مدة العرض</label>
                                <select id="duration-select" class="form-control">
                                    <option value="24">24 ساعة</option>
                                    <option value="48">48 ساعة</option>
                                    <option value="72">3 أيام</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">رابط خارجي (اختياري)</label>
                                <input type="url" id="link-url-input" class="form-control" placeholder="https://..." style="direction: ltr;">
                            </div>
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label">عنوان / وصف القصة</label>
                            <input type="text" id="caption-input" class="form-control" placeholder="اكتب تعليقاً يظهر أسفل القصة..." maxlength="100" oninput="StoriesController.updateMockupCaption(this.value)">
                        </div>

                        <div class="form-group mb-4">
                             <label class="feature-toggle-btn w-100">
                                <input type="checkbox" id="is-active-input" checked>
                                <div class="feature-toggle-icon">✅</div>
                                <div class="feature-toggle-info">
                                    <span class="feature-title">نشر القصة فوراً</span>
                                    <span class="feature-desc">ستصبح القصة مرئية للمستخدمين بمجرد الحفظ</span>
                                </div>
                            </label>
                        </div>

                        <div class="form-actions mt-4">
                            <button type="submit" id="save-btn" class="btn btn-primary btn-lg w-100">
                                <i data-lucide="send"></i> نشر القصة الآن
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Preview Side (Phone Mockup) -->
                <div class="d-none d-lg-block">
                    <div class="card p-3 sticky-top" style="top: 20px;">
                        <h4 class="fs-16 fw-bold mb-3 text-center">معاينة مباشرة</h4>
                        <div class="phone-frame mx-auto" style="border: 4px solid #333; border-radius: 24px; overflow: hidden; width: 280px; height: 500px; position: relative; background: #000;">
                            <div class="phone-notch" style="width: 120px; height: 20px; background: #333; position: absolute; top: 0; left: 50%; transform: translateX(-50%); border-radius: 0 0 12px 12px; z-index: 10;"></div>
                            
                            <!-- Preview Screen -->
                            <div id="preview-screen-bg" style="width: 100%; height: 100%; background: #222; display: flex; align-items: center; justify-content: center; color: #666;">
                                <div class="text-center">
                                    <i data-lucide="smartphone" style="width: 48px; height: 48px; opacity: 0.5;"></i>
                                    <p class="mt-2 fs-12">ستظهر المعاينة هنا</p>
                                </div>
                            </div>
                            
                            <!-- Dynamic Content Overlay -->
                            <div id="preview-content" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: none;">
                                <img id="mockup-img" style="width: 100%; height: 100%; object-fit: cover;">
                                <video id="mockup-video" style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.8));"></div>
                                
                                <div style="position: absolute; bottom: 20px; left: 0; width: 100%; px: 16px; text-align: center; color: white; padding: 0 16px;">
                                    <h5 class="fw-bold mb-1 fs-14" id="mockup-caption"></h5>
                                </div>
                            </div>
                        </div>
                        <p class="text-center text-muted fs-12 mt-3">هذا شكل تقريبي لكيفية ظهور القصة</p>
                    </div>
                </div>
            </div>
        `;
    }
};

window.StoriesView = StoriesView;
