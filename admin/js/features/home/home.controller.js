/**
 * Home Controller
 */
const HomeController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        
        try {
            // Get User
            const user = AuthService.getUserData();
            
            // Get Stats
            // Check if StatsService is loaded. It is in index.html (legacy services are not loaded yet in new index.html!)
            // Wait, we didn't add stats.service.js to index.html yet. We need to add it.
            
            let stats = { totalPlaces: 0, activeOffers: 0, mainCategories: 0, addedToday: 0 };
            let recent = [];

            if (typeof StatsService !== 'undefined') {
                stats = await StatsService.getDashboardStats();
                const rawRecent = await StatsService.getRecentActivity();
                
                // Enrich with Category Strings
                // categories-service.js must be loaded
                if (window.CategoriesService) {
                    const allCats = await window.CategoriesService.getAll();
                    const catMap = {};
                    allCats.forEach(c => catMap[c.id] = c.name_ar);
                    
                    recent = rawRecent.map(item => ({
                        ...item,
                        category_name: catMap[item.main_cat_id] || item.main_cat_id // Fallback to ID
                    }));
                } else {
                    recent = rawRecent;
                }
            } else {
                console.warn("StatsService is not loaded.");
            }

            container.innerHTML = HomeUI.render(stats, recent, user);
            lucide.createIcons();

        } catch (e) {
            console.error(e);
            container.innerHTML = '<p class="text-danger">فشل تحميل لوحة التحكم</p>';
        }
    }
};

window.HomeController = HomeController;
