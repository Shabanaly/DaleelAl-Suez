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
        "section_latest": "أحدث الإضافات",
        "section_offers": "عروض مميزة 🔥",
        "section_quick": "خدمات عاجلة",
        "section_info": "حول السويس الآن",
        "section_trending": "الأكثر بحثاً الآن",
        "section_explore": "استكشف مدينتك",
        "section_reviews": "آراء مستخدمينا",
        "weather_title": "الطقس",
        "port_title": "الميناء",
        "port_status": "يعمل بشكل طبيعي",
        "action_emergency": "طوارئ",
        "action_transport": "مواصلات",
        "action_police": "شرطة",
        "action_ambulance": "إسعاف",
        "trending_pharmacy": "صيدلية طوارئ",
        "trending_cafe_sea": "كافيه فيو بحر",
        "trending_plumber": "سباك فوري",
        "explore_random_title": "هل زرت هذا المكان من قبل؟",
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
        "sub_rest_popular": "أكل شعبي",
        "sub_rest_homemade": "أكل بيتي",
        "sub_rest_grill": "مشويات",
        "sub_rest_seafood": "أسماك ومأكولات بحرية",
        "sub_rest_traditional": "كشري وفول وطعمية",
        "sub_rest_pizza": "بيتزا",
        "sub_rest_burger": "برجر",
        "sub_rest_fried_chicken": "فرايد تشيكن",
        "sub_rest_shawarma": "شاورما",
        "sub_rest_international": "مطابخ عالمية",
        "sub_rest_family": "مطاعم عائلية",
        "sub_rest_budget": "مطاعم اقتصادية",
        "sub_rest_luxury": "مطاعم فاخرة",
        "sub_rest_delivery_only": "مطاعم توصيل فقط",
        "sub_rest_open_24h": "مطاعم 24 ساعة",

        "sub_cafe_quiet": "كافيهات هادية",
        "sub_cafe_youth": "كافيهات للشباب",
        "sub_cafe_family": "كافيهات عائلية",
        "sub_cafe_sea_view": "كافيهات مطلة على البحر",
        "sub_cafe_gaming": "كافيهات ألعاب",
        "sub_cafe_study": "كافيهات مذاكرة",
        "sub_cafe_shisha": "كافيهات شيشة",
        "sub_cafe_no_shisha": "كافيهات بدون شيشة",
        "sub_cafe_open_24h": "كافيهات 24 ساعة",

        "sub_doc_internal": "باطنة",
        "sub_doc_pediatric": "أطفال",
        "sub_doc_obgyn": "نساء وتوليد",
        "sub_doc_dermatology": "جلدية",
        "sub_doc_dentist": "أسنان",
        "sub_doc_ophthalmology": "عيون",
        "sub_doc_orthopedic": "عظام",
        "sub_doc_neurology": "مخ وأعصاب",
        "sub_doc_cardiology": "قلب",
        "sub_doc_ent": "أنف وأذن",
        "sub_doc_psychiatry": "نفسية",
        "sub_doc_slimming": "تخسيس",
        "sub_doc_physiotherapy": "علاج طبيعي",
        "sub_doc_lab_xray": "تحاليل وأشعة",

        "sub_pharm_open_24h": "صيدليات 24 ساعة",
        "sub_pharm_insurance": "صيدليات تأمين",
        "sub_pharm_medical_supplies": "صيدليات مستلزمات طبية",
        "sub_pharm_cosmetics": "صيدليات مستحضرات تجميل",
        "sub_pharm_imported_meds": "صيدليات أدوية مستوردة",
        "sub_pharm_delivery": "صيدليات توصيل",
        "sub_pharm_emergency": "صيدليات طوارئ",

        "sub_shop_men_clothes": "ملابس رجالي",
        "sub_shop_women_clothes": "ملابس حريمي",
        "sub_shop_kids_clothes": "ملابس أطفال",
        "sub_shop_shoes": "أحذية",
        "sub_shop_bags_acc": "شنط وإكسسوارات",
        "sub_shop_electronics": "أجهزة كهربائية",
        "sub_shop_mobiles": "موبايلات",
        "sub_shop_computers": "كمبيوتر",
        "sub_shop_home_tools": "أدوات منزلية",
        "sub_shop_supermarket": "سوبر ماركت",
        "sub_shop_spices": "عطارة",
        "sub_shop_cosmetics": "مستحضرات تجميل",
        "sub_shop_jewelry": "ذهب وفضة",

        "sub_serv_plumber": "سباك",
        "sub_serv_electrician": "كهربائي",
        "sub_serv_carpenter": "نجار",
        "sub_serv_painter": "نقاش",
        "sub_serv_ac": "تكييف",
        "sub_serv_appliance_repair": "تصليح أجهزة",
        "sub_serv_mechanic": "ميكانيكي",
        "sub_serv_car_electric": "كهرباء سيارات",
        "sub_serv_towing": "ونش",
        "sub_serv_car_wash": "مغسلة سيارات",
        "sub_serv_oil_change": "تغيير زيت",
        "sub_serv_cleaning_co": "شركات نظافة",
        "sub_serv_pest_control": "مكافحة حشرات",
        "sub_serv_moving": "نقل عفش",
        "sub_serv_apt_maintenance": "صيانة شقق",
        "sub_serv_lawyer": "محامي",
        "sub_serv_accountant": "محاسب",
        "sub_serv_clearance": "مكاتب تخليص",
        "sub_serv_notary": "توثيق",
        
        
        "title_rest_popular": "أكل شعبي في السويس",
        "title_rest_homemade": "أكل بيتي في السويس",
        "title_rest_grill": "مطاعم مشويات في السويس",
        "title_rest_seafood": "مطاعم مأكولات بحرية في السويس",
        "title_rest_traditional": "كشري وفول وطعمية في السويس",
        "title_rest_pizza": "بيتزا في السويس",
        "title_rest_burger": "برجر في السويس",
        "title_rest_fried_chicken": "فرايد تشيكن في السويس",
        "title_rest_shawarma": "شاورما في السويس",
        "title_rest_international": "مطابخ عالمية في السويس",
        "title_rest_family": "مطاعم عائلية في السويس",
        "title_rest_budget": "مطاعم اقتصادية في السويس",
        "title_rest_luxury": "مطاعم فاخرة في السويس",
        "title_rest_delivery_only": "مطاعم توصيل فقط في السويس",
        "title_rest_open_24h": "مطاعم 24 ساعة في السويس",

        "title_cafe_quiet": "كافيهات هادئة في السويس",
        "title_cafe_youth": "كافيهات للشباب في السويس",
        "title_cafe_family": "كافيهات عائلية في السويس",
        "title_cafe_sea_view": "كافيهات على البحر في السويس",
        "title_cafe_gaming": "كافيهات ألعاب في السويس",
        "title_cafe_study": "كافيهات مذاكرة في السويس",
        "title_cafe_shisha": "كافيهات شيشة في السويس",
        "title_cafe_no_shisha": "كافيهات بدون شيشة في السويس",
        "title_cafe_open_24h": "كافيهات 24 ساعة في السويس",

        "title_doc_internal": "أطباء باطنة في السويس",
        "title_doc_pediatric": "أطباء أطفال في السويس",
        "title_doc_obgyn": "أطباء نساء وتوليد في السويس",
        "title_doc_dermatology": "أطباء جلدية في السويس",
        "title_doc_dentist": "أطباء أسنان في السويس",
        "title_doc_ophthalmology": "أطباء عيون في السويس",
        "title_doc_orthopedic": "أطباء عظام في السويس",
        "title_doc_neurology": "أطباء مخ وأعصاب في السويس",
        "title_doc_cardiology": "أطباء قلب في السويس",
        "title_doc_ent": "أطباء أنف وأذن في السويس",
        "title_doc_psychiatry": "أطباء نفسية في السويس",
        "title_doc_slimming": "أطباء تخسيس في السويس",
        "title_doc_physiotherapy": "علاج طبيعي في السويس",
        "title_doc_lab_xray": "معامل تحاليل وأشعة في السويس",

        "title_pharm_open_24h": "صيدليات 24 ساعة في السويس",
        "title_pharm_insurance": "صيدليات تأمين في السويس",
        "title_pharm_medical_supplies": "صيدليات مستلزمات طبية في السويس",
        "title_pharm_cosmetics": "صيدليات مستحضرات تجميل في السويس",
        "title_pharm_imported_meds": "صيدليات أدوية مستوردة في السويس",
        "title_pharm_delivery": "صيدليات توصيل في السويس",
        "title_pharm_emergency": "صيدليات طوارئ في السويس",

        "title_shop_men_clothes": "محلات ملابس رجالي في السويس",
        "title_shop_women_clothes": "محلات ملابس حريمي في السويس",
        "title_shop_kids_clothes": "محلات ملابس أطفال في السويس",
        "title_shop_shoes": "محلات أحذية في السويس",
        "title_shop_bags_acc": "شنط وإكسسوارات في السويس",
        "title_shop_electronics": "أجهزة كهربائية في السويس",
        "title_shop_mobiles": "موبايلات في السويس",
        "title_shop_computers": "كمبيوتر في السويس",
        "title_shop_home_tools": "أدوات منزلية في السويس",
        "title_shop_supermarket": "سوبر ماركت في السويس",
        "title_shop_spices": "عطارة في السويس",
        "title_shop_cosmetics": "مستحضرات تجميل في السويس",
        "title_shop_jewelry": "ذهب وفضة في السويس",

        "title_serv_plumber": "سباكين في السويس",
        "title_serv_electrician": "كهربائيين في السويس",
        "title_serv_carpenter": "نجارين في السويس",
        "title_serv_painter": "نقاشين في السويس",
        "title_serv_ac": "فنيين تكييف في السويس",
        "title_serv_appliance_repair": "تصليح أجهزة في السويس",
        "title_serv_mechanic": "ميكانيكية في السويس",
        "title_serv_car_electric": "كهرباء سيارات في السويس",
        "title_serv_towing": "ونش إنقاذ في السويس",
        "title_serv_car_wash": "مغاسل سيارات في السويس",
        "title_serv_oil_change": "تغيير زيت في السويس",
        "title_serv_cleaning_co": "شركات نظافة في السويس",
        "title_serv_pest_control": "مكافحة حشرات في السويس",
        "title_serv_moving": "نقل عفش في السويس",
        "title_serv_apt_maintenance": "صيانة شقق في السويس",
        "title_serv_lawyer": "محامين في السويس",
        "title_serv_accountant": "محاسبين في السويس",
        "title_serv_clearance": "مكاتب تخليص في السويس",
        "title_serv_notary": "توثيق في السويس",
        
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
        "sub_eme_hospitals": "مستشفيات طوارئ", "sub_eme_ambulance": "إسعاف خاص", "sub_eme_pharm_24h": "صيدليات 24 ساعة", "sub_eme_doctors": "أطباء طوارئ", "sub_eme_vinch": "ونش سيارات", "sub_eme_mainten": "كهربائي/سباك طوارئ", "sub_eme_locks": "فتح أقفال", "sub_eme_gas": "بنزينات",
        "sub_hom_nursery": "حضانات", "sub_hom_schools": "مدارس", "sub_hom_centers": "مراكز تعليم", "sub_hom_ngo": "جمعيات", "sub_hom_clubs": "نوادي", "sub_hom_gym": "جيمات", "sub_hom_slimming": "مراكز تخسيس", "sub_hom_laundry": "مغاسل", "sub_hom_cleaning": "شركات نظافة", "sub_hom_furniture": "مفروشات", "sub_hom_utils": "أدوات منزلية",
        "sub_car_mech": "ورش ميكانيكا", "sub_car_elec": "كهرباء سيارات", "sub_car_tires": "كاوتش", "sub_car_oil": "زيوت", "sub_car_maint": "مراكز صيانة", "sub_car_wash": "مغاسل سيارات", "sub_car_parts": "قطع غيار", "sub_car_accs": "كماليات", "sub_car_insur": "تأمين سيارات", "sub_car_school": "مدارس قيادة",
        "sub_job_ads": "وظائف متاحة", "sub_job_train": "تدريب", "sub_job_offices": "مكاتب توظيف", "sub_job_accs": "محاسبين", "sub_job_lawyers": "محامين", "sub_job_clear": "مكاتب تخليص", "sub_job_ship": "شركات شحن", "sub_job_free": "أعمال حرة", "sub_job_online": "خدمات أونلاين",
        "sub_edu_centers": "سناتر", "sub_edu_lang": "كورسات لغات", "sub_edu_code": "برمجة", "sub_edu_design": "تصميم", "sub_edu_craft": "تعليم حرف", "sub_edu_tutor": "دروس خصوصية", "sub_edu_lib": "مكتبات", "sub_edu_tools": "أدوات تعليمية",
        "sub_eve_halls": "قاعات أفراح", "sub_eve_kosha": "كوش", "sub_eve_dj": "دي جي", "sub_eve_photo": "تصوير", "sub_eve_cate": "كاترينج", "sub_eve_plan": "تنظيم حفلات", "sub_eve_ballo": "بالونات وزينة", "sub_eve_rent": "تأجير معدات",
        "sub_tou_spots": "أماكن سياحية", "sub_tou_hotels": "فنادق", "sub_tou_apart": "شقق فندقية", "sub_tou_trips": "رحلات", "sub_tou_boats": "مراكب", "sub_tou_day": "جولات يوم واحد", "sub_tou_prog": "برامج سياحية",
        "sub_gov_offices": "مصالح حكومية", "sub_gov_times": "عناوين وأوقات عمل", "sub_gov_papers": "أوراق مطلوبة", "sub_gov_steps": "خطوات الإجراءات", "sub_gov_phones": "أرقام تليفونات", "sub_gov_comp": "شكاوى",
        "sub_sel_top10": "أحسن 10 أماكن", "sub_sel_cheap5": "أرخص 5", "sub_sel_family": "أنسب للعيلة", "sub_sel_budget": "حسب الميزانية", "sub_sel_time": "حسب الوقت", "sub_sel_dist": "حسب القرب",
        "title_cafe_original": "كافيهات السويس",

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
        "nav_account": "My Account",
        "nav_contact": "Contact Us",
        "section_latest": "Latest Additions",
        "section_offers": "Special Offers 🔥",
        "section_quick": "Quick Actions",
        "section_info": "Suez Today",
        "section_trending": "Trending Now",
        "section_explore": "Explore Your City",
        "section_reviews": "User Reviews",
        "weather_title": "Weather",
        "port_title": "Port Status",
        "port_status": "Operating Normally",
        "action_emergency": "Emergency",
        "action_transport": "Transport",
        "action_police": "Police",
        "action_ambulance": "Ambulance",
        "trending_pharmacy": "24h Pharmacy",
        "trending_cafe_sea": "Sea View Cafe",
        "trending_plumber": "Fast Plumber",
        "explore_random_title": "Have you visited this place?",
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
        "sub_rest_popular": "Popular Food",
        "sub_rest_homemade": "Homemade Food",
        "sub_rest_grill": "Grill",
        "sub_rest_seafood": "Seafood",
        "sub_rest_traditional": "Koshary & Foul",
        "sub_rest_pizza": "Pizza",
        "sub_rest_burger": "Burger",
        "sub_rest_fried_chicken": "Fried Chicken",
        "sub_rest_shawarma": "Shawarma",
        "sub_rest_international": "International Cuisines",
        "sub_rest_family": "Family Restaurants",
        "sub_rest_budget": "Budget Friendly",
        "sub_rest_luxury": "Luxury Dining",
        "sub_rest_delivery_only": "Delivery Only",
        "sub_rest_open_24h": "24 Hours Restaurants",

        "sub_cafe_quiet": "Quiet Cafes",
        "sub_cafe_youth": "Youth Spots",
        "sub_cafe_family": "Family Cafes",
        "sub_cafe_sea_view": "Sea View Cafes",
        "sub_cafe_gaming": "Gaming Cafes",
        "sub_cafe_study": "Study Spaces",
        "sub_cafe_shisha": "Shisha Cafes",
        "sub_cafe_no_shisha": "No-Shisha Cafes",
        "sub_cafe_open_24h": "24 Hours Cafes",

        "sub_doc_internal": "Internal Med",
        "sub_doc_pediatric": "Pediatrics",
        "sub_doc_obgyn": "Obstetrics & Gynecology",
        "sub_doc_dermatology": "Dermatology",
        "sub_doc_dentist": "Dentistry",
        "sub_doc_ophthalmology": "Ophthalmology",
        "sub_doc_orthopedic": "Orthopedic",
        "sub_doc_neurology": "Neurology",
        "sub_doc_cardiology": "Cardiology",
        "sub_doc_ent": "ENT Specialist",
        "sub_doc_psychiatry": "Psychiatry",
        "sub_doc_slimming": "Slimming & Nutrition",
        "sub_doc_physiotherapy": "Physiotherapy",
        "sub_doc_lab_xray": "Labs & X-Rays",

        "sub_pharm_open_24h": "24-Hour Pharmacies",
        "sub_pharm_insurance": "Health Insurance",
        "sub_pharm_medical_supplies": "Medical Supplies",
        "sub_pharm_cosmetics": "Cosmetic Pharmacies",
        "sub_pharm_imported_meds": "Imported Medicines",
        "sub_pharm_delivery": "Home Delivery",
        "sub_pharm_emergency": "Emergency Pharmacies",

        "sub_shop_men_clothes": "Men Clothing",
        "sub_shop_women_clothes": "Women Clothing",
        "sub_shop_kids_clothes": "Kids Clothing",
        "sub_shop_shoes": "Shoe Stores",
        "sub_shop_bags_acc": "Bags & Accessories",
        "sub_shop_electronics": "Electronics",
        "sub_shop_mobiles": "Mobiles",
        "sub_shop_computers": "Computers",
        "sub_shop_home_tools": "Home Utilities",
        "sub_shop_supermarket": "Supermarkets",
        "sub_shop_spices": "Spices & Herbs",
        "sub_shop_cosmetics": "Cosmetics",
        "sub_shop_jewelry": "Gold & Silver",

        "sub_serv_plumber": "Plumber",
        "sub_serv_electrician": "Electrician",
        "sub_serv_carpenter": "Carpenter",
        "sub_serv_painter": "Painter",
        "sub_serv_ac": "AC Services",
        "sub_serv_appliance_repair": "Appliance Repair",
        "sub_serv_mechanic": "Mechanic",
        "sub_serv_car_electric": "Car Electric",
        "sub_serv_towing": "Towing",
        "sub_serv_car_wash": "Car Wash",
        "sub_serv_oil_change": "Oil Change",
        "sub_serv_cleaning_co": "Cleaning Co.",
        "sub_serv_pest_control": "Pest Control",
        "sub_serv_moving": "Furniture Moving",
        "sub_serv_apt_maintenance": "Apt Maintenance",
        "sub_serv_lawyer": "Lawyer",
        "sub_serv_accountant": "Accountant",
        "sub_serv_clearance": "Customs Clearance",
        "sub_serv_notary": "Notary",
        
        
        "title_rest_popular": "Popular food in Suez",
        "title_rest_homemade": "Homemade food in Suez",
        "title_rest_grill": "Grill restaurants in Suez",
        "title_rest_seafood": "Seafood restaurants in Suez",
        "title_rest_traditional": "Koshary & Foul in Suez",
        "title_rest_pizza": "Pizza in Suez",
        "title_rest_burger": "Burger in Suez",
        "title_rest_fried_chicken": "Fried chicken in Suez",
        "title_rest_shawarma": "Shawarma in Suez",
        "title_rest_international": "International cuisines in Suez",
        "title_rest_family": "Family restaurants in Suez",
        "title_rest_budget": "Budget friendly in Suez",
        "title_rest_luxury": "Luxury dining in Suez",
        "title_rest_delivery_only": "Delivery only in Suez",
        "title_rest_open_24h": "24 Hours Restaurants in Suez",

        "title_cafe_quiet": "Quiet spaces in Suez",
        "title_cafe_youth": "Youth spots in Suez",
        "title_cafe_family": "Family cafes in Suez",
        "title_cafe_sea_view": "Sea view cafes in Suez",
        "title_cafe_gaming": "Gaming cafes in Suez",
        "title_cafe_study": "Study spaces in Suez",
        "title_cafe_shisha": "Shisha cafes in Suez",
        "title_cafe_no_shisha": "No-shisha cafes in Suez",
        "title_cafe_open_24h": "24 Hours Cafes in Suez",

        "title_doc_internal": "Internal Medicine in Suez",
        "title_doc_pediatric": "Pediatricians in Suez",
        "title_doc_obgyn": "Obstetrics & Gynecology in Suez",
        "title_doc_dermatology": "Dermatology in Suez",
        "title_doc_dentist": "Dentists in Suez",
        "title_doc_ophthalmology": "Ophthalmology in Suez",
        "title_doc_orthopedic": "Orthopedists in Suez",
        "title_doc_neurology": "Neurology in Suez",
        "title_doc_cardiology": "Cardiology in Suez",
        "title_doc_ent": "ENT Specialist in Suez",
        "title_doc_psychiatry": "Psychiatry in Suez",
        "title_doc_slimming": "Slimming & Nutrition in Suez",
        "title_doc_physiotherapy": "Physiotherapy in Suez",
        "title_doc_lab_xray": "Labs & X-Rays in Suez",

        "title_pharm_open_24h": "24-Hour Pharmacies in Suez",
        "title_pharm_insurance": "Insurance Pharmacies in Suez",
        "title_pharm_medical_supplies": "Medical Supplies in Suez",
        "title_pharm_cosmetics": "Cosmetics Pharmacies in Suez",
        "title_pharm_imported_meds": "Imported Medicines in Suez",
        "title_pharm_delivery": "Delivery Pharmacies in Suez",
        "title_pharm_emergency": "Emergency Pharmacies in Suez",

        "title_shop_men_clothes": "Men Clothing in Suez",
        "title_shop_women_clothes": "Women Clothing in Suez",
        "title_shop_kids_clothes": "Kids Clothing in Suez",
        "title_shop_shoes": "Shoe Stores in Suez",
        "title_shop_bags_acc": "Bags & Accessories in Suez",
        "title_shop_electronics": "Electronics in Suez",
        "title_shop_mobiles": "Mobiles in Suez",
        "title_shop_computers": "Computers in Suez",
        "title_shop_home_tools": "Home Utilities in Suez",
        "title_shop_supermarket": "Supermarkets in Suez",
        "title_shop_spices": "Spices & Herbs in Suez",
        "title_shop_cosmetics": "Cosmetics in Suez",
        "title_shop_jewelry": "Gold & Silver in Suez",

        "title_serv_plumber": "Plumbers in Suez",
        "title_serv_electrician": "Electricians in Suez",
        "title_serv_carpenter": "Carpenters in Suez",
        "title_serv_painter": "Painters in Suez",
        "title_serv_ac": "AC Technicians in Suez",
        "title_serv_appliance_repair": "Appliance Repair in Suez",
        "title_serv_mechanic": "Mechanics in Suez",
        "title_serv_car_electric": "Car Electric in Suez",
        "title_serv_towing": "Towing Services in Suez",
        "title_serv_car_wash": "Car Wash in Suez",
        "title_serv_oil_change": "Oil Change in Suez",
        "title_serv_cleaning_co": "Cleaning Companies in Suez",
        "title_serv_pest_control": "Pest Control in Suez",
        "title_serv_moving": "Moving Services in Suez",
        "title_serv_apt_maintenance": "Apt Maintenance in Suez",
        "title_serv_lawyer": "Lawyers in Suez",
        "title_serv_accountant": "Accountants in Suez",
        "title_serv_clearance": "Clearance Offices in Suez",
        "title_serv_notary": "Notary in Suez",
        
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
        "sub_eme_hospitals": "ER Hospitals", "sub_eme_ambulance": "Private Ambulance", "sub_eme_pharm_24h": "24h Pharmacies", "sub_eme_doctors": "ER Doctors", "sub_eme_vinch": "Car Towing", "sub_eme_mainten": "ER Electr/Plumb", "sub_eme_locks": "Locksmith", "sub_eme_gas": "Gas Stations",
        "sub_hom_nursery": "Nurseries", "sub_hom_schools": "Schools", "sub_hom_centers": "Edu Centers", "sub_hom_ngo": "NGOs", "sub_hom_clubs": "Clubs", "sub_hom_gym": "Gyms", "sub_hom_slimming": "Weight Loss", "sub_hom_laundry": "Laundries", "sub_hom_cleaning": "Cleaning Co", "sub_hom_furniture": "Furniture", "sub_hom_utils": "Housewares",
        "sub_car_mech": "Mechanics", "sub_car_elec": "Car Electrics", "sub_car_tires": "Tires", "sub_car_oil": "Oil", "sub_car_maint": "Maint Centers", "sub_car_wash": "Car Wash", "sub_car_parts": "Spare Parts", "sub_car_accs": "Accessories", "sub_car_insur": "Car Insurance", "sub_car_school": "Driving Schools",
        "sub_job_ads": "Available Jobs", "sub_job_train": "Training", "sub_job_offices": "Recruit Offices", "sub_job_accs": "Accountants", "sub_job_lawyers": "Lawyers", "sub_job_clear": "Clear Offices", "sub_job_ship": "Shipping Co", "sub_job_free": "Freelance", "sub_job_online": "Online Services",
        "sub_edu_centers": "Centers", "sub_edu_lang": "Lang Courses", "sub_edu_code": "Programming", "sub_edu_design": "Design", "sub_edu_craft": "Crafts", "sub_edu_tutor": "Tutoring", "sub_edu_lib": "Libraries", "sub_edu_tools": "Edu Tools",
        "sub_eve_halls": "Wedding Halls", "sub_eve_kosha": "Koshas", "sub_eve_dj": "DJ", "sub_eve_photo": "Photography", "sub_eve_cate": "Catering", "sub_eve_plan": "Party Planning", "sub_eve_ballo": "Balloons", "sub_eve_rent": "Equipment Rental",
        "sub_tou_spots": "Tourist Spots", "sub_tou_hotels": "Hotels", "sub_tou_apart": "Hotel Aparts", "sub_tou_trips": "Trips", "sub_tou_boats": "Boats", "sub_tou_day": "Day Tours", "sub_tou_prog": "Tour Programs",
        "sub_gov_offices": "Gov Offices", "sub_gov_times": "Work Hours", "sub_gov_papers": "Required Papers", "sub_gov_steps": "Procedures", "sub_gov_phones": "Phone Numbers", "sub_gov_comp": "Complaints",
        "sub_sel_top10": "Top 10 Places", "sub_sel_cheap5": "Cheapest 5", "sub_sel_family": "Family Best", "sub_sel_budget": "By Budget", "sub_sel_time": "By Time", "sub_sel_dist": "By Distance",
        "title_cafe_original": "Cafes in Suez",

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
