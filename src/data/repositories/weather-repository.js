/**
 * Weather Repository
 * Handles external API calls for weather data
 */
window.WeatherRepository = {
    async getWeather(lat, long) {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`);
            if (!res.ok) throw new Error("Weather API failed");
            return await res.json();
        } catch (error) {
            console.error("Weather Repo Error:", error);
            throw error;
        }
    }
};
