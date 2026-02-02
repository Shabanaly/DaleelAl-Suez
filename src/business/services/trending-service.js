/**
 * Trending Service
 * Business logic for Trending Tags
 */
window.TrendingService = {
    async getTrendingTags() {
        try {
            if (!window.TrendingRepository) throw new Error("TrendingRepository not found");
            return await window.TrendingRepository.getTrendingTags();
        } catch (error) {
            console.warn("TrendingService Error:", error);
            return [];
        }
    }
};
