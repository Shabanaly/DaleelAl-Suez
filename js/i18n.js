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
        
        "cat_entertainment": "الخروج والترفيه",
        "header_entertainment": "أفضل أماكن الخروج في السويس",
        "page_title_entertainment": "الخروج والترفيه في السويس",
        
        "cat_emergency": "الطوارئ",
        "header_emergency": "خدمات الطوارئ والاحتياجات السريعة",
        "page_title_emergency": "الطوارئ في السويس",
        
        "cat_home_living": "البيت والمعيشة",
        "header_home_living": "دليل البيت والمعيشة في السويس",
        "page_title_home_living": "البيت والمعيشة في السويس",
        
        "cat_cars": "السيارات والمواصلات",
        "header_cars": "صيانة وخدمات السيارات في السويس",
        "page_title_cars": "السيارات والمواصلات في السويس",
        
        "cat_jobs": "الشغل والرزق",
        "header_jobs": "وظائف وخدمات أعمال في السويس",
        "page_title_jobs": "الشغل والرزق في السويس",
        
        "cat_education": "التعليم والتطوير",
        "header_education": "مراكز التعليم والكورسات في السويس",
        "page_title_education": "التعليم والتطوير في السويس",
        
        "cat_events": "المناسبات والحفلات",
        "header_events": "تجهيز الحفلات والقاعات في السويس",
        "page_title_events": "المناسبات والحفلات في السويس",
        
        "cat_tourism": "السياحة الداخلية",
        "header_tourism": "السياحة والرحلات في مدينة السويس",
        "page_title_tourism": "السياحة الداخلية في السويس",
        
        "cat_government": "الحكومة والخدمات",
        "header_government": "المصالح الحكومية والخدمات الرسمية",
        "page_title_government": "الخدمات الحكومية في السويس",
        
        "cat_selection": "أختار إيه؟",
        "header_selection": "أفضل الترشيحات والاختيارات",
        "page_title_selection": "دليل الترشيحات في السويس",

        "sub_ent_family": "فسح عائلية", "sub_ent_youth": "أماكن للشباب", "sub_ent_parks": "حدائق عامة", "sub_ent_beaches": "شواطئ", "sub_ent_cinemas": "سينمات", "sub_ent_malahi": "ملاهي", "sub_ent_gaming": "كافيهات ألعاب", "sub_ent_quiet": "أماكن هادئة", "sub_ent_photo": "أماكن تصوير",
        "sub_emg_hospitals": "مستشفيات طوارئ", "sub_emg_ambulance": "إسعاف خاص", "sub_emg_pharm_24h": "صيدليات 24 ساعة", "sub_emg_doctors": "أطباء طوارئ", "sub_emg_vinch": "ونش سيارات", "sub_emg_mainten": "كهربائي/سباك طوارئ", "sub_emg_locks": "فتح أقفال", "sub_emg_gas": "بنزينات",
        "sub_home_nursery": "حضانات", "sub_home_schools": "مدارس", "sub_home_centers": "مراكز تعليم", "sub_home_ngo": "جمعيات", "sub_home_clubs": "نوادي", "sub_home_gym": "جيمات", "sub_home_slimming": "مراكز تخسيس", "sub_home_laundry": "مغاسل", "sub_home_cleaning": "شركات نظافة", "sub_home_furniture": "مفروشات", "sub_home_utils": "أدوات منزلية",
        "sub_car_mech": "ورش ميكانيكا", "sub_car_elec": "كهرباء سيارات", "sub_car_tires": "كاوتش", "sub_car_oil": "زيوت", "sub_car_maint": "مراكز صيانة", "sub_car_wash": "مغاسل سيارات", "sub_car_parts": "قطع غيار", "sub_car_accs": "كماليات", "sub_car_insur": "تأمين سيارات", "sub_car_school": "مدارس قيادة",
        "sub_job_ads": "وظائف متاحة", "sub_job_train": "تدريب", "sub_job_offices": "مكاتب توظيف", "sub_job_accs": "محاسبين", "sub_job_lawyers": "محامين", "sub_job_clear": "مكاتب تخليص", "sub_job_ship": "شركات شحن", "sub_job_free": "أعمال حرة", "sub_job_online": "خدمات أونلاين",
        "sub_edu_centers": "سناتر", "sub_edu_lang": "كورسات لغات", "sub_edu_code": "برمجة", "sub_edu_design": "تصميم", "sub_edu_craft": "تعليم حرف", "sub_edu_tutor": "دروس خصوصية", "sub_edu_lib": "مكتبات", "sub_edu_tools": "أدوات تعليمية",
        "sub_eve_halls": "قاعات أفراح", "sub_eve_kosha": "كوش", "sub_eve_dj": "دي جي", "sub_eve_photo": "تصوير", "sub_eve_cate": "كاترينج", "sub_eve_plan": "تنظيم حفلات", "sub_eve_ballo": "بالونات وزينة", "sub_eve_rent": "تأجير معدات",
        "sub_tou_spots": "أماكن سياحية", "sub_tou_hotels": "فنادق", "sub_tou_apart": "شقق فندقية", "sub_tou_trips": "رحلات", "sub_tou_boats": "مراكب", "sub_tou_day": "جولات يوم واحد", "sub_tou_prog": "برامج سياحية",
        "sub_gov_offices": "مصالح حكومية", "sub_gov_times": "عناوين وأوقات عمل", "sub_gov_papers": "أوراق مطلوبة", "sub_gov_steps": "خطوات الإجراءات", "sub_gov_phones": "أرقام تليفونات", "sub_gov_comp": "شكاوى",
        "sub_sel_top10": "أحسن 10 أماكن", "sub_sel_cheap5": "أرخص 5", "sub_sel_family": "أنسب للعيلة", "sub_sel_budget": "حسب الميزانية", "sub_sel_time": "حسب الوقت", "sub_sel_dist": "حسب القرب",

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
        
        "cat_entertainment": "Entertainment",
        "header_entertainment": "Best Places for Outing in Suez",
        "page_title_entertainment": "Entertainment in Suez",
        
        "cat_emergency": "Emergency",
        "header_emergency": "Emergency Services in Suez",
        "page_title_emergency": "Emergency in Suez",
        
        "cat_home_living": "Home & Living",
        "header_home_living": "Home & Living Guide in Suez",
        "page_title_home_living": "Home & Living in Suez",
        
        "cat_cars": "Cars & Transport",
        "header_cars": "Car Maintenance & Services",
        "page_title_cars": "Cars & Transport in Suez",
        
        "cat_jobs": "Jobs & Business",
        "header_jobs": "Jobs & Business Services",
        "page_title_jobs": "Jobs in Suez",
        
        "cat_education": "Education",
        "header_education": "Education Centers & Courses",
        "page_title_education": "Education in Suez",
        
        "cat_events": "Events & Parties",
        "header_events": "Party Planning & Event Venues",
        "page_title_events": "Events in Suez",
        
        "cat_tourism": "Domestic Tourism",
        "header_tourism": "Tourism & Trips in Suez",
        "page_title_tourism": "Tourism in Suez",
        
        "cat_government": "Government Services",
        "header_government": "Government Offices & Services",
        "page_title_government": "Government in Suez",
        
        "cat_selection": "What to Choose?",
        "header_selection": "Best Recommendations",
        "page_title_selection": "Recommendations in Suez",

        "sub_ent_family": "Family Outings", "sub_ent_youth": "Youth Spots", "sub_ent_parks": "Public Parks", "sub_ent_beaches": "Beaches", "sub_ent_cinemas": "Cinemas", "sub_ent_malahi": "Amusement Parks", "sub_ent_gaming": "Gaming Cafes", "sub_ent_quiet": "Quiet Spots", "sub_ent_photo": "Photography Spots",
        "sub_emg_hospitals": "ER Hospitals", "sub_emg_ambulance": "Private Ambulance", "sub_emg_pharm_24h": "24h Pharmacies", "sub_emg_doctors": "ER Doctors", "sub_emg_vinch": "Car Towing", "sub_emg_mainten": "ER Electr/Plumb", "sub_emg_locks": "Locksmith", "sub_emg_gas": "Gas Stations",
        "sub_home_nursery": "Nurseries", "sub_home_schools": "Schools", "sub_home_centers": "Edu Centers", "sub_home_ngo": "NGOs", "sub_home_clubs": "Clubs", "sub_home_gym": "Gyms", "sub_home_slimming": "Weight Loss", "sub_home_laundry": "Laundries", "sub_home_cleaning": "Cleaning Co", "sub_home_furniture": "Furniture", "sub_home_utils": "Housewares",
        "sub_car_mech": "Mechanics", "sub_car_elec": "Car Electrics", "sub_car_tires": "Tires", "sub_car_oil": "Oil", "sub_car_maint": "Maint Centers", "sub_car_wash": "Car Wash", "sub_car_parts": "Spare Parts", "sub_car_accs": "Accessories", "sub_car_insur": "Car Insurance", "sub_car_school": "Driving Schools",
        "sub_job_ads": "Available Jobs", "sub_job_train": "Training", "sub_job_offices": "Recruit Offices", "sub_job_accs": "Accountants", "sub_job_lawyers": "Lawyers", "sub_job_clear": "Clear Offices", "sub_job_ship": "Shipping Co", "sub_job_free": "Freelance", "sub_job_online": "Online Services",
        "sub_edu_centers": "Centers", "sub_edu_lang": "Lang Courses", "sub_edu_code": "Programming", "sub_edu_design": "Design", "sub_edu_craft": "Crafts", "sub_edu_tutor": "Tutoring", "sub_edu_lib": "Libraries", "sub_edu_tools": "Edu Tools",
        "sub_eve_halls": "Wedding Halls", "sub_eve_kosha": "Koshas", "sub_eve_dj": "DJ", "sub_eve_photo": "Photography", "sub_eve_cate": "Catering", "sub_eve_plan": "Party Planning", "sub_eve_ballo": "Balloons", "sub_eve_rent": "Equipment Rental",
        "sub_tou_spots": "Tourist Spots", "sub_tou_hotels": "Hotels", "sub_tou_apart": "Hotel Aparts", "sub_tou_trips": "Trips", "sub_tou_boats": "Boats", "sub_tou_day": "Day Tours", "sub_tou_prog": "Tour Programs",
        "sub_gov_offices": "Gov Offices", "sub_gov_times": "Work Hours", "sub_gov_papers": "Required Papers", "sub_gov_steps": "Procedures", "sub_gov_phones": "Phone Numbers", "sub_gov_comp": "Complaints",
        "sub_sel_top10": "Top 10 Places", "sub_sel_cheap5": "Cheapest 5", "sub_sel_family": "Family Best", "sub_sel_budget": "By Budget", "sub_sel_time": "By Time", "sub_sel_dist": "By Distance",

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
