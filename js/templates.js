// templates.js

function t(key) {
    if (typeof translations === "undefined") return key;
    const lang = document.documentElement.lang || "ar";
    return translations[lang][key] || key;
}

function placeCard(place) {
    var imageUrl = place.image;
    
    // تحديد المسار الأساسي بناءً على مكان الصفحة
    var isHome = window.location.pathname === "/" || window.location.pathname.endsWith("index.html") || window.location.pathname === "" || window.location.pathname.endsWith("suez_guide/");
    var basePath = isHome ? "" : "../";
    
    // Demo images from Unsplash (Premium Collection)
    if (place.category === "restaurants") {
        imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop";
    } else if (place.category === "cafes") {
        imageUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop";
    } else if (place.category === "doctors") {
        imageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=450&fit=crop";
    } else if (place.category === "pharmacies") {
        imageUrl = "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&h=450&fit=crop";
    } else if (place.category === "services") {
        imageUrl = "https://images.unsplash.com/photo-1530124560676-1ad26e92796e?w=600&h=450&fit=crop";
    }
    
    return '<div class="listing-card">' +
        '<div style="position:relative">' +
            '<img class="listing-img" src="' + imageUrl + '" alt="' + place.name + '">' +
            '<div style="position:absolute; top:12px; left:12px; background:var(--primary); color:#fff; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:700">' + getCategoryName(place.category) + '</div>' +
        '</div>' +
        '<div class="listing-body">' +
            '<h4>' + place.name + '</h4>' +
            '<div class="listing-meta">' +
                '<div class="meta-info"><i data-lucide="map-pin"></i> <span>' + place.address + '</span></div>' +
            '</div>' +
            '<a href="' + basePath + 'places/' + place.slug + '.html" style="display:inline-block; margin-top:16px; color:var(--primary); font-weight:700; font-size:13px; text-decoration:none">' + (document.documentElement.lang === 'en' ? 'Full Details →' : 'التفاصيل الكاملة ←') + '</a>' +
        '</div>' +
    '</div>';
}

function getCategoryName(cat) {
    const lang = document.documentElement.lang || "ar";
    var names = {
        ar: {
            "restaurants": "مطعم",
            "cafes": "كافيه",
            "doctors": "عيادة",
            "pharmacies": "صيدلية",
            "shops": "محل",
            "services": "خدمة"
        },
        en: {
            "restaurants": "Restaurant",
            "cafes": "Cafe",
            "doctors": "Clinic",
            "pharmacies": "Pharmacy",
            "shops": "Shop",
            "services": "Service"
        }
    };
    return names[lang][cat] || cat;
}
