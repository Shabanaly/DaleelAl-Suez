/**
 * UI Utilities for Admin Panel
 * Loading states, confirmations, and other UX helpers
 * @namespace UIUtils
 */
const UIUtils = {
    /**
     * Set button loading state
     * @param {HTMLElement|string} button - Button element or ID
     * @param {boolean} isLoading - Loading state
     */
    setButtonLoading(button, isLoading) {
        const btn = typeof button === 'string' ? document.getElementById(button) : button;
        if (!btn) return;
        
        if (isLoading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.innerHTML;
            btn.classList.add('loading');
            btn.innerHTML = '<span class="spinner"></span> جاري المعالجة...';
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            btn.innerHTML = btn.dataset.originalText || 'حفظ';
            delete btn.dataset.originalText;
        }
    },
    
    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {string} confirmText - Confirm button text (default: "نعم، تأكيد")
     * @param {string} cancelText - Cancel button text (default: "إلغاء")
     * @returns {Promise<boolean>} True if confirmed
     */
    async confirm(message, confirmText = 'نعم، تأكيد', cancelText = 'إلغاء') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal-overlay';
            modal.innerHTML = `
                <div class="confirm-modal">
                    <div class="confirm-icon">⚠️</div>
                    <h3 class="confirm-title">تأكيد العملية</h3>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-actions">
                        <button class="btn btn-danger" id="confirm-yes">${confirmText}</button>
                        <button class="btn btn-secondary" id="confirm-no">${cancelText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
            
            const cleanup = (result) => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
                resolve(result);
            };
            
            document.getElementById('confirm-yes').onclick = () => cleanup(true);
            document.getElementById('confirm-no').onclick = () => cleanup(false);
            modal.onclick = (e) => {
                if (e.target === modal) cleanup(false);
            };
            
            // ESC key to cancel
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    },
    
    /**
     * Validate required form fields
     * @param {HTMLFormElement|string} form - Form element or ID
     * @returns {boolean} True if valid
     */
    validateForm(form) {
        const formEl = typeof form === 'string' ? document.getElementById(form) : form;
        if (!formEl) return false;
        
        const requiredFields = formEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            if (!value) {
                this.showFieldError(field, 'هذا الحقل مطلوب');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    },
    
    /**
     * Show field error
     * @param {HTMLElement} field - Input field
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    },
    
    /**
     * Clear field error
     * @param {HTMLElement} field - Input field
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    },
    
    /**
     * Setup real-time validation for a form
     * @param {HTMLFormElement|string} form - Form element or ID
     */
    setupRealtimeValidation(form) {
        const formEl = typeof form === 'string' ? document.getElementById(form) : form;
        if (!formEl) return;
        
        const fields = formEl.querySelectorAll('[required]');
        fields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', () => {
                const value = field.value.trim();
                if (!value) {
                    this.showFieldError(field, 'هذا الحقل مطلوب');
                } else {
                    this.clearFieldError(field);
                }
            });
            
            // Clear error on input if field had error
            field.addEventListener('input', () => {
                if (field.classList.contains('error') && field.value.trim()) {
                    this.clearFieldError(field);
                }
            });
        });
    },
    
    /**
     * Show loading skeleton in container
     * @param {string} containerId - Container element ID
     */
    showSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;
    }
};

window.UIUtils = UIUtils;
