/**
 * Stories Feature Logic
 * Renders Instagram-like stories bar and handles viewing
 */

async function initStories(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Fetch Stories (Mock used if Supabase table missing)
    const stories = await fetchActiveStories();

    if (stories.length === 0) {
        container.style.display = 'none';
        return;
    }

    // 2. Render Bubbles
    container.innerHTML = stories.map((story, index) => `
        <div class="story-bubble" onclick="openStoryViewer(${index})">
            <div class="story-ring ${story.seen ? 'seen' : ''}">
                <img src="${story.place_logo || 'assets/images/logo-placeholder.png'}" alt="Story">
            </div>
            <span class="story-name">${story.place_name}</span>
        </div>
    `).join('');

    // Expose global viewer
    window.currentStories = stories;
    window.openStoryViewer = openStoryViewer;
}

async function fetchActiveStories() {
    if (!window.StoriesService) {
        console.warn('StoriesService not found');
        return [];
    }

    try {
        const stories = await window.StoriesService.getActiveStories();
        
        if (!stories || stories.length === 0) return [];

        // Group by Place
        const groupedMap = new Map();
        
        stories.forEach(story => {
            const placeId = story.place_id || 'general';
            const placeName = story.places ? story.places.name_ar : 'دليل السويس';
            const placeLogo = story.places ? story.places.image_url : 'assets/images/logo-placeholder.png';
            
            if (!groupedMap.has(placeId)) {
                groupedMap.set(placeId, {
                    place_id: placeId,
                    place_name: placeName,
                    place_logo: placeLogo,
                    items: [],
                    seen: false // Logic for seen state could be added here (localStorage)
                });
            }
            
            groupedMap.get(placeId).items.push({
                id: story.id,
                media: story.media_url,
                caption: story.caption,
                link: story.link_url,
                type: story.media_type,
                created_at: story.created_at
            });
        });

        return Array.from(groupedMap.values());
    } catch (e) {
        console.error("Failed to fetch stories", e);
        return [];
    }
}

