/**
 * @file: admin/src/data/repositories/ad-repository.js
 * @layer: Data Layer
 * @responsibility: CRUD for Ads Settings.
 */

const AdRepository = {
    TABLE: 'ads_settings',

    async getAll() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from(this.TABLE)
            .select('*')
            .order('slot_label', { ascending: true });
        
        if (error) throw error;
        return data || [];
    },

    async update(id, updates) {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from(this.TABLE)
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
        return { id, ...updates }; // Optimistic return
    },

    async getActive() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from(this.TABLE)
            .select('slot_id, ad_code, is_active')
            .eq('is_active', true);
            
        if (error) throw error;
        return data || [];
    }
};

window.AdRepository = AdRepository;
