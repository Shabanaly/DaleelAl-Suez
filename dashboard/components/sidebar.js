const Sidebar = {
    render: (activePage = 'home') => {
        const navItems = [
            { id: 'home', label: 'الرئيسية', icon: 'layout-dashboard', link: 'dashboard-home.html' },
            { id: 'places', label: 'الأماكن', icon: 'map-pin', link: 'places.html' },
            { id: 'categories', label: 'الأقسام', icon: 'layers', link: 'categories.html' },
            { id: 'users', label: 'المستخدمين', icon: 'users', link: 'users.html' },
            { id: 'settings', label: 'الإعدادات', icon: 'settings', link: 'settings.html' },
        ];

        const navHtml = navItems.map(item => `
            <a href="${item.link}" class="nav-item ${activePage === item.id ? 'active' : ''}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `).join('');

        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i data-lucide="compass" class="logo-icon"></i>
                    <h2>دليل السويس</h2>
                </div>
                <nav class="sidebar-nav">
                    ${navHtml}
                </nav>
                <div class="sidebar-footer">
                    <button class="logout-btn">
                        <i data-lucide="log-out"></i>
                        <span>تسجيل خروج</span>
                    </button>
                    <p class="version">Version 2.0</p>
                </div>
            </aside>
        `;
    }
};

window.Sidebar = Sidebar;
