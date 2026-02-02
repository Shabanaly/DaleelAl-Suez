/**
 * Place UI Helpers
 * DOM utilities for place details page (lightbox, share)
 */

window.PlaceUIHelpers = {
    /**
     * Open image lightbox
     */
    openLightbox(src) {
        const lightbox = document.getElementById('v8-lightbox');
        const img = document.getElementById('v8-lightbox-img');
        if (lightbox && img) {
            img.src = src;
            lightbox.classList.add('active');
        }
    },

    /**
     * Close lightbox
     */
    closeLightbox() {
        const lightbox = document.getElementById('v8-lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
        }
    },

    /**
     * Share current place using Web Share API or clipboard
     */
    sharePlace() {
        const name = document.querySelector('.v8-place-name')?.innerText || 'مكان رائع';
        if (navigator.share) {
            navigator.share({
                title: name,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ الرابط!');
        }
    }
};

// Expose globally for onclick handlers
window.openLightbox = (src) => window.PlaceUIHelpers.openLightbox(src);
window.closeLightbox = () => window.PlaceUIHelpers.closeLightbox();
window.sharePlace = () => window.PlaceUIHelpers.sharePlace();
