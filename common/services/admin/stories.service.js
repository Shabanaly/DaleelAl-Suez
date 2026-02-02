/**
 * Admin Stories Service
 * Handles CRUD operations for stories
 */

(function(window) {
    const StoriesService = {
        /**
         * Get all stories (for admin list)
         */
        getAll: async function() {
            if (!window.sb) throw new Error("Supabase client not initialized");
            
            const { data, error } = await window.sb
                .from('stories')
                .select('*, places(name_ar)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },

        /**
         * Create a new story
         * @param {Object} storyData 
         */
        create: async function(storyData) {
            if (!window.sb) throw new Error("Supabase client not initialized");

            const { data, error } = await window.sb
                .from('stories')
                .insert([storyData])
                .select();

            if (error) throw error;
            return data[0];
        },

        /**
         * Delete a story
         * @param {string} id 
         */
        delete: async function(id) {
            if (!window.sb) throw new Error("Supabase client not initialized");

            const { error } = await window.sb
                .from('stories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        },
        
        /**
         * Upload media file
         * @param {File} file 
         */
        uploadMedia: async function(file) {
            if (!window.sb) throw new Error("Supabase client not initialized");
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `stories/${fileName}`;
            
            const { data, error } = await window.sb.storage
                .from('main-bucket') // Assuming 'main-bucket' exists, might need adjustment
                .upload(filePath, file);
                
            if (error) throw error;
            
            // Get public URL
            const { data: { publicUrl } } = window.sb.storage
                .from('main-bucket')
                .getPublicUrl(filePath);
                
            return publicUrl;
        }
    };

    window.StoriesService = StoriesService;

})(window);
