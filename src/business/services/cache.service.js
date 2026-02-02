/**
 * Cache Service
 * Provides browser-side caching using localStorage with TTL support
 * Reduces server requests and improves performance
 */

const CacheService = {
    // Memory cache for faster access within same session
    _memoryCache: new Map(),
    
    // Default TTL in minutes
    DEFAULT_TTL: 10,
    
    // Prefix for all cache keys
    PREFIX: 'suez_cache_',

    /**
     * Generate cache key with prefix
     * @param {string} key - Original key
     * @returns {string} Prefixed key
     */
    _getKey(key) {
        return this.PREFIX + key;
    },

    /**
     * Store data in cache with TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttlMinutes - Time to live in minutes (default: 10)
     */
    set(key, data, ttlMinutes = this.DEFAULT_TTL) {
        const cacheKey = this._getKey(key);
        const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
        
        const cacheEntry = {
            data: data,
            expiresAt: expiresAt,
            cachedAt: Date.now()
        };
        
        // Store in memory cache
        this._memoryCache.set(cacheKey, cacheEntry);
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
        } catch (e) {
            // localStorage might be full or disabled
            console.warn('Cache: localStorage write failed', e);
            // Try to clear old cache entries
            this._cleanupOldEntries();
        }
    },

    /**
     * Get cached data if not expired
     * @param {string} key - Cache key
     * @returns {any|null} Cached data or null if expired/not found
     */
    get(key) {
        const cacheKey = this._getKey(key);
        
        // Try memory cache first (faster)
        if (this._memoryCache.has(cacheKey)) {
            const entry = this._memoryCache.get(cacheKey);
            if (entry.expiresAt > Date.now()) {
                return entry.data;
            } else {
                // Expired, remove from memory
                this._memoryCache.delete(cacheKey);
            }
        }
        
        // Try localStorage
        try {
            const stored = localStorage.getItem(cacheKey);
            if (stored) {
                const entry = JSON.parse(stored);
                if (entry.expiresAt > Date.now()) {
                    // Still valid, also store in memory for faster future access
                    this._memoryCache.set(cacheKey, entry);
                    return entry.data;
                } else {
                    // Expired, clean up
                    localStorage.removeItem(cacheKey);
                }
            }
        } catch (e) {
            console.warn('Cache: localStorage read failed', e);
        }
        
        return null;
    },

    /**
     * Check if cache entry exists and is valid
     * @param {string} key - Cache key
     * @returns {boolean} True if valid cache exists
     */
    has(key) {
        return this.get(key) !== null;
    },

    /**
     * Invalidate specific cache entry
     * @param {string} key - Cache key to invalidate
     */
    invalidate(key) {
        const cacheKey = this._getKey(key);
        this._memoryCache.delete(cacheKey);
        try {
            localStorage.removeItem(cacheKey);
        } catch (e) {}
    },

    /**
     * Invalidate all cache entries matching a pattern
     * @param {string} pattern - Pattern to match (e.g., 'places_')
     */
    invalidatePattern(pattern) {
        const fullPattern = this.PREFIX + pattern;
        
        // Clear from memory
        for (const key of this._memoryCache.keys()) {
            if (key.includes(fullPattern)) {
                this._memoryCache.delete(key);
            }
        }
        
        // Clear from localStorage
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes(fullPattern)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (e) {}
    },

    /**
     * Clear all cache entries
     */
    clearAll() {
        this._memoryCache.clear();
        
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (e) {}
    },

    /**
     * Get cache info for debugging
     * @returns {Object} Cache statistics
     */
    getInfo() {
        let totalEntries = 0;
        let expiredEntries = 0;
        let totalSize = 0;
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.PREFIX)) {
                    totalEntries++;
                    const value = localStorage.getItem(key);
                    totalSize += value ? value.length : 0;
                    
                    try {
                        const entry = JSON.parse(value);
                        if (entry.expiresAt <= Date.now()) {
                            expiredEntries++;
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}
        
        return {
            totalEntries,
            expiredEntries,
            validEntries: totalEntries - expiredEntries,
            sizeBytes: totalSize,
            memoryEntries: this._memoryCache.size
        };
    },

    /**
     * Clean up expired entries (called periodically or on storage pressure)
     */
    _cleanupOldEntries() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.PREFIX)) {
                    const value = localStorage.getItem(key);
                    try {
                        const entry = JSON.parse(value);
                        if (entry.expiresAt <= Date.now()) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {
                        // Invalid entry, remove it
                        keysToRemove.push(key);
                    }
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (e) {}
    },

    /**
     * Wrapper for async functions - returns cached data or fetches fresh
     * @param {string} key - Cache key
     * @param {Function} fetchFn - Async function to fetch fresh data
     * @param {number} ttlMinutes - TTL in minutes
     * @returns {Promise<any>} Cached or fresh data
     */
    async getOrFetch(key, fetchFn, ttlMinutes = this.DEFAULT_TTL) {
        // Try cache first
        const cached = this.get(key);
        if (cached !== null) {
            console.log(`Cache HIT: ${key}`);
            return cached;
        }
        
        // Cache miss - fetch fresh data
        console.log(`Cache MISS: ${key}`);
        const data = await fetchFn();
        
        // Only cache non-empty results
        if (data !== null && data !== undefined) {
            this.set(key, data, ttlMinutes);
        }
        
        return data;
    }
};

// Run cleanup on page load
document.addEventListener('DOMContentLoaded', () => {
    CacheService._cleanupOldEntries();
});

// Expose globally
window.CacheService = CacheService;
