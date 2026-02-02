/**
 * Urgent/Quick Services Renderer
 * Renders urgent services section (emergency, 24/7, etc)
 */

/**
 * Render quick actions section (urgent services)
 */
async function renderQuickActions() {
    const container = document.getElementById('quick-actions-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const places = await window.UserPlacesService.getUrgentPlaces(12);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';

        container.innerHTML = places.map((place, idx) => {
            const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
            const color = colors[idx % colors.length];

            return `
                <a href="pages/place.html?id=${place.id}" class="quick-btn">
                    <div class="quick-icon" style="background: ${color}">
                        <i data-lucide="zap"></i>
                    </div>
                    <span>${name}</span>
                </a>
            `;
        }).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        container.parentElement.style.display = 'block';
    } catch (e) {
        console.error("Quick Actions Render Error", e);
        container.parentElement.style.display = 'none';
    }
}
