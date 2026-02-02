/**
 * @file: admin/src/business/services/stats-service.js
 * @layer: Business Logic Layer
 * @responsibility: Aggregate Stats.
 */

const AppStatsService = {
    async getDashboardStats() {
        const counts = await window.StatsRepository.getCounts();
        
        const today = new Date().toISOString().split('T')[0];
        const addedToday = await window.StatsRepository.getAddedSince(today);

        return {
            totalPlaces: counts.placesCount,
            activeOffers: counts.offersCount,
            mainCategories: counts.categoriesCount,
            addedToday: addedToday
        };
    },

    async getRecentActivity(limit = 5) {
        return await window.StatsRepository.getRecentActivity(limit);
    }
};

window.AppStatsService = AppStatsService;
