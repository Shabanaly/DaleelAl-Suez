/**
 * Quick Services Service
 * Business logic for Quick Services
 */
window.QuickServicesService = {
    async getQuickServices() {
        try {
            if (!window.QuickServicesRepository) throw new Error("QuickServicesRepository not found");
            return await window.QuickServicesRepository.getServices();
        } catch (error) {
            console.warn("QuickServicesService Error:", error);
            // Return empty to allow fallback in presentation layer, or handle fallback here.
            // For now, allow fallback in presentation layer
            return [];
        }
    }
};