// Viewer Logic (Simple Overlay)
// Viewer Logic (Grouped Support)
function openStoryViewer(groupIndex) {
    const groups = window.currentStories; // These are now GROUPS of stories
    let currentGroupIndex = groupIndex;
    let currentStoryIndex = 0; // Index within the group

    // Create or Get Modal
    let modal = document.getElementById('story-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'story-modal';
        modal.className = 'story-modal';
        document.body.appendChild(modal);
    }
    
    // Add class for backdrop
    document.body.classList.add('story-view-active');

    function renderStory() {
        if (currentGroupIndex >= groups.length) {
            closeStoryViewer();
            return;
        }

        const group = groups[currentGroupIndex];
        
        // Ensure valid story index
        if (currentStoryIndex >= group.items.length) {
            // Move to next group
            currentGroupIndex++;
            currentStoryIndex = 0;
            renderStory();
            return;
        }

        const s = group.items[currentStoryIndex];
        const isVideo = s.type === 'video';
        
        // Helper: Time Ago
        const timeAgo = (dateStr) => {
            if (!dateStr) return '';
            const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
            let interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + 'س';
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + 'د';
            return 'الآن';
        };

        // Progress Bars (Segmented)
        const progressHtml = group.items.map((_, idx) => `
            <div class="progress-segment" style="flex:1; height:3px; background:rgba(255,255,255,0.3); border-radius:2px; margin:0 2px; overflow:hidden;">
                <div class="${idx < currentStoryIndex ? 'filled' : (idx === currentStoryIndex ? 'filling' : '')}" 
                     style="height:100%; background:#fff; width:${idx < currentStoryIndex ? '100%' : '0%'}; transition: width ${idx === currentStoryIndex ? (isVideo ? '0s' : '5s') : '0s'} linear;"></div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="story-progress-bar" style="display:flex; padding: 10px 5px; position:absolute; top:0; left:0; right:0; z-index:20;">
                ${progressHtml}
            </div>
            <div class="story-header" style="position:absolute; top:20px; right:10px; z-index:20; display:flex; align-items:center;">
                <div onclick="const isPages = window.location.pathname.includes('/pages/'); window.location.href = (isPages ? 'place.html' : 'pages/place.html') + '?id=${group.place_id}'" style="display:flex; align-items:center; cursor:pointer;">
                    <img src="${group.place_logo || 'assets/images/logo-placeholder.png'}" style="width:32px; height:32px; border-radius:50%; margin-left:10px; border:1px solid rgba(255,255,255,0.5);">
                    <div style="display:flex; flex-direction:column;">
                        <span style="color:white; font-weight:bold; font-size:14px; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${group.place_name}</span>
                        <span style="color:rgba(255,255,255,0.8); font-size:11px; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${timeAgo(s.created_at || new Date().toISOString())}</span>
                    </div>
                </div>
                <button onclick="closeStoryViewer()" class="close-story" style="margin-right:auto; background:none; border:none; color:white; font-size:24px; padding:0 10px; cursor:pointer;">✕</button>
            </div>
            
            <div class="story-media-container" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#000;">
                ${isVideo 
                    ? `<video src="${s.media}" autoplay playsinline webkit-playsinline style="width:100%; height:100%; object-fit:cover;"></video>` 
                    : `<div class="story-img" style="width:100%; height:100%; background-image: url('${s.media}'); background-size:cover; background-position:center;"></div>`
                }
            </div>

            <div class="story-overlay" style="position:absolute; bottom:0; left:0; right:0; padding:20px; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events:none; z-index:10; display:flex; flex-direction:column; align-items:center;">
                <div class="story-caption" style="${s.caption ? '' : 'display:none'}; color:white; margin-bottom:15px; text-align:center; font-size:16px; line-height:1.4; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${s.caption}</div>
                ${s.link ? `<a href="${s.link}" target="_blank" class="story-cta" style="pointer-events:auto; background: white; color: black; padding: 12px 24px; border-radius: 30px; font-weight: bold; text-decoration: none; display:inline-flex; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-size:14px; transition:transform 0.2s;">زيارة الرابط <i data-lucide="external-link" style="width:16px; margin-right:6px;"></i></a>` : ''}
            </div>

            <div class="story-nav left" onclick="prevStory()" style="position:absolute; top:0; bottom:0; left:0; width:30%; z-index:15;"></div>
            <div class="story-nav right" onclick="nextStory()" style="position:absolute; top:0; bottom:0; right:0; width:30%; z-index:15;"></div>
        `;

        // Handle Video Progress & Auto Advance
        const videoEl = modal.querySelector('video');
        const filling = modal.querySelector('.filling');
        
        clearTimeout(window.storyTimer);

        if (isVideo && videoEl) {
            videoEl.onloadedmetadata = () => {
                const duration = videoEl.duration * 1000;
                if(filling) {
                    filling.style.transition = `width ${duration}ms linear`;
                    requestAnimationFrame(() => filling.style.width = '100%');
                }
                window.storyTimer = setTimeout(() => nextStory(), duration);
            };
            videoEl.onerror = () => {
                 console.error("Video failed to load");
                 window.storyTimer = setTimeout(() => nextStory(), 3000); // Skip after 3s error
            };
        } else {
             // Image Default 5s
            setTimeout(() => {
                if(filling) filling.style.width = '100%';
            }, 50);
            window.storyTimer = setTimeout(() => nextStory(), 5000);
        }

        // Mark as viewed
        if (window.StoriesService) {
            window.StoriesService.markStoryAsViewed(s.id);
        }
        
        if (window.lucide) window.lucide.createIcons();
    }

    window.nextStory = () => {
        const group = groups[currentGroupIndex];
        if (currentStoryIndex < group.items.length - 1) {
            currentStoryIndex++;
            renderStory();
        } else {
            // Next Group
            if (currentGroupIndex < groups.length - 1) {
                currentGroupIndex++;
                currentStoryIndex = 0;
                renderStory();
            } else {
                closeStoryViewer();
            }
        }
    };

    window.prevStory = () => {
        if (currentStoryIndex > 0) {
            currentStoryIndex--;
            renderStory();
        } else {
            // Previous Group
            if (currentGroupIndex > 0) {
                currentGroupIndex--;
                currentStoryIndex = 0; // Should ideally be last item of prev group, but start is fine for MVP
                renderStory();
            }
        }
    };

    window.closeStoryViewer = () => {
        clearTimeout(window.storyTimer);
        document.body.classList.remove('story-view-active');
        modal.remove();
    };

    renderStory();
}
