/**
 * @file: admin/src/presentation/controllers/home-controller.js
 * @layer: Presentation Layer
 * @responsibility: Dashboard Controller.
 */

const HomeController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        
        try {
            // Get User (Auth Service legacy or new?)
            // Assuming legacy AuthService available globally for now.
            const user = window.AuthService ? window.AuthService.getUserData() : null;
            
            // Get Stats from StatsService (Existing)
            let stats = { totalPlaces: 0, activeOffers: 0, mainCategories: 0, addedToday: 0 };
            let recent = [];
            
            // Get Analytics from AnalyticsService (New)
            let analyticsData = {};

            if (window.AppStatsService) {
                stats = await window.AppStatsService.getDashboardStats();
                const rawRecent = await window.AppStatsService.getRecentActivity();
                
                // Enrich with Category Strings
                if (window.AppCategoryService) {
                    const allCats = await window.AppCategoryService.getAllCategories();
                    const catMap = {};
                    allCats.forEach(c => catMap[c.id] = c.label || c.name_ar);
                    
                    recent = rawRecent.map(item => ({
                        ...item,
                        category_name: catMap[item.main_cat_id] || item.main_cat_id
                    }));
                } else {
                    recent = rawRecent;
                }
            }

            if (window.AnalyticsService) {
                try {
                    analyticsData = await window.AnalyticsService.getDashboardStats();
                    // Merge counts if needed, but existing stats are fine.
                } catch (err) {
                    console.error("Analytics load error:", err);
                }
            }

            container.innerHTML = HomeView.render(stats, recent, user, analyticsData);
            if (window.lucide) window.lucide.createIcons();

        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل لوحة التحكم</p>';
        }
    }
};

window.HomeController = HomeController;
