/**
 * Quick Services Feature
 * Displays emergency or utility icons
 */

async function initQuickServices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        if (!window.QuickServicesService) throw new Error("QuickServicesService not found");
        
        const data = await window.QuickServicesService.getQuickServices();

        if (data && data.length > 0) {
            renderServices(container, data);
            return;
        }
    } catch (e) {
        console.warn("Quick services fetch failed", e);
    }

    // Fallback: Emergency Numbers
    const emergencyServices = [
        { name_ar: 'إسعاف', icon_name: 'ambulance', action_url: 'tel:123' },
        { name_ar: 'مطافي', icon_name: 'flame', action_url: 'tel:180' },
        { name_ar: 'نجدة', icon_name: 'shield-alert', action_url: 'tel:122' },
        { name_ar: 'صيدلية', icon_name: 'pill', action_url: 'pages/search.html?q=صيدلية' }
    ];
    renderServices(container, emergencyServices);
}

function renderServices(container, services) {
    container.innerHTML = services.map(s => `
        <a href="${s.action_url}" class="service-icon-box">
            <div class="service-icon">
                <i data-lucide="${s.icon_name}"></i>
            </div>
            <span class="service-name">${s.name_ar}</span>
        </a>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}
