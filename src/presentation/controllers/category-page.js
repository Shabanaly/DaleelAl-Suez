/**
 * Category Page Controller
 */
window.CategoryPageController = {
    async init() {
        console.log("📂 CategoryPageController Initializing (Clean Architecture)...");
        
        const catId = window.getQueryParam('id');
        if (!catId) return;

        // 1. Fetch Page Metadata (Business Logic -> Service)
        if (window.UserCategoriesService) {
            try {
                const category = await window.UserCategoriesService.getById(catId);
                // 2. Render Page Metadata (Presentation -> Renderer)
                if (window.CategoryRenderer) {
                    window.CategoryRenderer.renderHeader(category);
                }
            } catch (err) {
                console.error("Failed to load category metadata:", err);
            }
        }
        
        // 3. Fetch Content (Business Logic -> Service)
        if (window.UserPlacesService) {
            try {
                const places = await window.UserPlacesService.getPlacesByMainCategory(catId);
                
                // 4. Render Content (Presentation -> Renderer)
                if (window.PlaceRenderer) {
                    const isAr = (localStorage.getItem('lang') || 'ar') === 'ar';
                    const container = document.getElementById('places-container');
                    if (container) {
                        container.innerHTML = window.PlaceRenderer.renderList(places, isAr, 'standard');
                        if (window.lucide) window.lucide.createIcons();
                    }
                }
            } catch (err) {
                console.error("Failed to load category places:", err);
            }
        }
    }
};
