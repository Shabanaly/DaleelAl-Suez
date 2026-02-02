/**
 * @file: src/business/services/analytics-service.js
 * @layer: Business Logic Layer
 * @responsibility: Aggregate and format analytics data for presentation.
 */

const AnalyticsService = {
    
    async getDashboardStats() {
        // Parallel Fetch
        const [dailyRaw, topPlaces, counts] = await Promise.all([
            window.AnalyticsRepository.getDailyViews(7),
            window.AnalyticsRepository.getTopPlaces(5),
            window.AnalyticsRepository.getCounts()
        ]);

        // 1. Process Daily Views (Aggregate by Date)
        const dayCounts = {};
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
            dayCounts[key] = 0;
        }

        dailyRaw.forEach(row => {
            const key = new Date(row.created_at).toLocaleDateString('en-CA');
            if (dayCounts[key] !== undefined) dayCounts[key]++;
        });

        // Convert to Chart Format
        const chartData = {
            labels: Object.keys(dayCounts).map(dateStr => {
                // Format: 02/02
                const d = new Date(dateStr);
                return `${d.getDate()}/${d.getMonth() + 1}`;
            }),
            values: Object.values(dayCounts)
        };

        // 2. Add fake 'growth' for demo if data is static, 
        // or calculate if we had previous period. 
        // For now returning raw counts.

        return {
            chart: chartData,
            topPlaces: topPlaces,
            counts: counts
        };
    }
};

window.AnalyticsService = AnalyticsService;
