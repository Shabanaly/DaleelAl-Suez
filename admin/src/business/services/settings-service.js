/**
 * @file: src/business/services/settings-service.js
 * @layer: Business Logic Layer
 * @responsibility: Manage global application settings.
 */

const AppSettingsService = {
    
    async getSettings() {
        return await window.SettingsRepository.getAll();
    },

    async saveSetting(key, value) {
        // Simple validation or transformation could go here
        return await window.SettingsRepository.update(key, value);
    },

    /**
     * Bulk save settings from a form object
     * @param {Object} settingsObject - { key1: val1, key2: val2 }
     */
    async saveBulk(settingsObject) {
        const promises = Object.entries(settingsObject).map(([key, value]) => {
            return this.saveSetting(key, value);
        });
        
        return await Promise.all(promises);
    }
};

window.AppSettingsService = AppSettingsService;
