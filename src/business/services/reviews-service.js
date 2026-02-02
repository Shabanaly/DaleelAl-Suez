/**
 * Reviews Service
 * Responsibility: Business logic, validation, and caching for reviews.
 */
window.ReviewsService = {
    CACHE_TTL: 5,

    /**
     * Get reviews for a place (with caching)
     */
    async getReviews(placeId) {
        const cacheKey = `reviews_${placeId}`;
        return this._withCache(cacheKey, () => window.ReviewsRepository.getByPlace(placeId));
    },

    /**
     * Add a review
     */
    async addReview(placeId, rating, comment) {
        const sb = window.getSupabaseClient();
        if (!sb) return { error: "Client not init" };

        const { data: { user } } = await sb.auth.getUser();
        if (!user) throw new Error("AUTH_REQUIRED");

        if (!rating || rating < 1 || rating > 5) {
            return { error: "Invalid rating" };
        }

        const result = await window.ReviewsRepository.add(user.id, placeId, rating, comment);
        
        if (!result.error) {
            this.invalidateCache(placeId);
            // Also invalidate place cache as rating might update
            if (window.UserPlacesService) window.UserPlacesService.invalidateCache();
        }

        return result;
    },

    async _withCache(key, fetchFn) {
        if (window.CacheService) {
            return window.CacheService.getOrFetch(key, fetchFn, this.CACHE_TTL);
        }
        return fetchFn();
    },

    invalidateCache(placeId) {
        if (window.CacheService) {
            if (placeId) window.CacheService.invalidate(`reviews_${placeId}`);
            else window.CacheService.invalidatePattern(`reviews_`);
        }
    }
};
