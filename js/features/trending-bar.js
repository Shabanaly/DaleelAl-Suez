/**
 * Trending Tags Feature
 * Renders dynamic tags under search bar
 */

export async function initTrendingTags(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        const { data } = await window.sb
            .from('trending_tags')
            .select('tag')
            .eq('is_active', true)
            .limit(5);

        if (data && data.length > 0) {
            renderTags(container, data.map(t => t.tag));
            return;
        }
    } catch (e) {
        console.warn("Trending tags fetch failed");
    }

    // Fallback Mock Data
    const mockTags = ['سوشي', 'فيو_بحر', 'فطار', '24_ساعة'];
    renderTags(container, mockTags);
}

function renderTags(container, tags) {
    const html = `
        <span>🔥 تريند:</span>
        ${tags.map(tag => `<a href="pages/search.html?q=${tag}">#${tag}</a>`).join('')}
    `;
    container.innerHTML = html;
}
