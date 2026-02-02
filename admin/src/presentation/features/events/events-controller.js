/**
 * @file: src/presentation/features/events/events-controller.js
 * @layer: Presentation Layer
 * @responsibility: Handle user interactions for Events module.
 */

const EventsController = {
    
    container: null,

    init(container) {
        this.container = container; 
        this.loadList();
    },

    async loadList() {
        try {
            // Skeleton / Loading state? 
            // Ideally View should support generic loading, but simple approach:
            this.container.innerHTML = '<div class="text-center p-5"><span class="spinner-border text-primary"></span></div>';
            
            const events = await window.AppEventService.getAllEvents();
            this.container.innerHTML = window.EventsView.renderList(events || []);
            lucide.createIcons();
        } catch (error) {
            console.error('Failed to load events', error);
            window.Toast.error('فشل تحميل الفعاليات');
            this.container.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء تحميل البيانات: ${error.message}</div>`;
        }
    },

    async loadForm(id = null) {
        if (!this.container) this.container = document.getElementById('app-content');

        try {
            let event = {};
            if (id) {
                // Fetch event for Edit
                // Loading indicator...
                event = await window.AppEventService.getEventById(id);
                if (!event) throw new Error("Event not found");
            }

            this.container.innerHTML = window.EventsView.renderForm(event);
            lucide.createIcons();
        } catch (error) {
            console.error('Failed to load form', error);
            window.Toast.error('فشل تحميل النموذج');
        }
    },

    async save(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('#save-btn');
        const spinner = submitBtn.querySelector('.spinner-border');

        // Extract raw data
        const rawData = {
            id: formData.get('id') || null,
            title: formData.get('title'),
            description: formData.get('description'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time'),
            location_name: formData.get('location_name'),
            type: formData.get('type'),
            // Keep existing image if no new one
            image_url: formData.get('existing_image') 
        };

        const imageFile = formData.get('image').size > 0 ? formData.get('image') : null;

        try {
            // UI Loading State
            submitBtn.disabled = true;
            spinner.classList.remove('d-none');

            // Call Service
            await window.AppEventService.saveEvent(rawData, imageFile);

            window.Toast.success(rawData.id ? 'تم تعديل الفعالية بنجاح' : 'تم نشر الفعالية بنجاح');
            
            // Redirect to list
            this.loadList();

        } catch (error) {
            console.error('Save failed', error);
            window.Toast.error(error.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
        }
    },

    async delete(id) {
        if (!confirm('هل أنت متأكد من حذف هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        try {
            await window.AppEventService.deleteEvent(id);
            window.Toast.success('تم الحذف بنجاح');
            this.loadList(); // Refresh
        } catch (error) {
            console.error('Delete failed', error);
            window.Toast.error('فشل عملية الحذف');
        }
    }
};

window.EventsController = EventsController;
