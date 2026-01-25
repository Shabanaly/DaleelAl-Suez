// render.js

function renderPlaces(list, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "";
    
    for (var i = 0; i < list.length; i++) {
        container.innerHTML += placeCard(list[i]);
    }

    // تفعيل الأيقونات بعد عملية الـ Render
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}
