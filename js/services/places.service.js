// Places Service (User Frontend)
// Handles data fetching with strict querying logic

const PlacesService = {
    // 1. Get Latest Places
    getLatestPlaces: async (limit = 10) => {
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) {
            console.error("Error fetching latest:", error);
            return [];
        }
        return data;
    },

    // 2. Get by Main Category
    getPlacesByMainCategory: async (catId) => {
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('main_cat_id', catId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching main cat:", error);
            return [];
        }
        return data;
    },

    // 3. Get by Sub Category
    getPlacesBySubCategory: async (subId) => {
        const { data, error } = await window.sb
            .from('places')
            .select('*')
            .eq('sub_cat_id', subId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching sub cat:", error);
            return [];
        }
        return data;
    }
};

window.UserPlacesService = PlacesService;
