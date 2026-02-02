/**
 * @file: src/data/repositories/story-repository.js
 * @layer: Data Layer
 * @responsibility: Calculate nothing. Validate nothing. Only CRUD.
 */

const StoryRepository = {
    /**
     * Get all active stories
     * @returns {Promise<Array>} Raw story objects
     */
    async getAll() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('stories')
            .select('*, places:place_id(id, name_ar, image_url)')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Create a new story record
     * @param {Object} storyData Raw data object
     * @returns {Promise<Object>} Created record
     */
    async create(storyData) {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('stories')
            .insert([storyData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a story by ID
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const client = window.AppSupabase.get();
        const { error } = await client
            .from('stories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

window.StoryRepository = StoryRepository;
