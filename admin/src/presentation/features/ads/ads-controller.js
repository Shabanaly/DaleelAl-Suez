/**
 * @file: admin/src/presentation/features/ads/ads-controller.js
 * @layer: Presentation Layer
 * @responsibility: Ads SPA Controller.
 */

const AdsController = {
    init: async (container) => {
        container.innerHTML = '<div class="spinner"></div>';
        await AdsController.loadAds(container);
    },

    loadAds: async (container) => {
        try {
            const slots = await window.AppAdService.getAllSlots();
            container.innerHTML = AdsView.renderList(slots);
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
            container.innerHTML = `<div class="card" style="color:var(--danger)">خطأ في تحميل البيانات: ${e.message}</div>`;
        }
    },

    handleToggle: async (id, isActive) => {
        try {
            await window.AppAdService.toggleSlotStatus(id, isActive);
            if (typeof Toast !== 'undefined') window.Toast.success(isActive ? "تم تفعيل الإعلان" : "تم تعطيل الإعلان");
            // Don't reload entire list to prevent flickering/reverting race conditions.
            // The checkbox is already in the correct state visually.
        } catch (e) {
            alert('فشل تحديث الحالة: ' + e.message);
            // Revert state on error
            const toggle = document.getElementById(`toggle-${id}`);
            if(toggle) toggle.checked = !isActive;
        }
    },

    handleSave: async (id) => {
        const code = document.getElementById(`code-${id}`).value;
        const btn = document.getElementById(`btn-${id}`);
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i>';
        if (window.lucide) window.lucide.createIcons();

        try {
            await window.AppAdService.updateSlotCode(id, code);
            btn.innerHTML = '<i data-lucide="check"></i> تم الحفظ';
            btn.style.background = 'var(--success)';
            if (window.lucide) window.lucide.createIcons();
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                if (window.lucide) window.lucide.createIcons();
            }, 2000);
        } catch (e) {
            alert('خطأ في الحفظ: ' + e.message);
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            if (window.lucide) window.lucide.createIcons();
        }
    }
};

window.AdsController = AdsController;
