console.log("DEBUG: main.js top level execution started");
document.addEventListener("DOMContentLoaded", function() {
    console.log("DEBUG: DOMContentLoaded fired");
    // تحديد الصفحة الحالية
    var path = window.location.pathname;
    // التحقق من الصفحة الرئيسية (سواء كانت / أو index.html أو المجلد الرئيسي)
    var isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";

    // 0. Initialize Dynamic Backend (Supabase)
    const { createClient } = supabase;
    window.sb = createClient(window.GUIDE_CONFIG.URL, window.GUIDE_CONFIG.ANON_KEY);

    // 1. Initial Global Render (Universal)
    renderGlobalCategories(isHome, path);
    renderBottomNav(isHome, path);

    initDynamicPage(isHome, path);
});

// Load Service if not present (Dynamically or assumed loaded)
// Since we can't easily modify head from here, assuming we will add it to HTML or just use window.UserPlacesService if loaded.
// Actually, let's just stick to the requested structure inside initDynamicPage for now or assume I will add the script tag.

async function initDynamicPage(isHome, path) {
    if (!window.UserPlacesService) {
        console.warn("UserPlacesService not loaded, waiting...");
        // Fallback or retry could go here, but I will ensure script is loaded in HTML
    }

    // 2. Page Specific Logic
    if (isHome) {
        // Use New Service: Latest
        const allPlaces = await window.UserPlacesService.getLatestPlaces(6);
        
        if (allPlaces) {
            renderPlaces(allPlaces, "places-container");
            renderExploreCity(allPlaces); 
        }

        // Execute New Homepage Enhancements
        renderOffers();
        renderSuezInfo();
        renderTrendingHub();
        renderQuickActions();
        renderHomepageReviews();
    }
    
    // Logic for individual category pages
    // Pattern: /categories/xyz.html -> Main Category
    const mainCatMatch = path.match(/\/categories\/([^.]+)\.html/);
    if (mainCatMatch) {
        const catId = mainCatMatch[1]; // e.g. "restaurants"
        const catPlaces = await window.UserPlacesService.getPlacesByMainCategory(catId);
        renderPlaces(catPlaces, "places-container");
    }

    // Pattern: /subcategories/xyz.html -> Sub Category (if exists)
    const subCatMatch = path.match(/\/subcategories\/([^.]+)\.html/);
    if (subCatMatch) {
         const subId = subCatMatch[1];
         const subPlaces = await window.UserPlacesService.getPlacesBySubCategory(subId);
         renderPlaces(subPlaces, "places-container");
    }

    // 3. Final i18n Pass
    if (typeof updatePageContent === "function") {
        updatePageContent(getPreferredLanguage());
    }
}

/**
 * Renders the global categories navigation bar dynamically
 */
async function renderGlobalCategories(isHome, currentPath) {
    const container = document.getElementById('global-cats');
    if (!container) return;

    // Fix Base Path based on depth
    let basePath = "categories/";
    if (currentPath.indexOf("/categories/") !== -1) basePath = "";
    if (currentPath.indexOf("/subcategories/") !== -1) basePath = "../categories/";
    if (currentPath.indexOf("/pages/") !== -1) basePath = "../categories/";

    const activePage = currentPath.split('/').pop() || "index.html";

    // Fetch from DB
    let cats = [];
    if (window.UserCategoriesService) {
        cats = await window.UserCategoriesService.getAll();
    } else {
        console.warn("UserCategoriesService missing");
    }

    // Fallback or empty state could be handled here
    if (!cats.length) {
        container.innerHTML = `<div style="padding:20px; color:#aaa;">جاري تحميل الأقسام...</div>`;
        return;
    }

    let html = "";
    cats.forEach(cat => {
        // DB uses 'name_ar', 'name_en', 'icon'. 
        // We map to match existing structure if needed, or just use direct.
        const catId = cat.id;
        const icon = cat.icon || "folder";
        const label = cat.name_ar || cat.label || catId; // Fallback
        
        const catUrl = basePath + catId + ".html";
        const isActive = activePage === (catId + ".html") ? "active" : "";
        
        // i18n key construction: 'cat_' + id (replacing dashes with underscores if any)
        const i18nKey = `cat_${catId.replace(/-/g, '_')}`;

        html += `
            <a href="${catUrl}" class="cat-nav-item ${isActive}">
                <i data-lucide="${icon}"></i> 
                <span data-i18n="${i18nKey}">${label}</span>
            </a>`;
    });

    container.innerHTML = html;
    
    // Support i18n and Icons
    if (typeof updatePageContent === "function") {
        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : (document.documentElement.lang || "ar");
        updatePageContent(lang);
    }
    if (typeof lucide !== "undefined") lucide.createIcons();

    // Scroll Logic for dynamic row
    initCategoryScroll();
}

