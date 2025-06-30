import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { useUser } from '@clerk/clerk-react';
import { calendarService, CalendarEvent } from '../services/supabase';

export interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  time?: string;
  color?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
}

interface CalendarContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  getDaysInMonth: () => Date[];
  getEventsForDate: (date: Date) => Event[];
  loading: boolean;
  error: string | null;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load events from Supabase when user changes
  useEffect(() => {
    if (user?.id) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [user?.id]);

  const loadEvents = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const supabaseEvents = await calendarService.getEvents(user.id);
      
      // Convert Supabase events to our Event format
      const convertedEvents: Event[] = supabaseEvents.map((supabaseEvent: CalendarEvent) => ({
        id: supabaseEvent.id!,
        title: supabaseEvent.title,
        date: parseISO(supabaseEvent.start_time),
        description: supabaseEvent.description,
        time: new Date(supabaseEvent.start_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        color: supabaseEvent.color || 'bg-blue-500',
        location: supabaseEvent.location,
        start_time: supabaseEvent.start_time,
        end_time: supabaseEvent.end_time
      }));
      
      setEvents(convertedEvents);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      const newSupabaseEvent: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        title: event.title,
        description: event.description,
        start_time: event.start_time || event.date.toISOString(),
        end_time: event.end_time || addDays(event.date, 1).toISOString(),
        location: event.location,
        color: event.color
      };

      const createdEvent = await calendarService.createEvent(newSupabaseEvent);
      
      const newEvent: Event = {
        id: createdEvent.id!,
        title: createdEvent.title,
        date: parseISO(createdEvent.start_time),
        description: createdEvent.description,
        time: new Date(createdEvent.start_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        color: createdEvent.color || 'bg-blue-500',
        location: createdEvent.location,
        start_time: createdEvent.start_time,
        end_time: createdEvent.end_time
      };

      setEvents([...events, newEvent]);
      setError(null);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event');
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<Omit<Event, 'id'>>) => {
    try {
      const updates: Partial<CalendarEvent> = {};
      
      if (updatedEvent.title) updates.title = updatedEvent.title;
      if (updatedEvent.description) updates.description = updatedEvent.description;
      if (updatedEvent.start_time) updates.start_time = updatedEvent.start_time;
      if (updatedEvent.end_time) updates.end_time = updatedEvent.end_time;
      if (updatedEvent.location) updates.location = updatedEvent.location;
      if (updatedEvent.color) updates.color = updatedEvent.color;

      await calendarService.updateEvent(id, updates);
      
      setEvents(events.map(event => event.id === id ? {
        ...event,
        ...updatedEvent
      } : event));
      
      setError(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <CalendarContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      selectedDate,
      setSelectedDate,
      currentMonth,
      setCurrentMonth,
      getDaysInMonth,
      getEventsForDate,
      loading,
      error
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};