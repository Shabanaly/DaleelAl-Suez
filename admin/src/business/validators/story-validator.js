/**
 * @file: src/business/validators/story-validator.js
 * @layer: Business Logic Layer
 * @responsibility: Validate input data purity.
 */

const StoryValidator = {
    /**
     * Validate data for creating a story
     * @param {Object} data { caption, duration, file, placeId }
     * @returns {Object} Validated and Sanitized data ready for service
     * @throws {Error} If validation fails
     */
    validateCreate(data) {
        if (!data.file) {
            throw new Error("صورة القصة مطلوبة (Story image is required).");
        }
        
        // Duration check
        const duration = parseInt(data.duration);
        if (isNaN(duration) || duration < 1) {
            throw new Error("مدة العرض غير صحيحة.");
        }

        return {
            file: data.file,
            caption: data.caption ? data.caption.trim() : null,
            duration: duration,
            placeId: data.placeId || null
        };
    }
};

window.StoryValidator = StoryValidator;
