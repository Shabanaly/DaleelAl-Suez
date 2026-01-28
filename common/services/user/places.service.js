/**
 * Places Service (User Frontend) - WITH CACHING
 * Handles fetching place data from Supabase for user-facing pages
 * Uses CacheService for browser-side caching to reduce server requests
 * @namespace UserPlacesService
 */
const PlacesService = {
    // Cache TTL configuration (in minutes)
    CACHE_TTL: {
        LATEST: 5,          // Latest places - frequently updated
        CATEGORY: 10,       // Category listings - medium frequency
        SINGLE: 15,         // Single place details - rarely change
        TRENDING: 10,       // Trending places
        URGENT: 10,         // Urgent services
        OFFERS: 5,          // Offers - time sensitive
        FEATURED: 10        // Featured place
    },

    /**
     * Get latest places (with caching)
     * @async
     * @param {number} limit - Maximum number of places to fetch
     * @returns {Promise<Array>} Array of place objects
     */
    getLatestPlaces: async (limit = 10) => {
        const cacheKey = `places_latest_${limit}`;
        
        // Use cache wrapper if available
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchLatestPlaces(limit);
            }, PlacesService.CACHE_TTL.LATEST);
        }
        
        return PlacesService._fetchLatestPlaces(limit);
    },

    // Internal fetch method
    _fetchLatestPlaces: async (limit) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) {
            console.error("Error fetching latest:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get places by main category (with caching)
     * @async
     * @param {number|string} catId - Main category ID
     * @returns {Promise<Array>} Array of place objects
     */
    getPlacesByMainCategory: async (catId) => {
        const cacheKey = `places_main_cat_${catId}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchPlacesByMainCategory(catId);
            }, PlacesService.CACHE_TTL.CATEGORY);
        }
        
        return PlacesService._fetchPlacesByMainCategory(catId);
    },

    _fetchPlacesByMainCategory: async (catId) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('main_cat_id', catId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching main cat:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get places by sub category (with caching)
     * @async
     * @param {number|string} subId - Sub category ID
     * @returns {Promise<Array>} Array of place objects
     */
    getPlacesBySubCategory: async (subId) => {
        const cacheKey = `places_sub_cat_${subId}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchPlacesBySubCategory(subId);
            }, PlacesService.CACHE_TTL.CATEGORY);
        }
        
        return PlacesService._fetchPlacesBySubCategory(subId);
    },

    _fetchPlacesBySubCategory: async (subId) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('sub_cat_id', subId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching sub cat:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get single place by ID (with caching)
     * @async
     * @param {number|string} id - Place ID
     * @returns {Promise<Object|null>} Place object or null if not found
     */
    getById: async (id) => {
        const cacheKey = `place_${id}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchById(id);
            }, PlacesService.CACHE_TTL.SINGLE);
        }
        
        return PlacesService._fetchById(id);
    },

    _fetchById: async (id) => {
        if (!window.sb) return null;
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching place:", error);
            return null;
        }
        return data;
    },

    /**
     * Get featured place (with caching)
     * @async
     * @returns {Promise<Object|null>} Featured place object or null
     */
    getFeaturedPlace: async () => {
        const cacheKey = 'places_featured';
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchFeaturedPlace();
            }, PlacesService.CACHE_TTL.FEATURED);
        }
        
        return PlacesService._fetchFeaturedPlace();
    },

    _fetchFeaturedPlace: async () => {
        if (!window.sb) return null;
        
        const { data: featured } = await window.sb
            .from('places')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();
            
        if (featured) return featured;
        
        const { data: latest } = await window.sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
        return latest;
    },

    /**
     * Get trending places (with caching)
     * @async
     * @param {number} limit - Maximum number of trending places
     * @returns {Promise<Array>} Array of trending place objects
     */
    getTrendingPlaces: async (limit = 10) => {
        const cacheKey = `places_trending_${limit}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchTrendingPlaces(limit);
            }, PlacesService.CACHE_TTL.TRENDING);
        }
        
        return PlacesService._fetchTrendingPlaces(limit);
    },

    _fetchTrendingPlaces: async (limit) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('id, name_ar, name_en')
            .eq('is_trending', true)
            .eq('is_active', true)
            .limit(limit);
        return data || [];
    },

    /**
     * Get urgent places (with caching)
     * @async
     * @param {number} limit - Maximum number of urgent places
     * @returns {Promise<Array>} Array of urgent place objects
     */
    getUrgentPlaces: async (limit = 8) => {
        const cacheKey = `places_urgent_${limit}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchUrgentPlaces(limit);
            }, PlacesService.CACHE_TTL.URGENT);
        }
        
        return PlacesService._fetchUrgentPlaces(limit);
    },

    _fetchUrgentPlaces: async (limit) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('*')
            .eq('is_urgent', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    /**
     * Get offer places (with caching)
     * @async
     * @param {number} limit - Maximum number of offer places
     * @returns {Promise<Array>} Array of place objects with offers
     */
    getOfferPlaces: async (limit = 6) => {
        const cacheKey = `places_offers_${limit}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return PlacesService._fetchOfferPlaces(limit);
            }, PlacesService.CACHE_TTL.OFFERS);
        }
        
        return PlacesService._fetchOfferPlaces(limit);
    },

    _fetchOfferPlaces: async (limit) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('*')
            .eq('has_offer', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    /**
     * Invalidate all places cache (call after admin updates)
     */
    invalidateCache() {
        if (window.CacheService) {
            window.CacheService.invalidatePattern('places_');
            window.CacheService.invalidatePattern('place_');
        }
    }
};

window.UserPlacesService = PlacesService;
