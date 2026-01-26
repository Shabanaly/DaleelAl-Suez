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
    },

    // 5. Get Featured Place for "Explore Your City"
    getFeaturedPlace: async () => {
        if (!window.sb) return null;
        
        // Try to get specifically featured first
        const { data: featured } = await window.sb
            .from('places')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();
            
        if (featured) return featured;
        
        // Fallback to latest prominent if none specifically featured
        const { data: latest } = await window.sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
        return latest;
    },

    // 6. Get Trending Places (Chips)
    getTrendingPlaces: async (limit = 10) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('id, name_ar, name_en')
            .eq('is_trending', true)
            .eq('is_active', true)
            .limit(limit);
        return data || [];
    },

    // 7. Get Urgent/Quick Services
    getUrgentPlaces: async (limit = 8) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('*')
            .eq('is_urgent', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    // 8. Get Active Offers
    getOfferPlaces: async (limit = 6) => {
        if (!window.sb) return [];
        const { data } = await window.sb
            .from('places')
            .select('*')
            .eq('has_offer', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    }
};

window.UserPlacesService = PlacesService;
