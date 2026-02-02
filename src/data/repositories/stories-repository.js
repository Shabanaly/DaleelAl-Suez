/**
 * Stories Repository
 * Handles direct data access for Stories feature
 */
window.StoriesRepository = {
    /**
     * Fetch active stories from database
     * @returns {Promise<Array>} List of raw story objects
     */
    async getStories() {
        const { data, error } = await window.sb
            .from('stories')
            .select(`
                id, 
                place_id, 
                media_url, 
                media_type, 
                caption, 
                created_at,
                link_url,
                places (
                    name_ar,
                    image_url
                )
            `)
            .eq('is_active', true)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Increment view count for a story
     * @param {number} storyId 
     */
    async incrementView(storyId) {
        const { error } = await window.sb.rpc('increment_story_views', { story_id_input: storyId });
        if (error) {
            console.error('Error incrementing views:', error);
        }
    }
};
