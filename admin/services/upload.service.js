// Upload Service (Cloudinary)
const UploadService = {
    uploadImage: async (file) => {
        if (!file) throw new Error('No file provided');
        
        if (!window.GUIDE_CONFIG || !window.GUIDE_CONFIG.CLOUDINARY_CLOUD_NAME) {
            throw new Error('Cloudinary config missing');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', window.GUIDE_CONFIG.CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${window.GUIDE_CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            const data = await res.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return data.secure_url;
        } catch (err) {
            console.error('Upload failed:', err);
            throw err;
        }
    }
};

window.UploadService = UploadService;
