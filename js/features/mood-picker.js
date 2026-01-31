/**
 * Mood Picker Feature
 * Decoupled Logic for Home Page
 */

export function initMoodPicker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Mood Configurations
    const moods = [
        { id: 'chill', label: 'رايق ☕', type: 'cafe' },
        { id: 'hungry', label: 'جعان 🍔', type: 'restaurant' },
        { id: 'shopping', label: 'شوبينج 🛍️', type: 'shop' },
        { id: 'sick', label: 'تعبان 🩺', type: 'doctor' },
        { id: 'fix', label: 'تصليح 🔧', type: 'service' },
        { id: 'night', label: 'سهرة 🎉', type: 'attraction' }
    ];

    // Render Clean HTML
    container.innerHTML = moods.map(mood => `
        <div class="mood-card" data-type="${mood.type}">
            <div class="mood-icon">${mood.label.split(' ')[1] || '✨'}</div>
            <div class="mood-label">${mood.label.split(' ')[0]}</div>
        </div>
    `).join('');

    // Attach Events (Cleanly)
    // We bind event listeners to the container for better performance
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.mood-card');
        if (card) {
            const type = card.dataset.type;
            handleMoodSelect(type);
        }
    });
}

function handleMoodSelect(type) {
    // Navigate to categories/places with filter
    // For now, redirect to categories page with a query param
    window.location.href = `pages/categories.html?filter=${type}`;
}
