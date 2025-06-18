import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { googleCalendarService, GoogleCalendarEvent } from '../services/googleCalendar';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface GoogleCalendarContextType {
  events: GoogleCalendarEvent[];
  isLoading: boolean;
  error: Error | null;
  refreshEvents: (date: Date) => Promise<void>;
  createEvent: (event: Omit<GoogleCalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, event: Partial<GoogleCalendarEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextType | undefined>(undefined);

export const GoogleCalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simplified initialization - no async calls that could fail
  useEffect(() => {
    console.log('GoogleCalendarProvider initialized');
  }, []);

  const refreshEvents = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const timeMin = format(startOfMonth(date), "yyyy-MM-dd'T'HH:mm:ssXXX");
      const timeMax = format(endOfMonth(date), "yyyy-MM-dd'T'HH:mm:ssXXX");
      const fetchedEvents = await googleCalendarService.listEvents(timeMin, timeMax);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error refreshing events:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (event: Omit<GoogleCalendarEvent, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await googleCalendarService.createEvent(event);
      // Refresh events after creating a new one
      await refreshEvents(new Date(event.start.dateTime || event.start.date || ''));
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err : new Error('Failed to create event'));
    } finally {
      setIsLoading(false);
    }
  }, [refreshEvents]);

  const updateEvent = useCallback(async (eventId: string, event: Partial<GoogleCalendarEvent>) => {
    setIsLoading(true);
    setError(null);
    try {
      await googleCalendarService.updateEvent(eventId, event);
      // Refresh events after updating
      const updatedEvent = events.find(e => e.id === eventId);
      if (updatedEvent) {
        await refreshEvents(new Date(updatedEvent.start.dateTime || updatedEvent.start.date || ''));
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err instanceof Error ? err : new Error('Failed to update event'));
    } finally {
      setIsLoading(false);
    }
  }, [events, refreshEvents]);

  const deleteEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await googleCalendarService.deleteEvent(eventId);
      // Remove the deleted event from the state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete event'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <GoogleCalendarContext.Provider
      value={{
        events,
        isLoading,
        error,
        refreshEvents,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </GoogleCalendarContext.Provider>
  );
};

export const useGoogleCalendar = () => {
  const context = useContext(GoogleCalendarContext);
  if (context === undefined) {
    throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider');
  }
  return context;
}; 