/**
 * i18n.js - Internationalization System
 * Handles Language State, Translations, and UI Updates
 * Contains ONLY user-facing UI constant translations
 */

const translations = {
    ar: {
        // App Core
        "app_name": "دليل <span>السويس</span>",
        "app_title": "دليل السويس",
        
        // Navigation
        "nav_home": "الرئيسية",
        "nav_categories": "الأقسام",
        "nav_favorites": "المفضلة",
        "nav_account": "حسابي",
        "nav_contact": "تواصل معنا",
        
        // Home Sections
        "section_latest": "أحدث الإضافات",
        "section_offers": "عروض مميزة 🔥",
        "section_quick": "خدمات عاجلة",
        "section_info": "حول السويس الآن",
        "section_trending": "الأكثر بحثاً الآن",
        "section_explore": "استكشف مدينتك",
        "section_reviews": "آراء مستخدمينا",
        
        // Home Info Hub
        "weather_title": "الطقس",
        "port_title": "الميناء",
        "port_status": "يعمل بشكل طبيعي",
        
        // Quick Actions
        "action_emergency": "طوارئ",
        "action_transport": "مواصلات",
        "action_police": "شرطة",
        "action_ambulance": "إسعاف",
        
        // Hero
        "hero_title": "اكتشف أفضل أماكن السويس",
        "hero_desc": "دليلك المحلي الذكي للمطاعم، الخدمات والأطباء في مدينة السويس.",
        "search_placeholder": "ابحث عن مكان، مطعم، دكتور...",
        
        // Explore Widget
        "explore_random_title": "هل زرت هذا المكان من قبل؟",
        
        // Footer
        "footer_desc": "المنصة الأكبر والأكثر موثوقية لاكتشاف مدينة السويس.",
        "footer_quick_links": "روابط سريعة",
        "footer_about": "عن الموقع",
        "footer_terms": "الشروط",
        "footer_privacy": "الخصوصية",
        "footer_copyright": "© 2025 دليل السويس.",
        
        // Controls
        "lang_switch": "English",
        "theme_toggle": "المظهر",
        
        // Favorites Page
        "no_favorites_title": "لا توجد عناصر مفضلة",
        "no_favorites_desc": "قم بإضافة الأماكن التي تعجبك بالضغط على أيقونة القلب لتراها هنا.",
        
        // Categories Page
        "categories_page_title": "الأقسام",
        "sub_all": "الكل",
        
        // Place Details
        "place_working_hours": "ساعات العمل",
        "place_address": "العنوان",
        "place_phone": "الهاتف",
        "place_call": "اتصال",
        "place_whatsapp": "واتساب",
        "place_map": "خريطة",
        "place_share": "مشاركة",
        "place_featured": "مميز",
        
        // About Page
        "about_title": "عن دليل السويس",
        "about_description": "منصة شاملة لاستكشاف مدينة السويس",
        
        // Contact Page
        "contact_title": "تواصل معنا",
        "contact_name": "الاسم",
        "contact_email": "البريد الإلكتروني",
        "contact_message": "الرسالة",
        "contact_send": "إرسال",
        
        // Advertise Page
        "advertise_title": "أعلن معنا",
        "advertise_description": "أضف مكانك في دليل السويس",
        
        // Terms Page
        "terms_title": "الشروط والأحكام",
        
        // Privacy Page
        "privacy_title": "سياسة الخصوصية",
        
        // Common Actions
        "btn_view_all": "عرض الكل",
        "btn_view_details": "عرض التفاصيل",
        "btn_save": "حفظ",
        "btn_cancel": "إلغاء",
        "btn_delete": "حذف",
        "btn_edit": "تعديل",
        "btn_saving": "جاري الحفظ...",
        
        // Admin Messages
        "alert_fill_required": "يرجى ملء الحقول المطلوبة",
        "alert_save_success": "تم حفظ البيانات بنجاح",
        "alert_save_error": "حدث خطأ أثناء الحفظ",
        "alert_confirm_delete": "هل أنت متأكد من الحذف؟",
        "loading_text": "جاري التحميل...",
        "error_loading": "فشل التحميل",
        "no_places_found": "لا توجد أماكن",
        "status_open": "مفتوح",
        "status_closed": "مغلق",
        "uncategorized": "غير مصنف",
        "toggle_status_title": "تغيير الحالة",
        
        // Profile
        "profile_welcome": "مرحباً بك،",
        "profile_provider": "مزود الخدمة",
        "profile_last_login": "آخر دخول",
        "profile_logout": "تسجيل الخروج",
        
        // Tabs
        "tab_about": "معلومات",
        "tab_reviews": "التقييمات",
        "tab_photos": "الصور",
        "tab_map": "الخريطة",
        
        // Reviews Section
        "reviews_title": "التقييمات والمراجعات",
        "no_reviews_yet": "لا توجد تقييمات حتى الآن. كن أول من يقيم!",
        "login_to_review": "سجل دخول لإضافة تقييم",
        "your_review_posted": "لقد قمت بتقييم هذا المكان مسبقاً",
        "submit_review": "نشر التقييم",
        "review_placeholder": "شاركنا تجربتك...",
        "reviews_count_label": "تقييم",
        "no_photos": "لا توجد صور متاحة",
        "no_location": "لا توجد بيانات للموقع",
        "add_your_review": "أضف تقييمك",
        "login_link_text": "سجل دخول للتقييم",
        "btn_see_more": "المزيد",
        "btn_back": "رجوع",
        "btn_close": "إغلاق",
        "loading": "جاري التحميل...",
        "no_results": "لا توجد نتائج",
        "error_loading": "حدث خطأ في التحميل",
        
        // Login Page
        "login_title": "تسجيل الدخول",
        "login_desc": "قم بتسجيل الدخول للمتابعة",
        "login_google": "المتابعة باستخدام Google",
        "login_facebook": "المتابعة باستخدام Facebook",
        "login_footer": "بالتسجيل أنت توافق على الشروط والأحكام",
        
        // Profile Page
        "profile_title": "الملف الشخصي",
        "profile_name": "الاسم",
        "profile_email": "البريد الإلكتروني",
        "profile_logout": "تسجيل الخروج",
        "profile_welcome": "مرحباً بك،",
        
        // Favorites
        "fav_title": "المفضلة",
        "fav_login_required": "يجب تسجيل الدخول لعرض المفضلة",
        "fav_login_btn": "تسجيل الدخول",
        "no_favorites_title": "لا توجد عناصر مفضلة",
        "no_favorites_desc": "قم بإضافة الأماكن التي تعجبك بالضغط على أيقونة القلب لتراها هنا."
    },
    en: {
        // App Core
        "app_name": "Daleel <span>Al-Suez</span>",
        "app_title": "Suez Guide",
        
        // Navigation
        "nav_home": "Home",
        "nav_categories": "Categories",
        "nav_favorites": "Favorites",
        "nav_account": "My Account",
        "nav_contact": "Contact Us",
        
        // Home Sections
        "section_latest": "Latest Additions",
        "section_offers": "Special Offers 🔥",
        "section_quick": "Quick Actions",
        "section_info": "Suez Today",
        "section_trending": "Trending Now",
        "section_explore": "Explore Your City",
        "section_reviews": "User Reviews",
        
        // Home Info Hub
        "weather_title": "Weather",
        "port_title": "Port Status",
        "port_status": "Operating Normally",
        
        // Quick Actions
        "action_emergency": "Emergency",
        "action_transport": "Transport",
        "action_police": "Police",
        "action_ambulance": "Ambulance",
        
        // Hero
        "hero_title": "Explore Best Places in Suez",
        "hero_desc": "Your smart local guide for restaurants, services, and doctors in Suez.",
        "search_placeholder": "Search...",
        
        // Explore Widget
        "explore_random_title": "Have you visited this place?",
        
        // Footer
        "footer_desc": "The most reliable platform to explore Suez City.",
        "footer_quick_links": "Quick Links",
        "footer_about": "About",
        "footer_terms": "Terms",
        "footer_privacy": "Privacy",
        "footer_copyright": "© 2025 Suez Guide.",
        
        // Controls
        "lang_switch": "العربية",
        "theme_toggle": "Theme",
        
        // Favorites Page
        "no_favorites_title": "No Favorites Added",
        "no_favorites_desc": "Add places you like by clicking the heart icon to see them here.",
        
        // Categories Page
        "categories_page_title": "Categories",
        "sub_all": "All",
        
        // Place Details
        "place_working_hours": "Working Hours",
        "place_address": "Address",
        "place_phone": "Phone",
        "place_call": "Call",
        "place_whatsapp": "WhatsApp",
        "place_map": "Map",
        "place_share": "Share",
        "place_featured": "Featured",
        
        // About Page
        "about_title": "About Suez Guide",
        "about_description": "Comprehensive platform to explore Suez City",
        
        // Contact Page
        "contact_title": "Contact Us",
        "contact_name": "Name",
        "contact_email": "Email",
        "contact_message": "Message",
        "contact_send": "Send",
        
        // Advertise Page
        "advertise_title": "Advertise With Us",
        "advertise_description": "Add your place to Suez Guide",
        
        // Terms Page
        "terms_title": "Terms & Conditions",
        
        // Privacy Page
        "privacy_title": "Privacy Policy",
        
        // Common Actions
        "btn_view_all": "View All",
        "btn_view_details": "View Details",
        "btn_save": "Save",
        "btn_cancel": "Cancel",
        "btn_delete": "Delete",
        "btn_edit": "Edit",
        "btn_saving": "Saving...",
        
        // Admin Messages
        "alert_fill_required": "Please fill required fields",
        "alert_save_success": "Saved successfully",
        "alert_save_error": "Error saving data",
        "alert_confirm_delete": "Are you sure you want to delete?",
        "loading_text": "Loading...",
        "error_loading": "Failed to load",
        "no_places_found": "No places found",
        "status_open": "Open",
        "status_closed": "Closed",
        "uncategorized": "Uncategorized",
        "toggle_status_title": "Toggle Status",
        
        // Profile
        "profile_welcome": "Welcome back,",
        "profile_provider": "Provider",
        "profile_last_login": "Last Login",
        "profile_logout": "Logout",
        
        // Tabs
        "tab_about": "About",
        "tab_reviews": "Reviews",
        "tab_photos": "Photos",
        "tab_map": "Map",
        
        // Reviews Section
        "reviews_title": "Ratings & Reviews",
        "no_reviews_yet": "No reviews yet. Be the first to review!",
        "login_to_review": "Login to write a review",
        "your_review_posted": "You have already reviewed this place",
        "submit_review": "Submit Review",
        "review_placeholder": "Share your experience...",
        "reviews_count_label": "Reviews",
        "no_photos": "No photos available",
        "no_location": "No location data",
        "add_your_review": "Write a Review",
        "login_link_text": "Login to Review",
        "btn_see_more": "See More",
        "btn_back": "Back",
        "btn_close": "Close",
        "loading": "Loading...",
        "no_results": "No results found",
        "error_loading": "Error loading data",
        
        // Login Page
        "login_title": "Login",
        "login_desc": "Sign in to continue",
        "login_google": "Continue with Google",
        "login_facebook": "Continue with Facebook",
        "login_footer": "By signing in you agree to Terms & Conditions",
        
        // Profile Page
        "profile_title": "My Profile",
        "profile_name": "Name",
        "profile_email": "Email",
        "profile_logout": "Logout",
        "profile_welcome": "Welcome back,",
        
        // Favorites
        "fav_title": "Favorites",
        "fav_login_required": "Login required to view favorites",
        "fav_login_btn": "Sign In",
        "no_favorites_title": "No favorites yet",
        "no_favorites_desc": "Like places to see them here."
    }
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
    
    // Dispatch event for dynamic components to update
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function updatePageContent(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // 1. Static Elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.placeholder = dict[key];
            } else if (el.tagName === "TITLE") {
                document.title = dict[key] + " - " + dict["app_title"];
            } else {
                if (dict[key].includes("<")) el.innerHTML = dict[key];
                else el.textContent = dict[key];
            }
        }
    });

    // 2. Language Toggle Buttons
    document.querySelectorAll("#lang-toggle, #lang-toggle-mobile, #lang-toggle-mobile-2").forEach(btn => {
        btn.textContent = dict["lang_switch"];
    });
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if key not found
 * @returns {string} Translated text
 */
function t(key, fallback = '') {
    const lang = getPreferredLanguage();
    return translations[lang]?.[key] || fallback || key;
}

function toggleLanguage() {
    const current = getPreferredLanguage();
    const next = current === "ar" ? "en" : "ar";
    setLanguageState(next);
}

// Blocking Init - Set direction before render
(function() {
    const lang = getPreferredLanguage();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Anti-Flash: Hide i18n elements until translated
    const style = document.createElement('style');
    style.id = 'i18n-cloak';
    style.textContent = '[data-i18n] { opacity: 0 !important; }';
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

// Expose globally
window.t = t; // Backward compatibility if used directly
window.getPreferredLanguage = getPreferredLanguage;
window.toggleLanguage = toggleLanguage;

// Namespace exposure for new I18n.t() calls
window.I18n = {
    t: t,
    getPreferredLanguage: getPreferredLanguage,
    toggleLanguage: toggleLanguage
};
