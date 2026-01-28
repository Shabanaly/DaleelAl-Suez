/**
 * Bottom Navigation Renderer
 * Renders the global bottom navigation bar dynamically with i18n support
 */

/**
 * Render bottom navigation
 * @param {boolean} isHome - Is this the home page
 * @param {string} currentPath - Current page path
 */
export function renderBottomNav(isHome, currentPath) {
    const container = document.getElementById('bottom-nav-container');
    if (!container) return;

    // Get current language
    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    // Determine path prefix based on directory depth
    let toHome = isHome ? "index.html" : "../index.html";
    let toCats = isHome ? "pages/categories.html" : "../pages/categories.html";
    let toFavs = isHome ? "pages/favorites.html" : "../pages/favorites.html";

    // Patch for depth level
    if (currentPath.includes("/categories/") || currentPath.includes("/subcategories/") || currentPath.includes("/pages/")) {
        toHome = "../index.html";
        toCats = "../pages/categories.html";
        toFavs = "../pages/favorites.html";
    }

    const navItems = [
        { id: "home", icon: "home", labelKey: "nav_home", ar: "الرئيسية", en: "Home", url: toHome },
        { id: "categories", icon: "grid", labelKey: "nav_categories", ar: "الأقسام", en: "Categories", url: toCats },
        { id: "favorites", icon: "heart", labelKey: "nav_favorites", ar: "المفضلة", en: "Favorites", url: toFavs },
        { id: "account", icon: "user", labelKey: "nav_account", ar: "حسابي", en: "Account", url: "#" }
    ];

    let html = "";
    navItems.forEach(item => {
        let isActive = "";
        
        // Active Logic
        if (item.id === "home" && isHome) isActive = "active";
        if (item.id === "categories" && (currentPath.includes("/categories/") || currentPath.includes("/subcategories/") || currentPath.includes("categories.html") || currentPath.includes("category.html"))) isActive = "active";
        if (item.id === "favorites" && currentPath.includes("favorites.html")) isActive = "active";

        const onClick = item.id === "account" ? 'onclick="window.openAccountModal(event)"' : "";
        const label = isAr ? item.ar : item.en;
        
        html += `
            <a href="${item.url}" class="nav-item-mobile ${isActive}" ${onClick} data-i18n-key="${item.labelKey}">
                <i data-lucide="${item.icon}"></i> <span>${label}</span>
            </a>`;
    });

    container.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();
}
