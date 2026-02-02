/**
 * Categories Repository
 */
window.CategoriesRepository = {
    async getMainCategories() {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data, error } = await sb
            .from('categories')
            .select('*')
            .order('name_ar');
        if (error) console.error(error);
        return data || [];
    },

    async getSubcategories(mainCatId) {
        if (!mainCatId) return [];
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data, error } = await sb
            .from('subcategories')
            .select('*')
            .eq('main_cat_id', mainCatId)
            .order('name_ar');
        if (error) console.error(error);
        return data || [];
    },

    async getById(id) {
        const sb = window.getSupabaseClient();
        if (!sb) return null;
        const { data, error } = await sb
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error(error);
        return data;
    }
};
