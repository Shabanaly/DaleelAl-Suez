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
    }
};

// Close drawer when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const drawerLinks = document.querySelectorAll('.drawer-nav-link');
        drawerLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.toggleDrawer) {
                    window.toggleDrawer();
                }
            });
        });
    }, 100);
});
