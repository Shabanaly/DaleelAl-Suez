/**
 * Search Page Logic
 * Handles input, URL params, and rendering.
 */

import { searchPlaces } from '../features/search-engine.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    
    // 1. Check URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        searchInput.value = query;
        await performSearch(query);
    }
    
    // 2. Input Event (Debounce)
    let timeout = null;
    const triggerSearch = () => {
        const val = searchInput.value.trim();
        const filters = {
            offers: document.querySelector('[data-filter="offers"]').classList.contains('active'),
            open: document.querySelector('[data-filter="open"]').classList.contains('active'),
            top: document.querySelector('[data-filter="top"]').classList.contains('active')
        };
        performSearch(val, filters);
    };

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        // Update URL
        const newUrl = new URL(window.location);
        if (val) newUrl.searchParams.set('q', val);
        else newUrl.searchParams.delete('q');
        window.history.replaceState({}, '', newUrl);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (val.length > 1 || Object.values(getFilters()).some(v=>v)) triggerSearch();
            else {
                resultsContainer.innerHTML = '';
                emptyState.classList.remove('hidden');
            }
        }, 500); 
    });

    // 3. Filter Chips
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            triggerSearch();
        });
    });

    function getFilters() {
        return {
            offers: document.querySelector('[data-filter="offers"]').classList.contains('active'),
            open: document.querySelector('[data-filter="open"]').classList.contains('active'),
            top: document.querySelector('[data-filter="top"]').classList.contains('active')
        };
    }
});

async function performSearch(query, filters = {}) {
    const loading = document.getElementById('loading-state');
    const container = document.getElementById('results-container');
    const empty = document.getElementById('empty-state');
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    empty.classList.add('hidden');
    
    try {
        const results = await searchPlaces(query, filters);
        
        loading.classList.add('hidden');
        
        if (results && results.length > 0) {
            renderResults(results, container);
        } else {
            empty.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Search Error", e);
        loading.classList.add('hidden');
        empty.classList.remove('hidden');
    }
}

function renderResults(places, container) {
    container.innerHTML = places.map(place => `
        <div class="listing-card" onclick="location.href='place.html?id=${place.id}'">
            <div class="listing-img">
                <img src="${place.image_url || '../assets/images/placeholder.jpg'}" loading="lazy" onerror="this.src='../assets/images/placeholder.jpg'">
            </div>
            <div class="listing-content">
                <h3>${place.name_ar || place.name}</h3>
                <p>${place.address || place.category_name || 'السويس'}</p>
            </div>
        </div>
    `).join('');
}
