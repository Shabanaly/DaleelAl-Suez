// Places Service (User Frontend)
const PlacesService = {
    // 1. Get Latest Places
    getLatestPlaces: async (limit = 10) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) {
            console.error("Error fetching latest:", error);
            return [];
        }
        return data || [];
    },

    // 2. Get by Main Category
    getPlacesByMainCategory: async (catId) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('main_cat_id', catId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching main cat:", error);
            return [];
        }
        return data || [];
    },

    // 3. Get by Sub Category
    getPlacesBySubCategory: async (subId) => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('sub_cat_id', subId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching sub cat:", error);
            return [];
        }
        return data || [];
    },

    // 4. Get Single Place by ID
    getById: async (id) => {
        if (!window.sb) return null;
        
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching place:", error);
            return null;
        }
        return data;
    }
};

window.UserPlacesService = PlacesService;
