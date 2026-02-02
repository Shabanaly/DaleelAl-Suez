/**
 * @file: src/business/services/category-service.js
 * @layer: Business Logic Layer
 * @responsibility: Category logic.
 */

const AppCategoryService = {
    
    async getAllCategories() {
        const cats = await window.CategoryRepository.getAll();
        // Transformation for UI if needed (e.g. label = name_ar)
        return cats.map(c => ({
            ...c,
            label: c.name_ar 
        }));
    },

    async createCategory(nameAr, nameEn, id = null) {
        if (!nameAr) throw new Error("اسم القسم (عربي) مطلوب");
        
        const payload = {
            name_ar: nameAr,
            name_en: nameEn || nameAr
        };
        if (id) payload.id = id;

        return await window.CategoryRepository.create(payload);
    },

    async updateCategory(id, nameAr, nameEn) {
        if (!nameAr) throw new Error("اسم القسم (عربي) مطلوب");

        return await window.CategoryRepository.update(id, {
            name_ar: nameAr,
            name_en: nameEn
        });
    },

    async deleteCategory(id) {
        return await window.CategoryRepository.delete(id);
    }
};

window.AppCategoryService = AppCategoryService;
