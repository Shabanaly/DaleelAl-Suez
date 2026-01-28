/**
 * Place Renderer
 * Handles rendering of place cards in different contexts
 * @namespace PlaceRenderer
 */
const PlaceRenderer = {
    /**
     * Render offer card (special design for offers section)
     * @param {Object} place - Place object
     * @param {boolean} isAr - Is Arabic language
     * @returns {string} HTML string
     */
    renderOfferCard(place, isAr) {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const offerText = isAr ? (place.offer_text_ar || 'خصم خاص') : (place.offer_text_en || 'Special Offer');
        
        return `
            <div class="offer-card" onclick="location.href='pages/place.html?id=${place.id}'" style="cursor:pointer;">
                <div>
                    <div class="offer-badge">${isAr ? 'عرض حصري' : 'Exclusive'}</div>
                    <h4 style="margin: 8px 0; font-size:18px; font-weight:800;">${name}</h4>
                </div>
                <p style="font-size:14px; opacity:0.9; font-weight:600;">${offerText}</p>
            </div>
        `;
    },

    /**
     * Render trending place card
     * @param {Object} place - Place object
     * @param {boolean} isAr - Is Arabic language
     * @returns {string} HTML string
     */
    renderTrendingCard(place, isAr) {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const address = place.address || '';
        const image = place.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
        
        return `
            <div class="trending-card" onclick="location.href='pages/place.html?id=${place.id}'" style="cursor:pointer; background-image: url('${image}')">
                <div class="trending-overlay">
                    <span class="trending-badge">🔥 ${isAr ? 'رائج' : 'Trending'}</span>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size:17px; font-weight:800; color:white;">${name}</h4>
                        <p style="margin:0; font-size:13px; opacity:0.95; color:white;">
                            <i data-lucide="map-pin" style="width:14px; height:14px; display:inline-block; vertical-align:middle;"></i>
                            ${address}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render quick action card (for urgent services)
     * @param {Object} place - Place object
     * @param {boolean} isAr - Is Arabic language
     * @returns {string} HTML string
     */
    renderQuickActionCard(place, isAr) {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const phone = place.phone || '';
        
        return `
            <div class="quick-action-card" onclick="location.href='pages/place.html?id=${place.id}'" style="cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div class="quick-icon">
                        <i data-lucide="zap"></i>
                    </div>
                    <div>
                        <h4 style="margin:0; font-size:15px; font-weight:800;">${name}</h4>
                        ${phone ? `<p style="margin:4px 0 0 0; font-size:12px; opacity:0.7;">${phone}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render standard place card (used in category pages)
     * @param {Object} place - Place object
     * @param {boolean} isAr - Is Arabic language
     * @returns {string} HTML string
     */
    renderStandardCard(place, isAr) {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
        const address = place.address || '';
        const image = place.image || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
        const rating = parseFloat(place.rating || 0).toFixed(1);
        const reviewsCount = place.reviews_count || 0;
        
        const badges = this._renderBadges(place, isAr); // Use internal reuse helper
        
        // Generate star rating display (Simplified logic inline or helper if available)
        // Since this object doesn't have _renderStars based on previous file read, we'll do inline or simple stars
        // Ideally we should unify renderers, but for now let's just match the HTML output structure
        
        return `
            <a href="pages/place.html?id=${place.id}" class="place-card-link" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                <div class="place-card place-card-clickable">
                    <div class="card-image"> <!-- Changed from place-img to card-image to match CSS wrapper -->
                        <div class="place-img" style="background-image: url('${image}'); height: 100%; width: 100%;"></div>
                        ${badges}
                        <button class="favorite-btn" data-id="${place.id}" onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite('${place.id}')">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                    
                    <div class="card-content"> <!-- Changed from place-body to card-content to match CSS -->
                        <div class="card-header">
                            <h3 class="place-title">${name}</h3>
                            <div class="place-rating">
                               <i data-lucide="star" class="star-icon"></i>
                               <span>${rating}</span>
                               <span class="review-count">(${reviewsCount})</span>
                            </div>
                        </div>
                        ${desc ? `<p class="place-desc">${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}</p>` : ''}
                        ${address ? `
                            <p class="place-meta">
                                <i data-lucide="map-pin"></i>
                                <span>${address}</span>
                            </p>
                        ` : ''}
                    </div>
                </div>
            </a>
        `;
    },

    /**
     * Render badges for place (offer, trending, urgent)
     * @private
     * @param {Object} place - Place object
     * @param {boolean} isAr - Is Arabic language
     * @returns {string} HTML string
     */
    _renderBadges(place, isAr) {
        const badges = [];
        
        if (place.has_offer) {
            badges.push(`<span class="badge badge-offer">${isAr ? 'عرض خاص' : 'Special Offer'}</span>`);
        }
        if (place.is_trending) {
            badges.push(`<span class="badge badge-trending">${isAr ? 'رائج' : 'Trending'}</span>`);
        }
        if (place.is_urgent) {
            badges.push(`<span class="badge badge-urgent">${isAr ? 'خدمة سريعة' : 'Quick Service'}</span>`);
        }
        
        return badges.length ? `<div class="place-badges">${badges.join('')}</div>` : '';
    },

    /**
     * Render list of places
     * @param {Array} places - Array of place objects
     * @param {boolean} isAr - Is Arabic language
     * @param {string} type - Card type: 'standard', 'offer', 'trending', 'quick'
     * @returns {string} HTML string
     */
    renderList(places, isAr, type = 'standard') {
        if (!places || places.length === 0) {
            return `<p class="no-results" style="text-align: center; padding: 40px; color: var(--text-muted);">${isAr ? 'لا توجد أماكن متاحة' : 'No places available'}</p>`;
        }
        
        const renderMethod = {
            'offer': this.renderOfferCard,
            'trending': this.renderTrendingCard,
            'quick': this.renderQuickActionCard,
            'standard': this.renderStandardCard
        }[type] || this.renderStandardCard;
        
        return places.map(place => renderMethod.call(this, place, isAr)).join('');
    }
};

window.PlaceRenderer = PlaceRenderer;
