/**
 * Places Repository
 * Responsibility: Direct interaction with the 'places' table.
 */
window.PlacesRepository = {
    /**
     * Get latest active places
     * @param {number} limit 
     */
    async getLatest(limit = 10) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        
        const { data, error } = await sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
            
        if (error) {
            console.error("Repo Error fetching latest:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get places by main category
     * @param {number|string} catId 
     */
    async getByMainCategory(catId) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        
        const { data, error } = await sb
            .from('places')
            .select('*')
            .eq('main_cat_id', catId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Repo Error fetching main cat:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Get a single place by ID
     * @param {number|string} id 
     */
    async getById(id) {
        const sb = window.getSupabaseClient();
        if (!sb) return null;
        
        const { data, error } = await sb
            .from('places')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Repo Error fetching place:", error);
            return null;
        }
        return data;
    },

    /**
     * Get featured place
     */
    async getFeatured() {
        const sb = window.getSupabaseClient();
        if (!sb) return null;
        
        const { data: featured } = await sb
            .from('places')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true)
            .limit(1)
            .maybeSingle();
            
        if (featured) return featured;
        
        // Fallback to latest
        const { data: latest } = await sb
            .from('places')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
        return latest;
    },

    /**
     * Get trending places
     */
    async getTrending(limit = 10) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data } = await sb
            .from('places')
            .select('id, name_ar, name_en')
            .eq('is_trending', true)
            .eq('is_active', true)
            .limit(limit);
        return data || [];
    },

    /**
     * Get urgent services
     */
    async getUrgent(limit = 8) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data } = await sb
            .from('places')
            .select('*')
            .eq('is_urgent', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    /**
     * Get places with offers
     */
    async getOffers(limit = 6) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data } = await sb
            .from('places')
            .select('*')
            .eq('has_offer', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    /**
     * Get hidden gems
     */
    async getHiddenGems(limit = 4) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];
        const { data, error } = await sb
            .from('places')
            .select('id, name_ar, image_url, address')
            .eq('is_hidden_gem', true)
            .limit(limit);
            
        if (error) {
             console.error("Repo Error fetching hidden gems:", error);
             return [];
        }
        return data || [];
    },
    /**
     * Search places by text and filters
     * @param {string} query 
     * @param {object} filters 
     */
    async search(query, filters = {}) {
        const sb = window.getSupabaseClient();
        if (!sb) return [];

        let dbQuery = sb
            .from('places')
            .select('id, name_ar, name_en, image_url, address, main_cat_id, has_offer, rating')
            .eq('is_active', true);
        
        if (query) {
            dbQuery = dbQuery.or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%,address.ilike.%${query}%`);
        }

        if (filters.offers) {
            dbQuery = dbQuery.eq('has_offer', true);
        }

        if (filters.top) {
            dbQuery = dbQuery.order('rating', { ascending: false });
        }

        const { data, error } = await dbQuery.limit(20);
        if (error) {
            console.error("Repo Search Error:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Log a view for a place
     * @param {string} placeId 
     * @param {string|null} userId 
     * @param {string|null} sessionHash 
     */
    async logView(placeId, userId, sessionHash) {
        const sb = window.getSupabaseClient();
        if (!sb) return;

        // Construct payload based on what's available
        const payload = {
            place_id: placeId,
            user_id: userId || null,
            session_hash: sessionHash || null
        };

        const { error } = await sb
            .from('place_views')
            .insert(payload);

        if (error) {
             // Ignore duplicate key error (expected for repeat views in same day)
             if (error.code !== '23505') { 
                 console.error("Repo Error logging view:", error);
             }
        }
    }
};
