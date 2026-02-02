/**
 * Place Details Renderer V8 (Ultra Modern Experience)
 * Renders complete place details page with modern UX
 */

window.PlaceDetailsRenderer = {
    /**
     * Render complete place details
     * @param {Object} place - Place data
     * @param {string} categoryName - Category label
     * @param {Array} reviews - List of reviews
     * @param {boolean} isFavorited - Current favorite status
     */
    render(place, categoryName, reviews, isFavorited) {
        if (!place) {
            this.showPlaceNotFound();
            return;
        }

        // Track View
        if (window.PlaceService) {
            window.PlaceService.trackView(place.id);
        }
        
        const lang = localStorage.getItem('lang') || 'ar';
        const isAr = lang === 'ar';
        const name = isAr ? (place.name_ar || place.name_en) : (place.name_en || place.name_ar);
        const desc = isAr ? (place.desc_ar || place.desc_en || '') : (place.desc_en || place.desc_ar || '');
        
        // Update Page Meta
        document.title = `${name} - دليل السويس`;

        // Parse Images
        const images = this.parseImages(place);

        // 1. Render Hero Section (Includes Header & Actions)
        this.renderHero(images, name, place, categoryName, isFavorited, isAr);

        // 2. Render Contact Info
        this.renderContactInfo(place, isAr);

        // 3. Render Gallery
        this.renderGallery(images, name);

        // 4. Render About Section
        this.renderAbout(desc, isAr);

        // 5. Render Map Section
        this.renderMap(place, isAr);

        // 6. Render Reviews Section
        this.renderReviews(place, reviews, isAr);

        // Initialize icons
        if (window.lucide) window.lucide.createIcons();
    },

    /**
     * Parse images from place data
     */
    parseImages(place) {
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
        if (images.length === 0) images.push('../assets/images/placeholder.jpg');
        
        return images;
    },

    /**
     * Show place not found error
     */
    showPlaceNotFound() {
        const main = document.getElementById('v8-main-content');
        if (!main) return;
        
        main.innerHTML = `
            <div style="text-align: center; padding: 100px 20px;">
                <i data-lucide="alert-circle" style="width: 64px; height: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h2 style="font-size: 24px; margin-bottom: 12px;">المكان غير موجود</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">عذراً، لم نتمكن من العثور على هذا المكان</p>
                <a href="../../index.html" class="v8-action-btn map" style="display: inline-flex; padding: 16px 32px;">
                    <i data-lucide="home"></i> العودة للرئيسية
                </a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    },

    /**
     * 1. Render Hero Section
     */
    renderHero(images, name, place, categoryName, isFavorited, isAr) {
        const container = document.getElementById('v8-hero-section');
        if (!container) return;

        const phone = place.phone;
        const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);

        let buttonsHtml = '';
        if (phone) {
            buttonsHtml += `
                <a href="tel:${phone}" class="v9-hero-btn call">
                    <span>${isAr ? 'اتصل الآن' : 'Call Now'}</span>
                    <i data-lucide="phone"></i>
                </a>
            `;
        }
        buttonsHtml += `
            <button class="v9-hero-btn share" onclick="if(window.sharePlace) window.sharePlace()">
                <span>${isAr ? 'مشاركة' : 'Share'}</span>
                <i data-lucide="share-2"></i>
            </button>
        `;

        container.innerHTML = `
            <div class="v9-hero-inner">
                <img src="${images[0]}" alt="${name}" class="v9-hero-img">
                <div class="v9-hero-overlay">
                    <div class="v9-top-actions">
                        <button class="v9-icon-btn" onclick="history.back()">
                            <i data-lucide="arrow-right"></i>
                        </button>
                        <button id="v8-hero-fav-btn" class="v9-icon-btn ${isFavorited ? 'active' : ''}" onclick="if(window.toggleFavorite) window.toggleFavorite('${place.id}')">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                    <div class="v9-hero-content">
                        <div class="v9-hero-text-side">
                            <div class="v9-category-badge">${categoryName || (isAr ? 'غير محدد' : 'Not specified')}</div>
                            <h1 class="v9-hero-title">${name}</h1>
                            <div class="v9-location-row">
                                <i data-lucide="map-pin"></i>
                                <span>${address || (isAr ? 'غير محدد' : 'Not specified')}</span>
                            </div>
                            <div class="v9-location-row" style="margin-top:4px;">
                                <i data-lucide="eye"></i>
                                <span>${place.views || 0} ${isAr ? 'مشاهدة' : 'Views'}</span>
                            </div>
                        </div>
                        <div class="v9-hero-buttons">
                            ${buttonsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 2. Render Contact Information
     */
    renderContactInfo(place, isAr) {
        const container = document.getElementById('v8-info-grid');
        if (!container) return;

        const phone = place.phone;
        const website = place.website;
        const createdDate = place.created_at ? new Date(place.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : null;

        if (!phone && !website && !createdDate) {
            container.style.display = 'none';
            return;
        }

        let itemsHtml = '';
        if (phone) {
            itemsHtml += `
                <div class="v9-contact-item">
                    <div class="v9-contact-icon bg-blue"><i data-lucide="phone"></i></div>
                    <div class="v9-contact-text">
                        <div class="v9-label">${isAr ? 'رقم الهاتف' : 'Phone Number'}</div>
                        <div class="v9-value" dir="ltr">${phone}</div>
                    </div>
                </div>
            `;
        }
        if (website) { 
             itemsHtml += `
                <div class="v9-contact-item">
                    <div class="v9-contact-icon bg-globe"><i data-lucide="globe"></i></div>
                    <div class="v9-contact-text">
                        <div class="v9-label">${isAr ? 'الموقع الإلكتروني' : 'Website'}</div>
                        <a href="${website}" target="_blank" class="v9-value link">${isAr ? 'زيارة الموقع' : 'Visit Website'}</a>
                    </div>
                </div>
            `;
        }
        if (createdDate) {
             itemsHtml += `
                <div class="v9-contact-item">
                    <div class="v9-contact-icon bg-clock"><i data-lucide="clock"></i></div>
                    <div class="v9-contact-text">
                        <div class="v9-label">${isAr ? 'تاريخ الإضافة' : 'Date Added'}</div>
                        <div class="v9-value">${createdDate}</div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <h3 class="v9-section-title">${isAr ? 'معلومات التواصل' : 'Contact Information'}</h3>
            <div class="v9-contact-list">${itemsHtml}</div>
        `;
        container.className = 'v9-contact-section v8-fade-in'; 
    },

    /**
     * 3. Render Gallery
     */
    renderGallery(images, name) {
        const container = document.getElementById('v8-gallery-section');
        if (!container || images.length <= 1) {
            if (container) container.style.display = 'none';
            return;
        }

        const isAr = (localStorage.getItem('lang') || 'ar') === 'ar';
        let galleryItems = images.map(img => `
            <div class="v8-gallery-item" onclick="if(window.openLightbox) window.openLightbox('${img}')">
                <img src="${img}" alt="${name}" loading="lazy">
            </div>
        `).join('');

        container.innerHTML = `
            <h3 class="v8-section-title"><i data-lucide="image"></i> ${isAr ? 'الصور' : 'Photos'}</h3>
            <div class="v8-gallery-scroll">${galleryItems}</div>
        `;
    },

    /**
     * 4. Render About Section
     */
    renderAbout(desc, isAr) {
        const container = document.getElementById('v8-about-section');
        if (!container) return;

        if (!desc || desc.trim() === '') {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = `
            <h3 class="v8-section-title"><i data-lucide="info"></i> ${isAr ? 'عن المكان' : 'About'}</h3>
            <p class="v8-description">${desc}</p>
        `;
    },

    /**
     * 5. Render Map Section
     */
    renderMap(place, isAr) {
        const container = document.getElementById('v8-map-section');
        if (!container) return;

        const address = isAr ? (place.address_ar || place.address) : (place.address_en || place.address);
        if (!address) {
            container.style.display = 'none';
            return;
        }

        const query = encodeURIComponent(address);
        container.innerHTML = `
            <h3 class="v8-section-title"><i data-lucide="map"></i> ${isAr ? 'الموقع' : 'Location'}</h3>
            <div class="v8-map-container">
                <iframe src="https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy" allowfullscreen></iframe>
            </div>
        `;
    },

    /**
     * 6. Render Reviews Section
     */
    renderReviews(place, reviews, isAr) {
        const container = document.getElementById('v8-reviews-section');
        if (!container) return;

        const rating = parseFloat(place.rating || 0).toFixed(1);
        const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

        // Distribution
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            const index = 5 - Math.round(r.rating || 0);
            if (index >= 0 && index < 5) distribution[index]++;
        });
        const total = reviews.length || 1;
        const percentages = distribution.map(count => Math.round((count / total) * 100));

        let reviewsListHtml = '';
        if (reviews.length === 0) {
            reviewsListHtml = `
                <div class="v8-no-reviews">
                    <i data-lucide="message-square-dashed"></i>
                    <p>${isAr ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                </div>
            `;
        } else {
            reviewsListHtml = reviews.map(r => {
                const rs = '★'.repeat(Math.round(r.rating || 0)) + '☆'.repeat(5 - Math.round(r.rating || 0));
                return `
                    <div class="v8-review-item">
                        <div class="v8-review-header">
                            <div class="v8-review-avatar">${(r.user_name || '?').charAt(0)}</div>
                            <div class="v8-review-info">
                                <div class="v8-review-name">${r.user_name || (isAr ? 'مستخدم' : 'User')}</div>
                                <div class="v8-review-date">${r.created_at ? new Date(r.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : ''}</div>
                            </div>
                            <div class="v8-review-stars">${rs}</div>
                        </div>
                        <p class="v8-review-text">${r.comment || ''}</p>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <h3 class="v8-section-title"><i data-lucide="message-square"></i> ${isAr ? 'التقييمات' : 'Reviews'} (${reviews.length})</h3>
            <div class="v8-reviews-stats">
                <div class="v8-big-rating">
                    <div class="v8-big-rating-number">${rating}</div>
                    <div class="v8-big-rating-stars">${stars}</div>
                </div>
                <div class="v8-rating-bars">
                    ${[5, 4, 3, 2, 1].map((n, i) => `
                        <div class="v8-bar-row">
                            <span>${n}</span>
                            <div class="v8-bar-track"><div class="v8-bar-fill" style="width: ${percentages[i]}%"></div></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="v8-reviews-list">${reviewsListHtml}</div>
            <div class="v8-add-review">
                <h4>${isAr ? 'أضف تقييمك' : 'Add Review'}</h4>
                <div class="v8-star-rating" id="v8-star-rating">
                    ${[1,2,3,4,5].map(n => `<button class="v8-star-btn" data-rating="${n}"><i data-lucide="star"></i></button>`).join('')}
                </div>
                <textarea id="v8-review-comment" class="v8-review-textarea" placeholder="${isAr ? 'اكتب تعليقك...' : 'Comment...' }"></textarea>
                <button id="v8-submit-review-btn" class="v8-submit-review" data-place-id="${place.id}">
                    <i data-lucide="send"></i> ${isAr ? 'إرسال' : 'Submit'}
                </button>
            </div>
        `;

        this.setupStarRating();
        this.setupReviewSubmit(place.id, isAr);
    },

    setupStarRating() {
        const btns = document.querySelectorAll('.v8-star-btn');
        let rating = 0;
        btns.forEach(btn => {
            btn.onclick = () => {
                rating = btn.dataset.rating;
                btns.forEach((b, i) => i < rating ? b.classList.add('active') : b.classList.remove('active'));
                window._selectedReviewRating = rating;
            };
        });
    },

    setupReviewSubmit(placeId, isAr) {
        const btn = document.getElementById('v8-submit-review-btn');
        if (!btn) return;
        btn.onclick = async () => {
            const r = window._selectedReviewRating || 0;
            const c = document.getElementById('v8-review-comment').value;
            if (r === 0) return alert(isAr ? 'اختر تقييم' : 'Select rating');
            
            btn.disabled = true;
            try {
                const res = await window.ReviewsService.addReview(placeId, r, c);
                if (res.error) throw new Error(res.error);
                alert(isAr ? 'شكرا لتقييمك!' : 'Thank you!');
                window.location.reload();
            } catch (e) {
                alert(e.message);
                btn.disabled = false;
            }
        };
    }
};
