const Topbar = {
    render: (pageTitle = 'لوحة التحكم') => {
        return `
            <header class="topbar">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="mobile-menu-btn" onclick="toggleDrawer()">
                        <i data-lucide="menu"></i>
                    </button>
                    <h1 class="page-title">${pageTitle}</h1>
                </div>
                <div style="display:flex; align-items:center; gap: 16px;">
                    <button class="btn btn-outline btn-icon"><i data-lucide="bell"></i></button>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" style="width:32px; height:32px; border-radius:50%;">
                        <span style="font-weight:600; font-size:13px;" class="admin-name">المدير</span>
                    </div>
                </div>
            </header>
        `;
    }
};

window.Topbar = Topbar;
