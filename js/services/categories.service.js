const UserCategoriesService = {
    getAll: async () => {
        if (!window.sb) return [];
        
        const { data, error } = await window.sb
            .from('categories')
            .select('*')
            .order('id');
        
        if (error) {
            console.error("Cats Fetch Error:", error);
            return [];
        }
        return data;
    }
};
window.UserCategoriesService = UserCategoriesService;
