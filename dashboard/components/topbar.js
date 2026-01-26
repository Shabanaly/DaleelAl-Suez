const Topbar = {
    render: (title) => {
        return `
            <header class="topbar">
                <div class="page-title">
                    <h1 id="page-title">${title}</h1>
                </div>
                <div class="topbar-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="بحث سريع...">
                    </div>
                    <button class="icon-btn notification-btn">
                        <i data-lucide="bell"></i>
                        <span class="badge">3</span>
                    </button>
                    <div class="user-profile">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff" alt="Admin">
                        <div class="user-info">
                            <span class="name">المدير العام</span>
                            <span class="role">Admin</span>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
};

window.Topbar = Topbar;
