/**
 * Home UI Renderer (Dashboard)
 */
const HomeUI = {
    render: (stats, recentItems, user) => {
        const userName = user ? user.email.split('@')[0] : "Admin";
        
        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">لوحة التحكم</h2>
                    <p class="text-muted">نظرة عامة على إحصائيات التطبيق</p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon bg-primary-light text-primary">
                        <i data-lucide="map-pin"></i>
                    </div>
                    <div>
                        <div class="stat-value">${stats.totalPlaces}</div>
                        <div class="stat-label">إجمالي الأماكن</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon bg-success-light text-success">
                        <i data-lucide="layers"></i>
                    </div>
                    <div>
                        <div class="stat-value">${stats.mainCategories}</div>
                        <div class="stat-label">الأقسام</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon bg-warning-light text-warning">
                        <i data-lucide="users"></i>
                    </div>
                    <div>
                        <div class="stat-value">${userName}</div>
                        <div class="stat-label">المستخدم (Admin)</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon bg-info-light text-info">
                        <i data-lucide="clock"></i>
                    </div>
                    <div>
                        <div class="stat-value">${stats.addedToday}</div>
                        <div class="stat-label">أضيف اليوم</div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card mt-4">
                <div class="card-header">
                    <h3>أحدث الإضافات</h3>
                </div>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>القسم</th>
                            <th>تاريخ الإضافة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentItems.length ? recentItems.map(i => {
                            const date = new Intl.DateTimeFormat('ar-EG', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            }).format(new Date(i.created_at));
                            
                            // Use light/soft styling for category badge
                            return `
                            <tr>
                                <td class="fw-bold">${i.name_ar}</td>
                                <td>
                                    <span class="badge" style="background: var(--bg-body); color: var(--text-secondary); border: 1px solid var(--border);">
                                        ${i.category_name || 'غير محدد'}
                                    </span>
                                </td>
                                <td class="text-secondary" style="font-size: 0.9em;">${date}</td>
                            </tr>
                            `;
                        }).join('') : '<tr><td colspan="3" class="text-center py-4 text-muted">لا توجد بيانات حديثة</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }
};

window.HomeUI = HomeUI;
