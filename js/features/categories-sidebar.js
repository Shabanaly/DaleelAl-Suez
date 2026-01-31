// import { CategoriesService } from ... (Service is global)

export async function initCategoriesSidebar(containerId) {
    const CategoriesService = window.UserCategoriesService;
    if (!CategoriesService) {
        console.error("UserCategoriesService not found globally.");
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Use getAll to get main categories
        const categories = await CategoriesService.getAll();
        if (!categories || categories.length === 0) {
            container.innerHTML = '<p class="text-muted">لا توجد أقسام</p>';
            return;
        }

        renderCategories(container, categories);
    } catch (error) {
        console.error("Error loading sidebar categories:", error);
        container.innerHTML = '<p class="text-error">خطأ في التحميل</p>';
    }
}

function renderCategories(container, categories) {
    const html = categories.map(cat => `
        <a href="pages/category.html?id=${cat.id}" class="sidebar-cat-item">
            <div class="cat-icon">
                <i data-lucide="${cat.icon || 'circle'}"></i>
            </div>
            <span class="cat-name">${cat.name_ar}</span>
            <i data-lucide="chevron-left" class="arrow-icon"></i>
        </a>
    `).join('');

    container.innerHTML = html;
    lucide.createIcons();
}
