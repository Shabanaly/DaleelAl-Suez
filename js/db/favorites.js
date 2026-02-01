/**
 * Favorites Service
 * Handles user favorite places (toggle, check, list)
 */

const FavoritesService = {
    
    /**
     * Get all favorite place IDs for current user
     * @returns {Promise<Set<string>>} Set of Place IDs
     */
    async getFavoritesIds() {
        if (!window.sb) return new Set();
        
        const { data: { user } } = await window.sb.auth.getUser();
        if (!user) return new Set();
        
        const { data, error } = await window.sb
            .from('user_favorites')
            .select('place_id')
            .eq('user_id', user.id);
            
        if (error) {
            console.error('Error fetching favorites:', error);
            return new Set();
        }
        
        // Return as Set for O(1) lookup
        return new Set(data.map(item => item.place_id));
    },

    /**
     * Get full favorite places details
     * @returns {Promise<Array>} List of Place objects
     */
    async getFavorites() {
        if (!window.sb) return [];
        
        const { data: { user } } = await window.sb.auth.getUser();
        if (!user) return [];
        
        // Step 1: Get IDs with Order
        const { data: favs, error: favError } = await window.sb
            .from('user_favorites')
            .select('place_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
        if (favError || !favs || favs.length === 0) {
            if (favError) console.error('Error fetching favorites IDs:', favError);
            return [];
        }
        
        const placeIds = favs.map(f => f.place_id);
        
        // Step 2: Get Places
        const { data: places, error: placeError } = await window.sb
            .from('places')
            .select('*')
            .in('id', placeIds);
            
        if (placeError) {
            console.error('Error fetching favorite places details:', placeError);
            return [];
        }
        
        // Step 3: Map to preserve order and filter valid
        const placesMap = new Map(places.map(p => [p.id, p]));
        return favs
            .map(f => placesMap.get(f.place_id))
            .filter(p => p !== undefined);
    },

    /**
     * Toggle favorite status
     * @param {string} placeId 
     * @returns {Promise<boolean>} new status (true=favorited, false=removed)
     */
    async toggleFavorite(placeId) {
        if (!window.sb) return false;
        
        const { data: { user } } = await window.sb.auth.getUser();
        if (!user) {
            // Not logged in -> Redirect to login
            window.location.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
            return false;
        }

        // Check availability strictly
        const { data: existing } = await window.sb
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('place_id', placeId)
            .maybeSingle();

        if (existing) {
            // Remove
            await window.sb
                .from('user_favorites')
                .delete()
                .eq('id', existing.id);
            return false;
        } else {
            // Add
            await window.sb
                .from('user_favorites')
                .insert({
                    user_id: user.id,
                    place_id: placeId
                });
            return true;
        }
    }
};

// Expose globally
window.FavoritesService = FavoritesService;
