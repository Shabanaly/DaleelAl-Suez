const CategoriesService = {
    // 1. Get All Categories (with subcategories embedded)
    getAll: async () => {
        const sb = SupabaseService.getClient();
        
        try {
            // Fetch Main
            const { data: cats, error: err1 } = await sb.from('categories').select('*').order('id');
            if (err1) throw err1;

            // Fetch Subs
            const { data: subs, error: err2 } = await sb.from('subcategories').select('*');
            if (err2) throw err2;

            // Map Subs to Main
            return cats.map(c => ({
                ...c,
                label: c.name_ar, // Admin UI helper
                subs: subs.filter(s => s.main_cat_id === c.id).map(s => ({
                    ...s,
                    label: s.name_ar
                }))
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    // 2. Get Subcategories for a specific ID
    getSubs: async (mainId) => {
        const sb = SupabaseService.getClient();
        const { data } = await sb.from('subcategories').select('*').eq('main_cat_id', mainId);
        return data ? data.map(s => ({...s, label: s.name_ar})) : [];
    },

    // 3. Create Category
    create: async (categoryData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('categories')
            .insert([categoryData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // 4. Update Category
    update: async (id, categoryData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // 5. Delete Category
    delete: async (id) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('categories')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    // 6. Subcategories CRUD
    createSub: async (subData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('subcategories')
            .insert([subData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateSub: async (id, subData) => {
        const sb = SupabaseService.getClient();
        const { data, error } = await sb
            .from('subcategories')
            .update(subData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteSub: async (id) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('subcategories')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};
window.CategoriesService = CategoriesService;
