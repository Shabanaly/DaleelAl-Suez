/**
 * Main Application Entry Point (Refactored & Modular)
 * All business logic extracted to separate modules
 * 
 * Original main.js: 886 lines → New: ~100 lines
 */

// ===================================
// IMPORTS
// ===================================

// Core
 // import { initApp } from './core/app-initializer.js';
 // import { getCurrentPage } from './core/router.js';

// UI Components
 // import { openLightbox, closeLightbox } from './presentation/ui/lightbox.js';
 // import { openAccountModal, closeAccountModal } from './presentation/ui/modal.js';

// Renderers
 // import { renderGlobalCategories } from './presentation/renderers/categories/category-grid-renderer.js';
 // import { renderBottomNav } from './presentation/renderers/common/bottom-nav-renderer.js';

// Data/Repositories (Formerly Services/DB)
 // import './data/api/supabase-client.js'; // Initialize Supabase
 // import './data/repositories/favorites-repository.js';
 // import './data/repositories/reviews-repository.js';

// Page Controllers
 // import { initHomePage } from './presentation/pages/home-page.js';
 // import { initPlacePage } from './presentation/pages/place-page.js';
 // import { initCategoryPage } from './presentation/pages/category-page.js';
 // import { initSearchPage } from './presentation/pages/search-page.js';
 // import { initFavoritesPage } from './presentation/pages/favorites-page.js';

// ===================================
// GLOBAL FUNCTIONS (for inline onclick - temporary)
// ===================================

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openAccountModal = openAccountModal;
window.closeAccountModal = closeAccountModal;
window.scrollCats = function(dir) {}; // Placeholder

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize app (theme, i18n, etc.)
    await initApp();
    
    // Get current page context
    const path = window.location.pathname;
    const currentPage = getCurrentPage();
    const isHome = currentPage === 'home';
    
    // Render global UI components
    await renderGlobalCategories(isHome, path);
    renderBottomNav(isHome, path);
    
    // Initialize page-specific logic
    if (currentPage === 'home') {
        await initHomePage();
    } else if (currentPage === 'place') {
        await initPlacePage();
    } else if (currentPage === 'category') {
        await initCategoryPage();
    } else if (currentPage === 'search') {
        await initSearchPage();
    } else if (currentPage === 'favorites') {
        await initFavoritesPage();
    }
    
    // Render ads
    renderAds();
    
    // Initialize icons
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    // Listen for language changes to re-render dynamic components
    window.addEventListener('languageChanged', () => {
        renderBottomNav(isHome, path);
        if (typeof lucide !== "undefined") lucide.createIcons();
    });

    // Attach handler for Desktop Account Link (Top Nav)
    const desktopAccountLinks = document.querySelectorAll('.top-nav .top-nav-link[data-i18n="nav_account"]');
    desktopAccountLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openAccountModal) window.openAccountModal(e);
        });
    });
});

// ===================================
// ADS RENDERING (Kept as is)
// ===================================

async function renderAds() {
    if (!window.AdsService) {
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
                
                // Execute scripts in ad code
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

// ===================================
// LEGACY SUPPORT (Subcategory Rendering - TODO: Extract)
// ===================================

async function setupCategoryPageHeader(catId) {
    const container = document.getElementById('subcategories-container');
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    try {
        if (window.UserCategoriesService) {
            const cat = await window.UserCategoriesService.getById(catId);
            if (cat) {
                const catName = isAr ? cat.name_ar : (cat.name_en || cat.name_ar);
                const header = document.getElementById('category-header-title');
                if (header) header.innerText = catName;
            }
        }
    } catch (e) {
        console.error("Category header error", e);
    }
}

async function renderSubCategories(mainCatId, activeSubId) {
    const container = document.getElementById('subcategories-container');
    if (!container) return;

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    try {
        if (window.sb) {
            const { data: cat } = await window.sb
                .from('categories')
                .select('subs')
                .eq('id', mainCatId)
                .single();

            if (cat && cat.subs && Array.isArray(cat.subs)) {
                const html = cat.subs.map(sub => {
                    const label = isAr ? (sub.name_ar || sub.id) : (sub.name_en || sub.name_ar || sub.id);
                    const isActive = sub.id === activeSubId;
                    return `
                        <a href="?id=${mainCatId}&sub=${sub.id}" class="sub-chip ${isActive ? 'active' : ''}">
                            ${label}
                        </a>
                    `;
                }).join('');
                
                container.innerHTML = html;
            }
        }
    } catch (e) {
        console.error("Subcategories render error", e);
    }
}

// Make legacy functions available
window.setupCategoryPageHeader = setupCategoryPageHeader;
window.renderSubCategories = renderSubCategories;
