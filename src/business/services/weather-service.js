/**
 * Weather Service
 * Business logic for Weather Widget
 */
window.WeatherService = {
    SUEZ_COORDS: { lat: 29.97, long: 32.53 },

    async getCurrentWeather() {
        try {
            if (!window.WeatherRepository) throw new Error("WeatherRepository not found");
            
            const data = await window.WeatherRepository.getWeather(this.SUEZ_COORDS.lat, this.SUEZ_COORDS.long);
            
            if (data && data.current_weather) {
                return {
                    temp: Math.round(data.current_weather.temperature),
                    isDay: data.current_weather.is_day === 1
                };
            }
            return null;
        } catch (error) {
            console.warn("WeatherService Error:", error);
            throw error;
        }
    }
};
