/**
 * Events Service
 * Business logic for Events feature
 */
window.EventsService = {
    /**
     * Get validated upcoming events
     * @returns {Promise<Array>} List of events
     */
    async getUpcomingEvents() {
        try {
            if (!window.EventsRepository) {
                throw new Error("EventsRepository not found");
            }
            return await window.EventsRepository.getUpcomingEvents();
        } catch (error) {
            console.warn("EventsService Error:", error);
            // Decide if we want to return null/empty, or let controller decide fallback
            // Here we throw so controller/widget knows to fallback if needed
            throw error;
        }
    }
};
