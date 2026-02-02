/**
 * @file: admin/src/utils/drawer.js
 * @layer: Utils
 * @responsibility: Mobile Drawer Toggling.
 */

window.toggleDrawer = function() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
};

// Close on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer && drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
});
