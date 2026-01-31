/**
 * Events Widget Feature
 * Displays upcoming events in Suez
 */

export async function initEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const events = await fetchEvents();

    if (events.length === 0) {
        document.querySelector('.events-section').style.display = 'none';
        return;
    }

    const cardHTML = events.map(event => `
        <div class="event-card">
            <div class="event-date">
                <span class="day">${event.day}</span>
                <span class="month">${event.month}</span>
            </div>
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <div class="event-meta">
                    <span>📍 ${event.location}</span>
                    <span>⏰ ${event.time}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Render Cards
    container.innerHTML = cardHTML;

    // Auto-Scroll Logic (Card by Card with Pause)
    if (container && events.length > 1) {
        
        let intervalId;
        let direction = 1;
        
        const nextSlide = () => {
             // 1. Get accurate width including gap/margin
             const card = container.querySelector('.event-card');
             if (!card) return;
             
             // Calculate full stride distance
             // (Card Width) + (Left Margin) + (Right Margin) + (Gap if any)
             // Flex gap is on container. 
             const style = window.getComputedStyle(card);
             const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
             const width = card.offsetWidth;
             
             // Check gap
             const containerStyle = window.getComputedStyle(container);
             const gap = parseFloat(containerStyle.gap) || 0;

             const stride = width + margin + gap;
             
             const maxScroll = container.scrollWidth - container.clientWidth;
             const current = container.scrollLeft;

             // Bounce Check
             if (current >= maxScroll - 10) direction = -1;
             if (current <= 0) direction = 1;
             
             // Scroll exactly one stride
             // Use scrollBy for relative jump
             container.scrollBy({
                left: stride * direction,
                behavior: 'smooth'
             });
        };

        // Start Interval (3 seconds pause)
        intervalId = setInterval(nextSlide, 3000);

        // Pause on User Interaction
        const stop = () => clearInterval(intervalId);
        const start = () => {
             clearInterval(intervalId);
             intervalId = setInterval(nextSlide, 3000);
        };

        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
        container.addEventListener('touchstart', stop);
        container.addEventListener('touchend', () => setTimeout(start, 3000));
    }
}



async function fetchEvents() {
    try {
        const { data } = await window.sb
            .from('events')
            .select('*')
            .eq('is_active', true)
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })
            .limit(5);

        if (data && data.length > 0) {
            return data.map(formatEvent);
        }
    } catch (e) {
        console.warn("Events table missing, utilizing mock.");
    }

    // Mock Data
    return [
        {
            title: "افتتاح فرع بافلو برجر",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
            start_time: new Date(Date.now() + 86400000).toISOString(),
            location_name: "شارع الجيش"
        },
        {
            title: "حفلة مسار إجباري",
            image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
            start_time: new Date(Date.now() + 172800000).toISOString(),
            location_name: "النادي الاجتماعي"
        }
    ].map(formatEvent);
}

function formatEvent(e) {
    const d = new Date(e.start_time);
    return {
        title: e.title,
        image: e.image_url || e.image || 'assets/images/placeholder.jpg',
        location: e.location_name,
        month: d.toLocaleDateString('ar-EG', { month: 'short' }),
        day: d.getDate(),
        time: d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
}
