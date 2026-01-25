/**
 * i18n.js - Strict Single Source of Truth System
 * Handles Language State, Translations, and UI Updates without Reloads
 */

const translations = {
    ar: {
        "app_name": "دليل <span>السويس</span>",
        "nav_home": "الرئيسية",
        "nav_categories": "الأقسام",
        "nav_favorites": "المفضلة",
        "nav_account": "حسابي",
        "nav_contact": "تواصل معنا",
        "hero_title": "اكتشف أفضل أماكن السويس",
        "hero_desc": "دليلك المحلي الذكي للمطاعم، الخدمات والأطباء في مدينة السويس.",
        "search_placeholder": "ابحث عن مكان، مطعم، دكتور...",
        
        "cat_restaurants": "مطاعم",
        "cat_cafes": "كافيهات",
        "cat_doctors": "أطباء",
        "cat_pharmacies": "صيدليات",
        "cat_shops": "محلات",
        "cat_services": "خدمات",
        
        "sub_all": "الكل",
        "sub_rest_grill": "مشويات",
        "sub_rest_seafood": "مأكولات بحرية",
        "sub_rest_oriental": "شرقي",
        "sub_rest_fastfood": "وجبات سريعة",
        
        "sub_cafe_seaview": "على البحر",
        "sub_cafe_workspace": "مساحات عمل",
        "sub_cafe_original": "كافيهات",
        
        "sub_doc_dentist": "أسنان",
        "sub_doc_pediatric": "أطفال",
        "sub_doc_internal": "باطنة",
        "sub_doc_orthopedic": "عظام",
        
        "sub_shop_clothes": "ملابس",
        "sub_shop_supermarket": "سوبر ماركت",
        "sub_shop_electronics": "إلكترونيات",
        "sub_shop_shoes": "أحذية",
        
        "sub_serv_car": "صيانة سيارات",
        "sub_serv_cleaning": "تنظيف",
        "sub_serv_maintenance": "صيانة منزلية",
        
        "sub_pharm_24h": "24 ساعة",
        "sub_pharm_delivery": "توصيل منزلي",
        
        "section_latest": "أحدث الإضافات",
        "footer_brand_desc": "دليلك الأول لكل كافيهات السويس.",
        "footer_desc": "المنصة الأكبر والأكثر موثوقية لاكتشاف مدينة السويس.",
        "footer_quick_links": "روابط سريعة",
        "footer_about": "عن الموقع",
        "footer_terms": "الشروط",
        "footer_privacy": "الخصوصية",
        "footer_copyright": "© 2025 دليل السويس.",
        "lang_switch": "English",
        "theme_toggle": "المظهر"
    },
    en: {
        "app_name": "Daleel <span>Al-Suez</span>",
        "nav_home": "Home",
        "nav_categories": "Categories",
        "nav_favorites": "Favorites",
        "nav_account": "Account",
        "nav_contact": "Contact",
        "hero_title": "Explore Best Places in Suez",
        "hero_desc": "Your smart local guide for restaurants, services, and doctors in Suez.",
        "search_placeholder": "Search...",
        
        "cat_restaurants": "Restaurants",
        "cat_cafes": "Cafes",
        "cat_doctors": "Doctors",
        "cat_pharmacies": "Pharmacies",
        "cat_shops": "Shops",
        "cat_services": "Services",
        
        "sub_all": "All",
        "sub_rest_grill": "Grill",
        "sub_rest_seafood": "Seafood",
        "sub_rest_oriental": "Oriental",
        "sub_rest_fastfood": "Fast Food",
        
        "sub_cafe_seaview": "Sea View",
        "sub_cafe_workspace": "Workspace",
        "sub_cafe_original": "Classic Cafes",
        
        "sub_doc_dentist": "Dentist",
        "sub_doc_pediatric": "Pediatric",
        "sub_doc_internal": "Internal Med",
        "sub_doc_orthopedic": "Orthopedic",
        
        "sub_shop_clothes": "Clothes",
        "sub_shop_supermarket": "Supermarket",
        "sub_shop_electronics": "Electronics",
        "sub_shop_shoes": "Shoes",

        "sub_serv_car": "Car Service",
        "sub_serv_cleaning": "Cleaning",
        "sub_serv_maintenance": "Home Maintenance",
        
        "sub_pharm_24h": "24 Hours",
        "sub_pharm_delivery": "Delivery",
        
        "section_latest": "Latest Additions",
        "footer_brand_desc": "Your #1 guide for all Suez cafes.",
        "footer_desc": "The most reliable platform to explore Suez City.",
        "footer_quick_links": "Quick Links",
        "footer_about": "About",
        "footer_terms": "Terms",
        "footer_privacy": "Privacy",
        "footer_copyright": "© 2025 Suez Guide.",
        "lang_switch": "العربية",
        "theme_toggle": "Theme"
    }
};

const categoryMap = {
    "مطعم": "Restaurant", "Restaurant": "مطعم",
    "كافيه": "Cafe", "Cafe": "كافيه",
    "عيادة": "Clinic", "Clinic": "عيادة",
    "صيدلية": "Pharmacy", "Pharmacy": "صيدلية",
    "محل": "Shop", "Shop": "محل",
    "خدمة": "Service", "Service": "خدمة"
};

function getPreferredLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ar") return saved;
    return "ar";
}

function setLanguageState(lang) {
    if (lang !== "ar" && lang !== "en") return;
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    updatePageContent(lang);
}

function updatePageContent(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // 1. Static Elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.placeholder = dict[key];
            } else {
                if (dict[key].includes("<")) el.innerHTML = dict[key];
                else el.textContent = dict[key];
            }
        }
    });

    // 2. Buttons
    document.querySelectorAll("#lang-toggle, #lang-toggle-mobile").forEach(btn => {
        btn.textContent = dict["lang_switch"];
    });

    // 3. Dynamic Cards Patch (No Reload)
    const isAr = lang === "ar";
    document.querySelectorAll(".listing-card").forEach(card => {
        // Details Link
        const link = card.querySelector("a");
        if (link) {
            link.textContent = isAr ? "التفاصيل الكاملة ←" : "Full Details →";
        }
        // Category Badge (Heuristic)
        const badge = card.querySelector(".listing-img + div");
        if (badge) {
            const currentText = badge.textContent.trim();
            if (categoryMap[currentText]) {
               badge.textContent = categoryMap[currentText];
            }
        }
    });
}

function toggleLanguage() {
    const current = getPreferredLanguage();
    const next = current === "ar" ? "en" : "ar";
    setLanguageState(next);
}

// Blocking Init
(function() {
    const lang = getPreferredLanguage();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
})();

document.addEventListener("DOMContentLoaded", () => {
    updatePageContent(getPreferredLanguage());
});
