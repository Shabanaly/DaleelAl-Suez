/**
 * @file: src/business/services/story-service.js
 * @layer: Business Logic Layer
 * @responsibility: Orchestrate flow, business rules, calculations.
 */

const AppStoryService = {
    /**
     * Business flow to add a new story
     * @param {Object} rawData Input from UI
     */
    async addStory(rawData) {
        // 1. Validation
        const validData = window.StoryValidator.validateCreate(rawData);

        // 2. Business Logic: Handle Upload
        // (In a real app, upload logic might be in a StorageService/Repository)
        const mediaUrl = await this._uploadMedia(validData.file);

        // 3. Business Logic: Calculate Expiry
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + (validData.duration * 60 * 60 * 1000));

        // 4. Prepare DTO for Repository
        const storyDTO = {
            media_url: mediaUrl,
            caption: validData.caption,
            place_id: validData.placeId,
            expires_at: expiresAt.toISOString(),
            is_active: rawData.isActive,
            link_url: rawData.linkUrl,
            media_type: rawData.mediaType
        };

        // 5. Persist
        return await window.StoryRepository.create(storyDTO);
    },

    async getAllStories() {
        return await window.StoryRepository.getAll();
    },

    async deleteStory(id) {
        return await window.StoryRepository.delete(id);
    },

    // Internal helper (Could be moved to StorageRepository)
    async _uploadMedia(file) {
        if (!window.CloudinaryService) {
            throw new Error("Cloudinary Service not initialized");
        }
        
        // Compress if it is an image
        let fileToUpload = file;
        if (window.ImageCompressionService && file.type.startsWith('image/')) {
            try {
                fileToUpload = await window.ImageCompressionService.compress(file, {
                    maxWidth: 1080, // Stories are usually vertical, 1080px width is good
                    quality: 0.8
                });
            } catch (e) {
                console.warn("Compression skipped:", e);
            }
        }

        try {
            return await window.CloudinaryService.uploadImage(fileToUpload);
        } catch (e) {
            throw new Error("فشل رفع الوسائط: " + e.message);
        }
    }
};

window.AppStoryService = AppStoryService;
