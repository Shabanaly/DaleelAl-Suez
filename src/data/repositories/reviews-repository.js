/**
 * Reviews Repository
 * Responsibility: Direct interaction with the 'reviews' table.
 */
window.ReviewsRepository = {
    /**
     * Fetch all reviews for a place
     * @param {string|number} placeId 
     */
    async getByPlace(placeId) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        
        const { data, error } = await sb
            .from('reviews')
            .select('*')
            .eq('place_id', placeId)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error("Repo Error (Reviews):", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get user's review for a place
     */
    async getByUserAndPlace(userId, placeId) {
        const sb = window.getSupabaseClient();
        if (!sb) return null;
        
        const { data, error } = await sb
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .eq('place_id', placeId)
            .maybeSingle();
            
        if (error) return null;
        return data;
    },

    /**
     * Add a record
     */
    async add(userId, placeId, rating, comment) {
        const sb = window.getSupabaseClient();
        if (!sb) return { error: "DB Error" };

        return await sb
            .from('reviews')
            .insert({
                user_id: userId,
                place_id: placeId,
                rating: rating,
                comment: comment
            })
            .select()
            .single();
    }
};
