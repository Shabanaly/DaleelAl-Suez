/**
 * Core Router for Admin Panel
 * Handles hash-based routing and module loading.
 */

const AdminRouter = {
    routes: {
        '': { title: 'الرئيسية', module: 'home' },
        'dashboard': { title: 'لوحة التحكم', module: 'home' },
        'places': { title: 'إدارة الأماكن', module: 'places' },
        'places/add': { title: 'إضافة مكان', module: 'places_form' },
        'places/edit': { title: 'تعديل مكان', module: 'places_form' },
        'categories': { title: 'الأقسام', module: 'categories' },
        'ads': { title: 'الإعلانات', module: 'ads' },
        'stories': { title: 'القصص', module: 'stories_list' },
        'stories/add': { title: 'إضافة قصة', module: 'stories_form' },
        'events': { title: 'الفعاليات', module: 'events_list' },
        'events/add': { title: 'إضافة فعالية', module: 'events_form' },
        'settings': { title: 'الإعدادات', module: 'settings' },
    },

    init: async function() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Initial load
    },

    handleRoute: async function() {
        const hash = window.location.hash.slice(1) || ''; // Remove #
        
        // Split hash to handle params (e.g., places/edit?id=123)
        // Split hash to handle params (e.g., places/edit?id=123)
        const [pathStr, queryStr] = hash.split('?');
        // Remove trailing slash AND LEADING slash
        const path = pathStr.replace(/\/$/, '').replace(/^\//, '');

        const route = this.resolveRoute(path);
        
        if (route) {
            // Update Title
            document.title = `${route.title} - لوحة التحكم`;
            
            // Render Layout Structure (if not already there)
            if (!document.getElementById('app-content')) {
                LayoutRenderer.renderMainLayout();
            }

            // Update Topbar Title
            if (typeof Topbar !== 'undefined') {
                Topbar.setTitle(route.title);
            }

            // Load Module Content
            await this.loadModule(route.module, queryStr);
            
            // Update Sidebar Active State
            if (typeof Sidebar !== 'undefined') {
                Sidebar.setActive(path.split('/')[0] || 'dashboard');
            }
        } else {
            console.warn('Route not found:', path);
            document.getElementById('app-content').innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <h2>404 - الصفحة غير موجودة</h2>
                    <a href="#/" class="btn btn-primary">العودة للرئيسية</a>
                </div>
            `;
        }
    },

    resolveRoute: function(path) {
        // Direct match
        if (this.routes[path]) return this.routes[path];
        
        // Pattern match (future use)
        return null;
    },

    loadModule: async function(moduleName, queryStr) {
        const container = document.getElementById('app-content');
        container.innerHTML = `<div class="spinner-container"><div class="spinner"></div> جاري التحميل...</div>`;
        
        try {
            // Dynamic import logic or simple switch for now
            // For Phase 1: We support 'home' and 'places' (placeholder)
            
            switch(moduleName) {
                case 'home':
                    await HomeController.init(container);
                    break;
                    
                case 'places':
                    await PlacesController.init(container);
                    break;

                case 'places_form':
                    // Extract ID from queryStr if exists
                    const params = {};
                    if(queryStr) {
                         const urlParams = new URLSearchParams(queryStr);
                         params.id = urlParams.get('id');
                    }
                    await PlacesController.loadForm(container, params);
                    break;

                case 'categories':
                    await CategoriesController.init(container);
                    break;


                case 'ads':
                    await AdsController.init(container);
                    break;

                case 'stories_list':
                    await StoriesController.init(container);
                    break;

                case 'stories_form':
                    await StoriesController.loadForm(container);
                    break;
                
                case 'events_list':
                    await EventsController.init(container);
                    break;
                    
                case 'events_form':
                    await EventsController.loadForm();
                    break;
                    
                case 'settings':
                    await SettingsController.init(container);
                    break;

                default:
                    container.innerHTML = `Module ${moduleName} loaded.`;
            }
            
        } catch (error) {
            console.error('Module load error:', error);
            container.innerHTML = `<div class="error-msg">حدث خطأ أثناء تحميل الصفحة.</div>`;
        }
    }
};

window.AdminRouter = AdminRouter;
