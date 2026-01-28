/**
 * Trending Places Renderer
 * Renders the trending/popular places section
 */

/**
 * Render trending hub section
 */
export async function renderTrendingHub() {
    const container = document.getElementById('trending-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const places = await window.UserPlacesService.getTrendingPlaces(12);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';

        container.innerHTML = places.map(place => {
            const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
            return `<a href="pages/place.html?id=${place.id}" class="trending-chip"># ${name}</a>`;
        }).join('');
        
        container.parentElement.style.display = 'block';
    } catch (e) {
        console.error("Trending Render Error", e);
        container.parentElement.style.display = 'none';
    }
}
