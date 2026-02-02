/**
 * Home Page Renderer
 * Responsibility: DOM updates for the Home page.
 */
window.HomeRenderer = {
    /**
     * Render the search suggestions box
     * @param {Array} places - Search results
     * @param {HTMLElement} container - Suggestions container
     * @param {string} query - The search query
     */
    renderSuggestions(places, container, query) {
        if (!container) return;

        if (!places || places.length === 0) {
            container.innerHTML = `<div style="padding:15px; text-align:center;">مفيش نتائج لـ "${query}"</div>`;
            container.classList.remove('hidden');
            return;
        }
        
        container.innerHTML = places.slice(0, 10).map(place => {
            const name = place.name_ar || place.name_en;
            // Note: In non-module architecture, we'll keep the onclick logic simple
            // But ideally, even this would be event-delegated in a pure Clean Architecture.
            // For now, we remain compatible with the existing DOM structure.
            return `
                <div class="suggestion-item" onclick="location.href='pages/place.html?id=${place.id}'">
                    <div class="suggestion-info">
                        <h4>${name}</h4>
                        <p>${place.address || 'السويس'}</p>
                    </div>
                </div>
            `;
        }).join('') + `
            <div class="suggestion-item" style="justify-content:center; color:var(--primary); font-weight:700" onclick="location.href='pages/search.html?q=${encodeURIComponent(query)}'">
                عرض كل النتائج لـ "${query}"
            </div>
        `;
        container.classList.remove('hidden');
    },

    /**
     * Hide the suggestions box
     * @param {HTMLElement} container 
     */
    hideSuggestions(container) {
        if (container) container.classList.add('hidden');
    },

    /**
     * Render the latest places list
     * @param {Array} places 
     * @param {HTMLElement} container 
     */
    renderPlacesList(places, container) {
        if (!container) return;

        if (!places || places.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 40px;">لا توجد أماكن حالياً</div>`;
            return;
        }

        container.innerHTML = places.map(place => {
            const image = place.image_url || 'assets/images/placeholder.jpg';
            const name = place.name_ar || place.name_en;
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
};
