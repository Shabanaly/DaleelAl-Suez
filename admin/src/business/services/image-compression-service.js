/**
 * @file: src/business/services/image-compression-service.js
 * @layer: Business Logic Layer
 * @responsibility: Compress and resize images on the client side before upload.
 */

const ImageCompressionService = {
    
    /**
     * Compresses an image file.
     * @param {File} file - The file to compress.
     * @param {Object} options - Compression options.
     * @returns {Promise<File>} - The compressed file.
     */
    async compress(file, options = {}) {
        // 1. Check if it's an image
        if (!file.type.startsWith('image/')) {
            return file; // Return original if not an image (e.g. video)
        }

        const {
            maxWidth = 1200,
            quality = 0.8,
            maxSizeMB = 1 // Target size in MB (soft target)
        } = options;

        try {
            const imageBitmap = await createImageBitmap(file);
            
            // 2. Calculate new dimensions
            let width = imageBitmap.width;
            let height = imageBitmap.height;

            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = height * ratio;
            }

            // 3. Draw to Canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageBitmap, 0, 0, width, height);

            // 4. Convert to Blob (WebP for lighter size)
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/webp', quality);
            });

            // 5. Convert back to File
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                type: 'image/webp',
                lastModified: Date.now(),
            });

            console.log(`Image Compressed: ${originalSize(file.size)} -> ${originalSize(compressedFile.size)}`);
            return compressedFile;

        } catch (error) {
            console.error("Compression failed, using original file:", error);
            return file; // Fallback to original
        }
    }
};

// Helper for logging
function originalSize(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

window.ImageCompressionService = ImageCompressionService;
