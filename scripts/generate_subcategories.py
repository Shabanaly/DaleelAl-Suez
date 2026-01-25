import os

# Configuration: mapping departments to their new subcategories
taxonomy = {
    "restaurants": [
        "popular", "homemade", "grill", "seafood", "traditional", "pizza", "burger",
        "fried_chicken", "shawarma", "international", "family", "budget", "luxury",
        "delivery_only", "open_24h"
    ],
    "cafes": [
        "quiet", "youth", "family", "sea_view", "gaming", "study", "shisha", "no_shisha", "open_24h"
    ],
    "doctors": [
        "internal", "pediatric", "obgyn", "dermatology", "dentist", "ophthalmology",
        "orthopedic", "neurology", "cardiology", "ent", "psychiatry", "slimming",
        "physiotherapy", "lab_xray"
    ],
    "pharmacies": [
        "open_24h", "insurance", "medical_supplies", "cosmetics", "imported_meds", "delivery", "emergency"
    ],
    "shops": [
        "men_clothes", "women_clothes", "kids_clothes", "shoes", "bags_acc", "electronics",
        "mobiles", "computers", "home_tools", "supermarket", "spices", "cosmetics", "jewelry"
    ],
    "services": [
        "plumber", "electrician", "carpenter", "painter", "ac", "appliance_repair",
        "mechanic", "car_electric", "towing", "car_wash", "oil_change", "cleaning_co",
        "pest_control", "moving", "apt_maintenance", "lawyer", "accountant", "clearance", "notary"
    ]
}

# Mapping for the i18n keys and file naming
dept_map = {
    "restaurants": "rest",
    "cafes": "cafe",
    "doctors": "doc",
    "pharmacies": "pharm",
    "shops": "shop",
    "services": "serv"
}

# HTML Template (based on the existing structure)
template = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="title_{dept_short}_{sub_id}">{sub_id} - {dept_name}</title>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/responsive.css">
    <script src="../js/theme.js"></script>
    <script src="../js/i18n.js"></script>
</head>
<body>
    <header class="site-header">
        <a href="../index.html" class="logo">
            <i data-lucide="compass"></i>
            <span data-i18n="app_name">دليل <span>السويس</span></span>
        </a>
        <nav class="top-nav">
            <a href="../index.html" class="top-nav-link" data-i18n="nav_home">الرئيسية</a>
            <a href="../categories/restaurants.html" class="top-nav-link active" data-i18n="nav_categories">الأقسام</a>
            <a href="../pages/favorites.html" class="top-nav-link" data-i18n="nav_favorites">المفضلة</a>
            <a href="#" class="top-nav-link" data-i18n="nav_account">حسابي</a>
            <a href="../pages/contact.html" class="top-nav-link" data-i18n="nav_contact">تواصل معنا</a>
            <button class="top-nav-link" onclick="toggleLanguage()" id="lang-toggle">English</button>
            <button class="theme-toggle-btn" onclick="toggleTheme()" id="theme-toggle">
                <i data-lucide="sun" class="theme-toggle-icon"></i>
            </button>
        </nav>
    </header>

    <main>
        <section class="categories-nav-section">
            <div class="nav-scroll-wrapper">
                <div class="categories-container" id="global-cats"></div>
            </div>
        </section>

        <section class="section-wrapper">
            <div class="section-head">
                <h1 data-i18n="title_{dept_short}_{sub_id}">{sub_id}</h1>
            </div>
            
            <div class="sub-nav">
                <a href="../categories/{dept}.html" data-i18n="sub_all">الكل</a>
                {sub_nav_links}
            </div>

            <div id="places-container" class="places-list"></div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-brand">
                <h4 data-i18n="app_name">دليل السويس</h4>
                <p data-i18n="footer_desc">المنصة الأكبر والأكثر موثوقية لاكتشاف مدينة السويس.</p>
            </div>
            <div class="footer-links">
                <h5 data-i18n="footer_quick_links">روابط سريعة</h5>
                <ul>
                    <li><a href="../pages/about.html" data-i18n="footer_about">عن الموقع</a></li>
                    <li><a href="../pages/terms.html" data-i18n="footer_terms">الشروط</a></li>
                    <li><a href="../pages/privacy.html" data-i18n="footer_privacy">الخصوصية</a></li>
                    <li><a href="../pages/contact.html" data-i18n="nav_contact">تواصل معنا</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom"><p data-i18n="footer_copyright">© 2025 دليل السويس.</p></div>
    </footer>

    <nav class="bottom-nav" id="bottom-nav-container"></nav>

    <script src="../js/data/{dept}.js"></script>
    <script src="../js/templates.js"></script>
    <script src="../js/render.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            if (typeof {dept} !== 'undefined') {{
                const filtered = {dept}.filter(p => p.subCategory === '{sub_id}');
                renderPlaces(filtered, 'places-container');
            }}
        }});
        lucide.createIcons();
    </script>
    <script src="../js/favorites.js"></script>
    <script src="../js/main.js"></script>
</body>
</html>"""

def generate():
    output_dir = "subcategories"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for dept, subs in taxonomy.items():
        dept_short = dept_map[dept]
        
        for sub_id in subs:
            # Generate sub-nav links for this page
            nav_links = []
            for other_sub in subs:
                is_active = ' class="active"' if other_sub == sub_id else ''
                nav_links.append(f'<a href="{dept}-{other_sub}.html"{is_active} data-i18n="sub_{dept_short}_{other_sub}">{other_sub}</a>')
            
            sub_nav_html = "\                ".join(nav_links)
            
            filename = f"{dept}-{sub_id}.html"
            file_path = os.path.join(output_dir, filename)
            
            content = template.format(
                dept=dept,
                dept_short=dept_short,
                dept_name=dept.capitalize(),
                sub_id=sub_id,
                sub_nav_links=sub_nav_html
            )
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Generated: {filename}")

if __name__ == "__main__":
    generate()
