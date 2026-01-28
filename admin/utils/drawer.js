// Mobile Drawer Utility
window.toggleDrawer = function() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when drawer is open
        if (drawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        console.warn('Drawer or overlay not found!');
    }
};

// Close drawer when clicking on a link (Delegated Event)
document.addEventListener('click', function(e) {
    if (e.target.closest('.drawer-nav-link')) {
        if (window.toggleDrawer) {
            window.toggleDrawer();
        }
    }
});
