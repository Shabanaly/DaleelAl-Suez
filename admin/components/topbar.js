const Topbar = {
  render: (pageTitle = "لوحة التحكم") => {
    // 🌟 اسحب بيانات المستخدم من localStorage
    const userData = AuthService.getUserData();
    const userEmail = userData?.email || "المدير";
    const userName = userData?.name || "Admin";

    console.log("🔝 Top Bar - بيانات المستخدم:", userData);

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
                    <div style="display:flex; align-items:center; gap:8px; cursor:pointer; padding: 8px; border-radius: 8px; transition: background 0.2s;" 
                         onmouseover="this.style.background='var(--bg-body)'" 
                         onmouseout="this.style.background='transparent'"
                         title="آخر نشاط: ${userData?.lastActivity ? new Date(userData.lastActivity).toLocaleString("ar-EG") : "N/A"}">
                        <img src="https://placehold.co/64x64/2563eb/ffffff?text=${userName.charAt(0).toUpperCase()}" style="width:32px; height:32px; border-radius:50%;">
                        <span style="font-weight:600; font-size:13px;" class="admin-name">${userName}</span>
                    </div>
                </div>
            </header>
        `;
  },
};

window.Topbar = Topbar;
