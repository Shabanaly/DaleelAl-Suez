/**
 * @file: src/business/validators/place-validator.js
 * @layer: Business Logic Layer
 * @responsibility: Validate Place Data.
 */

const PlaceValidator = {
    /**
     * Validate data for creating/updating a place
     * @param {Object} data Raw input data
     * @returns {Object} Sanitized data object specific for DB
     * @throws {Error} If validation fails
     */
    validateSave(data) {
        // Required Fields
        if (!data.name_ar || data.name_ar.trim() === '') {
            throw new Error("اسم المكان (عربي) مطلوب.");
        }
        if (!data.main_cat_id) {
            throw new Error("القسم الرئيسي مطلوب.");
        }
        if (!data.image_url) {
             throw new Error("صورة المكان الرئيسية مطلوبة.");
        }

        // Field Whitelist (Sanitization)
        // Matches DB Schema logic from old service
        const validFields = [
            'name_ar', 'name_en', 'main_cat_id', 'address', 'address_ar', 'address_en',
            'desc_ar', 'desc_en', 'image_url', 'is_featured', 'is_active',
            'phone', 'whatsapp', 'working_hours', 'is_trending', 'is_urgent', 
            'has_offer', 'offer_text_ar', 'offer_text_en', 'is_hidden_gem'
        ];

        const sanitized = {};
        validFields.forEach(field => {
            if (data[field] !== undefined) {
                sanitized[field] = data[field];
            }
        });

        // Default values
        if (sanitized.is_active === undefined) sanitized.is_active = true;

        return sanitized;
    }
};

window.PlaceValidator = PlaceValidator;
