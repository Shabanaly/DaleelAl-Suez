/**
 * Categories Service (User-facing) - WITH CACHING
 * Handles fetching category data from Supabase for user pages
 * Uses CacheService for browser-side caching
 */

/**
 * User Categories Service
 * Provides methods to fetch categories and subcategories
 * @namespace UserCategoriesService
 */
window.UserCategoriesService = {
    // Cache TTL in minutes (categories rarely change)
    CACHE_TTL: {
        MAIN: 30,      // Main categories - 30 minutes
        SUB: 30        // Subcategories - 30 minutes
    },

    /**
     * Fetch all main categories (with caching)
     * @async
     * @returns {Promise<Array>} Array of category objects
     */
    async getMainCategories() {
        const cacheKey = 'categories_main';
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return this._fetchMainCategories();
            }, this.CACHE_TTL.MAIN);
        }
        
        return this._fetchMainCategories();
    },

    async _fetchMainCategories() {
        if (!window.sb) return [];
        const { data, error } = await window.sb
            .from('categories')
            .select('*')
            .order('name_ar');
        if (error) console.error(error);
        return data || [];
    },

    /**
     * Alias for getMainCategories() for backward compatibility
     * @async
     * @returns {Promise<Array>} Array of category objects
     */
    async getAll() {
        return this.getMainCategories();
    },

    /**
     * Fetch subcategories for a specific parent category (with caching)
     * @async
     * @param {string} mainCatId - Main category ID
     * @returns {Promise<Array>} Array of subcategory objects
     */
    async getSubcategories(mainCatId) {
        if (!mainCatId) return [];
        
        const cacheKey = `categories_sub_${mainCatId}`;
        
        if (window.CacheService) {
            return window.CacheService.getOrFetch(cacheKey, async () => {
                return this._fetchSubcategories(mainCatId);
            }, this.CACHE_TTL.SUB);
        }
        
        return this._fetchSubcategories(mainCatId);
    },

    async _fetchSubcategories(mainCatId) {
        if (!window.sb || !mainCatId) return [];
        const { data, error } = await window.sb
            .from('subcategories')
            .select('*')
            .eq('main_cat_id', mainCatId)
            .order('name_ar');
        if (error) console.error(error);
        return data || [];
    },

    /**
     * Invalidate categories cache (call after admin updates)
     */
    invalidateCache() {
        if (window.CacheService) {
            window.CacheService.invalidatePattern('categories_');
        }
    }
};
