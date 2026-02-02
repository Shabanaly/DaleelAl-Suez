/**
 * @file: admin/src/presentation/features/places/places-controller.js
 * @layer: Presentation Layer
 * @responsibility: Places SPA Controller.
 */

const PlacesController = {
    currentView: 'list', // list | grid
    allPlaces: [], // Store all places for filtering
    categories: [], // Store categories for filter dropdown
    filters: {
        search: '',
        category: ''
    },

    tempGalleryFiles: [], // Store File objects for new gallery images
    
    autoTranslate: async (sourceName, targetName) => {
        const sourceEl = document.querySelector(`[name="${sourceName}"]`);
        const targetEl = document.querySelector(`[name="${targetName}"]`);
        
        if (sourceEl && targetEl && sourceEl.value && !targetEl.value && window.TranslationService) {
            const originalText = targetEl.placeholder;
            targetEl.placeholder = 'Translating...';
            try {
                const translated = await window.TranslationService.translateArToEn(sourceEl.value);
                if (translated) targetEl.value = translated;
            } catch (e) {
                console.warn('Translation failed', e);
            } finally {
                targetEl.placeholder = originalText || '';
            }
        }
    },

    init: async (container) => {
        await PlacesController.loadList(container);
    },

    loadList: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        try {
            // Load Places and Categories in parallel
            const [places, categories] = await Promise.all([
                window.AppPlaceService.getAllPlaces(),
                window.AppCategoryService.getAllCategories()
            ]);

            PlacesController.allPlaces = places;
            PlacesController.categories = categories; 
            
            // 1. Render Static Layout (Header + Toolbar)
            container.innerHTML = PlacesView.renderLayout(categories, places.length);
            
            // 2. Render Initial Content (List/Grid)
            PlacesController.render();
            
            if (window.lucide) window.lucide.createIcons();

        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل الأماكن</p>';
        }
    },

    render: () => {
        // Filter logic
        let filtered = PlacesController.allPlaces;

        // 1. Search (Name AR/EN)
        if (PlacesController.filters.search) {
            const term = PlacesController.filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                (p.name_ar && p.name_ar.toLowerCase().includes(term)) || 
                (p.name_en && p.name_en.toLowerCase().includes(term))
            );
        }

        // 2. Category Filter
        if (PlacesController.filters.category) {
            filtered = filtered.filter(p => p.main_cat_id == PlacesController.filters.category);
        }

        // Render Content Only
        const contentContainer = document.getElementById('places-list-container');
        if (contentContainer) {
            contentContainer.innerHTML = PlacesView.renderContent(filtered, PlacesController.currentView);
        }

        // Update Count
        const countInfo = document.getElementById('places-count');
        if (countInfo) countInfo.innerText = filtered.length;

        // Update Toggle Buttons State (Desktop & Mobile)
        const updateBtns = (listId, gridId) => {
            const btnList = document.getElementById(listId);
            const btnGrid = document.getElementById(gridId);
            if (btnList && btnGrid) {
                if (PlacesController.currentView === 'list') {
                    btnList.classList.add('active');
                    btnGrid.classList.remove('active');
                } else {
                    btnList.classList.remove('active');
                    btnGrid.classList.add('active');
                }
            }
        };

        updateBtns('btn-view-list', 'btn-view-grid');
        updateBtns('btn-view-list-m', 'btn-view-grid-m');

        if (window.lucide) window.lucide.createIcons();
    },

    handleSearch: (val) => {
        PlacesController.filters.search = val;
        PlacesController.render();
    },

    handleFilterCategory: (catId, el) => {
        PlacesController.filters.category = catId;
        
        // Visual Update for Chips
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        if (el) {
            el.classList.add('active');
        } else {
             // Fallback if el not passed (should not happen with new click handler)
             // Try to find by data attr
             const target = document.querySelector(`.filter-chip[data-cat-id="${catId}"]`) || document.querySelector('.filter-chip:first-child');
             if(target) target.classList.add('active');
        }

        PlacesController.render();
    },

    loadForm: async (container, params = {}) => {
        container.innerHTML = '<div class="spinner"></div>';
        let place = {};
        
        try {
            // Load Categories
            const categories = await window.AppCategoryService.getAllCategories();
            
            // If Edit Mode
            if (params.id) {
                place = await window.AppPlaceService.getPlaceById(params.id);
            }

            container.innerHTML = PlacesView.renderForm(place);
            if (window.lucide) window.lucide.createIcons();

            // Populate Main Categories
            const mainSelect = document.getElementById('p_main_cat');
            if (mainSelect) {
                mainSelect.innerHTML = '<option value="">اختر...</option>' + 
                    categories.map(c => `<option value="${c.id}" ${place.main_cat_id === c.id ? 'selected' : ''}>${c.label || c.name_ar}</option>`).join('');
                
            }

        } catch (e) {
            console.error(e);
            container.innerHTML = `<p class="text-danger">Error: ${e.message}</p>`;
        }
    },


    handleMainImage: (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                 document.getElementById('main_img_preview').src = e.target.result;
                 document.getElementById('main_img_preview').style.display = 'block';
                 document.getElementById('main_img_placeholder').style.display = 'none';
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    handleGalleryUpload: (input) => {
        if (input.files && input.files.length) {
            const files = Array.from(input.files);
            PlacesController.tempGalleryFiles = [...PlacesController.tempGalleryFiles, ...files];
            
            // Generate previews
            const urls = PlacesController.tempGalleryFiles.map(file => URL.createObjectURL(file));
            document.getElementById('temp_gallery').innerHTML = PlacesView.renderTempGallery(urls);
        }
    },

    removeTempImage: (index) => {
        PlacesController.tempGalleryFiles.splice(index, 1);
        const urls = PlacesController.tempGalleryFiles.map(file => URL.createObjectURL(file));
        document.getElementById('temp_gallery').innerHTML = PlacesView.renderTempGallery(urls);
    },

    deleteImage: async (placeId, imgUrl) => {
        if (!confirm('حذف هذه الصورة؟')) return;
        try {
            // Fetch current place
            const place = await window.AppPlaceService.getPlaceById(placeId);
            if (!place || !place.images) return;

            // Remove image from array
            const updatedImages = place.images.filter(url => url !== imgUrl);
            
            // Update place with new array
            await window.AppPlaceService.updatePlace(placeId, { images: updatedImages });
            
            // Refresh Form (or remove from DOM) - Reloading form is safer
            PlacesController.loadForm(document.getElementById('places-list-container'), { id: placeId });
            
        } catch(e) {
            console.error(e);
            alert('فشل حذف الصورة');
        }
    },

    save: async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'جاري الحفظ...';

        try {
            // 1. Upload Main Image (if new file selected)
            const mainFileInput = form.querySelector('#main_img_input');
            if (mainFileInput.files.length > 0) {
                 btn.innerHTML = 'جاري رفع الصورة الرئيسية...';
                 const mainUrl = await window.CloudinaryService.uploadImage(mainFileInput.files[0]);
                 data.image_url = mainUrl; // Update data with new URL
            }

            // 2. Upload Gallery Images
            let newGalleryUrls = [];
            if (PlacesController.tempGalleryFiles.length > 0) {
                btn.innerHTML = `جاري رفع ${PlacesController.tempGalleryFiles.length} صور للمعرض...`;
                newGalleryUrls = await window.CloudinaryService.uploadMultiple(PlacesController.tempGalleryFiles);
            }

            // 3. Save Place Data (Orchestrated by Service)
            btn.innerHTML = 'جاري حفظ البيانات...';
            
            if (data.id) {
                // Update: data + new gallery images
                await window.AppPlaceService.updatePlace(data.id, data, newGalleryUrls);
                 if (typeof Toast !== 'undefined') window.Toast.success("تم التعديل بنجاح");
            } else {
                delete data.id;
                // Create: data + gallery images
                await window.AppPlaceService.createPlace(data, newGalleryUrls);
                 if (typeof Toast !== 'undefined') window.Toast.success("تم الإضافة بنجاح");
            }
            
            // Clear temp files locally
            PlacesController.tempGalleryFiles = [];
            window.location.hash = '#/places';
        } catch (e) {
            alert("خطأ: " + e.message);
            console.error(e);
        } finally {
            if(btn) {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }
    },

    delete: async (id) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        try {
            await window.AppPlaceService.deletePlace(id);
            // Refresh
            const container = document.getElementById('app-content');
            PlacesController.loadList(container);
        } catch (e) {
            alert("فشل الحذف: " + e.message);
        }
    },

    switchView: (mode) => {
        PlacesController.currentView = mode;
        PlacesController.render();
    },

    toggleStatus: async (id, isActive) => {
        try {
            // Use Partial Update (Patch) to avoid Strict Validation errors on legacy data (e.g. missing images)
            await window.AppPlaceService.updatePlace(id, { is_active: isActive });
            
            // Update local state directly
            const place = PlacesController.allPlaces.find(p => p.id === id);
            if (place) place.is_active = isActive;
            
            if (typeof Toast !== 'undefined') window.Toast.success(isActive ? "تم تفعيل المكان" : "تم إيقاف المكان");
        } catch (e) {
            console.error(e);
            alert("فشل تحديث الحالة: " + e.message);
            // Revert UI: Reload ensures sync
            PlacesController.render(); 
        }
    },

    autoTranslate: async (sourceId, targetId) => {
        const sourceEl = document.querySelector(`[name="${sourceId}"]`);
        const targetEl = document.querySelector(`[name="${targetId}"]`) || document.getElementById(targetId);
        
        if (sourceEl && targetEl && sourceEl.value && !targetEl.value) {
            try {
                 // Assuming TranslationService is available (Validation layer or similar)
                 // Or we can invoke it if global
                if (typeof TranslationService !== 'undefined') {
                    targetEl.value = 'جاري الترجمة...';
                    const text = await TranslationService.translateArToEn(sourceEl.value);
                    targetEl.value = text || '';
                }
            } catch (e) {
                targetEl.value = '';
            }
        }
    }
};

window.PlacesController = PlacesController;
