/**
 * Categories State Manager
 * Manages local state for categories with optimistic updates
 */

class CategoriesState {
    constructor() {
        this.allCategories = [];
        this.editingCategoryId = null;
        this.isSaving = false;
        this.loadingIndicator = 0;
    }

    /**
     * Set categories
     */
    setCategories(categories) {
        this.allCategories = categories;
    }

    /**
     * Get all categories
     */
    getCategories() {
        return this.allCategories;
    }

    /**
     * Find category by ID
     */
    findCategory(catId) {
        return this.allCategories.find(c => c.id === catId);
    }

    /**
     * Update category locally (optimistic)
     */
    updateCategory(catId, updatedData) {
        const index = this.allCategories.findIndex(c => c.id === catId);
        if (index !== -1) {
            this.allCategories[index] = {
                ...this.allCategories[index],
                ...updatedData
            };
        }
    }

    /**
     * Add category locally (optimistic)
     */
    addCategory(categoryData) {
        const newCategory = {
            ...categoryData,
            label: categoryData.name_ar,
            subs: categoryData.subs || []
        };
        this.allCategories.unshift(newCategory);
    }

    /**
     * Remove category locally (optimistic)
     */
    removeCategory(catId) {
        this.allCategories = this.allCategories.filter(c => c.id !== catId);
    }

    /**
     * Update subcategory
     */
    updateSubcategory(catId, subId, action, subData = null) {
        const category = this.findCategory(catId);
        if (!category) return;

        if (!category.subs) category.subs = [];

        if (action === 'add' && subData) {
            category.subs.unshift(subData);
        } else if (action === 'remove') {
            category.subs = category.subs.filter(s => s.id !== subId);
        }
    }

    /**
     * Set editing category ID
     */
    setEditingId(catId) {
        this.editingCategoryId = catId;
    }

    /**
     * Get editing category ID
     */
    getEditingId() {
        return this.editingCategoryId;
    }

    /**
     * Set saving state
     */
    setSaving(isSaving) {
        this.isSaving = isSaving;
    }

    /**
     * Check if saving
     */
    isSavingNow() {
        return this.isSaving;
    }

    /**
     * Increment loading indicator
     */
    startLoading() {
        this.loadingIndicator++;
    }

    /**
     * Decrement loading indicator
     */
    stopLoading() {
        this.loadingIndicator--;
    }

    /**
     * Check if loading
     */
    isLoading() {
        return this.loadingIndicator > 0;
    }
}

// Export singleton instance
export const categoriesState = new CategoriesState();
