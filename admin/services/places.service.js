const PlacesService = {
    // 1. Get All Places
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

    // 2. Get by ID
    getById: async (id) => {
        const sb = SupabaseService.getClient();
        // Fetch place AND its images
        const { data: place, error } = await sb
            .from('places')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;

        // Fetch images
        if (place) {
            const { data: images } = await sb
                .from('place_images')
                .select('image_url')
                .eq('place_id', id);
            
            if (images) {
                place.images = images.map(img => img.image_url);
            }
        }

        return place;
    },

    // 3. Create Place
    create: async (placeData) => {
        const sb = SupabaseService.getClient();
        
        // Extract Gallery Images & Remove non-schema fields
        const { images, ...dbData } = placeData;
        
        // Sanitize: ensure we only send fields that exist in DB to avoid errors
        const validFields = [
            'name_ar', 'name_en', 'sub_cat_id', 'address', 'address_ar', 'address_en',
            'desc_ar', 'desc_en', 'image_url', 'is_featured', 'is_active',
            'phone', 'whatsapp', 'working_hours', 'is_trending', 'is_urgent', 
            'has_offer', 'offer_text_ar', 'offer_text_en'
        ];

        const payload = {};
        validFields.forEach(field => {
            if (dbData[field] !== undefined) payload[field] = dbData[field];
        });

        // 1. Insert Place
        const { data, error } = await sb
            .from('places')
            .insert([payload])
            .select()
            .single();
        
        if (error) throw error;

        // 2. Insert Gallery Images (if any)
        if (images && Array.isArray(images) && images.length > 0) {
            const imageInserts = images.map(url => ({
                place_id: data.id,
                image_url: url
            }));
            
            const { error: imgError } = await sb
                .from('place_images')
                .insert(imageInserts);
                
            if (imgError) console.error("Error saving gallery images", imgError);
        }

        return data;
    },

    // 4. Update Place
    update: async (id, placeData) => {
        const sb = SupabaseService.getClient();
        
        // Extract Gallery Images
        const { images, ...dbData } = placeData;

        // Sanitize Payload
        const validFields = [
            'name_ar', 'name_en', 'sub_cat_id', 'address', 'address_ar', 'address_en',
            'desc_ar', 'desc_en', 'image_url', 'is_featured', 'is_active',
            'phone', 'whatsapp', 'working_hours', 'is_trending', 'is_urgent', 
            'has_offer', 'offer_text_ar', 'offer_text_en'
        ];

        const payload = {};
        validFields.forEach(field => {
            if (dbData[field] !== undefined) payload[field] = dbData[field];
        });

        const { data, error } = await sb
            .from('places')
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;

        // Handle Images Update (Delete old, Insert new)
        if (images && Array.isArray(images)) {
            // 1. Delete existing
            await sb.from('place_images').delete().eq('place_id', id);
            
            // 2. Insert new
            if (images.length > 0) {
                 const imageInserts = images.map(url => ({
                    place_id: id,
                    image_url: url
                }));
                await sb.from('place_images').insert(imageInserts);
            }
        }

        return data;
    },

    // 5. Delete Place
    delete: async (id) => {
        const sb = SupabaseService.getClient();
        
        // Delete images first
        await sb.from('place_images').delete().eq('place_id', id);

        const { error } = await sb
            .from('places')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    toggleStatus: async (id, currentStatus) => {
        const sb = SupabaseService.getClient();
        const { error } = await sb
            .from('places')
            .update({ is_active: !currentStatus })
            .eq('id', id);
        if (error) throw error;
        return !currentStatus;
    }
};
window.PlacesService = PlacesService;
