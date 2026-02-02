/**
 * @file: admin/src/presentation/components/sidebar.js
 * @layer: Presentation Layer
 * @responsibility: Navigation Component (SPA).
 */

const Sidebar = {
  render: (activePage = "home") => {
    // SPA: We don't need path resolution anymore. We use Hash Strategy.
    const user = window.AppAuthService ? window.AppAuthService.getUserData() : { email: 'admin' }; 
    // Note: getUserData might be sync or async. For UI rendering, we assume it's available or we fetch async and update.
    // Ideally user is passed in. But Sidebar.render is often called synchronously.
    
    const items = [
      { id: "home", icon: "layout-dashboard", label: "الرئيسية", url: "#/" },
      { id: "places", icon: "map-pin", label: "الأماكن", url: "#/places" },
      { id: "categories", icon: "layers", label: "الأقسام", url: "#/categories" },
      { id: "events", icon: "calendar", label: "الفعاليات", url: "#/events" },
      { id: "ads", icon: "megaphone", label: "الإعلانات", url: "#/ads" },
      { id: "stories", icon: "aperture", label: "القصص", url: "#/stories" },
      { id: "settings", icon: "settings", label: "الإعدادات", url: "#/settings" },
    ];

    const navLinks = items.map(item => `
        <a href="${item.url}" class="nav-link ${activePage === item.id ? "active" : ""}">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
        </a>
    `).join("");

    const drawerLinks = items.map(item => `
        <a href="${item.url}" class="drawer-nav-link ${activePage === item.id ? "active" : ""}" onclick="toggleDrawer()">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
        </a>
    `).join("");

    return `
        <!-- Desktop Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <i data-lucide="compass" style="color: var(--primary)"></i>
                <span>دليل السويس</span>
            </div>
            <nav>${navLinks}</nav>
            <div class="sidebar-footer">
                <div class="sidebar-user-box">
                    <div class="sidebar-user-label">👤 مسجل دخول</div>
                    <div class="sidebar-user-email">Admin</div>
                </div>
                <button onclick="if(confirm('⚠️ هل تريد تسجيل الخروج؟')) window.AppAuthService.logout()" class="logout-btn-styled">
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
                <button onclick="if(confirm('⚠️ هل تريد تسجيل الخروج؟')) window.AppAuthService.logout()" class="drawer-nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer; margin-top: 20px;">
                    <i data-lucide="log-out"></i>
                    <span>تسجيل الخروج</span>
                </button>
            </nav>
        </div>
    `;
  },

  setActive: (activePage) => {
      document.querySelectorAll('.nav-link, .drawer-nav-link').forEach(el => el.classList.remove('active'));
      // activePage might be 'places' or 'home'
      // URL might be #/places/edit
      
      const items = ['home', 'places', 'categories', 'events', 'ads', 'stories', 'settings'];
      const current = items.find(i => activePage.startsWith(i)) || 'home';
      
      // Select by Href or ID if we add IDs to links
      // Simplest: use items array to map current to index or selector
      // Let's select by href="#/${current}"
      
      let selector = `a[href="#/${current}"]`;
      if (current === 'home') selector = `a[href="#/"]`;
      
      document.querySelectorAll(selector).forEach(el => el.classList.add('active'));
  }
};
window.Sidebar = Sidebar;
