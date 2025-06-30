import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our calendar events
export interface CalendarEvent {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

// Database operations
export const calendarService = {
  // Get all events for a user
  async getEvents(userId: string): Promise<CalendarEvent[]> {
    console.log('Fetching events for user:', userId);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Fetched events:', data);
    return data || [];
  },

  // Create a new event
  async createEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent> {
    console.log('Creating event:', event);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([event])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Created event:', data);
    return data;
  },

  // Update an event
  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    console.log('Updating event:', id, updates);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Updated event:', data);
    return data;
  },

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    console.log('Deleting event:', id);
    
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Event deleted successfully');
  }
}; 