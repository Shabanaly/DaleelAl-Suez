/**
 * @file: src/presentation/features/settings/settings-view.js
 * @layer: Presentation Layer
 * @responsibility: Render Settings UI.
 */

const SettingsView = {
    
    render: (settings = {}) => {
        // Defaults if keys missing
        const maintenance = settings['maintenance_mode'] === true || settings['maintenance_mode'] === 'true';
        const contactPhone = settings['support_phone'] || '';
        const contactEmail = settings['support_email'] || '';
        const appVersion = settings['min_app_version'] || '1.0.0';

        return `
            <div class="card mb-4">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">إعدادات النظام</h2>
                        <p class="text-muted">التحكم في الإعدادات العامة للتطبيق</p>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- General Settings -->
                <div class="col-md-6">
                    <div class="card h-100 p-4">
                        <div class="d-flex align-items-center gap-2 mb-4">
                            <i data-lucide="settings" class="text-primary"></i>
                            <h4 class="mb-0 fw-bold">إعدادات عامة</h4>
                        </div>
                        
                        <form onsubmit="SettingsController.save(event)">
                            <div class="mb-4">
                                <label class="form-label d-flex justify-content-between align-items-center cursor-pointer">
                                    <span>وضع الصيانة (Maintenance Mode)</span>
                                    <div class="form-check form-switch m-0">
                                        <input class="form-check-input" type="checkbox" name="maintenance_mode" ${maintenance ? 'checked' : ''}>
                                    </div>
                                </label>
                                <div class="form-text">عند تفعيل هذا الوضع، سيظهر للمستخدمين رسالة صيانة ولن يتمكنوا من استخدام التطبيق.</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">أدنى إصدار للتطبيق (للإجبار على التحديث)</label>
                                <input type="text" name="min_app_version" class="form-control" value="${appVersion}" placeholder="مثال: 1.2.0">
                            </div>

                            <hr class="my-4">

                            <div class="d-flex align-items-center gap-2 mb-3">
                                <i data-lucide="phone" class="text-primary"></i>
                                <h5 class="mb-0">بيانات التواصل</h5>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">رقم واتساب الدعم الفني</label>
                                <input type="text" name="support_phone" class="form-control" value="${contactPhone}" placeholder="+2010xxxxxxxx">
                            </div>

                            <div class="mb-4">
                                <label class="form-label">بريد الدعم</label>
                                <input type="email" name="support_email" class="form-control" value="${contactEmail}" placeholder="support@example.com">
                            </div>

                            <button type="submit" class="btn btn-primary w-100">
                                <i data-lucide="save"></i> حفظ الإعدادات
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Info Card -->
                <div class="col-md-6">
                    <div class="card bg-primary-subtle border-primary h-100 p-4">
                        <h4 class="text-primary fw-bold mb-3">ملاحظات هامة</h4>
                        <ul class="text-muted fs-14" style="line-height: 1.8;">
                            <li>يتم تحديث الإعدادات فورياً في قاعدة البيانات.</li>
                            <li>قد يحتاج المستخدم لإعادة فتح التطبيق لتطبيق التغييرات الحرجة (مثل وضع الصيانة).</li>
                            <li>تأكد من كتابة رقم الواتساب بالصيغة الدولية (بدون مسافات).</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
};

window.SettingsView = SettingsView;
