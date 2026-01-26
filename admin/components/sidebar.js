const Sidebar = {
    render: (activePage = 'home') => {
        // Simple Context Awareness
        const isPages = window.location.pathname.includes('/pages/');
        const root = isPages ? '../' : '';

        const links = [
            { id: 'home', icon: 'layout-dashboard', text: 'الرئيسية', href: isPages ? '../index.html' : 'index.html' },
            { id: 'places', icon: 'map', text: 'الأماكن', href: isPages ? 'places.html' : 'pages/places.html' },
            { id: 'categories', icon: 'list', text: 'الأقسام', href: isPages ? 'categories.html' : 'pages/categories.html' },
        ];

        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i data-lucide="compass" style="color: var(--primary)"></i>
                    <span>دليل السويس</span>
                </div>
                <nav>
                    ${links.map(l => `
                        <a href="${l.href}" class="nav-link ${activePage === l.id ? 'active' : ''}">
                            <i data-lucide="${l.icon}"></i>
                            <span>${l.text}</span>
                        </a>
                    `).join('')}
                </nav>
            </aside>
        `;
    }
};
window.Sidebar = Sidebar;
