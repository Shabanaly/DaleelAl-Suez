/**
 * Sidebar Component (Admin Panel)
 * Renders desktop sidebar and mobile drawer navigation
 * @namespace Sidebar
 */
const Sidebar = {
  /**
   * Render sidebar HTML with navigation links
   * @param {string} activePage - Current active page ID
   * @returns {string} Sidebar HTML string
   */
  render: (activePage = "home") => {
    // Detect if we're in pages/ subdirectory
    // Detect context
    const path = window.location.pathname;
    const isInPages = path.includes("/pages/"); // admin/html/pages/
    const isHtmlRoot = path.includes("/html/") && !isInPages; // admin/html/
    const isRoot = !isInPages && !isHtmlRoot; // admin/ (root)

    // Helper to resolve paths
    const getPath = (page) => {
        if (page === 'home') {
            if (isInPages) return "../../index.html"; // Go to admin/index.html
            if (isHtmlRoot) return "../index.html";   // Go to admin/index.html
            return "index.html";
        }
        // For subpages (places, categories, ads)
        const pageFile = page === 'categories' ? 'categories-list.html' : `${page}.html`;
        
        if (isInPages) return pageFile; // Same dir
        if (isHtmlRoot) return `pages/${pageFile}`; // Down to pages/
        return `html/pages/${pageFile}`; // Down to html/pages/ (from root)
    };

    // 🌟 اسحب بيانات المستخدم
    const userData = AuthService.getUserData();

    const items = [
      {
        id: "home",
        icon: "layout-dashboard",
        label: "الرئيسية",
        url: getPath('home'),
      },
      {
        id: "places",
        icon: "map-pin",
        label: "الأماكن",
        url: getPath('places'),
      },
      {
        id: "categories",
        icon: "layers",
        label: "الأقسام",
        url: getPath('categories'),
      },
      {
        id: "ads",
        icon: "megaphone",
        label: "الإعلانات",
        url: getPath('ads'),
      },
    ];

    const navLinks = items
      .map(
        (item) => `
            <a href="${item.url}" class="nav-link ${activePage === item.id ? "active" : ""}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `,
      )
      .join("");

    const drawerLinks = items
      .map(
        (item) => `
            <a href="${item.url}" class="drawer-nav-link ${activePage === item.id ? "active" : ""}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `,
      )
      .join("");

    return `
            <!-- Desktop Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i data-lucide="compass" style="color: var(--primary)"></i>
                    <span>دليل السويس</span>
                </div>
                <nav>${navLinks}</nav>
                <div class="sidebar-footer">
                    ${
                      userData
                        ? `
                        <div class="sidebar-user-box">
                            <div class="sidebar-user-label">👤 مسجل دخول</div>
                            <div class="sidebar-user-email">${userData.email}</div>
                        </div>
                    `
                        : ""
                    }
                    <button onclick="if(confirm('⚠️ هل تريد تسجيل الخروج؟')) AuthService.logout()" class="logout-btn-styled">
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
                    ${
                      userData
                        ? `
                        <div style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin: 20px 12px; font-size: 12px;">
                            <div style="color: var(--text-muted); margin-bottom: 4px;">👤 مسجل دخول</div>
                            <div style="font-weight: 600; color: var(--primary); word-break: break-all;">${userData.email}</div>
                        </div>
                    `
                        : ""
                    }
                    <button onclick="if(confirm('⚠️ هل تريد تسجيل الخروج؟')) AuthService.logout()" class="drawer-nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer; margin-top: 20px;">
                        <i data-lucide="log-out"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </nav>
            </div>
        `;
  },
};
window.Sidebar = Sidebar;
