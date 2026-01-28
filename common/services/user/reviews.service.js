/**
 * Reviews Service - WITH CACHING
 * Handles fetching and adding reviews
 * Uses CacheService for browser-side caching
 */

const ReviewsService = {
    // Cache TTL in minutes
    CACHE_TTL: 5,  // Reviews can change frequently
    
    /**
     * Get reviews for a specific place (with caching)
     * @param {string|number} placeId 
     * @returns {Promise<Array>} List of reviews with user info
     */
    async getReviews(placeId) {
        const cacheKey = `reviews_${placeId}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return this._fetchReviews(placeId);
            }, this.CACHE_TTL);
        }
        
        return this._fetchReviews(placeId);
    },

    async _fetchReviews(placeId) {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('reviews')
            .select('*')
            .eq('place_id', placeId)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error("Error fetching reviews", error);
            return [];
        }
        
        return data || [];
    },

    /**
     * Add a new review (invalidates cache)
     * @param {string|number} placeId 
     * @param {number} rating (1-5)
     * @param {string} comment 
     * @returns {Promise<Object>} The new review or error
     */
    async addReview(placeId, rating, comment) {
        if (!window.sb) return { error: "Supabase not init" };
        
        const { data: { user } } = await window.sb.auth.getUser();
        if (!user) return { error: "Not logged in" };

        const { data, error } = await window.sb
            .from('reviews')
            .insert({
                user_id: user.id,
                place_id: placeId,
                rating: rating,
                comment: comment
            })
            .select()
            .single();
            
        if (error) {
            console.error("Error adding review", error);
            return { error: error.message };
        }
        
        // Invalidate cache for this place's reviews
        if (window.CacheService) {
            window.CacheService.invalidate(`reviews_${placeId}`);
            // Also invalidate the place itself as rating might change
            window.CacheService.invalidate(`place_${placeId}`);
        }
        
        return { data };
    },

    /**
     * Check if user has already reviewed this place (with caching)
     * @param {string|number} placeId 
     * @returns {Promise<Object|null>} Review object if exists
     */
    async getUserReview(placeId) {
        if (!window.sb) return null;
        
        const { data: { user } } = await window.sb.auth.getUser();
        if (!user) return null;
        
        // User-specific reviews are not cached to ensure accuracy
        const { data, error } = await window.sb
            .from('reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('place_id', placeId)
            .maybeSingle();
            
        if (error) return null;
        return data;
    },

    /**
     * Invalidate reviews cache for a place
     * @param {string|number} placeId 
     */
    invalidateCache(placeId) {
        if (window.CacheService) {
            if (placeId) {
                window.CacheService.invalidate(`reviews_${placeId}`);
            } else {
                window.CacheService.invalidatePattern('reviews_');
            }
        }
    }
};

// Expose
window.ReviewsService = ReviewsService;
