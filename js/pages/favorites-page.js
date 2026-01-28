/**
 * Favorites Page Controller
 * Handles fetching and rendering user favorites
 */

import { PlaceRenderer } from '../renderers/place/place-card-renderer.js';

document.addEventListener("DOMContentLoaded", () => {
    initFavoritesPage();
});

async function initFavoritesPage() {
    const container = document.getElementById('favorites-container');
    const noFavs = document.getElementById('no-favorites');
    const countMeta = document.getElementById('fav-count-meta');
    
    if (!container || !noFavs) return;

    // Check Login
    if (!window.sb) {
        // Wait for init
        setTimeout(initFavoritesPage, 500);
        return;
    }

    const { data: { session } } = await window.sb.auth.getSession();
    
    if (!session) {
        // Not logged in
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 data-i18n="fav_login_required">يجب تسجيل الدخول لعرض المفضلة</h3>
                <a href="login.html" class="modal-action-btn" style="display:inline-block; width:auto; margin-top:20px; text-decoration:none;" data-i18n="fav_login_btn">تسجيل الدخول</a>
            </div>
        `;
        // Refresh translations for dynamic content
        if (typeof updatePageContent === 'function') updatePageContent(localStorage.getItem('lang') || 'ar');
        return;
    }

    // Loader
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center;"><i data-lucide="loader-2" class="spin" style="width:32px;height:32px;"></i></div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Fetch Data
    if (!window.FavoritesService) {
        console.error("FavoritesService missing");
        return;
    }

    const favorites = await window.FavoritesService.getFavorites();

    // Render
    if (favorites && favorites.length > 0) {
        noFavs.style.display = 'none';
        container.innerHTML = PlaceRenderer.renderList(favorites, (localStorage.getItem('lang') === 'ar'));
        if (countMeta) countMeta.textContent = `${favorites.length} items`;
    } else {
        container.innerHTML = '';
        noFavs.style.display = 'block';
        if (countMeta) countMeta.textContent = `0 items`;
    }
    
    // Sync icons (they should be active since they are favorites)
    if (typeof syncFavoriteIcons === 'function') syncFavoriteIcons();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Listen for removals
    window.addEventListener('place-favorite-toggled', (e) => {
        const { id, isFavorited } = e.detail;
        if (!isFavorited) {
            handleRemoveItem(id);
        }
    });
}

function handleRemoveItem(id) {
    const container = document.getElementById('favorites-container');
    const btn = container.querySelector(`.favorite-btn[data-id="${id}"]`);
    if (!btn) return;
    
    // Find parent card
    const card = btn.closest('.place-card') || btn.closest('.listing-card');
    if (card) {
        // Animation
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        
        setTimeout(() => {
            card.remove();
            
            // Check if empty
            if (container.children.length === 0) {
                document.getElementById('no-favorites').style.display = 'block';
                // Update count
                const countMeta = document.getElementById('fav-count-meta');
                if (countMeta) countMeta.textContent = '0 items';
            } else {
                // Update count
                const countMeta = document.getElementById('fav-count-meta');
                if (countMeta) countMeta.textContent = `${container.children.length} items`;
            }
        }, 300);
    }
}
