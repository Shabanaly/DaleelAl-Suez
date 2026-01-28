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

    // 1. Render Hero Section
    renderV8Hero(images, name, place);

    // 2. Render Header Card
    renderV8HeaderCard(place, name, isAr);

    // 3. Render Info Cards
    renderV8InfoCards(place, isAr);

    // 4. Render Action Buttons
    renderV8ActionGrid(place, isAr);

    // 5. Render Gallery
    renderV8Gallery(images, name);

    // 6. Render About Section
    renderV8About(desc, isAr);

    // 7. Render Map Section
    renderV8Map(place, isAr);

    // 8. Render Reviews Section
    renderV8Reviews(place, isAr);

    // 9. Render Mobile Bottom Bar
    renderV8BottomBar(place, isAr);

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
 * 1. Render Hero Section
 */
function renderV8Hero(images, name, place) {
    const container = document.getElementById('v8-hero-section');
    if (!container) return;

    container.innerHTML = `
        <img src="${images[0]}" alt="${name}" class="v8-hero-img">
        <div class="v8-hero-overlay"></div>
        <a href="javascript:history.back()" class="v8-hero-back">
            <i data-lucide="chevron-right"></i>
        </a>
        <button id="v8-hero-fav-btn" class="v8-hero-fav" onclick="toggleFavorite('${place.id}')">
            <i data-lucide="heart"></i>
        </button>
        ${place.is_featured ? '<div class="v8-hero-badge">مميز</div>' : ''}
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
        }
    } catch (e) {
        console.error('Error checking favorite status:', e);
    }
}

/**
 * 2. Render Header Card
 */
async function renderV8HeaderCard(place, name, isAr) {
    const container = document.getElementById('v8-header-card');
    if (!container) return;

    const rating = parseFloat(place.rating || 0).toFixed(1);
    const reviewsCount = place.reviews_count || 0;

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

    container.innerHTML = `
        <div class="v8-header-top">
            <h1 class="v8-place-name">${name}</h1>
            <div class="v8-rating-badge">
                <i data-lucide="star"></i>
                ${rating}
            </div>
        </div>
        <div class="v8-header-meta">
            <span class="v8-category-tag">${categoryName}</span>
            <span class="v8-meta-dot"></span>
            <span>${reviewsCount} ${isAr ? 'تقييم' : 'reviews'}</span>
            ${place.address ? `
                <span class="v8-meta-dot"></span>
                <span>${isAr ? (place.address_ar || place.address) : (place.address_en || place.address)}</span>
            ` : ''}
        </div>
    `;
}

/**
 * 3. Render Info Cards
 */
function renderV8InfoCards(place, isAr) {
    const container = document.getElementById('v8-info-grid');
    if (!container) return;

    const workingHours = place.working_hours || (isAr ? 'غير محدد' : 'Not specified');
    const address = isAr ? (place.address_ar || place.address || '') : (place.address_en || place.address || '');
    const rating = parseFloat(place.rating || 0).toFixed(1);
    const reviewsCount = place.reviews_count || 0;

    // Determine if open (simple logic - can be enhanced)
    const isOpenNow = true; // Placeholder - would need actual time parsing

    container.innerHTML = `
        <div class="v8-info-card v8-fade-in">
            <div class="v8-info-icon">
                <i data-lucide="clock"></i>
            </div>
            <div class="v8-info-content">
                <div class="v8-info-label">${isAr ? 'ساعات العمل' : 'Working Hours'}</div>
                <div class="v8-info-value ${isOpenNow ? 'open' : 'closed'}">
                    ${workingHours}
                </div>
            </div>
        </div>
        
        <div class="v8-info-card v8-fade-in">
            <div class="v8-info-icon">
                <i data-lucide="map-pin"></i>
            </div>
            <div class="v8-info-content">
                <div class="v8-info-label">${isAr ? 'العنوان' : 'Address'}</div>
                <div class="v8-info-value">${address || (isAr ? 'غير محدد' : 'Not specified')}</div>
            </div>
        </div>
        
        <div class="v8-info-card v8-fade-in">
            <div class="v8-info-icon">
                <i data-lucide="star"></i>
            </div>
            <div class="v8-info-content">
                <div class="v8-info-label">${isAr ? 'التقييم' : 'Rating'}</div>
                <div class="v8-info-value">${rating} (${reviewsCount} ${isAr ? 'تقييم' : 'reviews'})</div>
            </div>
        </div>
    `;
}

/**
 * 4. Render Action Buttons
 */
function renderV8ActionGrid(place, isAr) {
    const container = document.getElementById('v8-action-grid');
    if (!container) return;

    const phone = place.phone;
    const whatsapp = place.whatsapp;
    const waNumber = whatsapp ? normalizeWhatsAppNumber(whatsapp) : null;
    const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
    const mapUrl = place.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`;

    let html = '';

    if (phone) {
        html += `
            <a href="tel:${phone}" class="v8-action-btn call">
                <i data-lucide="phone"></i>
                <span>${isAr ? 'اتصال' : 'Call'}</span>
            </a>
        `;
    }

    if (waNumber) {
        html += `
            <a href="https://wa.me/${waNumber}" target="_blank" class="v8-action-btn whatsapp">
                <i data-lucide="message-circle"></i>
                <span>${isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
        `;
    }

    html += `
        <a href="${mapUrl}" target="_blank" class="v8-action-btn map">
            <i data-lucide="navigation"></i>
            <span>${isAr ? 'الاتجاهات' : 'Directions'}</span>
        </a>
    `;

    // If only 2 buttons, add share button
    if (!phone || !waNumber) {
        html += `
            <button class="v8-action-btn share" onclick="sharePlace()">
                <i data-lucide="share-2"></i>
                <span>${isAr ? 'مشاركة' : 'Share'}</span>
            </button>
        `;
    }

    container.innerHTML = html;
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
function renderV8BottomBar(place, isAr) {
    const container = document.getElementById('v8-bottom-bar');
    if (!container) return;

    const phone = place.phone;
    const whatsapp = place.whatsapp;
    const waNumber = whatsapp ? normalizeWhatsAppNumber(whatsapp) : null;
    const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
    const mapUrl = place.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`;

    let html = '';

    if (phone) {
        html += `
            <a href="tel:${phone}" class="v8-bottom-btn call">
                <i data-lucide="phone"></i>
                ${isAr ? 'اتصال' : 'Call'}
            </a>
        `;
    }

    if (waNumber) {
        html += `
            <a href="https://wa.me/${waNumber}" target="_blank" class="v8-bottom-btn whatsapp">
                <i data-lucide="message-circle"></i>
                ${isAr ? 'واتساب' : 'WhatsApp'}
            </a>
        `;
    }

    html += `
        <a href="${mapUrl}" target="_blank" class="v8-bottom-btn map">
            <i data-lucide="navigation"></i>
            ${isAr ? 'خريطة' : 'Map'}
        </a>
    `;

    container.innerHTML = html;

    // Hide if no contact options
    if (!phone && !waNumber && !address) {
        container.style.display = 'none';
    }
}
