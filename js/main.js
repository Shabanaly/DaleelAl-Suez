/**
 * Injects a high-fidelity animated Suez Governorate logo preloader
 */
function injectPreloader() {
    const preloaderHtml = `
        <div id="site-preloader">
            <div class="loader-logo-wrapper">
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <!-- Rotating Gear (8 Teeth) -->
                    <path class="loader-gear" fill="#005a9c" d="M472.6,211.4l-42.6-7c-3.1-13-7.9-25.2-14.1-36.6l25.3-35.1c4.5-6.2,3.3-14.9-2.8-19.6L395.1,76.4 c-6.2-4.5-14.8-3.3-19.5,2.9l-25.3,35.1c-11.4-6.3-23.7-11.1-36.7-14.2l-7-42.6c-1.3-7.6-7.8-13.1-15.5-13.1H220.9 c-7.7,0-14.2,5.5-15.5,13.1l-7,42.6c-13,3.1-25.2,7.9-36.6,14.2l-35.1-25.3c-6.2-4.5-14.9-3.3-19.6,2.8l-36.7,43.3 c-4.5,6.2-3.3,14.8,2.9,19.5l35.1,25.3c-6.3,11.4-11.1,23.7-14.2,36.7l-42.6,7C39.5,212.7,34,219.2,34,226.9v70.2 c0,7.7,5.5,14.2,13.1,15.5l42.6,7c3.1,13,7.9,25.2,14.2,36.6l-25.3,35.1c-4.5,6.2-3.3,14.9,2.8,19.6l43.3,36.7 c6.2,4.5,14.8,3.3,19.5-2.9l25.3-35.1c11.4,6.3,23.7,11.1,36.7,14.2l7,42.6c1.3,7.6,7.8,13.1,15.5,13.1h70.2 c7.7,0,14.2-5.5,15.5-13.1l7-42.6c13-3.1,25.2-7.9,36.6-14.2l35.1,25.3c6.2,4.5,14.9,3.3,19.6-2.8l36.7-43.3 c4.5-6.2,3.3-14.8-2.9-19.5l-35.1-25.3c6.3-11.4,11.1-23.7,14.2-36.7l42.6-7c7.6-1.3,13.1-7.8,13.1-15.5V226.9 C485.7,219.2,480.2,212.7,472.6,211.4z M256,380.7c-68.9,0-124.7-55.8-124.7-124.7S187.1,131.3,256,131.3 S380.7,187.1,380.7,256S324.9,380.7,256,380.7z" />
                    
                    <!-- Static House & Identity Center -->
                    <g fill="#fff">
                        <path d="M256,170l-80,66v94h160v-94L256,170z M216,280h80v20h-80V280z M296,250v20h-80v-20H296z" />
                        <path d="M256,190l30,25v5h-60v-5L256,190z" />
                        <!-- Wrench Detail -->
                        <rect x="246" y="220" width="20" height="40" transform="rotate(45 256 240)" />
                    </g>

                    <!-- Flowing Waves (Bottom half of inner circle) -->
                    <path class="loader-waves" fill="#0091ff" d="M141.3,310c30-10,60,10,90,0c30-10,60,10,90,0c30-10,20,10,50,0v40H141.3V310z" />
                </svg>
            </div>
            <div class="loader-text" data-i18n="app_name">دليل السويس</div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
}

// Fade out preloader when everything is ready
window.addEventListener('load', () => {
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
        }, 800); // Small delay to let the animation be seen
    }
});

console.log("DEBUG: main.js execution started");
document.addEventListener('DOMContentLoaded', () => {
    injectPreloader(); // Show preloader immediately
    
    // تحديد الصفحة الحالية بناءً على الـ ID الخاص بـ body
    const bodyId = document.body.id;
    const path = window.location.pathname;
    const isHome = bodyId === 'home-page';

    // 0. Initialize Dynamic Backend (Supabase)
    if (window.supabase && window.GUIDE_CONFIG) {
        window.sb = window.supabase.createClient(window.GUIDE_CONFIG.URL, window.GUIDE_CONFIG.ANON_KEY);
    }

    // 1. Initial Global Render (Universal)
    renderGlobalCategories(isHome, path);
    renderBottomNav(isHome, path);

    // 2. Route Page Specific Logic
    if (isHome) {
        initHomepage();
    } else if (bodyId === 'categories-page') {
        // Categories list logic is already handled by renderGlobalCategories
    } else if (bodyId === 'dynamic-cat-page') {
        initCategoryPage(path);
    } else if (bodyId === 'place-details-page') {
        initPlaceDetailsPage();
    }

    // 3. Global Ads Rendering
    renderAds();
});

async function initHomepage() {
    console.log("DEBUG: Initializing Homepage Widgets");
    await renderOffers();
    await renderSuezInfo();
    await renderTrendingHub();
    await renderQuickActions();
    await renderExploreCity();
    renderHomepageReviews();
    
    if (window.UserPlacesService) {
        const allPlaces = await window.UserPlacesService.getLatestPlaces(7);
        if (allPlaces) renderPlaces(allPlaces, "places-container");
    }
}

async function initCategoryPage(path) {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('id');
    const subId = params.get('sub');

    if (catId) {
        if (typeof setupCategoryPageHeader === "function") await setupCategoryPageHeader(catId);
        if (typeof renderSubCategories === "function") await renderSubCategories(catId, subId);

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

async function initPlaceDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('id');
    if (placeId && window.UserPlacesService) {
        await renderPlaceDetails(placeId);
    }
}

async function renderPlaceDetails(placeId) {
    const place = await window.UserPlacesService.getById(placeId);
    if (!place) {
        document.querySelector('main').innerHTML = '<div style="text-align: center; padding: 100px 20px;"><i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i><h3>المكان غير موجود</h3><a href="../index.html" class="top-nav-link" style="margin-top: 20px; display: inline-block;">العودة للرئيسية</a></div>';
        if (typeof lucide !== "undefined") lucide.createIcons();
        if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
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

    // Fetch Category Name (Non-blocking)
    if (window.sb && place.main_cat_id) {
        window.sb.from('categories').select('name_ar, name_en').eq('id', place.main_cat_id).single()
            .then(({ data: cat }) => {
                if (cat) {
                    const catName = isAr ? cat.name_ar : (cat.name_en || cat.name_ar);
                    const badge = document.getElementById('place-category-badge');
                    if (badge) badge.innerText = catName;
                }
            }).catch(err => console.warn("Cat fetch error", err));
    }

    // Hero Image
    const heroImg = place.image_url || (place.images && Array.isArray(place.images) && place.images[0]) || 'https://via.placeholder.com/1200x800?text=No+Image';
    const heroEl = document.getElementById('place-hero-img');
    if (heroEl) {
        heroEl.src = heroImg;
        heroEl.alt = name;
    }

    // Sidebar Info Grid
    const infoGrid = document.getElementById('place-info-grid');
    let infoHTML = '';

    // 3. Grid Logic (Address, Hours, Category)
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

    infoGrid.innerHTML = infoHTML;

    // Sidebar Favorite Button
    const favBtnContainer = document.getElementById('favorite-btn-container');
    if (favBtnContainer) {
        favBtnContainer.innerHTML = `
            <button class="btn-outline-modern fav-btn-large ${typeof isFavorite === 'function' && isFavorite(place.id) ? 'active' : ''}" onclick="toggleFavorite('${place.id}'); this.classList.toggle('active')">
                <i data-lucide="heart"></i> <span>${isAr ? 'حفظ في المفضلة' : 'Save to Favorites'}</span>
            </button>
        `;
    }

    // Restore Sticky Mobile Action Bar
    renderStickyActionBar(place, isAr);

    // Gallery (Magazine Style - Robust & Resilient)
    const gallerySection = document.getElementById('gallery-section');
    const gallery = document.getElementById('place-gallery');

    if (gallery && gallerySection) {
        let rawImages = [];
        
        // 1. Add Main Image
        if (place.image_url) rawImages.push(place.image_url);
        
        // 2. Add Additional Images (Resilient Parsing)
        if (place.images) {
            if (Array.isArray(place.images)) {
                rawImages = [...rawImages, ...place.images];
            } else if (typeof place.images === 'string') {
                 // Check if it's stringified JSON
                if (place.images.trim().startsWith('[') || place.images.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(place.images);
                        if (Array.isArray(parsed)) rawImages = [...rawImages, ...parsed];
                        else if (typeof parsed === 'string') rawImages.push(parsed);
                    } catch(e) { 
                        // Fallback if not valid JSON
                        rawImages.push(place.images); 
                    }
                } else {
                    // Plain single string
                    rawImages.push(place.images);
                }
            }
        }

        // Filter valid, unique URLs
        const uniqueLinks = [...new Set(rawImages.filter(link => typeof link === 'string' && link.length > 5))];
        console.log("DEBUG: Final Gallery Links:", uniqueLinks);

        if (uniqueLinks.length > 0) {
            gallery.innerHTML = uniqueLinks.map(img => 
                `<div class="gallery-item" onclick="openLightbox('${img}')">
                    <img src="${img}" alt="${name}" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>`
            ).join('');
            
            gallerySection.style.display = 'block';
        } else {
            gallerySection.style.display = 'none';
        }
    }

    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
}

/**
 * Renders a sticky action bar fixed at the bottom for mobile devices
 */
function renderStickyActionBar(place, isAr) {
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
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
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

async function renderOffers() {
    const container = document.getElementById('offers-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const places = await window.UserPlacesService.getOfferPlaces(6);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
        const isAr = lang === 'ar';

        container.innerHTML = places.map(place => {
            const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
            const offerText = isAr ? (place.offer_text_ar || 'خصم خاص') : (place.offer_text_en || 'Special Offer');
            
            return `
                <div class="offer-card" onclick="location.href='pages/place.html?id=${place.id}'" style="cursor:pointer;">
                    <div>
                        <div class="offer-badge">${isAr ? 'عرض حصري' : 'Exclusive'}</div>
                        <h4 style="margin: 8px 0; font-size:18px; font-weight:800;">${name}</h4>
                    </div>
                    <p style="font-size:14px; opacity:0.9; font-weight:600;">${offerText}</p>
                </div>
            `;
        }).join('');
        container.parentElement.style.display = 'block';
    } catch (e) {
        console.error("Offers Render Error", e);
        container.parentElement.style.display = 'none';
    }
}

async function renderSuezInfo() {
    const container = document.getElementById('info-container');
    if (!container) return;

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === 'ar';

    // Initial Skeleton/Loading
    container.innerHTML = `
        <div class="info-chip">
            <div class="info-icon"><i data-lucide="cloud"></i></div>
            <div class="info-body">
                <div class="info-value" id="suez-temp">--°C</div>
                <div class="info-label">${isAr ? 'جو السويس' : 'Suez Weather'}</div>
            </div>
        </div>
        <div class="info-chip">
            <div class="info-icon" style="color: var(--secondary);"><i data-lucide="clock"></i></div>
            <div class="info-body">
                <div class="info-value" id="real-time-clock">--:--:--</div>
                <div class="info-label" id="real-time-date">--/--/----</div>
            </div>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();

    // 1. Fetch Live Weather (Open-Meteo)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=29.97&longitude=32.53&current_weather=true')
        .then(res => res.json())
        .then(data => {
            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const tempEl = document.getElementById('suez-temp');
                if (tempEl) tempEl.innerText = `${temp}°C`;
            }
        }).catch(err => console.warn("Weather fetch failed", err));

    // 2. Start Real-time Clock
    function updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('real-time-clock');
        const dateEl = document.getElementById('real-time-date');
        
        if (clockEl) {
            clockEl.innerText = now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            });
        }
        if (dateEl) {
            dateEl.innerText = now.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                day: 'numeric', month: 'short'
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

async function renderTrendingHub() {
    const container = document.getElementById('trending-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const places = await window.UserPlacesService.getTrendingPlaces(12);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
        const isAr = lang === 'ar';

        container.innerHTML = places.map(place => {
            const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
            return `<a href="pages/place.html?id=${place.id}" class="trending-chip"># ${name}</a>`;
        }).join('');
        container.parentElement.style.display = 'block';
    } catch (e) {
        console.error("Trending Render Error", e);
        container.parentElement.style.display = 'none';
    }
}

async function renderQuickActions() {
    const container = document.getElementById('quick-actions-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const places = await window.UserPlacesService.getUrgentPlaces(12);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
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
        console.error("Urgent Render Error", e);
        container.parentElement.style.display = 'none';
    }
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
                    <div class="fav-btn" data-id="${place.id}" onclick="event.stopPropagation(); toggleFavorite('${place.id}')">
                        <i data-lucide="heart"></i>
                    </div>
                </div>
                <div class="listing-content">
                    <h3>${name}</h3>
                    <p>${shortDesc}</p>
                    ${place.address ? `<div class="address-tag">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                        <span>${place.address}</span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
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

async function renderExploreCity() {
    const container = document.getElementById('explore-container');
    if (!container || !window.UserPlacesService) return;

    try {
        const place = await window.UserPlacesService.getFeaturedPlace();
        if (!place) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
        const isAr = lang === 'ar';
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const image = place.image_url || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';

        container.innerHTML = `
            <div class="explore-hero-card" onclick="location.href='pages/place.html?id=${place.id}'">
                <img src="${image}" alt="${name}" class="explore-bg">
                <div class="explore-overlay">
                    <div class="explore-badge">${isAr ? 'نرشح لك اليوم' : 'Daily Spotlight'}</div>
                    <h2 class="explore-title">${name}</h2>
                    <p class="explore-desc">${isAr ? (place.desc_ar || '').substring(0, 120) : (place.desc_en || '').substring(0, 120)}...</p>
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

async function renderAds() {
    if (!window.AdsService) {
        // Mock if service not loaded (should be loaded in index/place/etc)
        window.AdsService = {
            getActiveAds: async () => {
                if (!window.sb) return [];
                const { data } = await window.sb.from('ads_settings').select('*').eq('is_active', true);
                return data || [];
            }
        };
    }

    try {
        const ads = await window.AdsService.getActiveAds();
        ads.forEach(ad => {
            const container = document.querySelector(`[data-ad-slot="${ad.slot_id}"], [data-ad-position="${ad.slot_id}"]`);
            if (container && ad.ad_code) {
                container.innerHTML = ad.ad_code;
                container.style.display = 'block';
                
                // Execute any scripts in the ad code
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
        });
    } catch (e) {
        console.error("Ad Render Error", e);
    }
}

/**
 * Renders a sticky action bar fixed at the bottom for mobile devices
 */
function renderStickyActionBar(place, isAr) {
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
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
}
