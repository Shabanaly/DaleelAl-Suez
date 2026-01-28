/**
 * Categories Grid Renderer
 * Renders the global categories navigation bar
 */

/**
 * Render global categories navigation
 * @param {boolean} isHome - Is this the home page
 * @param {string} currentPath - Current page path
 */
export async function renderGlobalCategories(isHome, currentPath) {
    const container = document.getElementById('global-cats');
    if (!container) return;

    // Fix base path based on depth
    let basePath = "categories/";
    if (currentPath.indexOf("/categories/") !== -1) basePath = "";
    if (currentPath.indexOf("/subcategories/") !== -1) basePath = "../categories/";
    if (currentPath.indexOf("/pages/") !== -1) basePath = "../categories/";

    const activePage = currentPath.split('/').pop() || "index.html";

    // Fetch categories
    let cats = [];
    if (window.UserCategoriesService) {
        cats = await window.UserCategoriesService.getMainCategories();
    }

    if (!cats.length) {
        container.innerHTML = `<div style="padding:20px; color:#aaa;">جاري تحميل الأقسام...</div>`;
        return;
    }

    // Determine language
    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    // Different layout for categories page
    const isAllCatsPage = currentPath.endsWith("/categories.html");

    let html = "";
    cats.forEach(cat => {
        const catId = cat.id;
        const icon = cat.icon || "folder";
        const label = isAr ? (cat.name_ar || catId) : (cat.name_en || cat.name_ar || catId);
        
        let linkPrefix = "pages/";
        if (currentPath.includes("/pages/")) linkPrefix = "";
        
        const catUrl = `${linkPrefix}category.html?id=${catId}`;
        const isActive = (activePage === "category.html" && currentPath.includes(`id=${catId}`)) ? "active" : "";
        
        if (isAllCatsPage) {
            html += `
                <a href="${catUrl}" class="cat-nav-item card-style">
                    <i data-lucide="${icon}"></i> 
                    <span>${label}</span>
                </a>`;
        } else {
            html += `
                <a href="${catUrl}" class="cat-nav-item ${isActive}">
                    <i data-lucide="${icon}"></i> 
                    <span>${label}</span>
                </a>`;
        }
    });

    container.innerHTML = html;
    
    if (typeof lucide !== "undefined") lucide.createIcons();
}
