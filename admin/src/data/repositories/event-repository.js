/**
 * @file: src/data/repositories/event-repository.js
 * @layer: Data Layer
 * @responsibility: Handle database interactions for the 'events' table.
 */

const EventRepository = {
    
    /**
     * Fetch all events ordered by start_time descending
     */
    async getAll() {
        try {
            const { data, error } = await window.AppSupabase.get()
                .from('events')
                .select('*')
                .order('start_time', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('EventRepository.getAll Error:', error);
            throw error;
        }
    },

    /**
     * Get single event by ID
     */
    async getById(id) {
        try {
            const { data, error } = await window.AppSupabase.get()
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('EventRepository.getById Error:', error);
            throw error;
        }
    },

    /**
     * Create a new event
     */
    async create(eventData) {
        try {
            // Ensure ID is generated if not provided (though DB usually handles it, 
            // the schema said ID is uuid not null, but didn't explicitly say default gen_random_uuid() 
            // for the events table in the user prompt snippet? 
            // Wait, looking back at user request:
            // "create table public.events ( id uuid not null, ... )"
            // It does NOT say default gen_random_uuid(). 
            // So we MUST generate it here or let Supabase handle it if configured.
            // Best practice: Let DB handle if possible, but if schema is strict, we might need crypto.randomUUID().
            // Ideally we'd alter table to add default, but I can generate it here safely.
            
            if (!eventData.id) {
                eventData.id = crypto.randomUUID();
            }

            const { data, error } = await window.AppSupabase.get()
                .from('events')
                .insert([eventData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('EventRepository.create Error:', error);
            throw error;
        }
    },

    /**
     * Update an existing event
     */
    async update(id, eventData) {
        try {
            const { data, error } = await window.AppSupabase.get()
                .from('events')
                .update(eventData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('EventRepository.update Error:', error);
            throw error;
        }
    },

    /**
     * Delete an event
     */
    async delete(id) {
        try {
            const { error } = await window.AppSupabase.get()
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('EventRepository.delete Error:', error);
            throw error;
        }
    }
};

window.EventRepository = EventRepository;
