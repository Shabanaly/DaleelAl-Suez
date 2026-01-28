/**
 * Places Data Manager
 * Wrapper around global PlacesService for consistent async handling
 */

/**
 * Fetch all places
 * @returns {Promise<Array>}
 */
export async function getAllPlaces() {
    // PlacesService is global from common/services/admin/places.service.js
    if (typeof PlacesService === 'undefined') {
        throw new Error('PlacesService not loaded');
    }
    return await PlacesService.getAll();
}

/**
 * Update place status
 * @param {string} id 
 * @param {object} updates 
 */
export async function updatePlace(id, updates) {
    return await PlacesService.update(id, updates);
}

/**
 * Delete place
 * @param {string} id 
 */
export async function deletePlace(id) {
    return await PlacesService.delete(id);
}
