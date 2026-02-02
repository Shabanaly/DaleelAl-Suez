/**
 * Stories Service
 * Handles fetching regular stories (expired after 24h)
 */
window.StoriesService = {
    async getActiveStories() {
        try {
            // Call Data Layer
            if (!window.StoriesRepository) throw new Error("StoriesRepository not found");
            const data = await window.StoriesRepository.getStories();
            
            if (data && data.length > 0) {
                return data;
            }
        } catch (e) {
            console.warn("Using mock stories (DB missing or empty):", e);
        }

        // Mock Data Fallback
        console.log("Mocking Stories Data...");
        return [
            {
                id: 1,
                place_id: "p1",
                media_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
                media_type: "image",
                caption: "أفضل بيتزا في السويس 🍕",
                created_at: new Date().toISOString(),
                places: {
                    name_ar: "بيتزا هت",
                    image_url: "https://upload.wikimedia.org/wikipedia/sco/d/d2/Pizza_Hut_logo.svg"
                }
            },
            {
                id: 2,
                place_id: "p2",
                media_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                media_type: "image",
                caption: "قهوة الصباح معنا غير ☕️",
                created_at: new Date().toISOString(),
                places: {
                    name_ar: "ستاربكس",
                }
            },
            {
                id: 3,
                place_id: "p3",
                media_url: "https://videos.pexels.com/video-files/4114797/4114797-sd_640_360_25fps.mp4",
                media_type: "video",
                caption: "أجواء رائعة في الكورنيش ليلاً 🌃",
                created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                places: {
                    name_ar: "كورنيش السويس",
                }
            }
        ];
    },

    /**
     * Mark a story as viewed (Debounced per session)
     * @param {number} storyId 
     */
    async markStoryAsViewed(storyId) {
        if (!storyId) return;

        // Prevent duplicate counts in same session
        const key = `viewed_story_${storyId}`;
        if (sessionStorage.getItem(key)) return;

        try {
            if (window.StoriesRepository) {
                await window.StoriesRepository.incrementView(storyId);
                sessionStorage.setItem(key, 'true'); // Mark as viewed
            }
        } catch (e) {
            console.error("Service Error marking story viewed:", e);
        }
    }
};
