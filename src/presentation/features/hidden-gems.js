/**
 * Hidden Gems Feature
 * Showcases underrated places
 */

async function initHiddenGems(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const gems = await fetchHiddenGems();
    
    container.innerHTML = gems.map(gem => `
        <div class="hidden-gem-card" onclick="location.href='pages/place.html?id=${gem.id}'">
            <div class="gem-badge">💎 جوهرة</div>
            <img src="${gem.image}" class="gem-bg">
            <div class="gem-overlay">
                <h3>${gem.name}</h3>
                <p>${gem.reason}</p>
            </div>
        </div>
    `).join('');
}

async function fetchHiddenGems() {
    try {
        if (!window.UserPlacesService) throw new Error("UserPlacesService not found");
        
        const data = await window.UserPlacesService.getHiddenGems(4);

        if (data && data.length > 0) {
            return data.map(p => ({
                id: p.id,
                name: p.name_ar,
                image: p.image_url || 'assets/images/placeholder.jpg',
                reason: p.address || 'مكان مميز يستحق التجربة'
            }));
        }
    } catch (e) {
        console.warn("Hidden Gems query failed, utilizing mock.", e);
    }

    // Mock Data (2 Items only)
    return [
        {
            id: 'mock-1',
            name: 'قهوة العمده',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
            reason: 'أحلى قهوة تركي في السويس، مكان رايق وهادي.'
        },
        {
            id: 'mock-2',
            name: 'مطعم الأسماك القديم',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
            reason: 'أكل سمك بلدي على أصوله بأسعار زمان.'
        }
    ];
}
