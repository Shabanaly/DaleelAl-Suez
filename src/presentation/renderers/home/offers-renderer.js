/**
 * Offers Carousel Renderer
 * Renders places with special offers as an auto-rotating carousel with indicators
 */

let offersCarouselInterval = null;
let currentOfferIndex = 0;

/**
 * Render offers carousel section
 */
async function renderOffers() {
    const container = document.getElementById('offers-container');
    if (!container || !window.UserPlacesService) return;

    try {
        // Fetch max 7 offers
        const places = await window.UserPlacesService.getOfferPlaces(7);
        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';

        if (!places || places.length === 0) {
            container.innerHTML = `
                <div class="offer-card empty-state">
                    <div class="offer-content">
                        <div style="font-size: 54px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));">✨</div>
                        <h4 class="offer-title">
                            ${isAr ? 'انتظروا عروضنا قريباً' : 'Exciting Offers Coming Soon'}
                        </h4>
                        <p class="offer-text" style="justify-content: center; font-size: 16px;">
                            ${isAr ? 'نعمل حالياً على تجهيز أقوى الخصومات لكم' : 'We are working on bringing you the best discounts.'}
                        </p>
                    </div>
                </div>
            `;
            container.parentElement.style.display = 'block';
            return;
        }

        // Create carousel wrapper
        container.innerHTML = `
            <div class="offers-carousel">
                <div class="offers-track">
                    ${places.map((place, index) => {
                        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
                        const offerText = isAr ? (place.offer_text_ar || 'خصم خاص') : (place.offer_text_en || 'Special Offer');
                        const image = place.image_url || 'assets/images/placeholder.jpg';
                        
                        return `
                            <div class="offer-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <div class="offer-card" onclick="location.href='pages/place.html?id=${place.id}'">
                                    <div class="offer-card-bg" style="background-image: url('${image}')"></div>
                                    <div class="offer-content">
                                        <div class="offer-badge">
                                            <i data-lucide="tag" style="width:12px; margin-inline-end:5px;"></i>
                                            ${isAr ? 'عرض حصري' : 'Exclusive'}
                                        </div>
                                        <h4 class="offer-title">${name}</h4>
                                        <p class="offer-text">${offerText}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="offers-indicators">
                    ${places.map((_, index) => `
                        <button class="offer-indicator ${index === 0 ? 'active' : ''}" 
                                data-index="${index}">
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.parentElement.style.display = 'block';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
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