/**
 * Renders the global bottom navigation bar dynamically
 */
function renderBottomNav(isHome, currentPath) {
    const container = document.getElementById('bottom-nav-container');
    if (!container) return;

    // Determine path prefix based on directory depth
    let toHome = isHome ? "index.html" : "../index.html";
    let toCats = isHome ? "pages/categories.html" : "categories.html";
    let toFavs = isHome ? "pages/favorites.html" : "../pages/favorites.html";

    if (currentPath.includes("/pages/") || currentPath.includes("/subcategories/")) {
        toCats = currentPath.includes("/pages/") ? "categories.html" : "../pages/categories.html";
        toFavs = currentPath.includes("/pages/") ? "favorites.html" : "../pages/favorites.html";
    }
    
    if (currentPath.includes("/categories/")) {
        toHome = "../index.html";
        toCats = "../pages/categories.html";
        toFavs = "../pages/favorites.html";
    }

    if (currentPath.includes("/pages/")) {
        toHome = "../index.html";
        // toCats is already correct from the first block if simplified, but explicitly:
        toCats = "categories.html";
        toFavs = "favorites.html";
    }

    const navItems = [
        { id: "home", icon: "home", ar: "الرئيسية", url: toHome },
        { id: "categories", icon: "grid", ar: "الأقسام", url: toCats },
        { id: "favorites", icon: "heart", ar: "المفضلة", url: toFavs },
        { id: "account", icon: "user", ar: "حسابي", url: "#" }
    ];

    let html = "";
    navItems.forEach(item => {
        let isActive = "";
        if (item.id === "home" && isHome) isActive = "active";
        if (item.id === "categories" && (currentPath.includes("/categories/") || currentPath.includes("/subcategories/") || currentPath.includes("categories.html"))) isActive = "active";
        if (item.id === "favorites" && currentPath.includes("favorites.html")) isActive = "active";

        const onClick = item.id === "account" ? 'onclick="openAccountModal(event)"' : "";
        
        html += `
            <a href="${item.url}" class="nav-item-mobile ${isActive}" ${onClick}>
                <i data-lucide="${item.icon}"></i> <span data-i18n="nav_${item.id}">${item.ar}</span>
            </a>`;
    });

    container.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

/**
 * Handle scrolling logic for the categories bar
 */
function initCategoryScroll() {
    const container = document.getElementById('global-cats');
    if (!container) return;

    const wrapper = container.parentElement;
    if (!wrapper || !wrapper.classList.contains('nav-scroll-wrapper')) return;

    // Check if indicators exist, otherwise create them
    if (!wrapper.querySelector('.nav-indicator')) {
        wrapper.insertAdjacentHTML('afterbegin', `
            <div class="nav-indicator nav-indicator-right" onclick="scrollCats('right')"><i data-lucide="chevron-right"></i></div>
            <div class="nav-indicator nav-indicator-left" onclick="scrollCats('left')"><i data-lucide="chevron-left"></i></div>
        `);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    const updateArrows = () => {
        const leftArrow = wrapper.querySelector('.nav-indicator-left');
        const rightArrow = wrapper.querySelector('.nav-indicator-right');
        if (!leftArrow || !rightArrow) return;

        const isRtl = document.documentElement.dir === 'rtl';
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Simplified visibility logic
        if (isRtl) {
            leftArrow.classList.toggle('visible', scrollLeft > -maxScroll + 10);
            rightArrow.classList.toggle('visible', scrollLeft < -10);
        } else {
            leftArrow.classList.toggle('visible', scrollLeft > 10);
            rightArrow.classList.toggle('visible', scrollLeft < maxScroll - 10);
        }
    };

    container.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 100);
}

window.scrollCats = function(dir) {
    const container = document.getElementById('global-cats');
    if (!container) return;
    const amount = dir === 'left' ? -200 : 200;
    const isRtl = document.documentElement.dir === 'rtl';
    container.scrollBy({ left: isRtl ? -amount : amount, behavior: 'smooth' });
};

/* --- Mobile Account Modal Logic (Static / No Management) --- */
function createAccountModal() {
    if (document.querySelector('.account-modal')) return;

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === "ar";

    const modalHTML = `
        <div class="modal-backdrop" onclick="closeAccountModal()"></div>
        <div class="account-modal">
            <div class="modal-header">
                <h3 data-i18n="nav_account">${isAr ? "حسابي" : "Account"}</h3>
                <div class="modal-close" onclick="closeAccountModal()"><i data-lucide="x"></i></div>
            </div>
            
            <div class="modal-section">
                <h4 data-i18n="nav_home">${isAr ? "اللغة" : "Language"}</h4>
                <button class="modal-action-btn" onclick="toggleLanguage()">
                    <span>${isAr ? "English" : "العربية"}</span>
                    <i data-lucide="globe"></i>
                </button>
            </div>

            <div class="modal-section">
                <h4 data-i18n="theme_toggle">${isAr ? "المظهر" : "Theme"}</h4>
                <button class="modal-action-btn" onclick="toggleTheme()">
                    <span>Dark / Light</span>
                    <i data-lucide="moon"></i>
                </button>
            </div>

            <div class="modal-section">
                <h4>${isAr ? "تسجيل الدخول" : "Login"}</h4>
                <button class="modal-action-btn auth-btn" disabled>
                    <span>${isAr ? "متابعة باستخدام Google" : "Continue with Google"}</span>
                    <span class="badge-soon">${isAr ? "قريبًا" : "Soon"}</span>
                </button>
                <button class="modal-action-btn auth-btn" disabled>
                    <span>${isAr ? "متابعة باستخدام Facebook" : "Continue with Facebook"}</span>
                    <span class="badge-soon">${isAr ? "قريبًا" : "Soon"}</span>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function openAccountModal(e) {
    if(e) e.preventDefault();
    createAccountModal();
    
    // Helper delay to ensure DOM is ready before adding active class for animation
    requestAnimationFrame(() => {
        document.querySelector('.modal-backdrop').classList.add('active');
        document.querySelector('.account-modal').classList.add('active');
    });
}

function closeAccountModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.account-modal');
    if (backdrop) backdrop.classList.remove('active');
    if (modal) modal.classList.remove('active');
}

// Attach click handler to account nav items (both top and bottom)
document.addEventListener('DOMContentLoaded', function() {
    // Find all links that contain the account translation span
    const accountSpans = document.querySelectorAll('[data-i18n="nav_account"]');
    accountSpans.forEach(span => {
        const accountLink = span.closest('a, button');
        if (accountLink) {
            accountLink.addEventListener('click', openAccountModal);
        }
    });
});


/* --- Homepage Enrichment Renderers --- */

async function renderOffers() {
    const container = document.getElementById('offers-container');
    if (!container) return;

    const { data: offers } = await window.sb.from('offers').select('*').eq('is_active', true);
    if (!offers || !offers.length) {
        document.getElementById('offers-section').style.display = 'none';
        return;
    }

    const lang = getPreferredLanguage();

    container.innerHTML = offers.map(off => `
        <div class="offer-card" style="background: ${off.bg_color}">
            <h4 style="font-size: 18px; font-weight: 800;">${lang === 'ar' ? off.title_ar : off.title_en}</h4>
            <p style="font-size: 14px; opacity: 0.9;">${lang === 'ar' ? off.desc_ar : off.desc_en}</p>
            <button class="modal-action-btn" style="width: auto; padding: 10px 20px; font-size: 12px; margin-bottom: 0;" data-i18n="offer_details">تفاصيل العرض</button>
        </div>
    `).join('');
}

async function renderSuezInfo() {
    const container = document.getElementById('info-container');
    if (!container) return;

    let temp = "--";
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=29.9668&longitude=32.5498&current=temperature_2m");
        const data = await response.json();
        if (data && data.current) {
            temp = Math.round(data.current.temperature_2m);
        }
    } catch (err) {
        console.error("Weather fetch failed:", err);
    }

    container.innerHTML = `
        <div class="info-chip">
            <i data-lucide="cloud-sun"></i>
            <div>
                <div class="value">${temp}°C</div>
                <div class="label" data-i18n="weather_title">الطقس</div>
            </div>
        </div>
        <div class="info-chip">
            <i data-lucide="anchor"></i>
            <div>
                <div class="value" data-i18n="port_status">يعمل</div>
                <div class="label" data-i18n="port_title">الميناء</div>
            </div>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderTrendingHub() {
    const container = document.getElementById('trending-container');
    if (!container) return;
    // Removed demo trends. Fetch from DB later or hide.
    container.innerHTML = "";
}

function renderQuickActions() {
    const container = document.getElementById('quick-actions-container');
    if (!container) return;

    const actions = [
        { icon: "phone-call", color: "#ef4444", label_key: "action_emergency", url: "categories/emergency.html" },
        { icon: "bus", color: "#f59e0b", label_key: "action_transport", url: "#" },
        { icon: "shield-check", color: "#3b82f6", label_key: "action_police", url: "tel:122" },
        { icon: "heart-pulse", color: "#10b981", label_key: "action_ambulance", url: "tel:123" }
    ];

    container.innerHTML = actions.map(a => `
        <a href="${a.url}" class="quick-btn">
            <div class="quick-icon" style="background: ${a.color}"><i data-lucide="${a.icon}"></i></div>
            <span data-i18n="${a.label_key}">-</span>
        </a>
    `).join('');
    if (typeof lucide !== "undefined") lucide.createIcons();
}

async function renderExploreCity() {
    const container = document.getElementById('explore-container');
    if (!container) return;

    const { data: featured } = await window.sb.from('places').select('*').eq('is_featured', true);
    
    if (!featured || !featured.length) {
        document.getElementById('explore-section').style.display = 'none';
        return;
    }

    // Pick one random from featured list
    const p = featured[Math.floor(Math.random() * featured.length)];
    const lang = getPreferredLanguage();

    container.innerHTML = `
        <div class="listing-card" style="margin-top: 0;">
            <div style="padding: 16px; background: var(--primary-soft); color: var(--primary); font-size: 13px; font-weight: 700;" data-i18n="explore_random_title">
                هل زرت هذا المكان من قبل؟
            </div>
            <div class="listing-img">
                <img src="${p.image_url}" alt="${p.name_ar}">
                <div class="fav-btn" data-id="${p.id}"><i data-lucide="heart"></i></div>
            </div>
            <div class="listing-content">
                <h3>${lang === 'ar' ? p.name_ar : p.name_en}</h3>
                <p>${p.address || ''}</p>
                <a href="place-details.html?id=${p.id}" class="view-btn"><span data-i18n="view_details">رؤية التفاصيل</span> <i data-lucide="${lang === 'ar' ? 'arrow-left' : 'arrow-right'}"></i></a>
            </div>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderHomepageReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    // Removed demo reviews.
    container.innerHTML = "";
}
