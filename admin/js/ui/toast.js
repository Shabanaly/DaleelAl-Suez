/**
 * Toast Notification System
 * Shows success, error, warning, info messages to users
 * @namespace Toast
 */
const Toast = {
    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, warning, info
     * @param {number} duration - Duration in ms (default 3000)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const icon = icons[type] || icons.info;
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        // Get or create container
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    /**
     * Show success message
     * @param {string} message - Success message
     */
    success(message) {
        this.show(message, 'success');
    },
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    error(message) {
        this.show(message, 'error', 4000); // Longer duration for errors
    },
    
    /**
     * Show warning message
     * @param {string} message - Warning message
     */
    warning(message) {
        this.show(message, 'warning');
    },
    
    /**
     * Show info message
     * @param {string} message - Info message
     */
    info(message) {
        this.show(message, 'info');
    }
};

window.Toast = Toast;
