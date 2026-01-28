// favorites.js - Local Favorites System (LocalStorage using Supabase IDs)

const FAVORITES_KEY = 'suez_guide_favorites';

/**
 * Validates if a string is a valid UUID
 */
function isUUID(str) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

/**
 * Get all favorite IDs from LocalStorage (Cleans legacy data)
 * @returns {Array<string>}
 */
function getFavorites() {
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
 * Toggle a place in favorites by ID
 * @param {string} id 
 * @returns {boolean} - true if added, false if removed
 */
function toggleFavorite(id) {
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
    syncFavoriteIcons();
    return added;
}

/**
 * Check if a place is favorited by ID
 * @param {string} id 
 * @returns {boolean}
 */
function isFavorite(id) {
    return getFavorites().includes(id);
}

/**
 * Update heart icon UI states on the page based on stored favorites
 */
function syncFavoriteIcons() {
    const ids = getFavorites();
    const isAr = document.documentElement.lang === 'ar';

    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const textSpan = btn.querySelector('span');
        const isFav = ids.includes(id);

        if (isFav) {
            btn.classList.add('active');
            if (icon) icon.setAttribute('data-lucide', 'heart-off');
            if (textSpan) textSpan.innerText = isAr ? 'إزالة من المفضلة' : 'Remove Favorite';
            // Specific style for sidebar btn
            if (btn.classList.contains('btn-primary-modern')) {
                btn.style.background = 'var(--error-soft)';
                btn.style.color = 'var(--error)';
            }
        } else {
            btn.classList.remove('active');
            if (icon) icon.setAttribute('data-lucide', 'heart');
            if (textSpan) textSpan.innerText = isAr ? 'إضافة للمفضلة' : 'Add to Favorites';
            if (btn.classList.contains('btn-primary-modern')) {
                btn.style.background = 'var(--bg-main)';
                btn.style.color = 'var(--text-main)';
            }
        }
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Render favorite places on the favorites page
 */
async function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const noFavs = document.getElementById('no-favorites');
    const meta = document.getElementById('fav-count-meta');
    if (!container) return;

    const ids = getFavorites();
    
    if (ids.length === 0) {
        container.style.display = 'none';
        if (noFavs) noFavs.style.display = 'block';
        if (meta) meta.style.display = 'none';
        return;
    }

    // Wait for Supabase
    if (!window.sb) {
        setTimeout(renderFavorites, 100);
        return;
    }

    try {
        const { data: favPlaces, error } = await window.sb
            .from('places')
            .select('*')
            .in('id', ids)
            .eq('is_active', true);

        if (error) throw error;

        if (!favPlaces || favPlaces.length === 0) {
            container.style.display = 'none';
            if (noFavs) noFavs.style.display = 'block';
            if (meta) meta.style.display = 'none';
        } else {
            container.style.display = 'grid';
            if (noFavs) noFavs.style.display = 'none';
            if (meta) {
                const isAr = document.documentElement.lang === 'ar';
                meta.style.display = 'block';
                meta.textContent = (isAr ? 'عرض ' : 'Showing ') + favPlaces.length + (isAr ? ' مكان مفضل' : ' favorite places');
            }
            
            if (typeof renderPlaces === 'function') {
                renderPlaces(favPlaces, 'favorites-container');
            }
        }
    } catch (e) {
        console.error("Render Favorites Error", e);
        container.innerHTML = `<div style="padding:40px; text-align:center; color:#f00;">حدث خطأ أثناء تحميل المفضلة</div>`;
    }
}

// Keep toggleFavorite global for inline usage
window.toggleFavorite = toggleFavorite;
