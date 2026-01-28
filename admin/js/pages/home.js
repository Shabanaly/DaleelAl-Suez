document.addEventListener('DOMContentLoaded', () => {
    // 🌟 اسحب بيانات المستخدم المحفوظة
    const currentUser = AuthService.getUserData();

    console.log("👤 بيانات المستخدم الحالي:", currentUser);

    document.getElementById("sidebar-container").innerHTML = Sidebar.render("home");
    document.getElementById("topbar-container").innerHTML = Topbar.render("نظرة عامة");
    lucide.createIcons();

    init();

    async function init() {
        try {
            // 🌟 عند التهيئة، حدّث آخر نشاط للمستخدم
            if (currentUser) {
                AuthService.updateActivity();
                console.log("📊 تم تحديث وقت النشاط الأخير");
            }

            const stats = await StatsService.getDashboardStats();
            renderStats(stats);
            const recent = await StatsService.getRecentActivity();
            renderRecent(recent);
        } catch (e) {
            console.error(e);
        }
    }

    function renderStats(s) {
        document.getElementById("stats-container").innerHTML = `
            <div class="stat-card-wrapper">
                <div class="stat-card">
                    <div class="stat-icon"><i data-lucide="map-pin"></i></div>
                    <div><span class="stat-lbl">إجمالي الأماكن</span><span class="stat-val">${s.totalPlaces}</span></div>
                </div>
            </div>
            <div class="stat-card-wrapper">
                <div class="stat-card">
                    <div class="stat-icon"><i data-lucide="users"></i></div>
                    <div><span class="stat-lbl">المستخدمين (Admin)</span><span class="stat-val">${currentUser ? currentUser.email.split('@')[0] : "Admin"}</span></div>
                </div>
            </div>
            <div class="stat-card-wrapper">
                <div class="stat-card">
                    <div class="stat-icon"><i data-lucide="list"></i></div>
                    <div><span class="stat-lbl">الأقسام</span><span class="stat-val">${s.mainCategories}</span></div>
                </div>
            </div>
            <div class="stat-card-wrapper">
                <div class="stat-card">
                    <div class="stat-icon"><i data-lucide="clock"></i></div>
                    <div><span class="stat-lbl">أضيف اليوم</span><span class="stat-val">${s.addedToday}</span></div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    function renderRecent(items) {
        const tbody = document.querySelector("#recent-table tbody");
        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">لا يوجد بيانات</td></tr>';
            return;
        }
        tbody.innerHTML = items.map(i => `
            <tr>
                <td><strong>${i.name_ar}</strong></td>
                <td><span class="badge">${i.main_cat_id}</span></td>
                <td>${Utils.formatDate(i.created_at)}</td>
            </tr>
        `).join("");
    }
});
