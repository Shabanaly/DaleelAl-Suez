const Sidebar = {
    render: (activePage = 'home') => {
        // Detect if we're in pages/ subdirectory
        const isInPages = window.location.pathname.includes('/pages/');
        
        const items = [
            { id: 'home', icon: 'layout-dashboard', label: 'الرئيسية', url: isInPages ? '../index.html' : 'index.html' },
            { id: 'places', icon: 'map-pin', label: 'الأماكن', url: isInPages ? 'places.html' : 'pages/places.html' },
            { id: 'categories', icon: 'layers', label: 'الأقسام', url: isInPages ? 'categories.html' : 'pages/categories.html' },
            { id: 'ads', icon: 'megaphone', label: 'الإعلانات', url: isInPages ? 'ads.html' : 'pages/ads.html' }
        ];

        const navLinks = items.map(item => `
            <a href="${item.url}" class="nav-link ${activePage === item.id ? 'active' : ''}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `).join('');

        const drawerLinks = items.map(item => `
            <a href="${item.url}" class="drawer-nav-link ${activePage === item.id ? 'active' : ''}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `).join('');

        return `
            <!-- Desktop Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i data-lucide="compass" style="color: var(--primary)"></i>
                    <span>دليل السويس</span>
                </div>
                <nav>${navLinks}</nav>
                <div class="sidebar-footer" style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <button onclick="AuthService.logout()" class="nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer;">
                        <i data-lucide="log-out"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
            
            <!-- Mobile Drawer -->
            <div class="mobile-drawer-overlay" id="drawer-overlay" onclick="toggleDrawer()"></div>
            <div class="mobile-drawer" id="mobile-drawer">
                <div class="drawer-header">
                    <div class="drawer-brand">
                        <i data-lucide="compass"></i>
                        <span>دليل السويس</span>
                    </div>
                    <button class="drawer-close" onclick="toggleDrawer()">×</button>
                </div>
                <nav class="drawer-nav">
                    ${drawerLinks}
                    <button onclick="AuthService.logout()" class="drawer-nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer; margin-top: 20px;">
                        <i data-lucide="log-out"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </nav>
            </div>
        `;
    }
};
window.Sidebar = Sidebar;
