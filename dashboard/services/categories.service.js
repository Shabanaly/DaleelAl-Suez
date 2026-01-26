// Categories Service
// Handles Category Definitions (Static for now, but built to be dynamic)

const CategoriesService = {
    // Return the mapping structure we defined earlier
    getStructure: () => {
        return {
            restaurants: {
                label: "مطاعم",
                icon: "utensils",
                subs: [
                    { id: 'grill', label: 'مشويات' },
                    { id: 'seafood', label: 'مأكولات بحرية' },
                    { id: 'pizza', label: 'بيتزا وفطائر' },
                    { id: 'burger', label: 'برجر' },
                    { id: 'fried_chicken', label: 'فرايد تشيكن' },
                    { id: 'shawarma', label: 'شاورما وسوري' },
                    { id: 'traditional', label: 'أكل شعبي' },
                    { id: 'homemade', label: 'أكل بيتي' },
                    { id: 'international', label: 'أكل غربي' },
                    { id: 'luxury', label: 'اوبن بوفيه/فاخر' },
                    { id: 'budget', label: 'على قد اليد' },
                    { id: 'family', label: 'عائلي' },
                    { id: 'open_24h', label: 'مفتوح 24 ساعة' },
                    { id: 'delivery_only', label: 'دليفري فقط' }
                ]
            },
            cafes: {
                label: "كافيهات",
                icon: "coffee",
                subs: [
                    { id: 'youth', label: 'شبابي' },
                    { id: 'family', label: 'عائلي' },
                    { id: 'sea_view', label: 'على البحر' },
                    { id: 'quiet', label: 'هادئ للمذاكرة' },
                    { id: 'gaming', label: 'بلاستيشن' },
                    { id: 'shisha', label: 'يوجد شيشة' },
                    { id: 'no_shisha', label: 'لا يوجد شيشة' },
                    { id: 'open_24h', label: 'مفتوح 24 ساعة' }
                ]
            },
            shops: {
                label: "محلات وتسوق",
                icon: "shopping-bag",
                subs: [
                    { id: 'men_clothes', label: 'ملابس رجالي' },
                    { id: 'women_clothes', label: 'ملابس حريمي' },
                    { id: 'kids_clothes', label: 'ملابس أطفال' },
                    { id: 'shoes', label: 'أحذية وشنط' },
                    { id: 'cosmetics', label: 'مستحضرات تجميل' },
                    { id: 'accessories', label: 'إكسسوارات وهدايا' },
                    { id: 'jewelry', label: 'ذهب ومجوهرات' },
                    { id: 'electronics', label: 'إلكترونيات' },
                    { id: 'mobiles', label: 'موبايلات' },
                    { id: 'computers', label: 'كمبيوتر ولابتوب' },
                    { id: 'home_tools', label: 'أدوات منزلية' },
                    { id: 'supermarket', label: 'سوبر ماركت' },
                    { id: 'spices', label: 'عطارة' }
                ]
            },
            doctors: {
                label: "أطباء وعيادات",
                icon: "stethoscope",
                subs: [
                    { id: 'internal', label: 'باطنة' },
                    { id: 'pediatric', label: 'أطفال' },
                    { id: 'dentist', label: 'أسنان' },
                    { id: 'dermatology', label: 'جلدية' },
                    { id: 'obgyn', label: 'نساء وتوليد' },
                    { id: 'orthopedic', label: 'عظام' },
                    { id: 'ophthalmology', label: 'عيون' },
                    { id: 'ent', label: 'أنف وأذن' },
                    { id: 'cardiology', label: 'قلب وأوعية' },
                    { id: 'neurology', label: 'مخ وأعصاب' },
                    { id: 'psychiatry', label: 'نفسية وعصبية' },
                    { id: 'physiotherapy', label: 'علاج طبيعي' },
                    { id: 'slimming', label: 'تخسيس وتغذية' },
                    { id: 'lab_xray', label: 'معامل وأشعة' }
                ]
            },
            pharmacies: {
                label: "صيدليات",
                icon: "pill",
                subs: [
                    { id: 'open_24h', label: 'مفتوحة 24 ساعة' },
                    { id: 'delivery', label: 'توصيل منازل' },
                    { id: 'medical_supplies', label: 'مستلزمات طبية' },
                    { id: 'cosmetics', label: 'مستحضرات تجميل' },
                    { id: 'imported_meds', label: 'أدوية مستوردة' },
                    { id: 'insurance', label: 'تعاقدات تأمين' },
                    { id: 'emergency', label: 'إسعافات أولية' }
                ]
            },
            services: {
                label: "خدمات وصنايعية",
                icon: "wrench",
                subs: [
                    { id: 'plumber', label: 'سباك' },
                    { id: 'electrician', label: 'كهربائي' },
                    { id: 'carpenter', label: 'نجار' },
                    { id: 'painter', label: 'نقاش' },
                    { id: 'ac', label: 'تكييف وتبريد' },
                    { id: 'appliance_repair', label: 'صيانة أجهزة' },
                    { id: 'pest_control', label: 'مكافحة حشرات' },
                    { id: 'imoving', label: 'نقل عفش' },
                    { id: 'cleaning_co', label: 'شركات نظافة' },
                    { id: 'car_wash', label: 'غسيل سيارات' },
                    { id: 'mechanic', label: 'ميكانيكي' },
                    { id: 'car_electric', label: 'كهربائي سيارات' },
                    { id: 'oil_change', label: 'تغيير زيت' }
                ]
            },
             education: {
                label: "تعليم وكورسات",
                icon: "graduation-cap",
                subs: [
                    { id: 'centers', label: 'سناتر تعليمية' },
                    { id: 'lang', label: 'لغات' },
                    { id: 'code', label: 'برمجة وجرافيك' },
                    { id: 'design', label: 'تصميم وفنون' },
                    { id: 'tutor', label: 'مدرسين خصوصي' },
                    { id: 'lib', label: 'مكتبات' },
                    { id: 'tools', label: 'أدوات مدرسية' },
                    { id: 'craft', label: 'ورش فنية' }
                ]
            },
            emergency: {
                label: "طوارئ",
                icon: "alert-circle",
                subs: [
                    { id: 'hospitals', label: 'مستشفيات' },
                    { id: 'pharm_24h', label: 'صيدليات 24 ساعة' },
                    { id: 'ambulance', label: 'إسعاف' },
                    { id: 'doctors', label: 'أطباء طوارئ' },
                    { id: 'gas', label: 'طوارئ الغاز' },
                    { id: 'locks', label: 'فتح أقفال' },
                    { id: 'mainten', label: 'صيانة طارئة' },
                    { id: 'vinch', label: 'ونش إنقاذ' }
                ]
            },
            events: {
                label: "مناسبات وأفراح",
                icon: "cake",
                subs: [
                    { id: 'halls', label: 'قاعات أفراح' },
                    { id: 'plan', label: 'Wedding Planners' },
                    { id: 'photo', label: 'فوتوجرافر' },
                    { id: 'dj', label: 'DJ و Sound System' },
                    { id: 'cate', label: 'بوفيه وضيافة' },
                    { id: 'kosha', label: 'كوشة وديكور' },
                    { id: 'rent', label: 'تأجير كراسي' },
                    { id: 'ballo', label: 'بالون وديكور' }
                ]
            },
            government: {
                label: "خدمات حكومية",
                icon: "landmark",
                subs: [
                    { id: 'offices', label: 'مكاتب ومصالح' },
                    { id: 'times', label: 'مواعيد عمل' },
                    { id: 'papers', label: 'أوراق ومستندات' },
                    { id: 'steps', label: 'إجراءات وخطوات' },
                    { id: 'phones', label: 'أرقام هامة' },
                    { id: 'comp', label: 'شكاوى ومقترحات' }
                ]
            },
            "home-living": {
                label: "منزل ومعيشة",
                icon: "home",
                subs: [
                    { id: 'furniture', label: 'أثاث وديكور' },
                    { id: 'cleaning', label: 'أدوات نظافة' },
                    { id: 'laundry', label: 'دراي كلين' },
                    { id: 'nursery', label: 'حضانات' },
                    { id: 'schools', label: 'مدارس' },
                    { id: 'gym', label: 'جيم ولياقة' },
                    { id: 'clubs', label: 'نوادي' },
                    { id: 'slimming', label: 'مراكز تخسيس' },
                    { id: 'centers', label: 'مراكز مجتمعية' },
                    { id: 'ngo', label: 'جمعيات خيرية' },
                    { id: 'utils', label: 'خدمات مرافق' }
                ]
            },
            jobs: {
                label: "وظائف وأعمال",
                icon: "briefcase",
                subs: [
                    { id: 'ads', label: 'إعلانات وظائف' },
                    { id: 'free', label: 'عمل حر / Freelance' },
                    { id: 'online', label: 'عمل من المنزل' },
                    { id: 'train', label: 'تدريب مهني' },
                    { id: 'offices', label: 'مكاتب توظيف' },
                    { id: 'accs', label: 'محاسبين' },
                    { id: 'lawyers', label: 'محامين' },
                    { id: 'clear', label: 'تخليص جمركي' },
                    { id: 'ship', label: 'شحن ونقل' }
                ]
            },
            tourism: {
                label: "سياحة وسفر",
                icon: "palmtree",
                subs: [
                    { id: 'hotels', label: 'فنادق' },
                    { id: 'spots', label: 'مزارات سياحية' },
                    { id: 'day', label: 'داي يوز' },
                    { id: 'trips', label: 'رحلات داخلية' },
                    { id: 'prog', label: 'برامج سياحية' },
                    { id: 'boats', label: 'يخوت ومراكب' },
                    { id: 'apart', label: 'شقق مصيفية' }
                ]
            },
             cars: {
                label: "خدمات السيارات",
                icon: "car",
                subs: [
                    { id: 'wash', label: 'مغسلة' },
                    { id: 'maint', label: 'مركز صيانة' },
                    { id: 'mech', label: 'ميكانيكا' },
                    { id: 'elec', label: 'كهرباء' },
                    { id: 'oil', label: 'زيوت وفلاتر' },
                    { id: 'tires', label: 'إطارات وبطاريات' },
                    { id: 'parts', label: 'قطع غيار' },
                    { id: 'accs', label: 'كماليات' },
                    { id: 'insur', label: 'تأمين' },
                    { id: 'school', label: 'تعليم قيادة' }
                ]
            },
             entertainment: {
                label: "ترفيه وخروجات",
                icon: "clapperboard",
                subs: [
                    { id: 'cinemas', label: 'سينما' },
                    { id: 'parks', label: 'حدائق ومنتزهات' },
                    { id: 'malahi', label: 'ملاهي وألعاب' },
                    { id: 'gaming', label: 'Gaming Centers' },
                    { id: 'beaches', label: 'شواطئ وقرى' },
                    { id: 'photo', label: 'سيشن تصوير' }
                ]
            }
        };
    },

    getAll: () => {
        const structure = CategoriesService.getStructure();
        return Object.keys(structure).map(key => ({
            id: key,
            ...structure[key]
        }));
    },

    getSubs: (mainCatId) => {
        const structure = CategoriesService.getStructure();
        return structure[mainCatId] ? structure[mainCatId].subs : [];
    }
};

window.CategoriesService = CategoriesService;
