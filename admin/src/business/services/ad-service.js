/**
 * @file: admin/src/business/services/ad-service.js
 * @layer: Business Logic Layer
 * @responsibility: Ad logic.
 */

const AppAdService = {
    
    async getAllSlots() {
        return await window.AdRepository.getAll();
    },

    async updateSlot(id, updates) {
        // Business Rule: Ensure ID exists (Repo handles it, but we could add checks)
        return await window.AdRepository.update(id, updates);
    },

    async toggleSlotStatus(id, isActive) {
        return await window.AdRepository.update(id, { is_active: isActive });
    },

    async updateSlotCode(id, code) {
        // Sanitize code? For now, we trust admin input as raw HTML/JS for ads.
        return await window.AdRepository.update(id, { ad_code: code });
    },

    async getActiveAdsForFrontend() {
        return await window.AdRepository.getActive();
    }
};

window.AppAdService = AppAdService;
