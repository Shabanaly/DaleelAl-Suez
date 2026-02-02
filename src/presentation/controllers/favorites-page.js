/**
 * Favorites Page Controller
 * Handles fetching and rendering user favorites
 */

(function() {
    window.FavoritesPageController = {
        async init() {
            console.log("📂 FavoritesPageController Initializing (Clean Architecture)...");
            
            const container = document.getElementById('favorites-container');
            const noFavs = document.getElementById('no-favorites');
            const countMeta = document.getElementById('fav-count-meta');
            
            if (!container || !noFavs) return;

            // 1. Fetch Data through Service (Business Logic)
            try {
                // Show Loader
                container.innerHTML = `<div style="grid-column: 1/-1; text-align: center;"><i data-lucide="loader-2" class="spin" style="width:32px;height:32px;"></i></div>`;
                if (window.lucide) window.lucide.createIcons();

                const favorites = await window.UserFavoritesService.getFavorites();

                // 2. Delegate Rendering (Presentation Layer)
                if (favorites && favorites.length > 0) {
                    noFavs.style.display = 'none';
                    const isAr = (localStorage.getItem('lang') || 'ar') === 'ar';
                    container.innerHTML = window.PlaceRenderer.renderList(favorites, isAr, 'standard');
                    if (countMeta) countMeta.textContent = `${favorites.length} items`;
                } else {
                    container.innerHTML = '';
                    noFavs.style.display = 'block';
                    if (countMeta) countMeta.textContent = `0 items`;
                }
            } catch (err) {
                if (err.message === "AUTH_REQUIRED") {
                    this.renderLoginRequired(container);
                } else {
                    console.error("Failed to load favorites:", err);
                    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">فشل تحميل المفضلة</p>`;
                }
            }
            
            // Sync UI features
            if (typeof syncFavoriteIcons === 'function') syncFavoriteIcons();
            if (window.lucide) window.lucide.createIcons();
            
            // Initialize Events
            this.initEventListeners();
        },

        initEventListeners() {
            // Listen for removals
            window.addEventListener('place-favorite-toggled', (e) => {
                const { id, isFavorited } = e.detail;
                if (!isFavorited) {
                    this.handleRemoveItem(id);
                }
            });
        },

        renderLoginRequired(container) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <h3 data-i18n="fav_login_required">يجب تسجيل الدخول لعرض المفضلة</h3>
                    <a href="login.html" class="modal-action-btn" style="display:inline-block; width:auto; margin-top:20px; text-decoration:none;" data-i18n="fav_login_btn">تسجيل الدخول</a>
                </div>
            `;
            // Refresh translations
            if (window.i18n && window.i18n.updatePageContent) {
                window.i18n.updatePageContent(localStorage.getItem('lang') || 'ar');
            }
        },

        handleRemoveItem(id) {
            const container = document.getElementById('favorites-container');
            const btn = container.querySelector(`.favorite-btn[data-id="${id}"]`);
            if (!btn) return;
            
            const card = btn.closest('.place-card-link');
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.remove();
                    this.updateFavCount();
                }, 300);
            }
        },

        updateFavCount() {
            const container = document.getElementById('favorites-container');
            const noFavs = document.getElementById('no-favorites');
            const countMeta = document.getElementById('fav-count-meta');
            
            const count = container.querySelectorAll('.place-card').length;
            if (countMeta) countMeta.textContent = `${count} items`;
            
            if (count === 0 && noFavs) {
                noFavs.style.display = 'block';
            }
        }
    };
})();
