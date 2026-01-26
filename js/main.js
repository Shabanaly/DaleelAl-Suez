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

async function initDynamicPage(isHome, path) {
    // UI ONLY - Content areas are still placeholders until PlacesService is restored
    // console.log("Values initialized from DB for Categories");

    const params = new URLSearchParams(window.location.search);
    const subCatId = params.get('sub');

    // 1. Homepage Logic
    if (isHome) {
        // ... (Render Home Components)
        renderOffers();
        renderSuezInfo();
        renderTrendingHub();
        renderQuickActions();
        renderHomepageReviews();
        
        // Latest Places (Assuming Dynamic Places Re-enabled or still UI placeholder)
        // const allPlaces = await window.UserPlacesService.getLatestPlaces(6);
        // if (allPlaces) renderPlaces(allPlaces, "places-container");
    }

    // 2. Dynamic Category Page Logic (Universal)
    // Check if we are on the generic template
    if (path.includes("category.html")) {
        const catId = params.get('id');
        const subId = params.get('sub');

        if (catId) {
            // A. Set Metadata (Title)
            await setupCategoryPageHeader(catId);

            // B. Render Sub-Nav (pass current subId for active state)
            await renderSubCategories(catId, subId);

            // C. Render Places
            if (window.UserPlacesService) {
                let places = [];
                if (subId) {
                    places = await window.UserPlacesService.getPlacesBySubCategory(subId);
                } else {
                    places = await window.UserPlacesService.getPlacesByMainCategory(catId);
                }
                renderPlaces(places, 'places-container');
            }
        }
    }

    // 3. Place Details Page Logic
    if (path.includes("place.html")) {
        const placeId = params.get('id');
        if (placeId && window.UserPlacesService) {
            await renderPlaceDetails(placeId);
        }
    }
}

