/**
 * Stories Feature Logic
 * Renders Instagram-like stories bar and handles viewing
 */

export async function initStories(containerId) {
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
            const placeLogo = story.places ? story.places.logo_url : 'assets/images/logo-placeholder.png';
            
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
                type: story.media_type
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
        
        // Progress Bars (Segmented)
        const progressHtml = group.items.map((_, idx) => `
            <div class="progress-segment" style="flex:1; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; margin:0 2px; overflow:hidden;">
                <div class="${idx < currentStoryIndex ? 'filled' : (idx === currentStoryIndex ? 'filling' : '')}" 
                     style="height:100%; background:#fff; width:${idx < currentStoryIndex ? '100%' : '0%'}; transition: width ${idx === currentStoryIndex ? '5s' : '0s'} linear;"></div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="story-progress-bar" style="display:flex; padding: 10px 5px;">
                ${progressHtml}
            </div>
            <div class="story-header">
                <img src="${group.place_logo || 'assets/images/logo-placeholder.png'}">
                <span>${group.place_name}</span>
                <button onclick="closeStoryViewer()" class="close-story">✕</button>
            </div>
            <div class="story-media" style="background-image: url('${s.media}')">
                <div class="story-caption" style="${s.caption ? '' : 'display:none'}">${s.caption}</div>
                ${s.link ? `<a href="${s.link}" target="_blank" class="story-cta" style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); background: white; color: black; padding: 10px 20px; border-radius: 30px; font-weight: bold; text-decoration: none;">زيارة الرابط 🔗</a>` : ''}
            </div>
            <div class="story-nav left" onclick="prevStory()"></div>
            <div class="story-nav right" onclick="nextStory()"></div>
        `;

        // Animate Current Segment
        // Small delay to allow DOM paint
        setTimeout(() => {
            const filling = modal.querySelector('.filling');
            if(filling) filling.style.width = '100%';
        }, 50);

        // Auto Advance
        clearTimeout(window.storyTimer);
        window.storyTimer = setTimeout(() => {
            nextStory();
        }, 5000);
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
        modal.remove();
    };

    renderStory();
}
