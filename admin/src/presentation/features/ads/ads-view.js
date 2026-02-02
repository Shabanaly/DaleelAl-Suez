/**
 * @file: admin/src/presentation/features/ads/ads-view.js
 * @layer: Presentation Layer
 * @responsibility: Ads UI Renderer.
 */

const AdsView = {
    renderList: (slots) => {
        let content = '';

        if (!slots.length) {
            content = '<div class="card">لا يوجد مساحات إعلانية معرفة</div>';
        } else {
            content = slots.map(slot => `
                <div class="card" style="border-top: 3px solid ${slot.is_active ? 'var(--success)' : 'var(--border)'}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <div>
                            <h3 style="font-size:16px; font-weight:800;">${slot.slot_label}</h3>
                            <code style="font-size:11px; opacity:0.6;">ID: ${slot.slot_id}</code>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="toggle-${slot.id}" ${slot.is_active ? 'checked' : ''} onchange="AdsController.handleToggle('${slot.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="form-label">كود الإعلان (HTML/JS)</label>
                        <textarea id="code-${slot.id}" class="form-control" style="height:120px; font-family:monospace; font-size:12px; background:var(--bg-body);" 
                                  placeholder="انسخ كود Adsense هنا...">${slot.ad_code || ''}</textarea>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                        <button id="btn-${slot.id}" class="btn btn-primary btn-sm" onclick="AdsController.handleSave('${slot.id}')">
                            <i data-lucide="save"></i> حفظ الكود
                        </button>
                    </div>
                </div>
            `).join('');
        }

        return `
            <div class="card mb-3">
                <div class="page-header mb-0">
                    <div>
                        <h2 class="page-title">إدارة الإعلانات</h2>
                        <p class="text-muted">التحكم في المساحات الإعلانية</p>
                    </div>
                </div>
            </div>
            <div id="ads-list-container">
                ${content}
            </div>
        `;
    }
};

window.AdsView = AdsView;
