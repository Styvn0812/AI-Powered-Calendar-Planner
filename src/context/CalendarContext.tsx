import React, { useState, createContext, useContext } from 'react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
export interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  time?: string;
  color?: string;
}
interface CalendarContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  getDaysInMonth: () => Date[];
  getEventsForDate: (date: Date) => Event[];
}
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);
export const CalendarProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [events, setEvents] = useState<Event[]>([{
    id: '1',
    title: 'Team Meeting',
    date: new Date(),
    time: '10:00 AM',
    description: 'Weekly team sync meeting',
    color: 'bg-blue-500'
  }, {
    id: '2',
    title: 'Lunch with Client',
    date: addDays(new Date(), 2),
    time: '12:30 PM',
    description: 'Discuss project requirements',
    color: 'bg-green-500'
  }, {
    id: '3',
    title: 'Project Deadline',
    date: addDays(new Date(), 5),
    time: '5:00 PM',
    description: 'Submit final deliverables',
    color: 'bg-red-500'
  }]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substring(2, 9)
    };
    setEvents([...events, newEvent]);
  };
  const updateEvent = (id: string, updatedEvent: Partial<Omit<Event, 'id'>>) => {
    setEvents(events.map(event => event.id === id ? {
      ...event,
      ...updatedEvent
    } : event));
  };
  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({
      start,
      end
    });
  };
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };
  return <CalendarContext.Provider value={{
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    getDaysInMonth,
    getEventsForDate
  }}>
      {children}
    </CalendarContext.Provider>;
};
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};