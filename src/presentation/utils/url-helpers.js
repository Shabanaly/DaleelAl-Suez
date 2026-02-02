/**
 * URL Helpers
 */
window.URLHelpers = {
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
};

// Global shorthand
window.getQueryParam = window.URLHelpers.getQueryParam;

/**
 * Normalize WhatsApp number to international format (Egypt)
 */
window.normalizeWhatsAppNumber = function(number) {
    if (!number) return '';
    let waNumber = number.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
        waNumber = '20' + waNumber.substring(1);
    } else if (!waNumber.startsWith('20')) {
        waNumber = '20' + waNumber;
    }
    return waNumber;
};
