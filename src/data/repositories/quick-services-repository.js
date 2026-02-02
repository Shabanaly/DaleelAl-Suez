/**
 * Quick Services Repository
 * Handles data access for Quick Services (emergency/utility icons)
 */
window.QuickServicesRepository = {
    async getServices() {
        const sb = window.getSupabaseClient();
        if (!sb) return [];

        const { data, error } = await sb
            .from('quick_services')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        if (error) throw error;
        return data || [];
    }
};
