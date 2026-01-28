/**
 * Translation Service
 * Handles text translation from Arabic to English
 */
const TranslationService = {
    /**
     * Translate Arabic text to English
     * @param {string} text - Text to translate
     * @returns {Promise<string>} Translated text
     */
    translateArToEn: async (text) => {
        if (!text) return '';
        
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            
            // data[0][0][0] contains the translated text
            return data[0][0][0];
        } catch (error) {
            console.error('Translation failed:', error);
            return ''; // Return empty string on failure or handle as needed
        }
    }
};

window.TranslationService = TranslationService;
