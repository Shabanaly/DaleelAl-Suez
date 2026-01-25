// main.js

document.addEventListener("DOMContentLoaded", function() {
    // تحديد الصفحة الحالية
    var path = window.location.pathname;
    // التحقق من الصفحة الرئيسية (سواء كانت / أو index.html أو المجلد الرئيسي)
    var isHome = path === "/" || path.endsWith("index.html") || path.endsWith("/") || path === "";
    
    // تصحيح المسارات للصور والروابط بناءً على مستوى الصفحة
    var basePath = isHome ? "" : "../";

    // عرض أحدث الأماكن في الصفحة الرئيسية
    if (isHome) {
        var allPlaces = [];
        if (typeof restaurants !== "undefined") allPlaces = allPlaces.concat(restaurants.slice(0, 2));
        if (typeof cafes !== "undefined") allPlaces = allPlaces.concat(cafes.slice(0, 2));
        if (typeof doctors !== "undefined") allPlaces = allPlaces.concat(doctors.slice(0, 2));
        if (typeof shops !== "undefined") allPlaces = allPlaces.concat(shops.slice(0, 2));
        
        renderPlaces(allPlaces, "places-container");
    }
    
    // عرض المطاعم
    if (path.indexOf("restaurants.html") !== -1) {
        if (typeof restaurants !== "undefined") {
            renderPlaces(restaurants, "places-container");
        }
    }
    
    // عرض الكافيهات
    if (path.indexOf("cafes.html") !== -1) {
        if (typeof cafes !== "undefined") {
            renderPlaces(cafes, "places-container");
        }
    }
    
    // عرض الأطباء
    if (path.indexOf("doctors.html") !== -1) {
        if (typeof doctors !== "undefined") {
            renderPlaces(doctors, "places-container");
        }
    }
    
    // عرض الصيدليات
    if (path.indexOf("pharmacies.html") !== -1) {
        if (typeof pharmacies !== "undefined") {
            renderPlaces(pharmacies, "places-container");
        }
    }
    
    // عرض الخدمات
    if (path.indexOf("services.html") !== -1) {
        if (typeof services !== "undefined") {
            renderPlaces(services, "places-container");
        }
    }
    
    // عرض المحلات
    if (path.indexOf("shops.html") !== -1) {
        if (typeof shops !== "undefined") {
            renderPlaces(shops, "places-container");
        }
    }

    // تفعيل مؤشرات التنقل (السهام) للـ Navbars
    initScrollIndicators();
    
    // استرجاع موضع التمرير للأقسام (Mobile UX)
    restoreScrollPositions();

    // استعادة وضع العرض (Grid/List)
    const savedView = localStorage.getItem("viewMode");
    if (savedView === 'grid') {
        const containers = document.querySelectorAll('.categories-container, .sub-nav');
        containers.forEach(el => el.classList.add('grid-view'));
        
        // Update Icon Initial State
        const btn = document.querySelector('.view-toggle-btn i');
        if (btn) btn.setAttribute('data-lucide', 'list');
        
        // Update Arrows Initial State
        const indicators = document.querySelectorAll('.nav-indicator');
        indicators.forEach(ind => ind.style.display = 'none');
    }
});

function restoreScrollPositions() {
    const containers = document.querySelectorAll('.categories-container, .sub-nav');
    containers.forEach((container, index) => {
        const savedPos = sessionStorage.getItem('scroll_pos_' + index);
        if (savedPos) {
            container.scrollLeft = parseInt(savedPos);
        }
        
        container.addEventListener('scroll', () => {
            sessionStorage.setItem('scroll_pos_' + index, container.scrollLeft);
        }, { passive: true });
    });
}

function initScrollIndicators() {
    const containers = document.querySelectorAll('.categories-container, .sub-nav');
    
    containers.forEach(container => {
        const wrapper = container.parentElement;
        if (!wrapper) return;

        // إنشاء السهام برمجياً إذا لم تكن موجودة
        if (!wrapper.querySelector('.nav-indicator-left')) {
            const leftBtn = document.createElement('div');
            leftBtn.className = 'nav-indicator nav-indicator-left';
            leftBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
            wrapper.appendChild(leftBtn);
            
            const rightBtn = document.createElement('div');
            rightBtn.className = 'nav-indicator nav-indicator-right';
            rightBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
            wrapper.appendChild(rightBtn);

            if (typeof lucide !== "undefined") lucide.createIcons();

            // منطق التمرير عند النقر
            leftBtn.onclick = () => container.scrollBy({ left: -150, behavior: 'smooth' });
            rightBtn.onclick = () => container.scrollBy({ left: 150, behavior: 'smooth' });
        }

        const leftBtn = wrapper.querySelector('.nav-indicator-left');
        const rightBtn = wrapper.querySelector('.nav-indicator-right');

        const updateArrows = () => {
            // Check if grid view is active - hide arrows if so
            if (container.classList.contains('grid-view')) {
                leftBtn.style.display = 'none';
                rightBtn.style.display = 'none';
                return;
            }

            const isScrollable = container.scrollWidth > container.clientWidth + 2;
            if (!isScrollable) {
                leftBtn.classList.remove('visible');
                rightBtn.classList.remove('visible');
                leftBtn.style.display = ''; // Reset display to allow visibility check
                rightBtn.style.display = '';
                return;
            }

            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            
            // في وضع RTL (العربية):
            // التمرير لليسار (Left) يزيد من إزاحة التمرير (غالباً بالسالب أو الموجب حسب المتصفح)
            // سنستخدم الحواف المطلقة للتأكد من وجود محتوى
            
            // هل يوجد محتوى مخفي جهة اليسار؟
            const hasMoreLeft = Math.abs(scrollLeft) < (scrollWidth - clientWidth - 5);
            // هل يوجد محتوى مخفي جهة اليمين؟
            const hasMoreRight = Math.abs(scrollLeft) > 5;

            leftBtn.classList.toggle('visible', hasMoreLeft);
            rightBtn.classList.toggle('visible', hasMoreRight);
            
            // Ensure they are displayed (not none) when visible
            leftBtn.style.display = '';
            rightBtn.style.display = '';
        };

        container.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        // Delay initial update slightly to ensure grid class is applied if saved
        setTimeout(updateArrows, 50); 
    });
}

function toggleViewMode() {
    const containers = document.querySelectorAll('.categories-container, .sub-nav');
    const btn = document.querySelector('.view-toggle-btn i');
    
    let isGrid = false;
    containers.forEach(el => {
        el.classList.toggle('grid-view');
        if (el.classList.contains('grid-view')) isGrid = true;
    });

    // Save State
    localStorage.setItem("viewMode", isGrid ? "grid" : "list");

    // Toggle Icon
    if (btn) {
        btn.setAttribute('data-lucide', isGrid ? 'list' : 'layout-grid');
        if (typeof lucide !== "undefined") lucide.createIcons();
    }
    
    // Toggle Arrows Visibility
    const indicators = document.querySelectorAll('.nav-indicator');
    indicators.forEach(ind => {
        ind.style.display = isGrid ? 'none' : '';
    });
    
    // Trigger resize to update arrow visibility logic if switching back to list
    if (!isGrid) {
        window.dispatchEvent(new Event('resize'));
    }
}
