/**
 * @file: src/business/validators/event-validator.js
 * @layer: Business Logic Layer
 * @responsibility: Validate Event data before persistence.
 */

const EventValidator = {
    
    validateSave(data) {
        const errors = [];
        const sanitized = {};

        // 1. Title
        if (!data.title || data.title.trim() === '') {
            errors.push('عنوان الفعالية مطلوب');
        } else {
            sanitized.title = data.title.trim();
        }

        // 2. Start Time
        if (!data.start_time) {
            errors.push('موعد بدء الفعالية مطلوب');
        } else {
            sanitized.start_time = data.start_time;
        }

        // 3. End Time (Logic check)
        if (data.end_time) {
            sanitized.end_time = data.end_time;
            if (new Date(sanitized.end_time) <= new Date(sanitized.start_time)) {
                errors.push('تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء');
            }
        } else {
            sanitized.end_time = null;
        }

        // 4. Optional Fields
        sanitized.description = data.description ? data.description.trim() : null;
        sanitized.location_name = data.location_name ? data.location_name.trim() : null;
        sanitized.type = data.type || 'general';
        
        // Image URL is handled separately by Service upload, but if passed directly:
        if (data.image_url) sanitized.image_url = data.image_url;

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        return sanitized;
    }
};

window.EventValidator = EventValidator;
