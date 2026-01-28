/**
 * Categories Service (Admin Panel)
 * Handles CRUD operations for categories and subcategories in admin panel
 * @namespace CategoriesService
 */
const CategoriesService = {
    /**
     * Get all categories with subcategories embedded
     * @async
     * @returns {Promise<Array>} Array of category objects with nested subcategories
     */
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

    /**
     * Get subcategories for a specific category
     * @async
     * @param {number|string} mainId - Main category ID
     * @returns {Promise<Array>} Array of subcategory objects
     */
    getSubs: async (mainId) => {
        const sb = SupabaseService.getClient();
        const { data } = await sb.from('subcategories').select('*').eq('main_cat_id', mainId);
        return data ? data.map(s => ({...s, label: s.name_ar})) : [];
    },

    /**
     * Create new category
     * @async
     * @param {Object} categoryData - Category data object
     * @returns {Promise<Object>} Created category object
     * @throws {Error} If creation fails
     */
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

    /**
     * Update existing category
     * @async
     * @param {number|string} id - Category ID
     * @param {Object} categoryData - Updated category data
     * @returns {Promise<Object>} Updated category object
     * @throws {Error} If update fails
     */
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

    /**
     * Delete category
     * @async
     * @param {number|string} id - Category ID
     * @returns {Promise<boolean>} True if deletion successful
     * @throws {Error} If deletion fails
     */
    delete: async (id) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('categories')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    /**
     * Create new subcategory
     * @async
     * @param {Object} subData - Subcategory data object
     * @returns {Promise<Object>} Created subcategory object
     * @throws {Error} If creation fails
     */
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

    /**
     * Update existing subcategory
     * @async
     * @param {number|string} id - Subcategory ID
     * @param {Object} subData - Updated subcategory data
     * @returns {Promise<Object>} Updated subcategory object
     * @throws {Error} If update fails
     */
    updateSub: async (id, subData) => {
        const sb = SupabaseService.getClient();
        const { data, error} = await sb
            .from('subcategories')
            .update(subData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * Delete subcategory
     * @async
     * @param {number|string} id - Subcategory ID
     * @returns {Promise<boolean>} True if deletion successful
     * @throws {Error} If deletion fails
     */
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
