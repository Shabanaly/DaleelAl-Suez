/**
 * @file: src/data/repositories/analytics-repository.js
 * @layer: Data Layer
 * @responsibility: Read-only access to analytics tables (place_views, analytics_events).
 */

const AnalyticsRepository = {
    
    /**
     * Get Place Views grouped by date for the last N days
     * Uses the 'on_view_logged' trigger and 'update_daily_stats' function in DB usually,
     * but based on provided schema, we have raw 'place_views'.
     * Grouping by date in Supabase JS client can be tricky without RPC.
     * We will use a rough fetch of recent rows and aggregate in JS for MVP, 
     * or use a .rpc() call if the user provided one (the schema mentioned a trigger).
     * Since I don't see the RPC definition in detail, I'll fetch raw views for last 7 days.
     */
    async getDailyViews(days = 7) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        try {
            const { data, error } = await window.AppSupabase.get()
                .from('place_views')
                .select('created_at')
                .gte('created_at', dateLimit.toISOString());

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AnalyticsRepository.getDailyViews Error:', error);
            return [];
        }
    },

    /**
     * Get Top N most viewed places.
     * Requires aggregation. Since we are client-side, efficient way is RPC.
     * If no RPC, we fetch counts per place. This is heavy for client.
     * User provided: 
     * `create trigger on_view_logged ... execute FUNCTION update_daily_stats ();`
     * This implies there might be a `daily_stats` table or similar? 
     * The schema didn't show `daily_stats`. 
     * I will try to use a simple approach: fetch top places from `places` table if it has a `views_count` column (which we added in previous tasks? No, we added it to stories).
     * If `place_views` is the source of truth, we need an RPC `get_top_places`.
     * I'll assume for now I should simulate it or fetch a small sample.
     * BETTER APPROACH: Fetch `places` and order by `view_count` if it exists.
     * Let's check `PlaceRepository` or `places` schema in memory...
     * Previous conversation mentions `view_count` on places. 
     * I'll assume `places` table has `view_count` (which is likely updated by that trigger).
     */
    /**
     * Get Top N most viewed places.
     * Aggregates from 'place_views' table or falls back to newest if empty.
     */
    async getTopPlaces(limit = 5) {
        try {
            const client = window.AppSupabase.get();
            
            // 1. Fetch recent views (last 30 days) to calculate popularity
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: viewsData, error: viewsError } = await client
                .from('place_views')
                .select('place_id')
                .gte('created_at', thirtyDaysAgo.toISOString());

            if (viewsError) throw viewsError;

            let topIds = [];
            if (viewsData && viewsData.length > 0) {
                // Aggregate counts in JS
                const counts = {};
                viewsData.forEach(v => {
                    counts[v.place_id] = (counts[v.place_id] || 0) + 1;
                });

                // Sort by count and get top IDs
                topIds = Object.keys(counts)
                    .sort((a, b) => counts[b] - counts[a])
                    .slice(0, limit);
            }

            // 2. Fetch Place details for these IDs (or fallback to newest)
            let query = client.from('places').select('id, name_ar, images, main_cat_id, created_at');

            if (topIds.length > 0) {
                query = query.in('id', topIds);
            } else {
                // Fallback: Newest places
                query = query.order('created_at', { ascending: false }).limit(limit);
            }

            const { data: placesData, error: placesError } = await query;
            if (placesError) throw placesError;

            // If we fetched by topIds, we need to re-sort them to match the popularity order
            if (topIds.length > 0) {
                return placesData.sort((a, b) => topIds.indexOf(a.id.toString()) - topIds.indexOf(b.id.toString()));
            }

            return placesData || [];
        } catch (error) {
            console.error('AnalyticsRepository.getTopPlaces Error:', error);
            // Extreme fallback: just return empty list to prevent crash
            return [];
        }
    },

    /**
     * Get general stats (Total Users, Total Places, etc)
     */
    async getCounts() {
        try {
            const [places, users, events] = await Promise.all([
                window.AppSupabase.get().from('places').select('id', { count: 'exact', head: true }),
                // Users might be restricted, assume we can get count or just skip
                window.AppSupabase.get().from('events').select('id', { count: 'exact', head: true })
            ]);

            return {
                places: places.count || 0,
                events: events.count || 0,
                users: 0 // Auth users usually need admin role to count
            };
        } catch (error) {
            return { places: 0, events: 0, users: 0 };
        }
    }
};

window.AnalyticsRepository = AnalyticsRepository;
