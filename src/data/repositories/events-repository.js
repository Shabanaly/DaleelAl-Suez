/**
 * Events Repository
 * Handles direct data access for Events feature
 */
window.EventsRepository = {
    /**
     * Fetch upcoming events from database
     * @returns {Promise<Array>} List of raw event objects
     */
    async getUpcomingEvents() {
        const { data, error } = await window.sb
            .from('events')
            .select('*')
            //.eq('is_active', true) // Column does not exist in user schema
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })
            .limit(5);

        if (error) throw error;
        return data || [];
    }
};
