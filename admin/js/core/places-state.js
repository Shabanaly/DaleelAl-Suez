/**
 * Places State Management
 * centralised store for places data and filter state
 */

const state = {
    places: [],
    selectedCategoryId: '',
    isLoading: false
};

export const placesState = {
    getPlaces: () => state.places,
    setPlaces: (places) => { state.places = places; },
    
    getSelectedCategory: () => state.selectedCategoryId,
    setSelectedCategory: (id) => { state.selectedCategoryId = id; },
    
    isLoading: () => state.isLoading,
    setLoading: (loading) => { state.isLoading = loading; },
    
    // Find a place by ID
    findPlace: (id) => state.places.find(p => p.id === id),
    
    // Update local place data
    updatePlace: (id, updates) => {
        const place = state.places.find(p => p.id === id);
        if (place) {
            Object.assign(place, updates);
        }
    },
    
    // Remove place
    removePlace: (id) => {
        state.places = state.places.filter(p => p.id !== id);
    }
};
