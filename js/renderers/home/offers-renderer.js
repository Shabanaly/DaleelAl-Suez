/**
 * Offers Carousel Renderer
 * Renders places with special offers as an auto-rotating carousel with indicators
 */

let offersCarouselInterval = null;
let currentOfferIndex = 0;

/**
 * Render offers carousel section
 */
export async function renderOffers() {
    const container = document.getElementById('offers-container');
    if (!container || !window.UserPlacesService) return;

    try {
        // Fetch max 7 offers
        const places = await window.UserPlacesService.getOfferPlaces(7);
        if (!places || places.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';

        // Create carousel wrapper
        container.innerHTML = `
            <div class="offers-carousel">
                <div class="offers-track">
                    ${places.map((place, index) => {
                        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
                        const offerText = isAr ? (place.offer_text_ar || 'خصم خاص') : (place.offer_text_en || 'Special Offer');
                        
                        return `
                            <div class="offer-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <div class="offer-card" onclick="location.href='pages/place.html?id=${place.id}'" style="cursor:pointer;">
                                    <div>
                                        <div class="offer-badge">${isAr ? 'عرض حصري' : 'Exclusive'}</div>
                                        <h4 style="margin: 8px 0; font-size:18px; font-weight:800;">${name}</h4>
                                    </div>
                                    <p style="font-size:14px; opacity:0.9; font-weight:600;">${offerText}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="offers-indicators">
                    ${places.map((_, index) => `
                        <button class="offer-indicator ${index === 0 ? 'active' : ''}" 
                                data-index="${index}" 
                                aria-label="عرض ${index + 1}">
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.parentElement.style.display = 'block';
        
        // Initialize carousel
        initOffersCarousel(places.length);
        
    } catch (e) {
        console.error("Offers Render Error", e);
        container.parentElement.style.display = 'none';
    }
}

/**
 * Initialize carousel auto-rotation and indicator clicks
 */
function initOffersCarousel(totalSlides) {
    const track = document.querySelector('.offers-track');
    const indicators = document.querySelectorAll('.offer-indicator');
    const slides = document.querySelectorAll('.offer-slide');
    
    if (!track || slides.length === 0) return;
    
    currentOfferIndex = 0;
    
    // Clear any existing interval
    if (offersCarouselInterval) {
        clearInterval(offersCarouselInterval);
    }
    
    // Function to go to specific slide
    function goToSlide(index) {
        currentOfferIndex = index;
        
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update indicators
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        // Animate track position
        track.style.transform = `translateX(${index * 100}%)`;
    }
    
    // Next slide function
    function nextSlide() {
        const next = (currentOfferIndex + 1) % totalSlides;
        goToSlide(next);
    }
    
    // Setup indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            // Reset auto-rotate timer on manual navigation
            resetAutoRotate();
        });
    });
    
    // Setup auto-rotate
    function resetAutoRotate() {
        if (offersCarouselInterval) {
            clearInterval(offersCarouselInterval);
        }
        offersCarouselInterval = setInterval(nextSlide, 4000);
    }
    
    // Start auto-rotate
    resetAutoRotate();
    
    // Pause on hover
    const carousel = document.querySelector('.offers-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            if (offersCarouselInterval) {
                clearInterval(offersCarouselInterval);
            }
        });
        carousel.addEventListener('mouseleave', resetAutoRotate);
    }
}
