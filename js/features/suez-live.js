/**
 * Suez Live Widget Feature
 * Displays Weather and 'Open Now' Status
 */

export async function initSuezLive(widgetId) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;

    // Setup basic state while loading
    updateUI(widget, { temp: '--', status: 'جاري التحميل...' });

    try {
        // Parallel data fetching could go here
        // For now, simulate weather fetch logic
        await fetchWeather(widget);
    } catch (e) {
        console.error("Live Widget Error:", e);
        updateUI(widget, { temp: '25', status: 'Suez' }); // Fallback
    }
}

async function fetchWeather(widget) {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.97&longitude=32.53&current_weather=true');
        const data = await res.json();
        
        if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const isDay = data.current_weather.is_day === 1;
            
            updateUI(widget, {
                temp: temp,
                label: 'الجو بالسويس',
                icon: isDay ? '☀️' : '🌙'
            });
        }
    } catch (e) {
        throw e;
    }
}

function updateUI(widget, data) {
    // Update DOM cleanly
    // Ideally we would use specific IDs, but for simplicity/speed we rebuild inner HTML or specific slots
    // Since this is a dedicated widget, innerHTML is acceptable if verified safe
    
    widget.innerHTML = `
        <div class="live-stat">
            <div class="live-val">${data.temp}°C</div>
            <div class="live-lbl">${data.label || 'الطقس'} ${data.icon || ''}</div>
        </div>
        <div class="live-stat">
            <div class="live-val" style="color: #22c55e;">مفتوح</div>
            <div class="live-lbl">أماكن تعمل الآن</div>
        </div>
    `;
}
