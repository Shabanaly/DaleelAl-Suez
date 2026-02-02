/**
 * Trending Repository
 * Handles data access for dynamic trending tags
 */
window.TrendingRepository = {
    async getTrendingTags(limit = 5) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];

        const { data, error } = await sb
            .from('trending_tags')
            .select('tag')
            .eq('is_active', true)
            .limit(limit);

        if (error) throw error;
        return data || [];
    }
};
