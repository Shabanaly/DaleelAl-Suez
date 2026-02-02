/**
 * @file: src/business/services/event-service.js
 * @layer: Business Logic Layer
 * @responsibility: Orchestrate Event operations (Validation, Upload, Persistence).
 */

const AppEventService = {
    
    async getAllEvents() {
        return await window.EventRepository.getAll();
    },

    async getEventById(id) {
        return await window.EventRepository.getById(id);
    },

    async saveEvent(rawData, imageFile) {
        // 1. Validation
        const sanitizedData = window.EventValidator.validateSave(rawData);

        // 2. Upload Image if provided
        if (imageFile) {
             sanitizedData.image_url = await this._uploadImage(imageFile);
        }

        // 3. Persist
        if (rawData.id) {
            return await window.EventRepository.update(rawData.id, sanitizedData);
        } else {
            return await window.EventRepository.create(sanitizedData);
        }
    },

    async deleteEvent(id) {
        return await window.EventRepository.delete(id);
    },

    // --- Output Helper ---
    // (Optional: Reuse a shared storage service in the future)
    async _uploadImage(file) {
        // 1. Compress
        let fileToUpload = file;
        if (window.ImageCompressionService) {
            try {
                fileToUpload = await window.ImageCompressionService.compress(file, {
                    maxWidth: 1200, // HD Quality
                    quality: 0.8
                });
            } catch (e) {
                console.warn("Compression skipped:", e);
            }
        }

        // 2. Upload
        const client = window.AppSupabase.get();
        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `events/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        const { error } = await client.storage
            .from('images')
            .upload(fileName, fileToUpload);

        if (error) throw new Error("فشل رفع الصورة: " + error.message);

        const { data } = client.storage
            .from('images')
            .getPublicUrl(fileName);

        return data.publicUrl;
    }
};

window.AppEventService = AppEventService;
