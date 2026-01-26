const Sidebar = {
    render: (activePage = 'home') => {
        // Detect if we're in pages/ subdirectory
        const isInPages = window.location.pathname.includes('/pages/');
        
        const items = [
            { id: 'home', icon: 'layout-dashboard', label: 'الرئيسية', url: isInPages ? '../index.html' : 'index.html' },
            { id: 'places', icon: 'map-pin', label: 'الأماكن', url: isInPages ? 'places.html' : 'pages/places.html' },
            { id: 'categories', icon: 'layers', label: 'الأقسام', url: isInPages ? 'categories.html' : 'pages/categories.html' }
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
                <nav class="drawer-nav">${drawerLinks}</nav>
            </div>
        `;
    }
};
window.Sidebar = Sidebar;
