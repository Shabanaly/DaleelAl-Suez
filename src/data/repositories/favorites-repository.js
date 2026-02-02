/**
 * Favorites Repository
 * Responsibility: Interaction with 'user_favorites' table.
 */
 // import { getSupabaseClient } from '../api/supabase-client.js';

const FavoritesRepository = {
    /**
     * Get all favorite place IDs for current user
     */
    async getFavoritesIds() {
        const sb = getSupabaseClient();
        if (!sb) return new Set();
        
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return new Set();
        
        const { data, error } = await sb
            .from('user_favorites')
            .select('place_id')
            .eq('user_id', user.id);
            
        if (error) {
            console.error('Repo Error (Favorites IDs):', error);
            return new Set();
        }
        
        return new Set(data.map(item => item.place_id));
    },

    /**
     * Get full favorite places details
     */
    async getFavorites() {
        const sb = getSupabaseClient();
        if (!sb) return [];
        
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return [];
        
        const { data: favs, error: favError } = await sb
            .from('user_favorites')
            .select('place_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
        if (favError || !favs || favs.length === 0) {
            if (favError) console.error('Repo Error (Favorites):', favError);
            return [];
        }
        
        const placeIds = favs.map(f => f.place_id);
        
        const { data: places, error: placeError } = await sb
            .from('places')
            .select('*')
            .in('id', placeIds);
            
        if (placeError) {
            console.error('Repo Error (Favorite Places Details):', placeError);
            return [];
        }
        
        const placesMap = new Map(places.map(p => [p.id, p]));
        return favs
            .map(f => placesMap.get(f.place_id))
            .filter(p => p !== undefined);
    },

    /**
     * Get a specific favorite record
     */
    async getFavorite(userId, placeId) {
        const sb = getSupabaseClient();
        return await sb
            .from('user_favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('place_id', placeId)
            .maybeSingle();
    },

    /**
     * Add to favorites
     */
    async add(userId, placeId) {
        const sb = getSupabaseClient();
        return await sb
            .from('user_favorites')
            .insert({ user_id: userId, place_id: placeId });
    },

    /**
     * Remove from favorites
     */
    async remove(id) {
        const sb = getSupabaseClient();
        return await sb
            .from('user_favorites')
            .delete()
            .eq('id', id);
    }
};

window.UserFavoritesRepository = FavoritesRepository;
