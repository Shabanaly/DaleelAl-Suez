/**
 * Home Page Controller (Non-module)
 * Responsibility: Event listening and coordinating between Business Logic and Presentation Renderers.
 */
(function() {
    window.HomePageController = {
        async init() {
            console.log("🚀 Initializing Home Page (Clean Architecture)...");

            // 1. Initialize UI Features (Delegated)
            this.initFeatures();

            // 2. Setup Interactions
            this.setupSearchLogic();

            // 3. Load Initial Data
            await this.loadInitialContent();
        },

        initFeatures() {
            if (window.initMoodPicker) window.initMoodPicker('mood-picker-container');
            if (window.initSuezLive) window.initSuezLive('suez-live-widget');
            if (window.initStories) window.initStories('stories-container');
            if (window.initEvents) window.initEvents('events-container');
            if (window.initHiddenGems) window.initHiddenGems('gems-container');
            if (window.initCategoriesSidebar) window.initCategoriesSidebar('categories-sidebar-container');
            if (window.renderOffers) window.renderOffers();
        },

        setupSearchLogic() {
            const searchContainer = document.querySelector('.search-ui');
            if (!searchContainer) return;

            const input = searchContainer.querySelector('input');
            const suggestionsBox = document.getElementById('search-suggestions');

            if (!input) return;

            input.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length < 2) {
                    if (window.HomeRenderer) window.HomeRenderer.hideSuggestions(suggestionsBox);
                    return;
                }

                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(async () => {
                    // Page Controller calls Business Logic (UserPlacesService)
                    if (window.UserPlacesService) {
                        try {
                            const results = await window.UserPlacesService.search(query);
                            // Page Controller calls Presentation Layer (HomeRenderer)
                            if (window.HomeRenderer) {
                                window.HomeRenderer.renderSuggestions(results, suggestionsBox, query);
                            }
                        } catch (err) {
                            console.error("Search Suggest Error:", err);
                        }
                    }
                }, 300);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = input.value.trim();
                    if (val) window.location.href = `src/presentation/pages/search.html?q=${encodeURIComponent(val)}`;
                }
            });
        },

        async loadInitialContent() {
            const container = document.getElementById('places-container');
            if (!container || !window.UserPlacesService) return;

            try {
                // Controller calls Service
                const places = await window.UserPlacesService.getLatestPlaces(8);
                
                // Controller calls Renderer
                if (window.HomeRenderer) {
                    window.HomeRenderer.renderPlacesList(places, container);
                }
            } catch (e) {
                console.error("Failed to load places", e);
            }
        }
    };
})();
