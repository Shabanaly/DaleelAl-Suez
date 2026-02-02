/**
 * @file: admin/src/presentation/features/stories/stories-controller.js
 * @layer: Presentation Layer
 * @responsibility: Stories SPA Controller.
 */

const StoriesController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        await StoriesController.loadList(container);
    },

    loadList: async (container) => {
        try {
            const stories = await window.AppStoryService.getAllStories();
            StoriesController.stories = stories; // Cache for preview
            container.innerHTML = StoriesView.renderList(stories);
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل القصص</p>';
        }
    },

    preview: (id) => {
        const story = StoriesController.stories.find(s => s.id === id);
        if (!story) return;

        const modalHtml = StoriesView.renderPreviewModal(story);
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer); // Append to body for full screen
        
        if (window.lucide) window.lucide.createIcons();
    },

    closePreview: (e) => {
        // If e is present, it's a click. Check if it's the backdrop or close button.
        if (e && e.target.id !== 'story-preview-modal' && !e.target.closest('.close-btn')) {
             return; // Clicked content, don't close (handled by stopPropagation usually but safety)
        }
        
        const modal = document.getElementById('story-preview-modal');
        if (modal) {
            modal.classList.remove('fade-in');
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentElement) modal.parentElement.remove(); // Remove wrapper
            }, 300);
        }
    },

    loadForm: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        
        try {
            // Load Places Logic
            const placesHtml = await StoriesController._getPlacesOptions();
            container.innerHTML = StoriesView.renderForm(placesHtml);
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل النموذج</p>';
        }
    },

    save: async (event) => {
        event.preventDefault();
        const btn = document.getElementById('save-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i> جاري النشر...';
        btn.disabled = true;
        if (window.lucide) window.lucide.createIcons();

        try {
            const fileInput = document.getElementById('media-file');
            const placeId = document.getElementById('place-select').value;
            const caption = document.getElementById('caption-input').value;
            const duration = document.getElementById('duration-select').value;
            const linkUrl = document.getElementById('link-url-input').value; // New
            const isActive = document.getElementById('is-active-input').checked; // New

            // Determine Media Type
            const file = fileInput.files[0];
            const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

            const rawData = {
                file: file,
                placeId: placeId,
                caption: caption,
                duration: duration,
                linkUrl: linkUrl,
                isActive: isActive,
                mediaType: mediaType
            };

            await window.AppStoryService.addStory(rawData);
            
            if (window.Toast) window.Toast.success("تم النشر بنجاح!");
            else alert("تم النشر بنجاح!");

            window.location.hash = '#/stories';

        } catch (error) {
            console.error(error);
            if (window.Toast) window.Toast.error(error.message);
            else alert(error.message);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (window.lucide) window.lucide.createIcons();
        }
    },

    delete: async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذه القصة؟')) return;
        
        try {
            await window.AppStoryService.deleteStory(id);
            if (window.Toast) window.Toast.success("تم الحذف");
            
            // Refresh
            const container = document.getElementById('app-content');
            await StoriesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    },

    handleFilePreview: (input) => {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            const isVideo = file.type.startsWith('video/');

            reader.onload = function(e) {
                const result = e.target.result;

                // 1. Update Upload Box Preview
                const imgPreview = document.getElementById('image-preview');
                const videoPreview = document.getElementById('video-preview');
                const placeholder = document.getElementById('upload-placeholder');
                
                if (placeholder) placeholder.style.display = 'none';

                if (isVideo) {
                    if(imgPreview) imgPreview.style.display = 'none';
                    if(videoPreview) {
                        videoPreview.src = result;
                        videoPreview.style.display = 'block';
                    }
                } else {
                    if(videoPreview) videoPreview.style.display = 'none';
                    if(imgPreview) {
                        imgPreview.src = result;
                        imgPreview.style.display = 'block';
                    }
                }

                // 2. Update Phone Mockup Preview
                const mockupImg = document.getElementById('mockup-img');
                const mockupVideo = document.getElementById('mockup-video');
                const mockupContent = document.getElementById('preview-content');
                const previewBg = document.getElementById('preview-screen-bg');

                if (mockupContent) mockupContent.style.display = 'block';
                if (previewBg) previewBg.style.display = 'none';

                if (isVideo) {
                    if(mockupImg) mockupImg.style.display = 'none';
                    if(mockupVideo) {
                        mockupVideo.src = result;
                        mockupVideo.style.display = 'block';
                        mockupVideo.play().catch(() => {}); // Auto-play muted maybe?
                        mockupVideo.muted = true;
                        mockupVideo.loop = true; 
                    }
                } else {
                    if(mockupVideo) mockupVideo.style.display = 'none';
                    if(mockupImg) {
                        mockupImg.src = result;
                        mockupImg.style.display = 'block';
                    }
                }
            }
            reader.readAsDataURL(file);
        }
    },
    
    // Helper to update caption in mockup
    updateMockupCaption: (val) => {
        const el = document.getElementById('mockup-caption');
        if(el) el.textContent = val;
    },

    _getPlacesOptions: async () => {
        try {
            // Fetch via Services (Business Layer) only
            const [places, categories] = await Promise.all([
                window.AppPlaceService.getAllPlaces(), 
                window.AppCategoryService.getAllCategories()
            ]);

            let html = '<option value="">-- اختر المكان --</option>';
            
            if (places.length > 0 && categories.length > 0) {
                 const usedPlaceIds = new Set();
                 
                 categories.forEach(cat => {
                    const catPlaces = places.filter(p => p.main_cat_id === cat.id);
                    if (catPlaces.length > 0) {
                        html += `<optgroup label="${cat.label || cat.name_ar}">`;
                        catPlaces.forEach(p => {
                            html += `<option value="${p.id}">${p.name_ar}</option>`;
                            usedPlaceIds.add(p.id);
                        });
                        html += `</optgroup>`;
                    }
                 });

                 const orphans = places.filter(p => !usedPlaceIds.has(p.id));
                 if (orphans.length > 0) {
                    html += `<optgroup label="أخرى">`;
                    orphans.forEach(p => {
                        html += `<option value="${p.id}">${p.name_ar}</option>`;
                    });
                    html += `</optgroup>`;
                 }
            } else {
                places.forEach(p => {
                    html += `<option value="${p.id}">${p.name_ar}</option>`;
                });
            }
            return html;

        } catch (e) {
            console.error(e);
            return '<option value="">فشل تحميل القائمة</option>';
        }
    }
};

window.StoriesController = StoriesController;
