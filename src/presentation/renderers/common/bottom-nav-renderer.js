/**
 * Bottom Navigation Renderer
 * Renders the global bottom navigation bar dynamically with i18n support
 */

/**
 * Render bottom navigation
 */
window.renderBottomNav = function(isHome, currentPath) {
    const container = document.getElementById('bottom-nav-container');
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    // Path logic based on location
    // index.html is at public/. Subpages are in public/pages/
    const isAtRoot = isHome || (!currentPath.includes('/pages/'));
    
    const rootPath = isAtRoot ? "" : "../";
    const pagesPath = isAtRoot ? "pages/" : "";

    const navItems = [
        { id: "home", icon: "home", labelKey: "nav_home", ar: "الرئيسية", en: "Home", url: rootPath + "index.html" },
        { id: "categories", icon: "grid", labelKey: "nav_categories", ar: "الأقسام", en: "Categories", url: pagesPath + "categories.html" },
        { id: "favorites", icon: "heart", labelKey: "nav_favorites", ar: "المفضلة", en: "Favorites", url: pagesPath + "favorites.html" },
        { id: "account", icon: "user", labelKey: "nav_account", ar: "حسابي", en: "Account", url: "#" }
    ];

    let html = `
        <div class="bottom-nav-glass">
            <div class="bottom-nav-items">
    `;

    navItems.forEach(item => {
        let isActive = "";
        const fileName = currentPath.split('/').pop() || 'index.html';

        if (item.id === "home" && (fileName === 'index.html' || isHome)) isActive = "active";
        if (item.id === "categories" && (fileName === 'categories.html' || fileName === 'category.html')) isActive = "active";
        if (item.id === "favorites" && fileName === 'favorites.html') isActive = "active";

        const onClick = item.id === "account" ? 'onclick="if(window.openAccountModal) window.openAccountModal(event)"' : "";
        const label = isAr ? item.ar : item.en;
        
        html += `
            <a href="${item.url}" class="nav-item-mobile ${isActive}" ${onClick}>
                <div class="nav-item-icon-wrapper">
                    <i data-lucide="${item.icon}"></i>
                </div>
                <span data-i18n-key="${item.labelKey}">${label}</span>
            </a>`;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) {
        window.lucide.createIcons();
    }
};
