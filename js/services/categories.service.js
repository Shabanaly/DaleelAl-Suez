// User Categories Service
const UserCategoriesService = {
    getAll: async () => {
        const { data, error } = await window.sb
            .from('categories')
            .select('*')
            .order('id');
        
        if (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
        return data;
    }
};
window.UserCategoriesService = UserCategoriesService;
