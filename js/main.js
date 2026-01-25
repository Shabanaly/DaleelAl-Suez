// main.js

document.addEventListener("DOMContentLoaded", function() {
    // تحديد الصفحة الحالية
    var path = window.location.pathname;
    // التحقق من الصفحة الرئيسية (سواء كانت / أو index.html أو المجلد الرئيسي)
    var isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
    
    // تصحيح المسارات للصور والروابط بناءً على مستوى الصفحة
    var basePath = isHome ? "" : "../";

    // عرض أحدث الأماكن في الصفحة الرئيسية
    if (isHome) {
        var allPlaces = [];
        if (typeof restaurants !== "undefined") allPlaces = allPlaces.concat(restaurants.slice(0, 2));
        if (typeof cafes !== "undefined") allPlaces = allPlaces.concat(cafes.slice(0, 2));
        if (typeof doctors !== "undefined") allPlaces = allPlaces.concat(doctors.slice(0, 2));
        if (typeof entertainment !== "undefined") allPlaces = allPlaces.concat(entertainment.slice(0, 2));
        if (typeof emergency !== "undefined") allPlaces = allPlaces.concat(emergency.slice(0, 2));
        if (typeof home_living !== "undefined") allPlaces = allPlaces.concat(home_living.slice(0, 2));
        if (typeof cars !== "undefined") allPlaces = allPlaces.concat(cars.slice(0, 2));
        if (typeof jobs !== "undefined") allPlaces = allPlaces.concat(jobs.slice(0, 2));
        if (typeof education !== "undefined") allPlaces = allPlaces.concat(education.slice(0, 2));
        if (typeof events !== "undefined") allPlaces = allPlaces.concat(events.slice(0, 2));
        if (typeof tourism !== "undefined") allPlaces = allPlaces.concat(tourism.slice(0, 2));
        if (typeof government !== "undefined") allPlaces = allPlaces.concat(government.slice(0, 2));
        if (typeof selection !== "undefined") allPlaces = allPlaces.concat(selection.slice(0, 2));
        if (typeof shops !== "undefined") allPlaces = allPlaces.concat(shops.slice(0, 2));
        
        renderPlaces(allPlaces, "places-container");
    }
    
    // عرض المطاعم
    if (path.indexOf("restaurants.html") !== -1) {
        if (typeof restaurants !== "undefined") {
            renderPlaces(restaurants, "places-container");
        }
    }
    
    // عرض الكافيهات
    if (path.indexOf("cafes.html") !== -1) {
        if (typeof cafes !== "undefined") {
            renderPlaces(cafes, "places-container");
        }
    }
    
    // عرض الأطباء
    if (path.indexOf("doctors.html") !== -1) {
        if (typeof doctors !== "undefined") {
            renderPlaces(doctors, "places-container");
        }
    }
    
    // عرض الصيدليات
    if (path.indexOf("pharmacies.html") !== -1) {
        if (typeof pharmacies !== "undefined") {
            renderPlaces(pharmacies, "places-container");
        }
    }
    
    // عرض الخدمات
    if (path.indexOf("services.html") !== -1) {
        if (typeof services !== "undefined") {
            renderPlaces(services, "places-container");
        }
    }
    
    // عرض المحلات
    if (path.indexOf("shops.html") !== -1) {
        if (typeof shops !== "undefined") {
            renderPlaces(shops, "places-container");
        }
    }

    // Dynamic Categories Rendering
    renderGlobalCategories(isHome, path);
    // Dynamic Bottom Navigation Rendering
    renderBottomNav(isHome, path);
});

/**
 * Renders the global categories navigation bar dynamically
 */
function renderGlobalCategories(isHome, currentPath) {
    const container = document.getElementById('global-cats');
    if (!container) return;

    // Fix Base Path based on depth
    let basePath = "categories/";
    if (currentPath.indexOf("/categories/") !== -1) basePath = "";
    if (currentPath.indexOf("/subcategories/") !== -1) basePath = "../categories/";
    if (currentPath.indexOf("/pages/") !== -1) basePath = "../categories/";

    const activePage = currentPath.split('/').pop() || "index.html";

    const cats = [
        { id: "restaurants", icon: "utensils", ar: "مطاعم" },
        { id: "cafes", icon: "coffee", ar: "كافيهات" },
        { id: "doctors", icon: "stethoscope", ar: "أطباء" },
        { id: "entertainment", icon: "clapperboard", ar: "خروج" },
        { id: "emergency", icon: "alert-circle", ar: "طوارئ" },
        { id: "home-living", icon: "home", ar: "بيت" },
        { id: "cars", icon: "car", ar: "سيارات" },
        { id: "jobs", icon: "briefcase", ar: "شغل" },
        { id: "education", icon: "graduation-cap", ar: "تعليم" },
        { id: "events", icon: "cake", ar: "حفلات" },
        { id: "tourism", icon: "palmtree", ar: "سياحة" },
        { id: "government", icon: "landmark", ar: "حكومة" },
        { id: "selection", icon: "brain", ar: "أختار إيه؟" },
        { id: "pharmacies", icon: "pill", ar: "صيدليات" },
        { id: "shops", icon: "shopping-bag", ar: "محلات" },
        { id: "services", icon: "wrench", ar: "خدمات" }
    ];

    let html = "";
    cats.forEach(cat => {
        const catUrl = basePath + cat.id + ".html";
        const isActive = activePage === (cat.id + ".html") ? "active" : "";
        html += `
            <a href="${catUrl}" class="cat-nav-item ${isActive}">
                <i data-lucide="${cat.icon}"></i> <span data-i18n="cat_${cat.id.replace(/-/g, '_')}">${cat.ar}</span>
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

    const basePath = isHome ? "" : "../";
    const activePage = currentPath.split('/').pop() || "index.html";

    const items = [
        { id: "home", icon: "home", ar: "الرئيسية", url: isHome ? "index.html" : "../index.html" },
        { id: "categories", icon: "grid", ar: "الأقسام", url: isHome ? "categories/restaurants.html" : "restaurants.html" },
        { id: "favorites", icon: "heart", ar: "المفضلة", url: isHome ? "pages/favorites.html" : "../pages/favorites.html" },
        { id: "account", icon: "user", ar: "حسابي", url: "#" }
    ];

    let html = "";
    items.forEach(item => {
        let isActive = "";
        if (item.id === "home" && isHome) isActive = "active";
        if (item.id === "categories" && currentPath.includes("/categories/")) isActive = "active";
        if (item.id === "categories" && currentPath.includes("/subcategories/")) isActive = "active";
        if (item.id === "favorites" && currentPath.includes("/favorites.html")) isActive = "active";

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
