/**
 * Home Page Controller
 * Orchestrates all home page rendering and initialization
 */

import { renderOffers } from '../renderers/home/offers-renderer.js';
import { renderTrendingHub } from '../renderers/home/trending-renderer.js';
import { renderQuickActions } from '../renderers/home/urgent-renderer.js';
import { renderExploreCity } from '../renderers/home/featured-renderer.js';

/**
 * Initialize homepage with all widgets and content
 */
export async function initHomePage() {
    console.log("DEBUG: Initializing Homepage Widgets");
    
    try {
        // Render all sections concurrently
        await Promise.all([
            renderOffers(),
            renderSuezInfo(),
            renderTrendingHub(),
            renderQuickActions(),
            renderExploreCity()
        ]);
        
        // Render reviews (if needed)
        renderHomepageReviews();
        
        // Load latest places
        if (window.UserPlacesService) {
            const allPlaces = await window.UserPlacesService.getLatestPlaces(7);
            if (allPlaces) renderPlaces(allPlaces, "places-container");
        }
    } catch (error) {
        console.error('Home page initialization error:', error);
    }
}

/**
 * Render Suez info widget (weather + clock)
 */
async function renderSuezInfo() {
    const container = document.getElementById('info-container');
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    // Initial HTML
    container.innerHTML = `
        <div class="info-chip">
            <div class="info-icon"><i data-lucide="cloud"></i></div>
            <div class="info-body">
                <div class="info-value" id="suez-temp">--°C</div>
                <div class="info-label">${isAr ? 'جو السويس' : 'Suez Weather'}</div>
            </div>
        </div>
        <div class="info-chip">
            <div class="info-icon" style="color: var(--secondary);"><i data-lucide="clock"></i></div>
            <div class="info-body">
                <div class="info-value" id="real-time-clock">--:--:--</div>
                <div class="info-label" id="real-time-date">--/--/----</div>
            </div>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();

    // Fetch weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=29.97&longitude=32.53&current_weather=true')
        .then(res => res.json())
        .then(data => {
            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const tempEl = document.getElementById('suez-temp');
                if (tempEl) tempEl.innerText = `${temp}°C`;
            }
        }).catch(err => console.warn("Weather fetch failed", err));

    // Start clock
    function updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('real-time-clock');
        const dateEl = document.getElementById('real-time-date');
        
        if (clockEl) {
            clockEl.innerText = now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            });
        }
        if (dateEl) {
            dateEl.innerText = now.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                day: 'numeric', month: 'short'
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Render homepage reviews section
 */
function renderHomepageReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = "";
}

/**
 * Render places in a container
 */
function renderPlaces(places, containerId) {
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

    container.innerHTML = places.map(place => {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
        const image = place.image_url || (place.images && place.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image';
        
        const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;

        return `
            <div class="listing-card" onclick="location.href='${placeLink}?id=${place.id}'" style="cursor: pointer;">
                <div class="listing-img">
                    <img src="${image}" alt="${name}" loading="lazy">
                    <div class="fav-btn" data-id="${place.id}" onclick="event.stopPropagation(); toggleFavorite('${place.id}')">
                        <i data-lucide="heart"></i>
                    </div>
                </div>
                <div class="listing-content">
                    <h3>${name}</h3>
                    <p>${shortDesc}</p>
                    ${place.address ? `<div class="address-tag">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                        <span>${place.address}</span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
}
