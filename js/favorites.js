// favorites.js - Local Favorites System (LocalStorage)

const FAVORITES_KEY = 'suez_guide_favorites';

/**
 * Get all favorite slugs from LocalStorage
 * @returns {Array<string>}
 */
function getFavorites() {
    try {
        const favs = localStorage.getItem(FAVORITES_KEY);
        return favs ? JSON.parse(favs) : [];
    } catch (e) {
        console.error('Error reading favorites from localStorage', e);
        return [];
    }
}

/**
 * Save favorite slugs to LocalStorage
 * @param {Array<string>} favs 
 */
function saveFavorites(favs) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
        console.error('Error saving favorites to localStorage', e);
    }
}

/**
 * Toggle a place in favorites
 * @param {string} slug 
 * @returns {boolean} - true if added, false if removed
 */
function toggleFavorite(slug) {
    let favs = getFavorites();
    const index = favs.indexOf(slug);
    let added = false;

    if (index === -1) {
        favs.push(slug);
        added = true;
    } else {
        favs.splice(index, 1);
        added = false;
    }

    saveFavorites(favs);
    return added;
}

/**
 * Check if a place is favorited
 * @param {string} slug 
 * @returns {boolean}
 */
function isFavorite(slug) {
    return getFavorites().includes(slug);
}

/**
 * Render favorite places on the favorites page
 */
function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const noFavs = document.getElementById('no-favorites');
    const meta = document.getElementById('fav-count-meta');
    if (!container) return;

    const slugs = getFavorites();
    const allData = [
        ...(typeof restaurants !== 'undefined' ? restaurants : []),
        ...(typeof cafes !== 'undefined' ? cafes : []),
        ...(typeof doctors !== 'undefined' ? doctors : []),
        ...(typeof pharmacies !== 'undefined' ? pharmacies : []),
        ...(typeof services !== 'undefined' ? services : []),
        ...(typeof shops !== 'undefined' ? shops : [])
    ];

    const favPlaces = allData.filter(p => slugs.includes(p.slug));

    if (favPlaces.length === 0) {
        container.style.display = 'none';
        if (noFavs) noFavs.style.display = 'block';
        if (meta) meta.style.display = 'none';
    } else {
        container.style.display = 'grid';
        if (noFavs) noFavs.style.display = 'none';
        if (meta) {
            meta.style.display = 'block';
            meta.textContent = (document.documentElement.lang === 'en' ? 'Showing ' : 'عرض ') + favPlaces.length + (document.documentElement.lang === 'en' ? ' places' : ' مكان');
        }
        
        if (typeof renderPlaces === 'function') {
            renderPlaces(favPlaces, 'favorites-container');
        }
    }
}
