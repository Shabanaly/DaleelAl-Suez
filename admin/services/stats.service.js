// Stats Service
const StatsService = {
    getDashboardStats: async () => {
        const sb = SupabaseService.getClient();
        
        // 1. Total Places
        const { count: placesCount } = await sb.from('places').select('*', { count: 'exact', head: true });

        // 2. Active Offers (places with has_offer = true)
        const { count: offersCount } = await sb.from('places').select('*', { count: 'exact', head: true }).eq('has_offer', true).eq('is_active', true);

        // 3. Main Categories Count
        const { count: categoriesCount } = await sb.from('categories').select('*', { count: 'exact', head: true });
        const mainCategoriesCount = categoriesCount || 0;

        // 4. Added Today
        const today = new Date().toISOString().split('T')[0];
        const { count: addedToday } = await sb.from('places')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today);

        return {
            totalPlaces: placesCount || 0,
            activeOffers: offersCount || 0,
            mainCategories: mainCategoriesCount,
            addedToday: addedToday || 0
        };
    },

    getRecentActivity: async (limit = 5) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb.from('places')
            .select('id, name_ar, created_at') // Removed main_cat_id to fix crash
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
        return data;
    }
};

window.StatsService = StatsService;
