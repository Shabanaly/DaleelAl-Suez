// Stats Service
const StatsService = {
    getDashboardStats: async () => {
        const sb = SupabaseService.getClient();
        
        // 1. Total Places
        const { count: placesCount } = await sb.from('places').select('*', { count: 'exact', head: true });

        // 2. Active Offers
        const { count: offersCount } = await sb.from('offers').select('*', { count: 'exact', head: true }).eq('is_active', true);

        // 3. Main Categories Count (Static from config or derived)
        // For now, let's assume we count unique main_cat_ids from places as a proxy if we don't have a categories table
        // Or better, just hardcode the known static categories count from our logic
        const mainCategoriesCount = 13; // We know we have ~13 categories

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
            .select('id, name_ar, main_cat_id, created_at')
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
