/**
 * @file: src/data/infrastructure/services/translation-service.js
 * @layer: Infrastructure Layer
 * @responsibility: Handle text translation.
 */

const TranslationService = {
    async translateArToEn(text) {
        if (!text) return '';
        
        try {
            // Attempt to use a free API (MyMemory) - purely client side
            // LIMITATION: Rate limits apply. For prod, use Google Cloud / Azure.
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`);
            const data = await res.json();
            
            if (data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
        } catch (e) {
            console.warn("Translation failed", e);
        }

        return text; // Fallback
    }
};

window.TranslationService = TranslationService;
