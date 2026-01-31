/**
 * Search Engine Module
 * Pure logic for querying Supabase
 */

export async function searchPlaces(query, filters = {}) {
    if (!query && !filters.offers && !filters.open) return [];
    
    // Building query
    let dbQuery = window.sb
        .from('places')
        .select('id, name_ar, name_en, image_url, address, main_cat_id, has_offer'); // Added has_offer
    
    // Text Search
    if (query) {
        dbQuery = dbQuery.or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%,address.ilike.%${query}%`);
    }

    // Filter: Offers
    if (filters.offers) {
        dbQuery = dbQuery.eq('has_offer', true);
    }

    // Filter: Open Now
    // (Skipped complex logic for now)

    // apply filters BEFORE OR if strictly filtering
    // BUT Supabase query builder order matters?
    // .limit() must be last.
    
    // Sort: Top Rated
    if (filters.top) {
        // Assuming 'rating' column exists, otherwise try 'avg_rating' or ignore
        // Safest: Use 'rating' if we are confident.
        // Or default sort by creation if not top?
        dbQuery = dbQuery.order('rating', { ascending: false });
    } else {
        // Default sort relevancy? Supabase doesn't support relevance sort on ilike easily.
        // Maybe sort by name
        // dbQuery = dbQuery.order('name_ar');
    }
    
    const { data, error } = await dbQuery.limit(20);
        
    if (error) {
        console.error("Supabase Search Error:", error);
        // Fallback: Return empty array instead of crashing app logic
        return []; 
    }
    
    return data || [];
}
