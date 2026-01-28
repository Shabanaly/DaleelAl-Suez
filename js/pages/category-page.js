/**
 * Category Page Controller  
 * Handles category page initialization with subcategories and places
 */

import { getQueryParam } from '../utils/url-helpers.js';
import { renderPlaces } from '../renderers/place/place-card-renderer.js';

/**
 * Initialize category page
 */
export async function initCategoryPage() {
    const catId = getQueryParam('id');
    const subId = getQueryParam('sub');

    if (!catId) return;

    // Setup header
    await setupCategoryPageHeader(catId);
    
    // Render subcategories
    await renderSubCategories(catId, subId);

    // Load places
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

/**
 * Setup category page header with category name
 */
async function setupCategoryPageHeader(catId) {
    const titleEl = document.getElementById('cat-page-title');
    if (!titleEl) return;

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

/**
 * Render subcategories navigation
 */
async function renderSubCategories(mainCatId, activeSubId) {
    const container = document.querySelector('.sub-nav');
    if (!container) return;

    // Fetch Subs from DB
    let subs = [];
    if (window.sb) {
        const { data, error } = await window.sb
            .from('subcategories')
            .select('*')
            .eq('main_cat_id', mainCatId);
        if (error) console.error("Subcategory fetch error:", error);
        subs = data || [];
    }

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
