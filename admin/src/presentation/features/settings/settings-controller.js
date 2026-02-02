/**
 * @file: src/presentation/features/settings/settings-controller.js
 * @layer: Presentation Layer
 * @responsibility: Handle Settings UI interactions.
 */

const SettingsController = {
    
    container: null,

    init: async (container) => {
        this.container = container; 
        
        try {
            // Loading
            container.innerHTML = '<div class="spinner-center"><span class="spinner-border text-primary"></span></div>';
            
            // Fetch
            const settings = await window.AppSettingsService.getSettings();
            
            // Render
            container.innerHTML = window.SettingsView.render(settings);
            
            if (window.lucide) window.lucide.createIcons();

        } catch (error) {
            console.error('Settings load error:', error);
            container.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء تحميل الإعدادات: ${error.message}</div>`;
        }
    },

    save: async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Extract values
        const data = {};
        
        // Handle logic for checkboxes (on/off) or specific types
        data['maintenance_mode'] = form.querySelector('input[name="maintenance_mode"]').checked;
        data['min_app_version'] = formData.get('min_app_version');
        
        data['support_phone'] = formData.get('support_phone');
        data['support_email'] = formData.get('support_email');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> جاري الحفظ...';

            await window.AppSettingsService.saveBulk(data);
            
            window.Toast.success('تم حفظ الإعدادات بنجاح');

        } catch (error) {
            console.error('Settings save error:', error);
            window.Toast.error('فشل حفظ الإعدادات');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="save"></i> حفظ الإعدادات';
            if (window.lucide) window.lucide.createIcons();
        }
    }
};

window.SettingsController = SettingsController;
