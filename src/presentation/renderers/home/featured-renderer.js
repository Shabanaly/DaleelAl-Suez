/**
 * Featured/Spotlight Renderer
 * Renders the "Explore City" featured place section
 */

/**
 * Render explore city featured section
 */
async function renderExploreCity() {
    const container = document.getElementById('explore-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const place = await window.UserPlacesService.getFeaturedPlace();
        if (!place) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const image = place.image_url || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';
        const desc = isAr ? (place.desc_ar || '') : (place.desc_en || '');

        container.innerHTML = `
            <div class="explore-hero-card" onclick="location.href='pages/place.html?id=${place.id}'">
                <img src="${image}" alt="${name}" class="explore-bg">
                <div class="explore-overlay">
                    <div class="explore-badge">${isAr ? 'نرشح لك اليوم' : 'Daily Spotlight'}</div>
                    <h2 class="explore-title">${name}</h2>
                    <p class="explore-desc">${desc.substring(0, 120)}...</p>
                    <div class="explore-footer">
                        <span class="explore-btn">${isAr ? 'اكتشف الآن' : 'Explore Now'}</span>
                    </div>
                </div>
            </div>
        `;
        container.parentElement.style.display = 'block';
    } catch (e) {
        console.error("Explore City Error", e);
        container.parentElement.style.display = 'none';
    }
}
