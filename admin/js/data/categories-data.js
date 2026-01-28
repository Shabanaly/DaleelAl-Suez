/**
 * Categories Data Manager
 * Handles all API calls for categories and subcategories
 */

/**
 * Get all categories from API
 * @returns {Promise<Array>} Categories array
 */
export async function getAllCategories() {
    return await window.CategoriesService.getAll();
}

/**
 * Create new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(categoryData) {
    return await window.CategoriesService.create(categoryData);
}

/**
 * Update category
 * @param {string} catId - Category ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(catId, updates) {
    return await window.CategoriesService.update(catId, updates);
}

/**
 * Delete category
 * @param {string} catId - Category ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(catId) {
    return await window.CategoriesService.delete(catId);
}

/**
 * Create subcategory
 * @param {Object} subData - Subcategory data
 * @returns {Promise<Object>} Created subcategory
 */
export async function createSubcategory(subData) {
    return await window.CategoriesService.createSub(subData);
}

/**
 * Delete subcategory
 * @param {string} subId - Subcategory ID
 * @returns {Promise<void>}
 */
export async function deleteSubcategory(subId) {
    return await window.CategoriesService.deleteSub(subId);
}
