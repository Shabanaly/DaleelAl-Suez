// Places Service
const PlacesService = {
    // 1. Get Latest Places (Global or generic)
    getLatestPlaces: async (limit = 20) => {
        const { data, error } = await SupabaseService.getClient()
            .from('places')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    },

    // 2. Get by Main Category (Direct Query)
    getPlacesByMainCategory: async (mainCatId) => {
        if (!mainCatId) return [];
        const { data, error } = await SupabaseService.getClient()
            .from('places')
            .select('*')
            .eq('main_cat_id', mainCatId)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data;
    },

    // 3. Get by Sub Category (Direct Query)
    getPlacesBySubCategory: async (subCatId) => {
        if (!subCatId) return [];
        const { data, error } = await SupabaseService.getClient()
            .from('places')
            .select('*')
            .eq('sub_cat_id', subCatId)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data;
    },

    // Legacy/Admin Search Support (Refactored to use generic query if no cat specified)
    getAll: async (filter = {}) => {
        // If specific category requested, delegate (Strict Separation)
        if (filter.category) {
            return await PlacesService.getPlacesByMainCategory(filter.category);
        }

        // Otherwise generic search/latest
        let query = SupabaseService.getClient().from('places').select('*').order('created_at', { ascending: false });

        if (filter.search) {
            query = query.or(`name_ar.ilike.%${filter.search}%,name_en.ilike.%${filter.search}%`);
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
