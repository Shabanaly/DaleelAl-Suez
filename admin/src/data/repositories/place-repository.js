/**
 * @file: src/data/repositories/place-repository.js
 * @layer: Data Layer
 * @responsibility: CRUD operations for Places.
 */

const PlaceRepository = {
    /**
     * Get all places (raw)
     */
    async getAll() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('places')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get all active places
     */
    async getAllActive() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('places')
            .select('id, name_ar, main_cat_id')
            .eq('is_active', true)
            .order('name_ar');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get Place by ID
     */
    async getById(id) {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('places')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create Place
     */
    async create(placeData) {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('places')
            .insert([placeData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update Place
     */
    async update(id, placeData) {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('places')
            .update(placeData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete Place
     */
    async delete(id) {
        const client = window.AppSupabase.get();
        const { error } = await client
            .from('places')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // --- Sub-Resources (Images) ---

    // --- Sub-Resources (Images) ---
    // NO LONGER USED: Images are stored in 'images' column in 'places' table.
};

window.PlaceRepository = PlaceRepository;
