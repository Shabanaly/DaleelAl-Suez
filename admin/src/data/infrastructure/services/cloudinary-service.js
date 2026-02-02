/**
 * @file: src/data/infrastructure/services/cloudinary-service.js
 * @layer: Infrastructure Layer
 * @responsibility: Handle image uploads to Cloudinary.
 */

const CloudinaryService = {
    cloudName: 'dqwkv5gax', // Replace with User's Cloud Name if needed, or ask
    uploadPreset: 'daleel_suez_upload', // Replace with User's Upload Preset

    async uploadImage(file) {
        if (!file) return null;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload Failed');

            const data = await res.json();
            return data.secure_url;
        } catch (e) {
            console.error('Cloudinary Upload Error:', e);
            throw e;
        }
    },

    async uploadMultiple(files) {
        const promises = Array.from(files).map(file => this.uploadImage(file));
        return Promise.all(promises);
    }
};

window.CloudinaryService = CloudinaryService;
