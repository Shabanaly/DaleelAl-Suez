/**
 * Places Service (Admin Panel)
 * Handles CRUD operations for places in admin panel
 * @namespace PlacesService
 */
const PlacesService = {
    /**
     * Get all places ordered by creation date
     * @async
     * @returns {Promise<Array>} Array of place objects
     */
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

    /**
     * Get single place by ID
     * @async
     * @param {number|string} id - Place ID
     * @returns {Promise<Object>} Place object
     * @throws {Error} If place not found
     */
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

    /**
     * Create new place
     * @async
     * @param {Object} placeData - Place data object
     * @returns {Promise<Object>} Created place object
     * @throws {Error} If creation fails
     */
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

    /**
     * Update existing place
     * @async
     * @param {number|string} id - Place ID
     * @param {Object} placeData - Updated place data
     * @returns {Promise<Object>} Updated place object  
     * @throws {Error} If update fails
     */
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

    /**
     * Delete place
     * @async
     * @param {number|string} id - Place ID
     * @returns {Promise<boolean>} True if deletion successful
     * @throws {Error} If deletion fails
     */
    delete: async (id) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('places')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    /**
     * Toggle place status (Active <-> Closed)
     * @async
     * @param {string} id - Place ID
     * @param {boolean} currentStatus - Current is_active status
     * @returns {Promise<boolean>} New status
     */
    toggleStatus: async (id, currentStatus) => {
        const sb = SupabaseService.getClient();
        const newStatus = !currentStatus;
        
        const { data, error } = await sb
            .from('places')
            .update({ is_active: newStatus })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return newStatus;
    }
};

window.PlacesService = PlacesService;
