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
