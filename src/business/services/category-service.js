/**
 * Category Service
 */
window.UserCategoriesService = {
    CACHE_TTL: {
        MAIN: 30,
        SUB: 30
    },

    async getMainCategories() {
        const cacheKey = 'categories_main';
        return this._withCache(cacheKey, () => window.CategoriesRepository.getMainCategories(), this.CACHE_TTL.MAIN);
    },
    
    // Alias for compatibility
    async getAll() {
        return this.getMainCategories();
    },

    async getSubcategories(mainCatId) {
        const cacheKey = `categories_sub_${mainCatId}`;
        return this._withCache(cacheKey, () => window.CategoriesRepository.getSubcategories(mainCatId), this.CACHE_TTL.SUB);
    },

    async getById(id) {
        return window.CategoriesRepository.getById(id);
    },

    async _withCache(key, fetchFn, ttl) {
        if (window.CacheService) {
            return window.CacheService.getOrFetch(key, fetchFn, ttl);
        }
        return fetchFn();
    },

    invalidateCache() {
        if (window.CacheService) {
            window.CacheService.invalidatePattern('categories_');
        }
    }
};
