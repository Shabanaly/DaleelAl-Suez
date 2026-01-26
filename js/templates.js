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
    
    // Use real image or fallback
    if (!imageUrl && place.image_url) imageUrl = place.image_url;
    if (!imageUrl) imageUrl = "https://via.placeholder.com/600x450?text=No+Image";
    
    const isFav = typeof isFavorite === 'function' ? isFavorite(place.slug) : false;
    
    return '<div class="listing-card" data-slug="' + place.slug + '">' +
        '<div style="position:relative">' +
            '<img class="listing-img" src="' + imageUrl + '" alt="' + place.name + '">' +
            '<div style="position:absolute; top:12px; left:12px; background:var(--primary); color:#fff; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:700">' + getCategoryName(place.category) + '</div>' +
            '<button class="fav-btn ' + (isFav ? 'active' : '') + '" onclick="handleFavClick(event, \'' + place.slug + '\')" aria-label="Toggle Favorite">' +
                '<i data-lucide="heart"></i>' +
            '</button>' +
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

function handleFavClick(e, slug) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (typeof toggleFavorite === 'function') {
        const added = toggleFavorite(slug);
        const btn = e.currentTarget;
        if (btn) {
            btn.classList.toggle('active', added);
            // Re-render icons if using lucide
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
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
