const Sidebar = {
  render: (activePage = "home") => {
    // Detect if we're in pages/ subdirectory
    const isInPages = window.location.pathname.includes("/pages/");

    // 🌟 اسحب بيانات المستخدم
    const userData = AuthService.getUserData();

    const items = [
      {
        id: "home",
        icon: "layout-dashboard",
        label: "الرئيسية",
        url: isInPages ? "../index.html" : "index.html",
      },
      {
        id: "places",
        icon: "map-pin",
        label: "الأماكن",
        url: isInPages ? "places.html" : "pages/places.html",
      },
      {
        id: "categories",
        icon: "layers",
        label: "الأقسام",
        url: isInPages ? "categories-list.html" : "pages/categories-list.html",
      },
      {
        id: "ads",
        icon: "megaphone",
        label: "الإعلانات",
        url: isInPages ? "ads.html" : "pages/ads.html",
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
                <div class="sidebar-footer" style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
                    ${
                      userData
                        ? `
                        <div style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 16px; font-size: 12px;">
                            <div style="color: var(--text-muted); margin-bottom: 4px;">👤 مسجل دخول</div>
                            <div style="font-weight: 600; color: var(--primary); word-break: break-all;">${userData.email}</div>
                        </div>
                    `
                        : ""
                    }
                    <button onclick="confirmLogout()" class="nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer;">
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
                    <button onclick="confirmLogout()" class="drawer-nav-link" style="width:100%; border:none; background:transparent; color:#ef4444; justify-content:flex-start; cursor:pointer; margin-top: 20px;">
                        <i data-lucide="log-out"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </nav>
            </div>

            <script>
                // 🌟 دالة تأكيد الخروج
                function confirmLogout() {
                    if (confirm('⚠️ هل تريد تسجيل الخروج؟')) {
                        console.log('🔓 تسجيل الخروج للمستخدم:', '${userData?.email || "Unknown"}');
                        AuthService.logout();
                    }
                }
            </script>
        `;
  },
};
window.Sidebar = Sidebar;
