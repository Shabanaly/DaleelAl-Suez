/**
 * Place Details Page Controller
 * Orchestrates place details page initialization
 */

import { renderPlaceDetails } from '../renderers/place/place-details-renderer.js';
import { getQueryParam } from '../utils/url-helpers.js';

/**
 * Initialize place details page
 */
export async function initPlacePage() {
    const placeId = getQueryParam('id');
    if (placeId && window.UserPlacesService) {
        await renderPlaceDetails(placeId);
    }
}