async function renderPlaceDetails(placeId) {
    const place = await window.UserPlacesService.getById(placeId);
    if (!place) {
        document.querySelector('main').innerHTML = '<div style="text-align: center; padding: 100px 20px;"><i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i><h3>المكان غير موجود</h3><a href="../index.html" class="top-nav-link" style="margin-top: 20px; display: inline-block;">العودة للرئيسية</a></div>';
        if (typeof lucide !== "undefined") lucide.createIcons();
        return;
    }

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === 'ar';

    // Update Head/Title
    const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
    const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
    
    document.getElementById('place-name').innerText = name;
    document.title = `${name} - دليل السويس`;
    document.getElementById('place-description').innerText = desc;

    // Fetch Category Name
    if (window.sb && place.main_cat_id) {
        const { data: cat } = await window.sb.from('categories').select('name_ar, name_en').eq('id', place.main_cat_id).single();
        if (cat) {
            const catName = isAr ? cat.name_ar : (cat.name_en || cat.name_ar);
            document.getElementById('place-category-badge').innerText = catName;
        }
    }

    // Hero Image
    const heroImg = place.image_url || (place.images && place.images[0]) || 'https://via.placeholder.com/1200x800?text=No+Image';
    const heroEl = document.getElementById('place-hero-img');
    if (heroEl) {
        heroEl.src = heroImg;
        heroEl.alt = name;
    }

    // Sidebar Info Grid
    const infoGrid = document.getElementById('place-info-grid');
    let infoHTML = '';

    // Phone
    if (place.phone) {
        infoHTML += `
            <div class="place-info-item interactive" onclick="window.location.href='tel:${place.phone}'">
                <div class="info-icon"><i data-lucide="phone"></i></div>
                <div class="info-text">
                    <label>${isAr ? 'اتصال' : 'Call'}</label>
                    <span>${place.phone}</span>
                </div>
            </div>
        `;
    }

    // WhatsApp
    if (place.whatsapp) {
        let waNumber = place.whatsapp.replace(/\D/g,'');
        if (waNumber.startsWith('0')) waNumber = '20' + waNumber.substring(1);
        else if (!waNumber.startsWith('20')) waNumber = '20' + waNumber;

        infoHTML += `
            <div class="place-info-item interactive" onclick="window.open('https://wa.me/${waNumber}', '_blank')">
                <div class="info-icon" style="color: #22c55e;"><i data-lucide="message-circle"></i></div>
                <div class="info-text">
                    <label>${isAr ? 'واتساب' : 'WhatsApp'}</label>
                    <span style="color: #22c55e;">تحدث الآن</span>
                </div>
            </div>
        `;
    }

    // Working Hours
    if (place.working_hours) {
        infoHTML += `
            <div class="place-info-item">
                <div class="info-icon"><i data-lucide="clock"></i></div>
                <div class="info-text">
                    <label>${isAr ? 'ساعات العمل' : 'Working Hours'}</label>
                    <span>${place.working_hours}</span>
                </div>
            </div>
        `;
    }

    // Address (Text)
    if (place.address) {
        infoHTML += `
            <div class="place-info-item">
                <div class="info-icon"><i data-lucide="map-pin"></i></div>
                <div class="info-text">
                    <label>${isAr ? 'العنوان' : 'Address'}</label>
                    <span>${place.address}</span>
                </div>
            </div>
        `;
    }

    // Map Link (Direction)
    if (place.map_url || place.address) {
        const query = place.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
        infoHTML += `
            <div class="place-info-item interactive" onclick="window.open('${query}', '_blank')">
                <div class="info-icon" style="background: var(--primary-soft); color: var(--primary);"><i data-lucide="navigation"></i></div>
                <div class="info-text">
                    <label>${isAr ? 'الاتجاهات' : 'Directions'}</label>
                    <span style="color: var(--primary); font-weight: 700;">${isAr ? 'فتح في الخريطة' : 'Open in Maps'}</span>
                </div>
            </div>
        `;

        // Map Iframe Section
        const mapSection = document.getElementById('map-section');
        const mapContainer = document.getElementById('map-iframe-container');
        
        if (mapSection && mapContainer && place.map_url && (place.map_url.includes('google.com/maps') || place.map_url.includes('goo.gl/maps'))) {
            mapSection.style.display = 'block';
            mapContainer.innerHTML = `<iframe src="${place.map_url}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        }
    }

    infoGrid.innerHTML = infoHTML;

    // Sticky Mobile Action Bar
    renderStickyActionBar(place, isAr);

    // Gallery (Magazine Style)
    const allImages = [place.image_url, ...(place.images || [])].filter(Boolean);
    if (allImages.length > 0) {
        const gallery = document.getElementById('place-gallery');
        const gallerySection = document.getElementById('gallery-section');
        
        gallery.innerHTML = allImages.map(img => 
            `<div class="gallery-item" onclick="openLightbox('${img}')"><img src="${img}" alt="${name}" loading="lazy"></div>`
        ).join('');
        
        gallerySection.style.display = 'block';
    }

    if (typeof lucide !== "undefined") lucide.createIcons();
}

/**
 * Renders a sticky action bar fixed at the bottom for mobile devices
 */
function renderStickyActionBar(place, isAr) {
    if (window.innerWidth > 1024) return; // Desktop doesn't need this
    
    // Remove existing if any
    const existing = document.querySelector('.mobile-action-bar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.className = 'mobile-action-bar';
    
    let html = '';
    
    if (place.phone) {
        html += `<a href="tel:${place.phone}" class="action-item call"><i data-lucide="phone"></i> <span>${isAr ? 'اتصال' : 'Call'}</span></a>`;
    }
    
    if (place.whatsapp) {
        let waNumber = place.whatsapp.replace(/\D/g,'');
        if (waNumber.startsWith('0')) waNumber = '20' + waNumber.substring(1);
        else if (!waNumber.startsWith('20')) waNumber = '20' + waNumber;

        html += `<a href="https://wa.me/${waNumber}" class="action-item whatsapp"><i data-lucide="message-circle"></i> <span>واتساب</span></a>`;
    }
    
    const mapQuery = place.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || '')}`;
    html += `<a href="${mapQuery}" target="_blank" class="action-item map"><i data-lucide="navigation"></i> <span>${isAr ? 'خريطة' : 'Map'}</span></a>`;

    bar.innerHTML = html;
    document.body.appendChild(bar);
    
    if (typeof lucide !== "undefined") lucide.createIcons();
}

// Lightbox Logic
window.openLightbox = function(src) {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-img');
    if (overlay && img) {
        img.src = src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

async function setupCategoryPageHeader(catId) {
    const titleEl = document.getElementById('cat-page-title');
    if (!titleEl) return;

    // Default Loading State
    // titleEl.innerText = catId;

    if (!window.sb) return;

    // Fetch Name from DB
    const { data, error } = await window.sb
        .from('categories')
        .select('name_ar, name_en')
        .eq('id', catId)
        .single();

    if (data) {
        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
        const label = lang === 'ar' ? (data.name_ar || catId) : (data.name_en || data.name_ar || catId);
        titleEl.innerText = label;
        document.title = `${label} - دليل السويس`;
    }
}

async function renderSubCategories(mainCatId, activeSubId) {
    console.log("DEBUG: renderSubCategories called for", mainCatId);
    const container = document.querySelector('.sub-nav');
    if (!container) {
        console.warn("DEBUG: .sub-nav container NOT found");
        return; 
    }

    // Fetch Subs from DB
    let subs = [];
    if (window.sb) {
        const { data, error } = await window.sb.from('subcategories').select('*').eq('main_cat_id', mainCatId);
        if (error) console.error("DEBUG: Sub fetch error", error);
        subs = data || [];
    } else {
        console.error("DEBUG: window.sb not initialized");
    }

    console.log("DEBUG: Subs found:", subs.length);

    if (!subs.length) {
        container.style.display = 'none';
        return;
    }

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === 'ar';

    // "All" Link
    const allLabel = isAr ? "الكل" : "All";
    const allActive = !activeSubId ? 'active' : '';
    // Link to same page (category.html) with just ID, no sub
    const baseUrl = `category.html?id=${mainCatId}`;
    
    let html = `<a href="${baseUrl}" class="${allActive}">${allLabel}</a>`;

    subs.forEach(sub => {
        const isActive = activeSubId === sub.id ? 'active' : '';
        const label = isAr ? (sub.name_ar || sub.id) : (sub.name_en || sub.name_ar || sub.id);
        
        // Link to same page with &sub=ID
        html += `<a href="${baseUrl}&sub=${sub.id}" class="${isActive}">${label}</a>`;
    });

    container.innerHTML = html;
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
    }

    if (!cats.length) {
        container.innerHTML = `<div style="padding:20px; color:#aaa;">جاري تحميل الأقسام...</div>`;
        return;
    }

    // Determine Language
    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : (document.documentElement.lang || "ar");
    const isAr = lang === 'ar';

    // Different Layout for "All Categories" Page
    const isAllCatsPage = currentPath.endsWith("/categories.html");

    let html = "";
    cats.forEach(cat => {
        const catId = cat.id;
        const icon = cat.icon || "folder";
        
        // Bilingual Label
        const label = isAr ? (cat.name_ar || catId) : (cat.name_en || cat.name_ar || catId);
        
        // Dynamic Link Construction
        // We now point EVERYTHING to the single dynamic page
        // Adjust relative path based on current location
        let linkPrefix = "pages/";
        if (currentPath.includes("/pages/") || currentPath.includes("/categories/") || currentPath.includes("/subcategories/")) {
            linkPrefix = ""; // Already in pages/ or deep, so ./category.html works if in pages, but...
            // "pages/category.html" is in "pages/".
            // If we are in "index.html" (root) -> "pages/category.html"
            // If we are in "pages/about.html" -> "category.html"
        }
        
        if (currentPath.includes("/pages/")) linkPrefix = "";
        
        const catUrl = `${linkPrefix}category.html?id=${catId}`;
        const isActive = (activePage === "category.html" && currentPath.includes(`id=${catId}`)) ? "active" : "";
        
        if (isAllCatsPage) {
            // GRID Layout (Card style)
            html += `
                <a href="${catUrl}" class="cat-nav-item card-style">
                    <i data-lucide="${icon}"></i> 
                    <span>${label}</span>
                </a>`;
        } else {
            // HORIZONTAL SCROLL Layout (Chip style)
            html += `
                <a href="${catUrl}" class="cat-nav-item ${isActive}">
                    <i data-lucide="${icon}"></i> 
                    <span>${label}</span>
                </a>`;
        }
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
    let toCats = isHome ? "pages/categories.html" : "../pages/categories.html";
    let toFavs = isHome ? "pages/favorites.html" : "../pages/favorites.html";

    // Simple Patch for depth level
     if (currentPath.includes("/categories/") || currentPath.includes("/subcategories/") || currentPath.includes("/pages/")) {
         toHome = "../index.html";
         toCats = "../pages/categories.html";
         toFavs = "../pages/favorites.html";
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
        
        // Debug Active Logic
        if (item.id === "home" && isHome) isActive = "active";
        if (item.id === "categories" && (currentPath.includes("/categories/") || currentPath.includes("/subcategories/") || currentPath.includes("categories.html"))) isActive = "active";
        if (item.id === "favorites" && currentPath.includes("favorites.html")) isActive = "active";

        const onClick = item.id === "account" ? 'onclick="window.openAccountModal(event)"' : "";
        
        html += `
            <a href="${item.url}" class="nav-item-mobile ${isActive}" ${onClick}>
                <i data-lucide="${item.icon}"></i> <span>${item.ar}</span>
            </a>`;
    });

    container.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderOffers() {
    const container = document.getElementById('offers-container');
    if (!container) return;
    container.innerHTML = `<div style="padding:20px; text-align:center;">عروض قريباً</div>`;
}

async function renderSuezInfo() {
    const container = document.getElementById('info-container');
    if (!container) return;
    container.innerHTML = `
        <div class="info-chip">
            <i data-lucide="cloud"></i>
            <div>
                <div class="value">--°C</div>
                <div class="label">الطقس</div>
            </div>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderTrendingHub() {
    const container = document.getElementById('trending-container');
    if (!container) return;
    container.innerHTML = "";
}

function renderQuickActions() {
    const container = document.getElementById('quick-actions-container');
    if (!container) return;
    // Static Actions (Safe)
     const actions = [
        { icon: "phone-call", color: "#ef4444", label: "طوارئ", url: "#" },
    ];
    // container.innerHTML = ...
}

function renderHomepageReviews() {
     const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = "";
}

function renderPlaces(places, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!places || places.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">لا توجد أماكن حالياً</div>`;
        return;
    }

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === 'ar';
    const path = window.location.pathname;
    const isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
    const placeLink = isHome ? "pages/place.html" : "place.html";

    container.innerHTML = places.map(place => {
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
        const image = place.image_url || (place.images && place.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image';
        
        // Truncate description
        const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;

        return `
            <div class="listing-card" onclick="location.href='${placeLink}?id=${place.id}'" style="cursor: pointer;">
                <div class="listing-img">
                    <img src="${image}" alt="${name}" loading="lazy">
                    <div class="fav-btn" data-id="${place.id}" onclick="event.stopPropagation()">
                        <i data-lucide="heart"></i>
                    </div>
                </div>
                <div class="listing-content">
                    <h3>${name}</h3>
                    <p style="margin-bottom: 12px;">${shortDesc}</p>
                    ${place.address ? `<div style="font-size: 13px; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                        <span>${place.address}</span>
                    </div>` : ''}
                    <div class="view-btn">
                        <span>${isAr ? 'رؤية التفاصيل' : 'View Details'}</span>
                        <i data-lucide="${isAr ? 'arrow-left' : 'arrow-right'}"></i>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== "undefined") lucide.createIcons();
}

// ... Keep pure UI helpers like Scroll/Modal ... 
function initCategoryScroll() {} 
window.scrollCats = function(dir) {};
/* --- Mobile Account Modal Logic --- */
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

window.openAccountModal = function(e) {
    if(e) e.preventDefault();
    createAccountModal();
    
    // Helper delay to ensure DOM is ready before adding active class for animation
    requestAnimationFrame(() => {
        document.querySelector('.modal-backdrop').classList.add('active');
        document.querySelector('.account-modal').classList.add('active');
    });
};

window.closeAccountModal = function() {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.account-modal');
    if (backdrop) backdrop.classList.remove('active');
    if (modal) modal.classList.remove('active');
};
