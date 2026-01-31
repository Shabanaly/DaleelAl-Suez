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
    try {
        // Try Supabase First
        const { data, error } = await window.sb
            .from('stories')
            .select('*, places(name_ar, logo_url)')
            .gt('expires_at', new Date().toISOString());

        if (data && data.length > 0) {
            return data.map(s => ({
                id: s.id,
                media: s.media_url,
                caption: s.caption,
                place_name: s.places?.name_ar || 'مكان',
                place_logo: s.places?.logo_url,
                seen: false
            }));
        }
    } catch (e) {
        console.warn("Stories table not found or empty, using mock.");
    }

    // Fallback Mock Data for Demo
    return [
        { id: 1, media: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80', caption: 'عرض خاص النهاردة! 🍔', place_name: 'برجر كينج', seen: false },
        { id: 2, media: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', caption: 'قهوتك علينا ☕', place_name: 'كوستا', seen: false }
    ];
}

// Viewer Logic (Simple Overlay)
function openStoryViewer(index) {
    const stories = window.currentStories;
    let currentIndex = index;

    // Create or Get Modal
    let modal = document.getElementById('story-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'story-modal';
        modal.className = 'story-modal';
        document.body.appendChild(modal);
    }

    function renderStory() {
        if (currentIndex >= stories.length) {
            closeStoryViewer();
            return;
        }
        const s = stories[currentIndex];
        modal.innerHTML = `
            <div class="story-progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="story-header">
                <img src="${s.place_logo || 'assets/images/logo-placeholder.png'}">
                <span>${s.place_name}</span>
                <button onclick="closeStoryViewer()" class="close-story">✕</button>
            </div>
            <div class="story-media" style="background-image: url('${s.media}')">
                <div class="story-caption">${s.caption}</div>
            </div>
            <div class="story-nav left" onclick="prevStory()"></div>
            <div class="story-nav right" onclick="nextStory()"></div>
        `;

        // Animate Progress
        setTimeout(() => {
            const fill = modal.querySelector('.progress-fill');
            if(fill) fill.style.width = '100%';
        }, 50);

        // Auto Advance
        window.storyTimer = setTimeout(() => {
            nextStory();
        }, 5000);
    }

    window.nextStory = () => {
        clearTimeout(window.storyTimer);
        currentIndex++;
        renderStory();
    };

    window.prevStory = () => {
        clearTimeout(window.storyTimer);
        if (currentIndex > 0) {
            currentIndex--;
            renderStory();
        }
    };

    window.closeStoryViewer = () => {
        clearTimeout(window.storyTimer);
        modal.remove();
    };

    renderStory();
}
