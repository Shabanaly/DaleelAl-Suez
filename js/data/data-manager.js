/**
 * Data Manager
 * Centralized data fetching and caching for better performance
 * @namespace DataManager
 */
const DataManager = {
    cache: {
        categories: null,
        places: {},
        featuredPlace: null
    },

    /**
     * Get all categories (with caching)
     * @async
     * @param {boolean} forceRefresh - Force refresh cache
     * @returns {Promise<Array>} Categories array
     */
    async getCategories(forceRefresh = false) {
        if (!forceRefresh && this.cache.categories) {
            return this.cache.categories;
        }
        
        if (window.UserCategoriesService) {
            this.cache.categories = await window.UserCategoriesService.getMainCategories();
            return this.cache.categories;
        }
        return [];
    },

    /**
     * Get places by category
     * @async
     * @param {string} categoryId - Category ID
     * @returns {Promise<Array>} Places array
     */
    async getPlacesByCategory(categoryId) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getPlacesByMainCategory(categoryId);
        }
        return [];
    },

    /**
     * Get places by subcategory
     * @async
     * @param {string} subCategoryId - Subcategory ID
     * @returns {Promise<Array>} Places array
     */
    async getPlacesBySubCategory(subCategoryId) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getPlacesBySubCategory(subCategoryId);
        }
        return [];
    },

    /**
     * Get featured place for Explore widget
     * @async
     * @returns {Promise<Object|null>} Featured place
     */
    async getFeaturedPlace() {
        if (this.cache.featuredPlace) {
            return this.cache.featuredPlace;
        }
        
        if (window.UserPlacesService) {
            this.cache.featuredPlace = await window.UserPlacesService.getFeaturedPlace();
            return this.cache.featuredPlace;
        }
        return null;
    },

    /**
     * Get trending places
     * @async
     * @param {number} limit - Number of places
     * @returns {Promise<Array>} Trending places
     */
    async getTrendingPlaces(limit = 10) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getTrendingPlaces(limit);
        }
        return [];
    },

    /**
     * Get urgent/quick service places
     * @async
     * @param {number} limit - Number of places
     * @returns {Promise<Array>} Urgent places
     */
    async getUrgentPlaces(limit = 8) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getUrgentPlaces(limit);
        }
        return [];
    },

    /**
     * Get places with offers
     * @async
     * @param {number} limit - Number of places
     * @returns {Promise<Array>} Places with offers
     */
    async getOfferPlaces(limit = 6) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getOfferPlaces(limit);
        }
        return [];
    },

    /**
     * Get latest places
     * @async
     * @param {number} limit - Number of places
     * @returns {Promise<Array>} Latest places
     */
    async getLatestPlaces(limit = 10) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getLatestPlaces(limit);
        }
        return [];
    },

    /**
     * Get place by ID
     * @async
     * @param {string} placeId - Place ID
     * @returns {Promise<Object|null>} Place object
     */
    async getPlaceById(placeId) {
        if (window.UserPlacesService) {
            return await window.UserPlacesService.getById(placeId);
        }
        return null;
    },

    /**
     * Clear all cache
     */
    clearCache() {
        this.cache = {
            categories: null,
            places: {},
            featuredPlace: null
        };
    }
};

window.DataManager = DataManager;
