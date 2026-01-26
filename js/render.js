// render.js

function renderPlaces(list, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "";
    
    if (!list || list.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                <div style="background: var(--bg-card); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <i data-lucide="clock" style="width: 40px; height: 40px; color: var(--text-muted); opacity: 0.5;"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">سيتم إضافة أماكن قريبًا</h3>
                <p style="color: var(--text-muted); font-size: 14px;">نعمل حاليًا على إضافة محتوى لهذا القسم.</p>
            </div>
        `;
        if (typeof lucide !== "undefined") lucide.createIcons();
        return;
    }

    for (var i = 0; i < list.length; i++) {
        container.innerHTML += placeCard(list[i]);
    }

    // تفعيل الأيقونات بعد عملية الـ Render
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}
