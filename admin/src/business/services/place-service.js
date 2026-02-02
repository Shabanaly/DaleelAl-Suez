/**
 * @file: src/business/services/place-service.js
 * @layer: Business Logic Layer
 * @responsibility: Orchestrate Place operations.
 */

const AppPlaceService = {
    
    async getAllPlaces() {
        return await window.PlaceRepository.getAll();
    },

    async getPlaceById(id) {
        return await window.PlaceRepository.getById(id);
    },

    async createPlace(rawData, newImages = []) {
        // 1. Validate
        const sanitizedData = window.PlaceValidator.validateSave(rawData);

        // 2. Prepare Images Array
        sanitizedData.images = newImages || [];

        // 3. Save Place
        const newPlace = await window.PlaceRepository.create(sanitizedData);

        return newPlace;
    },

    async updatePlace(id, rawData, newImages = []) {
        // 1. Validate
        let sanitizedData;
        
        if (rawData.name_ar) {
             sanitizedData = window.PlaceValidator.validateSave(rawData);
        } else {
             sanitizedData = window.PlaceValidator.validatePatch ? 
                             window.PlaceValidator.validatePatch(rawData) : 
                             rawData; 
        }

        // 2. Handle New Images (Merging)
        // If we have new images, we need to append them to the existing list.
        // Option A: Fetch current, merge, then update.
        // Option B: Just send the merged array if the Caller (Controller) prepared it?
        // Let's assume the Controller sends *only new* images in newImages arg.
        // We will fetch the current place to get existing images, append, and save.
        
        if (newImages && newImages.length > 0) {
            const currentPlace = await window.PlaceRepository.getById(id);
            const currentImages = currentPlace.images || []; // Assuming 'images' column exists and is array
            sanitizedData.images = [...currentImages, ...newImages];
        }

        // 3. Update Place
        const updatedPlace = await window.PlaceRepository.update(id, sanitizedData);

        return updatedPlace;
    },

    async deletePlace(id) {
        // 1. Delete Dependencies (Images)
        // Done inside repo or via cascade, but explicit here for safety matching old logic
        await window.PlaceRepository.deleteImagesByPlaceId(id);
        
        // 2. Delete Record
        return await window.PlaceRepository.delete(id);
    },
    
    // --- Upload Helper ---
    async uploadImage(file) {
        // 1. Compress Image
        let fileToUpload = file;
        if (window.ImageCompressionService) {
            try {
                fileToUpload = await window.ImageCompressionService.compress(file, {
                    maxWidth: 1200,
                    quality: 0.8
                });
            } catch (e) {
                console.warn("Compression skipped:", e);
            }
        }

        const client = window.AppSupabase.get();
        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `places/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

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

window.AppPlaceService = AppPlaceService;
