/**
 * @file: src/data/repositories/category-repository.js
 * @layer: Data Layer
 * @responsibility: CRUD operations for Categories.
 */

const CategoryRepository = {
    async getAll() {
        const client = window.AppSupabase.get();
        const { data, error } = await client
            .from('categories')
            .select('*')
            .order('id');
        
        if (error) throw error;
        return data || [];
    },

    async create(data) {
        const client = window.AppSupabase.get();
        const { data: newCat, error } = await client
            .from('categories')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return newCat;
    },

    async update(id, data) {
        const client = window.AppSupabase.get();
        const { data: updated, error } = await client
            .from('categories')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },

    async delete(id) {
        const client = window.AppSupabase.get();
        const { error } = await client
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

};

window.CategoryRepository = CategoryRepository;
