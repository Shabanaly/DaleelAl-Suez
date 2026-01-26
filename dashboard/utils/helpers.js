// Dashboard Utilities
const Utils = {
    // Format Date (e.g., 2025-01-01)
    formatDate: (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    },

    // Toast Notification
    showToast: (message, type = 'success') => {
        // Simple Toast Implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        
        // CSS for toast should be in dashboard.css
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 10);
    },

    // Create Element Helper
    create: (tag, classes = '', content = '') => {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (content) el.innerHTML = content;
        return el;
    }
};

window.Utils = Utils;
