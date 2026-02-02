/**
 * Place Card Renderer
 * Reusable place card component used across the app
 */
window.PlaceRenderer = {
    /**
     * Render a single place card
     */
    renderCard(place, isAr, placeLink = 'place.html') {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const image = place.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
        const rating = parseFloat(place.rating || 0).toFixed(1);
        const reviewsCount = place.reviews_count || 0;
        const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
        const targetUrl = `${placeLink}?id=${place.id}`;

        return `
            <a href="${targetUrl}" class="place-card-link" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                <div class="place-card">
                    <div class="card-image">
                        <img src="${image}" alt="${name}" loading="lazy">
                        ${place.is_featured ? `<span class="badge-featured">مميز</span>` : ''}
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
    },

    /**
     * Render list of places
     */
    renderList(places, containerIdOrElement) {
        const container = typeof containerIdOrElement === 'string' ? document.getElementById(containerIdOrElement) : containerIdOrElement;
        if (!container) return "";

        if (!places || places.length === 0) {
            const emptyHtml = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">لا توجد أماكن حالياً</div>`;
            if (typeof containerIdOrElement === 'string') container.innerHTML = emptyHtml;
            return emptyHtml;
        }

        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';
        const path = window.location.pathname;
        const isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
        const placeLink = isHome ? "pages/place.html" : "place.html";

        const html = places.map(place => this.renderCard(place, isAr, placeLink)).join('');
        
        if (typeof containerIdOrElement === 'string') {
            container.innerHTML = html;
            if (typeof lucide !== "undefined") lucide.createIcons();
            if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
        }
        
        return html;
    }
};

// Also export as a global function for places-view.js compatibility if needed
window.renderPlaces = window.PlaceRenderer.renderList.bind(window.PlaceRenderer);

// Favorites Toggling Logic
window.toggleFavorite = async (id) => {
    const buttons = document.querySelectorAll(`.favorite-btn[data-id="${id}"]`);
    buttons.forEach(btn => btn.classList.toggle('active'));
    
    if (window.FavoritesService || window.UserFavoritesService) {
        const service = window.FavoritesService || window.UserFavoritesService;
        const isFavorited = await service.toggleFavorite(id);
        
        buttons.forEach(btn => {
            if (isFavorited) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        window.dispatchEvent(new CustomEvent('place-favorite-toggled', { 
            detail: { id, isFavorited } 
        }));
    }
};

window.syncFavoriteIcons = async () => {
    const service = window.FavoritesService || window.UserFavoritesService;
    if (!service || !service.getFavoritesIds) return;
    
    const ids = await service.getFavoritesIds();
    if (!ids) return;
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (ids.has(id) || ids.has(parseInt(id))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};
