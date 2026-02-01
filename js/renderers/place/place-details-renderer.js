/**
 * Place Details Renderer V8 (Ultra Modern Experience)
 * Renders complete place details page with modern UX
 */

import { normalizeWhatsAppNumber } from '../../utils/url-helpers.js';

/**
 * Render complete place details
 * @param {string} placeId - Place ID
 */
export async function renderPlaceDetails(placeId) {
    const place = await window.UserPlacesService.getById(placeId);
    if (!place) {
        showPlaceNotFound();
        return;
    }

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';
    const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
    const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
    
    // Update Page Meta
    document.title = `${name} - دليل السويس`;

    // Parse Images
    const images = parseImages(place);

    // 1. Render Hero Section (Includes Header & Actions)
    await renderV8Hero(images, name, place, isAr);

    // 2. Render Contact Info (Was Info Cards)
    renderV8ContactInfo(place, isAr);

    // 3. Render Gallery
    renderV8Gallery(images, name);

    // 4. Render About Section
    renderV8About(desc, isAr);

    // 5. Render Map Section
    renderV8Map(place, isAr);

    // 6. Render Reviews Section
    renderV8Reviews(place, isAr);

    // Initialize icons
    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof syncFavoriteIcons === "function") syncFavoriteIcons();
}

/**
 * Parse images from place data
 */
function parseImages(place) {
    let images = [];
    if (place.image_url) images.push(place.image_url);
    
    if (place.images) {
        let additional = [];
        if (Array.isArray(place.images)) additional = place.images;
        else if (typeof place.images === 'string') {
            try {
                const parsed = JSON.parse(place.images);
                if (Array.isArray(parsed)) additional = parsed;
            } catch(e) { }
        }
        images = [...images, ...additional];
    }
    
    images = [...new Set(images.filter(img => img && img.length > 5))];
    if (images.length === 0) images.push('https://via.placeholder.com/1200x800?text=No+Image');
    
    return images;
}

/**
 * Show place not found error
 */
