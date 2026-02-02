/**
 * @file: src/data/repositories/settings-repository.js
 * @layer: Data Layer
 * @responsibility: key-value storage for site settings.
 */

const SettingsRepository = {
    
    async getAll() {
        try {
            const { data, error } = await window.AppSupabase.get()
                .from('site_settings')
                .select('*');

            if (error) throw error;
            
            // Transform array [{key: 'k', value: 'v'}] to object {k: v} for easier usage
            const settingsMap = {};
            data.forEach(item => {
                settingsMap[item.key] = item.value;
            });
            
            return settingsMap;
        } catch (error) {
            console.error('SettingsRepository.getAll Error:', error);
            return {}; // Return empty object on error to prevent crash
        }
    },

    async update(key, value) {
        try {
            const { data, error } = await window.AppSupabase.get()
                .from('site_settings')
                .upsert({ key, value })
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('SettingsRepository.update Error:', error);
            throw error;
        }
    }
};

window.SettingsRepository = SettingsRepository;
