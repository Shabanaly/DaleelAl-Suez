/**
 * Favorites UI Sync
 * Updates heart icon UI states based on stored favorites
 */

 // import { getFavorites } from '../data/favorites-manager.js';

/**
 * Update heart icon UI states on the page based on stored favorites
 */
function syncFavoriteIcons() {
    const ids = getFavorites();
    const isAr = document.documentElement.lang === 'ar';

    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const textSpan = btn.querySelector('span');
        const isFav = ids.includes(id);

        if (isFav) {
            btn.classList.add('active');
            if (icon) icon.setAttribute('data-lucide', 'heart-off');
            if (textSpan) textSpan.innerText = isAr ? 'إزالة من المفضلة' : 'Remove Favorite';
            
            // Specific style for sidebar btn
            if (btn.classList.contains('btn-primary-modern')) {
                btn.style.background = 'var(--error-soft)';
                btn.style.color = 'var(--error)';
            }
        } else {
            btn.classList.remove('active');
            if (icon) icon.setAttribute('data-lucide', 'heart');
            if (textSpan) textSpan.innerText = isAr ? 'إضافة للمفضلة' : 'Add to Favorites';
            
            if (btn.classList.contains('btn-primary-modern')) {
                btn.style.background = 'var(--bg-main)';
                btn.style.color = 'var(--text-main)';
            }
        }
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Make globally accessible
window.syncFavoriteIcons = syncFavoriteIcons;
