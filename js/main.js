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
        if (typeof entertainment !== "undefined") allPlaces = allPlaces.concat(entertainment.slice(0, 2));
        if (typeof emergency !== "undefined") allPlaces = allPlaces.concat(emergency.slice(0, 2));
        if (typeof home_living !== "undefined") allPlaces = allPlaces.concat(home_living.slice(0, 2));
        if (typeof cars !== "undefined") allPlaces = allPlaces.concat(cars.slice(0, 2));
        if (typeof jobs !== "undefined") allPlaces = allPlaces.concat(jobs.slice(0, 2));
        if (typeof education !== "undefined") allPlaces = allPlaces.concat(education.slice(0, 2));
        if (typeof events !== "undefined") allPlaces = allPlaces.concat(events.slice(0, 2));
        if (typeof tourism !== "undefined") allPlaces = allPlaces.concat(tourism.slice(0, 2));
        if (typeof government !== "undefined") allPlaces = allPlaces.concat(government.slice(0, 2));
        if (typeof selection !== "undefined") allPlaces = allPlaces.concat(selection.slice(0, 2));
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

    // No Scroll or Toggle Logic needed for Grid-only mobile view
});

/* --- Mobile Account Modal Logic (Static / No Management) --- */
function createAccountModal() {
    if (document.querySelector('.account-modal')) return;

    const lang = typeof getPreferredLanguage === "function" ? getPreferredLanguage() : "ar";
    const isAr = lang === "ar";

    const modalHTML = `
        <div class="modal-backdrop" onclick="closeAccountModal()"></div>
        <div class="account-modal">
            <div class="modal-header">
                <h3 data-i18n="nav_account">${isAr ? "حسابي" : "Account"}</h3>
                <div class="modal-close" onclick="closeAccountModal()"><i data-lucide="x"></i></div>
            </div>
            
            <div class="modal-section">
                <h4 data-i18n="nav_home">${isAr ? "اللغة" : "Language"}</h4>
                <button class="modal-action-btn" onclick="toggleLanguage()">
                    <span>${isAr ? "English" : "العربية"}</span>
                    <i data-lucide="globe"></i>
                </button>
            </div>

            <div class="modal-section">
                <h4 data-i18n="theme_toggle">${isAr ? "المظهر" : "Theme"}</h4>
                <button class="modal-action-btn" onclick="toggleTheme()">
                    <span>Dark / Light</span>
                    <i data-lucide="moon"></i>
                </button>
            </div>

            <div class="modal-section">
                <h4>${isAr ? "تسجيل الدخول" : "Login"}</h4>
                <button class="modal-action-btn auth-btn" disabled>
                    <span>${isAr ? "متابعة باستخدام Google" : "Continue with Google"}</span>
                    <span class="badge-soon">${isAr ? "قريبًا" : "Soon"}</span>
                </button>
                <button class="modal-action-btn auth-btn" disabled>
                    <span>${isAr ? "متابعة باستخدام Facebook" : "Continue with Facebook"}</span>
                    <span class="badge-soon">${isAr ? "قريبًا" : "Soon"}</span>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function openAccountModal(e) {
    if(e) e.preventDefault();
    createAccountModal();
    
    // Helper delay to ensure DOM is ready before adding active class for animation
    requestAnimationFrame(() => {
        document.querySelector('.modal-backdrop').classList.add('active');
        document.querySelector('.account-modal').classList.add('active');
    });
}

function closeAccountModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.account-modal');
    if (backdrop) backdrop.classList.remove('active');
    if (modal) modal.classList.remove('active');
}

// Attach click handler to account nav items (both top and bottom)
document.addEventListener('DOMContentLoaded', function() {
    // Find all links that contain the account translation span
    const accountSpans = document.querySelectorAll('[data-i18n="nav_account"]');
    accountSpans.forEach(span => {
        const accountLink = span.closest('a, button');
        if (accountLink) {
            accountLink.addEventListener('click', openAccountModal);
        }
    });
});