function showPlaceNotFound() {
    const main = document.getElementById('v8-main-content');
    if (!main) return;
    
    main.innerHTML = `
        <div style="text-align: center; padding: 100px 20px;">
            <i data-lucide="alert-circle" style="width: 64px; height: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
            <h2 style="font-size: 24px; margin-bottom: 12px;">المكان غير موجود</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">عذراً، لم نتمكن من العثور على هذا المكان</p>
            <a href="../index.html" class="v8-action-btn map" style="display: inline-flex; padding: 16px 32px;">
                <i data-lucide="home"></i> العودة للرئيسية
            </a>
        </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
}

/**
 * 1. Render Hero Section (Includes Header & Actions)
 */
async function renderV8Hero(images, name, place, isAr) {
    const container = document.getElementById('v8-hero-section');
    if (!container) return;

    // Get category name
    let categoryName = isAr ? 'غير محدد' : 'Not specified';
    if (place.main_cat_id && window.sb) {
        try {
            const { data } = await window.sb.from('categories').select('name_ar, name_en').eq('id', place.main_cat_id).single();
            if (data) {
                categoryName = isAr ? data.name_ar : (data.name_en || data.name_ar);
            }
        } catch (e) {}
    }

    // Prepare Action Buttons Links
    const phone = place.phone;
    const whatsapp = place.whatsapp;
    const waNumber = whatsapp ? normalizeWhatsAppNumber(whatsapp) : null;
    const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
    // const mapUrl = place.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`; // Moved to location text click if needed, or separate button? 
    // Image 1 & 2 show: "Call Now" (Orange) and "Share" (Blue). 
    // Image 2 also shows "Share" on desktop? Image 1 shows Call & Share.
    // Let's implement Call & Share as primary.

    let buttonsHtml = '';
    
    // Call Button
    if (phone) {
        buttonsHtml += `
            <a href="tel:${phone}" class="v9-hero-btn call">
                <span>${isAr ? 'اتصل الآن' : 'Call Now'}</span>
                <i data-lucide="phone"></i>
            </a>
        `;
    }

    // Share Button
    buttonsHtml += `
        <button class="v9-hero-btn share" onclick="sharePlace()">
            <span>${isAr ? 'مشاركة' : 'Share'}</span>
            <i data-lucide="share-2"></i>
        </button>
    `;

    container.innerHTML = `
        <div class="v9-hero-inner">
            <img src="${images[0]}" alt="${name}" class="v9-hero-img">
            <div class="v9-hero-overlay">
                <!-- Top Nav Buttons -->
                <div class="v9-top-actions">
                    <button class="v9-icon-btn" onclick="history.back()">
                        <i data-lucide="arrow-right"></i> <!-- RTL: Right arrow points back in intent usually, checking icons -->
                    </button>
                    <!-- Favorite Button would go here if needed, but maybe not in design? keeping it for functionality -->
                     <button id="v8-hero-fav-btn" class="v9-icon-btn" onclick="toggleFavorite('${place.id}')">
                        <i data-lucide="heart"></i>
                    </button>
                </div>

                <!-- Bottom Content -->
                <div class="v9-hero-content">
                    <div class="v9-hero-text-side">
                        <div class="v9-category-badge">${categoryName}</div>
                        <h1 class="v9-hero-title">${name}</h1>
                        
                        <div class="v9-location-row">
                            <i data-lucide="map-pin"></i>
                            <span>${address || (isAr ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                    </div>

                    <div class="v9-hero-buttons">
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Check favorite status
    checkFavoriteStatus(place.id);
}

/**
 * Check and update favorite status
 */
async function checkFavoriteStatus(id) {
    if (!window.FavoritesService?.getFavoritesIds) return;
    
    try {
        const favIds = await window.FavoritesService.getFavoritesIds();
        const btn = document.getElementById('v8-hero-fav-btn');
        if (btn && favIds.has(id)) {
            btn.classList.add('active');
            // If active, maybe change icon fill style in CSS
        }
    } catch (e) {
        console.error('Error checking favorite status:', e);
    }
}

/**
 * 2. Render Contact Information (Replaces Info Cards)
 * Matches Image 3 layout (Contact Info List)
 */
function renderV8ContactInfo(place, isAr) {
    // We reuse the 'v8-info-grid' container ID but styled differently now
    const container = document.getElementById('v8-info-grid');
    if (!container) return;

    const phone = place.phone;
    const website = place.website; // Assuming website field exists or similar
    const createdDate = place.created_at ? new Date(place.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : null;

    // If no data, hide
    if (!phone && !website && !createdDate) {
        container.style.display = 'none';
        return;
    }

    let itemsHtml = '';

    // Phone
    if (phone) {
        itemsHtml += `
            <div class="v9-contact-item">
                <div class="v9-contact-icon bg-blue">
                    <i data-lucide="phone"></i>
                </div>
                <div class="v9-contact-text">
                    <div class="v9-label">${isAr ? 'رقم الهاتف' : 'Phone Number'}</div>
                    <div class="v9-value" dir="ltr">${phone}</div>
                </div>
            </div>
        `;
    }

    // Website (or Website link if available)
    if (website) { 
         itemsHtml += `
            <div class="v9-contact-item">
                <div class="v9-contact-icon bg-globe">
                    <i data-lucide="globe"></i>
                </div>
                <div class="v9-contact-text">
                    <div class="v9-label">${isAr ? 'الموقع الإلكتروني' : 'Website'}</div>
                    <a href="${website}" target="_blank" class="v9-value link">${isAr ? 'زيارة الموقع' : 'Visit Website'}</a>
                </div>
            </div>
        `;
    }

    // Date/Time (using created_at as generic info or maybe Working Hours if preferred)
    // The image 3 shows "Date Joined" or similar clock icon. Let's use Date Added for now or Working Hours.
    // Image 3 has a clock icon with a date. Let's assume it's "Date Added" or "Working Hours".
    // Let's use "Date Added" as seen in image 3 likely "تاريخ الإضافة".
    if (createdDate) {
         itemsHtml += `
            <div class="v9-contact-item">
                <div class="v9-contact-icon bg-clock">
                    <i data-lucide="clock"></i>
                </div>
                <div class="v9-contact-text">
                    <div class="v9-label">${isAr ? 'تاريخ الإضافة' : 'Date Added'}</div>
                    <div class="v9-value">${createdDate}</div>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <h3 class="v9-section-title">${isAr ? 'معلومات التواصل' : 'Contact Information'}</h3>
        <div class="v9-contact-list">
            ${itemsHtml}
        </div>
    `;
    
    // Clean up old classes if present by just using v9 classes inside
    container.className = 'v9-contact-section v8-fade-in'; 
}

// 4. Render Action Buttons - REMOVED (Merged into Hero)
function renderV8ActionGrid(place, isAr) {
    const container = document.getElementById('v8-action-grid');
    if (container) container.remove(); // Clean up if exists
}

/**
 * 5. Render Gallery
 */
function renderV8Gallery(images, name) {
    const container = document.getElementById('v8-gallery-section');
    if (!container || images.length <= 1) {
        if (container) container.style.display = 'none';
        return;
    }

    const lang = localStorage.getItem('lang') || 'ar';
    const isAr = lang === 'ar';

    let galleryItems = images.map(img => `
        <div class="v8-gallery-item" onclick="openLightbox('${img}')">
            <img src="${img}" alt="${name}" loading="lazy">
        </div>
    `).join('');

    container.innerHTML = `
        <h3 class="v8-section-title">
            <i data-lucide="image"></i>
            ${isAr ? 'الصور' : 'Photos'}
        </h3>
        <div class="v8-gallery-scroll">
            ${galleryItems}
        </div>
    `;
}

/**
 * 6. Render About Section
 */
function renderV8About(desc, isAr) {
    const container = document.getElementById('v8-about-section');
    if (!container) return;

    if (!desc || desc.trim() === '') {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = `
        <h3 class="v8-section-title">
            <i data-lucide="info"></i>
            ${isAr ? 'عن المكان' : 'About'}
        </h3>
        <p class="v8-description">${desc}</p>
    `;
}

/**
 * 7. Render Map Section
 */
function renderV8Map(place, isAr) {
    const container = document.getElementById('v8-map-section');
    if (!container) return;

    const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
    
    if (!address) {
        container.style.display = 'none';
        return;
    }

    const query = encodeURIComponent(address);

    container.innerHTML = `
        <h3 class="v8-section-title">
            <i data-lucide="map"></i>
            ${isAr ? 'الموقع' : 'Location'}
        </h3>
        <div class="v8-map-container">
            <iframe 
                src="https://www.google.com/maps?q=${query}&output=embed" 
                loading="lazy"
                allowfullscreen
            ></iframe>
        </div>
    `;
}

/**
 * 8. Render Reviews Section
 */
async function renderV8Reviews(place, isAr) {
    const container = document.getElementById('v8-reviews-section');
    if (!container) return;

    const rating = parseFloat(place.rating || 0).toFixed(1);
    const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    const reviewsCount = place.reviews_count || 0;

    // Fetch actual reviews
    let reviews = [];
    if (window.ReviewsService?.getReviews) {
        try {
            reviews = await window.ReviewsService.getReviews(place.id);
        } catch (e) {
            console.error('Error fetching reviews:', e);
        }
    }

    // Calculate rating distribution
    const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1
    reviews.forEach(r => {
        const ratingIndex = 5 - Math.round(r.rating || 0);
        if (ratingIndex >= 0 && ratingIndex < 5) distribution[ratingIndex]++;
    });
    const totalReviews = reviews.length || 1;
    const percentages = distribution.map(count => Math.round((count / totalReviews) * 100));

    // Render reviews list HTML
    let reviewsListHtml = '';
    if (reviews.length === 0) {
        reviewsListHtml = `
            <div class="v8-no-reviews">
                <i data-lucide="message-square-dashed"></i>
                <p>${isAr ? 'لا توجد تقييمات بعد. كن أول من يقيّم!' : 'No reviews yet. Be the first to review!'}</p>
            </div>
        `;
    } else {
        reviewsListHtml = reviews.map(review => {
            const reviewStars = '★'.repeat(Math.round(review.rating || 0)) + '☆'.repeat(5 - Math.round(review.rating || 0));
            const reviewerName = review.user_name || (isAr ? 'مستخدم' : 'User');
            const initial = reviewerName.charAt(0).toUpperCase();
            const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : '';
            
            return `
                <div class="v8-review-item">
                    <div class="v8-review-header">
                        <div class="v8-review-avatar">${initial}</div>
                        <div class="v8-review-info">
                            <div class="v8-review-name">${reviewerName}</div>
                            <div class="v8-review-date">${reviewDate}</div>
                        </div>
                        <div class="v8-review-stars">${reviewStars}</div>
                    </div>
                    <p class="v8-review-text">${review.comment || ''}</p>
                </div>
            `;
        }).join('');
    }

    container.innerHTML = `
        <h3 class="v8-section-title">
            <i data-lucide="message-square"></i>
            ${isAr ? 'التقييمات' : 'Reviews'} (${reviews.length})
        </h3>
        <div class="v8-reviews-stats">
            <div class="v8-big-rating">
                <div class="v8-big-rating-number">${rating}</div>
                <div class="v8-big-rating-stars">${stars}</div>
            </div>
            <div class="v8-rating-bars">
                <div class="v8-bar-row">
                    <span>5</span>
                    <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[0]}%"></div></div>
                </div>
                <div class="v8-bar-row">
                    <span>4</span>
                    <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[1]}%"></div></div>
                </div>
                <div class="v8-bar-row">
                    <span>3</span>
                    <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[2]}%"></div></div>
                </div>
                <div class="v8-bar-row">
                    <span>2</span>
                    <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[3]}%"></div></div>
                </div>
                <div class="v8-bar-row">
                    <span>1</span>
                    <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[4]}%"></div></div>
                </div>
            </div>
        </div>
        
        <div class="v8-reviews-list">
            ${reviewsListHtml}
        </div>
        
        <!-- Add Review Form -->
        <div class="v8-add-review">
            <h4 class="v8-add-review-title">${isAr ? 'أضف تقييمك' : 'Add Your Review'}</h4>
            <div class="v8-star-rating" id="v8-star-rating">
                <button type="button" class="v8-star-btn" data-rating="1"><i data-lucide="star"></i></button>
                <button type="button" class="v8-star-btn" data-rating="2"><i data-lucide="star"></i></button>
                <button type="button" class="v8-star-btn" data-rating="3"><i data-lucide="star"></i></button>
                <button type="button" class="v8-star-btn" data-rating="4"><i data-lucide="star"></i></button>
                <button type="button" class="v8-star-btn" data-rating="5"><i data-lucide="star"></i></button>
            </div>
            <textarea 
                id="v8-review-comment" 
                class="v8-review-textarea" 
                placeholder="${isAr ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}"
            ></textarea>
            <button 
                id="v8-submit-review-btn" 
                class="v8-submit-review"
                data-place-id="${place.id}"
            >
                <i data-lucide="send"></i>
                ${isAr ? 'إرسال التقييم' : 'Submit Review'}
            </button>
        </div>
    `;

    // Setup star rating interactivity
    setupStarRating();
    setupReviewSubmit(place.id, isAr);
    
    // Initialize lucide icons for the newly added elements
    if (typeof lucide !== "undefined") lucide.createIcons();
}

/**
 * Setup star rating buttons
 */
function setupStarRating() {
    const container = document.getElementById('v8-star-rating');
    if (!container) return;

    const buttons = container.querySelectorAll('.v8-star-btn');
    let selectedRating = 0;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.dataset.rating);
            buttons.forEach((b, i) => {
                if (i < selectedRating) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        });
    });

    // Store rating getter globally for submission
    window.getSelectedV8Rating = () => selectedRating;
}

/**
 * Setup review submission
 */
function setupReviewSubmit(placeId, isAr) {
    const submitBtn = document.getElementById('v8-submit-review-btn');
    const textarea = document.getElementById('v8-review-comment');
    
    if (!submitBtn || !textarea) return;

    submitBtn.addEventListener('click', async () => {
        const rating = window.getSelectedV8Rating?.() || 0;
        const comment = textarea.value.trim();

        if (rating === 0) {
            alert(isAr ? 'يرجى اختيار تقييم' : 'Please select a rating');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader"></i> ${isAr ? 'جاري الإرسال...' : 'Submitting...'}`;
        if (typeof lucide !== "undefined") lucide.createIcons();

        try {
            if (window.ReviewsService?.addReview) {
                const result = await window.ReviewsService.addReview(placeId, rating, comment);
                
                if (result.error) {
                    throw new Error(result.error);
                }
                
                alert(isAr ? 'تم إرسال تقييمك بنجاح!' : 'Your review has been submitted!');
                
                // Reload page to show new review
                window.location.reload();
            } else {
                throw new Error('Reviews service not available');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(isAr ? 'حدث خطأ: ' + error.message : 'Error: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="send"></i> ${isAr ? 'إرسال التقييم' : 'Submit Review'}`;
            if (typeof lucide !== "undefined") lucide.createIcons();
        }
    });
}

/**
 * 9. Render Mobile Bottom Bar
 */
// 9. Render Bottom Bar - REMOVED (Buttons in Hero)
function renderV8BottomBar(place, isAr) {
    const container = document.getElementById('v8-bottom-bar');
    if (container) container.remove();
}
