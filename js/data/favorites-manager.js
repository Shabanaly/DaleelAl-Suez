/**
 * Favorites Data Manager
 * Handles LocalStorage operations for favorites using Supabase UUIDs
 */

const FAVORITES_KEY = 'suez_guide_favorites';

/**
 * Validates if a string is a valid UUID
 * @param {string} str - String to validate
 * @returns {boolean}
 */
function isUUID(str) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

/**
 * Get all favorite IDs from LocalStorage (Cleans legacy data)
 * @returns {Array<string>} Array of valid UUIDs
 */
export function getFavorites() {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        const favs = raw ? JSON.parse(raw) : [];
        
        // Filter out legacy slugs or corrupted 'undefined' strings
        const validFavs = favs.filter(id => id && typeof id === 'string' && isUUID(id));
        
        // If we cleaned up some bad data, save the clean version back
        if (favs.length !== validFavs.length) {
            saveFavorites(validFavs);
        }
        
        return validFavs;
    } catch (e) {
        console.error('Error reading favorites from localStorage', e);
        return [];
    }
}

/**
 * Save favorite IDs to LocalStorage
 * @param {Array<string>} favs - Array of UUIDs
 */
export function saveFavorites(favs) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
        console.error('Error saving favorites to localStorage', e);
    }
}

/**
 * Toggle a place in favorites by ID
 * @param {string} id - Place UUID
 * @returns {boolean} - true if added, false if removed
 */
export function toggleFavorite(id) {
    let favs = getFavorites();
    const index = favs.indexOf(id);
    let added = false;

    if (index === -1) {
        favs.push(id);
        added = true;
    } else {
        favs.splice(index, 1);
        added = false;
    }

    saveFavorites(favs);
    return added;
}

/**
 * Check if a place is favorited by ID
 * @param {string} id - Place UUID
 * @returns {boolean}
 */
export function isFavorite(id) {
    return getFavorites().includes(id);
}

// Keep toggleFavorite global for inline onclick handlers
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
