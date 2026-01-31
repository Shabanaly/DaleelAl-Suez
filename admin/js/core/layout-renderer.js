/**
 * Layout Renderer
 * Renders the main admin shell (Sidebar, Topbar, Content Area)
 */

if (typeof Sidebar === 'undefined') {
    // Temporary stub if sidebar.js is not loaded yet or refactored
    window.Sidebar = {
        render: (active) => `<div class="mock-sidebar">Sidebar (${active})</div>`,
        setActive: (active) => console.log('Set active sidebar:', active)
    };
}

if (typeof Topbar === 'undefined') {
    // Temporary stub
    window.Topbar = {
        render: (title) => `<div class="mock-topbar">${title}</div>`,
        setTitle: (title) => {
            const el = document.getElementById('page-title');
            if(el) el.innerText = title;
        }
    };
}

const LayoutRenderer = {
    renderMainLayout: function() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="app-layout">
                <div id="sidebar-container"></div>
                <main class="main-content">
                    <div id="topbar-container"></div>
                    <div class="page-content" id="app-content">
                        <!-- Dynamic Content Goes Here -->
                    </div>
                </main>
            </div>
        `;

        // Render Shell Components
        // We will replace these with the actual components imported later
        // For now, checks if global components exist
        
        this.renderSidebar();
        this.renderTopbar();
    },

    renderSidebar: function() {
        const container = document.getElementById('sidebar-container');
        // We assume Sidebar.render() returns a string or we append it
        // Depending on existing utils/sidebar.js implementation
        if (typeof Sidebar !== 'undefined') {
            container.innerHTML = Sidebar.render('dashboard');
        }
    },

    renderTopbar: function() {
        const container = document.getElementById('topbar-container');
        if (typeof Topbar !== 'undefined') {
            container.innerHTML = Topbar.render('الرئيسية');
        }
    }
};

window.LayoutRenderer = LayoutRenderer;
