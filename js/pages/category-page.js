/**
 * Category Page Controller  
 * Handles category page initialization
 */

import { getQueryParam } from '../utils/url-helpers.js';
import { renderPlaces } from '../renderers/place/place-card-renderer.js';

/**
 * Initialize category page
 */
export async function initCategoryPage() {
    const catId = getQueryParam('id');

    if (!catId) return;

    // Setup header
    await setupCategoryPageHeader(catId);
    
    // Load places (Main Category Only)
    if (window.UserPlacesService) {
        const places = await window.UserPlacesService.getPlacesByMainCategory(catId);
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
