// Places Service
const PlacesService = {
    // Fetch all places with optional filters
    getAll: async (filter = {}) => {
        let query = SupabaseService.getClient().from('places').select('*').order('created_at', { ascending: false });

        if (filter.search) {
            query = query.or(`name_ar.ilike.%${filter.search}%,name_en.ilike.%${filter.search}%`);
        }
        if (filter.category) {
            query = query.eq('main_cat_id', filter.category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Get single place by ID
    getById: async (id) => {
        const { data, error } = await SupabaseService.getClient()
            .from('places').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Create new place
    create: async (placeData) => {
        const { data, error } = await SupabaseService.getClient()
            .from('places').insert([placeData]).select();
        if (error) throw error;
        return data ? data[0] : null;
    },

    // Update existing place
    update: async (id, updates) => {
        const { data, error } = await SupabaseService.getClient()
            .from('places').update(updates).eq('id', id).select();
        if (error) throw error;
        return data ? data[0] : null;
    },

    // Delete place
    delete: async (id) => {
        const { error } = await SupabaseService.getClient()
            .from('places').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
};

window.PlacesService = PlacesService;
