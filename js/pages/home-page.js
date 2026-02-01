/**
 * Home Page Controller (Clean Architecture)
 * Orchestrates home page modules.
 * Decoupled from legacy renderers.
 */

import { initMoodPicker } from '../features/mood-picker.js';
import { initSuezLive } from '../features/suez-live.js';
import { initStories } from '../features/stories-bar.js';
import { initEvents } from '../features/events-widget.js';
import { initHiddenGems } from '../features/hidden-gems.js';
import { initTrendingTags } from '../features/trending-bar.js';
import { initQuickServices } from '../features/quick-services.js';
import { initAIBot } from '../features/ai-bot.js';
import { renderOffers } from '../renderers/home/offers-renderer.js';

/**
 * Initialize homepage
 */
import { initCategoriesSidebar } from '../features/categories-sidebar.js'; // New
import { searchPlaces } from '../features/search-engine.js'; // Helper

const SEARCH_HISTORY_KEY = 'suez_search_history';

// Global Helper for onclick events in HTML strings
window.selectPlace = (id, name) => {
    // Sanitization handled by function
    addToHistory({ type: 'place', id, name });
    location.href = `pages/place.html?id=${id}`;
};

function addToHistory(item) {
    let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    // Remove duplicates
    history = history.filter(h => {
        if (item.type === 'text') return h.query !== item.query;
        if (item.type === 'place') return h.id !== item.id;
        return true;
    });
    // Add to top
    history.unshift(item);
    // Limit to 5
    if (history.length > 5) history.pop();
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

export async function initHomePage() {
    console.log("🚀 Initializing Clean Home Page");

    // 1. Core Visuals
    initMoodPicker('mood-picker-container');
    initSuezLive('suez-live-widget');
    initStories('stories-container');
    
    initEvents('events-container');
    initHiddenGems('gems-container');
    
    // 2. Sidebar (Restored)
    initCategoriesSidebar('categories-sidebar-container');

    // 3. Search & Autosuggest
    setupSearchLogic();

    // 4. Init Offers & Listings
    renderOffers();
    loadLatestPlaces();
}

function setupSearchLogic() {
    console.log("🔍 Setting up Search Logic...");
    const searchContainer = document.querySelector('.search-ui');
    if (!searchContainer) {
        console.warn("Search UI container not found");
        return;
    }

    const input = searchContainer.querySelector('input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const icon = searchContainer.querySelector('i') || searchContainer.querySelector('svg');

    if (!input) {
        console.warn("Search input not found");
        return;
    }

    console.log("✅ Search Input Found. Attaching listeners.");

    // Perform Search (Redirect)
    const doSearch = () => {
        const val = input.value.trim();
        console.log("Search Requested:", val);
        if (val) window.location.href = `pages/search.html?q=${encodeURIComponent(val)}`;
    };

    // Autosuggest
    let timeout;
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        console.log("Input:", query); // Debug
        clearTimeout(timeout);
        
        if (query.length < 2) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        timeout = setTimeout(async () => {
            console.log("Fetching suggestions for:", query);
            try {
                // Use existing search engine
                const results = await searchPlaces(query);
                console.log("Suggestions:", results);
                renderSuggestions(results, suggestionsBox);
            } catch (err) {
                console.error("Search Suggest Error:", err);
            }
        }, 300);
    });

    // 3. Enter Key -> Search Results Page
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val) {
                addToHistory({ type: 'text', query: val });
                location.href = `pages/search.html?q=${encodeURIComponent(val)}`;
            }
        }
    });
    
    // 4. Click Outside to Close
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

// Render Recent History
function renderHistory(container) {
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    if (history.length === 0) {
        container.classList.add('hidden');
        return;
    }

    const html = history.map(item => {
        if (item.type === 'place') {
            return `
                <div class="suggestion-item history-item" onclick="location.href='pages/place.html?id=${item.id}'">
                    <div class="suggestion-icon" style="background:#f0f2f5"><i data-lucide="clock" style="color:#65676b"></i></div>
                    <div class="suggestion-info">
                        <h4>${item.name}</h4>
                        <p>آخر زيارة</p>
                    </div>
                </div>`;
        } else {
            return `
                <div class="suggestion-item history-item" onclick="location.href='pages/search.html?q=${encodeURIComponent(item.query)}'">
                    <div class="suggestion-icon" style="background:#f0f2f5"><i data-lucide="search" style="color:#65676b"></i></div>
                    <div class="suggestion-info">
                        <h4>${item.query}</h4>
                        <p>بحث سابق</p>
                    </div>
                </div>`;
        }
    }).join('');

    // Add Header "Recent"
    container.innerHTML = `<div style="padding:8px 12px; font-size:12px; color:#65676b; font-weight:600">عمليات البحث الأخيرة</div>` + html;
    container.classList.remove('hidden');
    lucide.createIcons();
}

// Render Suggestions (Smart)
function renderSuggestions(places, container, query) {
    if (!places || places.length === 0) {
        container.innerHTML = `<div style="padding:15px; text-align:center; color:#666">مفيش نتائج لـ "${query}" 😕</div>`;
        container.classList.remove('hidden');
        return;
    }
    
    const getImg = (p) => p.image_url || 'assets/images/placeholder.jpg';
    
    // Show up to 50 items (Scroll handled by CSS)
    let html = places.slice(0, 50).map(place => {
        const name = place.name_ar || place.name_en || 'اسم المكان';
        const safeName = name.replace(/'/g, "\\'"); // Escape quotes
        return `
        <div class="suggestion-item" onclick="selectPlace('${place.id}', '${safeName}')">
            <div class="suggestion-icon">
                <img src="${getImg(place)}" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="suggestion-info">
                <h4>${place.name_ar || place.name_en || 'اسم المكان'}</h4>
                <p>${place.address || 'السويس'}</p>
            </div>
             <div style="margin-right:auto; padding-left:5px;">
                <i data-lucide="arrow-left" style="width:16px; color:var(--primary)"></i>
            </div>
        </div>
    `;
    }).join('');

    // "See All" Link
    html += `
        <div class="suggestion-item" style="justify-content:center; color:var(--primary); font-weight:700" onclick="location.href='pages/search.html?q=${encodeURIComponent(query)}'">
            عرض كل النتائج لـ "${query}"
        </div>
    `;
    
    container.innerHTML = html;
    container.classList.remove('hidden');
}



async function loadLatestPlaces() {
    const container = document.getElementById('places-container');
    if (!container) return; // Should exist

    if (window.UserPlacesService) {
        try {
            const places = await window.UserPlacesService.getLatestPlaces(8);
            if (places && places.length > 0) {
                renderHomePlaces(places, container);
            } else {
                container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px;">لا توجد أماكن حالياً</div>`;
            }
        } catch (e) {
            console.error("Failed to load places", e);
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted);">خطأ في تحميل الأماكن</div>`;
        }
    }
}

function renderHomePlaces(places, container) {
    // We use a simple render logic specific to Home Grid
    // This strictly follows the decoupling rule.
    // It creates cards compatible with css/pages/home.css
    
    container.innerHTML = places.map(place => {
        const image = place.image_url || 'assets/images/placeholder.jpg';
        const name = place.name_ar || place.name_en; // Default to AR
        
        return `
            <div class="listing-card" onclick="location.href='pages/place.html?id=${place.id}'">
                <div class="listing-img">
                    <img src="${image}" alt="${name}" loading="lazy">
                </div>
                <div class="listing-content">
                    <h3>${name}</h3>
                    <p style="font-size: 12px; color: var(--text-muted);">${place.address || 'السويس'}</p>
                </div>
            </div>
        `;
    }).join('');
}
