/**
 * Admin Ads Management Page Controller
 * Manages ad slots status and code updates
 */

(function() {
    'use strict';
    
    /**
     * Initialize page
     */
    async function init() {
        // Render components
        document.getElementById('sidebar-container').innerHTML = Sidebar.render('ads');
        document.getElementById('topbar-container').innerHTML = Topbar.render('الإعلانات');
        lucide.createIcons();
        
        try {
            const slots = await AdsService.getAll();
            renderAds(slots);
        } catch (e) {
            console.error(e);
            document.getElementById('ads-list').innerHTML = `<div class="card" style="color:var(--danger)">خطأ في تحميل البيانات: ${e.message}</div>`;
        }
    }
    
    /**
     * Render ad slots
     * @param {Array} slots - Array of ad slot objects
     */
    function renderAds(slots) {
        const container = document.getElementById('ads-list');
        if (!slots.length) {
            container.innerHTML = '<div class="card">لا يوجد مساحات إعلانية معرفة</div>';
            return;
        }

        container.innerHTML = slots.map(slot => `
            <div class="card" style="border-top: 3px solid ${slot.is_active ? 'var(--success)' : 'var(--border)'}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h3 style="font-size:16px; font-weight:800;">${slot.slot_label}</h3>
                        <code style="font-size:11px; opacity:0.6;">ID: ${slot.slot_id}</code>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="toggle-${slot.id}" ${slot.is_active ? 'checked' : ''} data-slot-id="${slot.id}">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="form-label">كود الإعلان (HTML/JS)</label>
                    <textarea id="code-${slot.id}" class="form-control" style="height:120px; font-family:monospace; font-size:12px; background:var(--bg-body);" 
                              placeholder="انسخ كود Adsense هنا...">${slot.ad_code || ''}</textarea>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button class="btn btn-primary btn-sm" data-slot-id="${slot.id}" data-action="save">
                        <i data-lucide="save"></i> حفظ الكود
                    </button>
                </div>
            </div>
        `).join('');
        
        // Attach event listeners
        attachEventListeners();
        lucide.createIcons();
    }
    
    /**
     * Attach event listeners to dynamically generated elements
     */
    function attachEventListeners() {
        const container = document.getElementById('ads-list');
        
        // Toggle status listeners
        container.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const slotId = e.target.dataset.slotId;
                toggleStatus(slotId, e.target.checked);
            });
        });
        
        // Save button listeners
        container.querySelectorAll('[data-action="save"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slotId = e.currentTarget.dataset.slotId;
                saveAd(slotId);
            });
        });
    }
    
    /**
     * Toggle ad status
     * @param {string} id - Slot ID
     * @param {boolean} isActive - New status
     */
    async function toggleStatus(id, isActive) {
        try {
            await AdsService.update(id, { is_active: isActive });
            // Refresh to update borders
            init();
        } catch (e) {
            alert('فشل تحديث الحالة: ' + e.message);
            // Revert toggle
            document.getElementById(`toggle-${id}`).checked = !isActive;
        }
    }
    
    /**
     * Save ad code
     * @param {string} id - Slot ID
     */
    async function saveAd(id) {
        const ad_code = document.getElementById(`code-${id}`).value;
        const btn = document.querySelector(`[data-slot-id="${id}"][data-action="save"]`);
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();

        try {
            await AdsService.update(id, { ad_code });
            btn.innerHTML = '<i data-lucide="check"></i> تم الحفظ';
            btn.style.background = 'var(--success)';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                lucide.createIcons();
            }, 2000);
        } catch (e) {
            alert('خطأ في الحفظ: ' + e.message);
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            lucide.createIcons();
        }
    }
    
    // Initialize on load
    init();
})();
