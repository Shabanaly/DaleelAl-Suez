/**
 * Keyboard Shortcuts Manager
 * Handles global keyboard shortcuts for admin panel
 * @namespace KeyboardShortcuts
 */
const KeyboardShortcuts = {
    /**
     * Initialize keyboard shortcuts
     */
    init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S or Cmd+S to save form
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const submitBtn = document.querySelector('form button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                    Toast.info('حفظ... (Ctrl+S)');
                }
            }
            
            // Escape to close modal/drawer
            if (e.key === 'Escape') {
                // Close any open modals
                const modal = document.querySelector('.modal-overlay.active, .confirm-modal-overlay.show');
                if (modal) {
                    modal.click();
                }
                
                // Close mobile drawer
                const drawer = document.querySelector('.mobile-drawer.active');
                if (drawer && window.closeDrawer) {
                    window.closeDrawer();
                }
            }
            
            // Ctrl+K or Cmd+K for search (future feature)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KeyboardShortcuts.init());
} else {
    KeyboardShortcuts.init();
}

window.KeyboardShortcuts = KeyboardShortcuts;
