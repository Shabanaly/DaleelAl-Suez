/**
 * @file: admin/src/data/repositories/stats-repository.js
 * @layer: Data Layer
 * @responsibility: Fetch raw stats from DB.
 */

const StatsRepository = {
    async getCounts() {
        const client = window.AppSupabase.get();
        
        // Parallel requests
        const [places, offers, categories] = await Promise.all([
            client.from('places').select('*', { count: 'exact', head: true }),
            client.from('places').select('*', { count: 'exact', head: true }).eq('has_offer', true).eq('is_active', true),
            client.from('categories').select('*', { count: 'exact', head: true })
        ]);

        return {
            placesCount: places.count || 0,
            offersCount: offers.count || 0,
            categoriesCount: categories.count || 0
        };
    },

    async getAddedSince(dateIsoString) {
        const client = window.AppSupabase.get();
        const { count } = await client.from('places')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateIsoString);
        return count || 0;
    },

    async getRecentActivity(limit) {
        const client = window.AppSupabase.get();
        const { data, error } = await client.from('places')
            .select('id, name_ar, main_cat_id, created_at, images')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data || [];
    }
};

window.StatsRepository = StatsRepository;
