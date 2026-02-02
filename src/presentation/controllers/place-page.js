/**
 * Place Page Controller
 */
window.PlacePageController = {
    async init() {
        console.log("📂 PlacePageController Initializing (Clean Architecture)...");
        
        const placeId = window.getQueryParam('id');
        if (!placeId) return;

        try {
            // 1. Fetch all data through Business Logic Layer (Parallel)
            const [place, reviews, favIds] = await Promise.all([
                window.UserPlacesService.getById(placeId),
                window.ReviewsService.getReviews(placeId),
                window.UserFavoritesService ? window.UserFavoritesRepository.getFavoritesIds() : Promise.resolve(new Set())
            ]);

            if (!place) {
                if (window.PlaceDetailsRenderer) window.PlaceDetailsRenderer.showPlaceNotFound();
                return;
            }

            // 2. Fetch Category Label (also through Business Logic)
            let categoryName = "";
            if (place.main_cat_id && window.UserCategoriesService) {
                const cat = await window.UserCategoriesService.getById(place.main_cat_id);
                if (cat) {
                    const lang = localStorage.getItem('lang') || 'ar';
                    categoryName = lang === 'ar' ? cat.name_ar : (cat.name_en || cat.name_ar);
                }
            }

            const isFavorited = favIds.has(placeId);

            // 3. Coordinate Rendering (Presentation Layer)
            if (window.PlaceDetailsRenderer) {
                window.PlaceDetailsRenderer.render(place, categoryName, reviews, isFavorited);
            }

        } catch (err) {
            console.error("Failed to load place details:", err);
            if (window.PlaceDetailsRenderer) window.PlaceDetailsRenderer.showPlaceNotFound();
        }
    }
};
