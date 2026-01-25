/**
 * i18n.js - Strict Single Source of Truth System
 * Handles Language State, Translations, and UI Updates without Reloads
 */

const translations = {
    ar: {
        "app_name": "دليل <span>السويس</span>",
        "app_title": "دليل السويس",
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
        
        "header_restaurants": "أفضل المطاعم في السويس",
        "header_cafes": "كافيهات السويس",
        "header_doctors": "دليل أطباء السويس",
        "header_pharmacies": "دليل صيدليات السويس",
        "header_shops": "محلات في السويس",
        "header_services": "دليل خدمات السويس",

        "page_title_restaurants": "المطاعم في السويس",
        "page_title_cafes": "كافيهات السويس",
        "page_title_doctors": "أطباء السويس",
        "page_title_pharmacies": "صيدليات السويس",
        "page_title_shops": "محلات السويس",
        "page_title_services": "خدمات السويس",

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
        
        "sub_pharm_delivery": "توصيل منزلي",
        
        
        "title_rest_grill": "مطاعم مشويات في السويس",
        "title_rest_seafood": "مطاعم مأكولات بحرية في السويس",
        "title_rest_oriental": "مطاعم شرقية في السويس",
        "title_rest_fastfood": "مطاعم وجبات سريعة في السويس",
        
        "title_cafe_seaview": "كافيهات على البحر في السويس",
        "title_cafe_workspace": "مساحات عمل في السويس",
        "title_cafe_original": "كافيهات السويس",
        
        "title_doc_dentist": "أطباء أسنان في السويس",
        "title_doc_pediatric": "أطباء أطفال في السويس",
        "title_doc_internal": "أطباء باطنة في السويس",
        "title_doc_orthopedic": "أطباء عظام في السويس",
        
        "title_shop_clothes": "محلات ملابس في السويس",
        "title_shop_supermarket": "سوبر ماركت في السويس",
        "title_shop_electronics": "محلات إلكترونيات في السويس",
        "title_shop_shoes": "محلات أحذية في السويس",
        
        "title_serv_car": "مراكز صيانة سيارات في السويس",
        "title_serv_cleaning": "شركات تنظيف في السويس",
        "title_serv_maintenance": "خدمات صيانة منزلية في السويس",
        
        "title_pharm_24h": "صيدليات 24 ساعة في السويس",
        "title_pharm_delivery": "صيدليات توصيل منزلي في السويس",
        
        "section_latest": "أحدث الإضافات",
        "footer_brand_desc": "دليلك الأول لكل كافيهات السويس.",
        "footer_desc": "المنصة الأكبر والأكثر موثوقية لاكتشاف مدينة السويس.",
        "footer_quick_links": "روابط سريعة",
        "footer_about": "عن الموقع",
        "footer_terms": "الشروط",
        "footer_privacy": "الخصوصية",
        "footer_copyright": "© 2025 دليل السويس.",
        "lang_switch": "English",
        "theme_toggle": "المظهر",
        "no_favorites_title": "لا توجد عناصر مفضلة",
        "no_favorites_desc": "قم بإضافة الأماكن التي تعجبك بالضغط على أيقونة القلب لتراها هنا."
    },
    en: {
        "app_name": "Daleel <span>Al-Suez</span>",
        "app_title": "Suez Guide",
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
        
        "header_restaurants": "Best Restaurants in Suez",
        "header_cafes": "Cafes in Suez",
        "header_doctors": "Suez Doctors Guide",
        "header_pharmacies": "Suez Pharmacies Guide",
        "header_shops": "Shops in Suez",
        "header_services": "Suez Services Guide",

        "page_title_restaurants": "Restaurants in Suez",
        "page_title_cafes": "Cafes in Suez",
        "page_title_doctors": "Doctors in Suez",
        "page_title_pharmacies": "Pharmacies in Suez",
        "page_title_shops": "Shops in Suez",
        "page_title_services": "Services in Suez",

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
        
        "sub_pharm_delivery": "Delivery",
        
        
        "title_rest_grill": "Grill Restaurants in Suez",
        "title_rest_seafood": "Seafood Restaurants in Suez",
        "title_rest_oriental": "Oriental Restaurants in Suez",
        "title_rest_fastfood": "Fast Food Restaurants in Suez",
        
        "title_cafe_seaview": "Sea View Cafes in Suez",
        "title_cafe_workspace": "Coworking Spaces in Suez",
        "title_cafe_original": "Cafes in Suez",
        
        "title_doc_dentist": "Dentists in Suez",
        "title_doc_pediatric": "Pediatricians in Suez",
        "title_doc_internal": "Internal Medicine Doctors in Suez",
        "title_doc_orthopedic": "Orthopedists in Suez",
        
        "title_shop_clothes": "Clothing Stores in Suez",
        "title_shop_supermarket": "Supermarkets in Suez",
        "title_shop_electronics": "Electronics Stores in Suez",
        "title_shop_shoes": "Shoe Stores in Suez",
        
        "title_serv_car": "Car Maintenance Centers in Suez",
        "title_serv_cleaning": "Cleaning Services in Suez",
        "title_serv_maintenance": "Home Maintenance Services in Suez",
        
        "title_pharm_24h": "24-Hour Pharmacies in Suez",
        "title_pharm_delivery": "Home Delivery Pharmacies in Suez",
        
        "section_latest": "Latest Additions",
        "footer_brand_desc": "Your #1 guide for all Suez cafes.",
        "footer_desc": "The most reliable platform to explore Suez City.",
        "footer_quick_links": "Quick Links",
        "footer_about": "About",
        "footer_terms": "Terms",
        "footer_privacy": "Privacy",
        "footer_copyright": "© 2025 Suez Guide.",
        "lang_switch": "العربية",
        "theme_toggle": "Theme",
        "no_favorites_title": "No Favorites Added",
        "no_favorites_desc": "Add places you like by clicking the heart icon to see them here."
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
            } else if (el.tagName === "TITLE") {
                 // Special handling for Page Title
                 document.title = dict[key] + " - " + dict["app_title"];
            } else {
                if (dict[key].includes("<")) el.innerHTML = dict[key];
                else el.textContent = dict[key];
            }
        }
    });

    // 2. Buttons
    document.querySelectorAll("#lang-toggle, #lang-toggle-mobile, #lang-toggle-mobile-2").forEach(btn => {
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
    
    // Anti-Flash: Hide i18n elements until translated
    const style = document.createElement('style');
    style.id = 'i18n-cloak';
    style.textContent = '[data-i18n] { opacity: 0 !important; }'; // Use opacity to avoid layout shift, or visibility
    document.head.appendChild(style);
})();

document.addEventListener("DOMContentLoaded", () => {
    updatePageContent(getPreferredLanguage());
    
    // Uncloak after translation
    requestAnimationFrame(() => {
        const cloak = document.getElementById('i18n-cloak');
        if (cloak) cloak.remove();
    });
});
