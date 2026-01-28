/**
 * Place Card Renderer
 * Reusable place card component used across the app
 */

/**
 * Render a single place card
 * @param {Object} place - Place object
 * @param {boolean} isAr - Is Arabic language
 * @param {string} placeLink - Link to place details
 * @returns {string} HTML string
 */
export function renderPlaceCard(place, isAr, placeLink = 'place.html') {
    const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
    const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
    const image = place.image_url || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
    
    // New variables for the updated card structure
    const rating = parseFloat(place.rating || 0).toFixed(1);
    const reviewsCount = place.reviews_count || 0;
    const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
    const targetUrl = `${placeLink}?id=${place.id}`;

    return `
        <a href="${targetUrl}" class="place-card-link" style="text-decoration: none; color: inherit; display: block; height: 100%;">
            <div class="place-card">
                <div class="card-image">
                    <img src="${image}" alt="${name}" loading="lazy">
                    ${place.is_featured ? `<span class="badge-featured">${I18n.t('place_featured')}</span>` : ''}
                    <button class="favorite-btn" data-id="${place.id}" onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite('${place.id}')">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="place-title">${name}</h3>
                        <div class="place-rating">
                           <i data-lucide="star" class="star-icon"></i>
                           <span>${rating}</span>
                           <span class="review-count">(${reviewsCount})</span>
                        </div>
                    </div>
                    
                    ${address ? `<p class="place-address">
                        <i data-lucide="map-pin"></i>
                        <span>${address}</span>
                    </p>` : ''}
                </div>
            </div>
        </a>
    `;
}

/**
 * Render list of places
 * @param {Array} places - Array of place objects
 * @param {string} containerId - Container element ID
 */
export function renderPlaces(places, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!places || places.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">لا توجد أماكن حالياً</div>`;
        return;
    }

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';
    const path = window.location.pathname;
    const isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
    const placeLink = isHome ? "pages/place.html" : "place.html";

    container.innerHTML = places.map(place => renderPlaceCard(place, isAr, placeLink)).join('');

    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
}

/**
 * PlaceRenderer object for backward compatibility with imports
 */
export const PlaceRenderer = {
    renderCard: renderPlaceCard,
    renderList(places, isAr, type = 'default') {
        if (!places || places.length === 0) {
            return `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">لا توجد نتائج</div>`;
        }
        
        const path = window.location.pathname;
        const isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
        const placeLink = isHome ? "pages/place.html" : "place.html";
        
        return places.map(place => renderPlaceCard(place, isAr, placeLink)).join('');
    }
};

// ===================================
// FAVORITES LOGIC
// ===================================

/**
 * Toggle Favorite (Global Handler)
 * Updates UI immediately (Optimistic) and calls service
 */
window.toggleFavorite = async (id) => {
    // Find all buttons for this place (in case of duplicates/list)
    const buttons = document.querySelectorAll(`.favorite-btn[data-id="${id}"]`);
    
    // 1. Optimistic Update
    buttons.forEach(btn => btn.classList.toggle('active'));
    
    // 2. Call Service
    if (window.FavoritesService) {
        const isFavorited = await window.FavoritesService.toggleFavorite(id);
        
        // 3. Correction (Source of Truth)
        buttons.forEach(btn => {
            if (isFavorited) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // 4. Dispatch Event for other components (e.g. Favorites Page)
        window.dispatchEvent(new CustomEvent('place-favorite-toggled', { 
            detail: { id, isFavorited } 
        }));
    } else {
        console.error("FavoritesService not found");
        // Revert
        buttons.forEach(btn => btn.classList.toggle('active'));
    }
};

/**
 * Sync Icons with User Favorites
 * Called after render
 */
window.syncFavoriteIcons = async () => {
    if (!window.FavoritesService) return;
    
    const ids = await window.FavoritesService.getFavoritesIds();
    if (!ids) return; // Not logged in or error
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        // Check both string and int just in case
        if (ids.has(id) || ids.has(parseInt(id))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};
