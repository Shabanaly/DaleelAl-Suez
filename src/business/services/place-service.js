/**
 * Place Service
 */
window.UserPlacesService = {
    CACHE_TTL: {
        LATEST: 5,
        CATEGORY: 10,
        SINGLE: 15,
        TRENDING: 10,
        URGENT: 10,
        OFFERS: 5,
        FEATURED: 10
    },

    async getLatestPlaces(limit = 10) {
        const cacheKey = `places_latest_${limit}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getLatest(limit), this.CACHE_TTL.LATEST);
    },

    async getPlacesByMainCategory(catId) {
        const cacheKey = `places_main_cat_${catId}`;
        return this._withCache(cacheKey, () => window.CategoriesRepository ? window.PlacesRepository.getByMainCategory(catId) : [], this.CACHE_TTL.CATEGORY);
    },

    async getById(id) {
        const cacheKey = `place_${id}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getById(id), this.CACHE_TTL.SINGLE);
    },

    /**
     * Track a view for a place
     * @param {string} placeId 
     */
    async trackView(placeId) {
        if (!placeId) return;
        
        try {
            // Get dependencies
            const repo = window.PlacesRepository;
            const sessionMgr = window.SessionManager;
            const authRepo = window.AuthRepository; // Optional if you have it

            if (!repo || !sessionMgr) {
                console.warn("Analytics dependencies missing");
                return;
            }

            // 1. Get Session Hash (Anonymous)
            const sessionHash = sessionMgr.getSessionHash();

            // 2. Get User ID (Authenticated) - Best effort
            let userId = null;
            if (authRepo) {
                const { session } = await authRepo.getSession();
                userId = session?.user?.id || null;
            } else if (window.sb) {
                 // Fallback to direct SB check if AuthRepo not ready
                 const { data } = await window.sb.auth.getSession();
                 userId = data.session?.user?.id || null;
            }

            // 3. Log View
            await repo.logView(placeId, userId, sessionHash);
            
        } catch (e) {
            console.error("Service Error tracking view:", e);
        }
    },

    async getFeaturedPlace() {
        const cacheKey = 'places_featured';
        return this._withCache(cacheKey, () => window.PlacesRepository.getFeatured(), this.CACHE_TTL.FEATURED);
    },

    async getTrendingPlaces(limit = 10) {
        const cacheKey = `places_trending_${limit}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getTrending(limit), this.CACHE_TTL.TRENDING);
    },

    async getUrgentPlaces(limit = 8) {
        const cacheKey = `places_urgent_${limit}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getUrgent(limit), this.CACHE_TTL.URGENT);
    },

    async getOfferPlaces(limit = 6) {
        const cacheKey = `places_offers_${limit}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getOffers(limit), this.CACHE_TTL.OFFERS);
    },

    async getHiddenGems(limit = 4) {
        // Hidden gems might change less frequently, maybe longer cache?
        // Using STANDARD TTL for now
        const cacheKey = `places_hidden_${limit}`;
        return this._withCache(cacheKey, () => window.PlacesRepository.getHiddenGems(limit), this.CACHE_TTL.TRENDING);
    },

    async search(query, filters = {}) {
        // We might choose NOT to cache search results to ensure freshness, 
        // or use a short TTL for popular queries.
        return window.PlacesRepository.search(query, filters);
    },

    async _withCache(key, fetchFn, ttl) {
        if (window.CacheService) {
            return window.CacheService.getOrFetch(key, fetchFn, ttl);
        }
        return fetchFn();
    },

    invalidateCache() {
        if (window.CacheService) {
            window.CacheService.invalidatePattern('places_');
            window.CacheService.invalidatePattern('place_');
        }
    }
};
