/**
 * URL Helpers
 * Utility functions for URL manipulation
 */

/**
 * Get query parameter from URL
 * @param {string} key - Parameter name
 * @returns {string|null} Parameter value
 */
export function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

/**
 * Set query parameter in URL
 * @param {string} key - Parameter name
 * @param {string} value - Parameter value
 */
export function setQueryParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

/**
 * Build URL with parameters
 * @param {string} path - Base path
 * @param {Object} params - Parameters object
 * @returns {string} Complete URL
 */
export function buildUrl(path, params = {}) {
    const url = new URL(path, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    return url.toString();
}

/**
 * Normalize WhatsApp number to international format (Egypt)
 * @param {string} number - Phone number
 * @returns {string} Normalized number with country code
 */
export function normalizeWhatsAppNumber(number) {
    let waNumber = number.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
        waNumber = '20' + waNumber.substring(1);
    } else if (!waNumber.startsWith('20')) {
        waNumber = '20' + waNumber;
    }
    return waNumber;
}
