/**
 * Lightbox UI Component
 * Handles image lightbox functionality
 */

/**
 * Open lightbox with image
 * @param {string} src - Image source URL
 */
export function openLightbox(src) {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-img');
    if (overlay && img) {
        img.src = src;
        overlay.classList.add('active');
    }
}

/**
 * Close lightbox
 */
export function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-img');
    if (overlay) overlay.classList.remove('active');
    if (img) img.src = '';
}

// Make globally accessible for inline onclick
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
