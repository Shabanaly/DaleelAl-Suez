/**
 * Contact Page Controller
 * Handles contact form submission
 */

window.ContactPageController = {
    init() {
        console.log("📧 ContactPageController Initializing...");
        this.setupFormHandler();
    },

    setupFormHandler() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(form);
        });
    },

    async handleSubmit(form) {
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        // Show loading state
        btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> جاري الإرسال...';
        if (window.lucide) window.lucide.createIcons();

        try {
            // TODO: Replace with actual API call to contact service
            await this.simulateSubmission();

            // Show success
            btn.innerHTML = '<i data-lucide="check"></i> تم الإرسال بنجاح!';
            btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            if (window.lucide) window.lucide.createIcons();

            // Reset after 3 seconds
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
                if (window.lucide) window.lucide.createIcons();
            }, 3000);

        } catch (error) {
            console.error("Form submission error:", error);
            alert('حدث خطأ، يرجى المحاولة مرة أخرى');
            btn.innerHTML = originalText;
        }
    },

    async simulateSubmission() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
};
