const PlacesService = {
    // 1. Get All Places
    getAll: async () => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('places')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error(error);
            return [];
        }
        return data || [];
    },

    // 2. Get by ID
    getById: async (id) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('places')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    },

    // 3. Create Place
    create: async (placeData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('places')
            .insert([placeData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // 4. Update Place
    update: async (id, placeData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('places')
            .update(placeData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // 5. Delete Place
    delete: async (id) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('places')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
};

window.PlacesService = PlacesService;
