/**
 * Stories Database Service
 * Handles fetching stories for the user interface
 */

const StoriesService = {
    // Fetch active stories (group by place logic handled in renderer or here?)
    // Let's fetch raw stories and let renderer group them for flexibility
    async getActiveStories() {
        if (!window.sb) {
            console.error('Supabase client not active');
            return [];
        }
        
        try {
            const { data, error } = await window.sb
                .from('stories')
                .select('*, places(id, name_ar, logo_url)')
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            return [];
        }
    },

    // Increment view count
    async incrementView(storyId) {
        if (!storyId || !window.sb) return;
        
        try {
            await window.sb.rpc('increment_story_view', { story_id: storyId });
        } catch (e) {
            // If RPC doesn't exist, we can ignore or try direct update (less safe)
            console.warn('View increment failed', e);
        }
    }
};

window.StoriesService = StoriesService;
export default StoriesService;
