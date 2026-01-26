const AdsService = {
    TABLE: 'ads_settings',

    // 1. Get all ad slots
    getAll: async () => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from(AdsService.TABLE)
            .select('*')
            .order('slot_label', { ascending: true });
        
        if (error) throw error;
        return data || [];
    },

    // 2. Update a specific slot
    update: async (id, updates) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from(AdsService.TABLE)
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 3. Get active ads for the frontend
    getActiveAds: async () => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from(AdsService.TABLE)
            .select('slot_id, ad_code, is_active')
            .eq('is_active', true);
            
        if (error) throw error;
        return data || [];
    }
};

window.AdsService = AdsService;
