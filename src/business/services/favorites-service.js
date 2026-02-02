/**
 * Favorites Service
 * Responsibility: Business logic for managing favorite places.
 */

window.UserFavoritesService = {
    /**
     * Get all favorite places for the current user
     */
    async getFavorites() {
        if (!window.UserFavoritesRepository) return [];
        
        // Logic check: Is user logged in?
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        
        const { data: { user } } = await sb.auth.getUser();
        if (!user) {
            throw new Error("AUTH_REQUIRED");
        }
        
        return await window.UserFavoritesRepository.getFavorites();
    },

    /**
     * Toggle a place as favorite
     * @param {string} placeId 
     */
    async toggleFavorite(placeId) {
        if (!window.UserFavoritesRepository) return;
        
        const sb = window.getSupabaseClient();
        if (!sb) return;
        
        const { data: { user } } = await sb.auth.getUser();
        if (!user) throw new Error("AUTH_REQUIRED");

        // Check current status
        const { data: existing } = await window.UserFavoritesRepository.getFavorite(user.id, placeId);
        
        if (existing) {
            await window.UserFavoritesRepository.remove(existing.id);
            return false; // Not favorited anymore
        } else {
            await window.UserFavoritesRepository.add(user.id, placeId);
            return true; // Favorited
        }
    }
};
