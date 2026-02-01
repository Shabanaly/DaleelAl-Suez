/**
 * Categories Service (Admin Panel)
 * Handles CRUD operations for categories and subcategories in admin panel
 * @namespace CategoriesService
 */
const CategoriesService = {
    /**
     * Get all categories (Main only)
     * @async
     * @returns {Promise<Array>} Array of category objects
     */
    getAll: async () => {
        const sb = SupabaseService.getClient();
        
        try {
            // Fetch Main only
            const { data: cats, error } = await sb.from('categories').select('*').order('id');
            if (error) throw error;

            return cats.map(c => ({
                ...c,
                label: c.name_ar // Admin UI helper
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
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
    }
};
window.CategoriesService = CategoriesService;
