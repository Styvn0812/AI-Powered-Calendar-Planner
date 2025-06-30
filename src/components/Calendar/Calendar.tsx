import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday, isSameMonth, startOfWeek, addDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useGoogleCalendar } from '../../context/GoogleCalendarContext';
import { EventList } from './EventList';
import { EventForm } from './EventForm';


export const Calendar: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    getEventsForDate
  } = useCalendar();
  const { events: googleEvents, refreshEvents, isLoading } = useGoogleCalendar();
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    refreshEvents(currentMonth);
  }, [currentMonth, refreshEvents]);

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-500 text-sm py-2">
          {format(addDays(startDate, i), dateFormat).substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfWeek(currentMonth);
    const rows = [];
    let days = [];
    let day = monthStart;
    let formattedDate = '';

    for (let i = 0; i < 42; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = new Date(day);
      cloneDay.setHours(0, 0, 0, 0);
      const eventsForDay = getEventsForDate(cloneDay);
      console.log('Tile', cloneDay.toISOString(), 'eventsForDay:', eventsForDay);
      const googleEventsForDay = googleEvents.filter(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date || '');
        return isSameMonth(eventDate, day) && eventDate.getDate() === day.getDate();
      });
      const hasEvents = eventsForDay.length > 0 || googleEventsForDay.length > 0;

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[80px] border border-gray-200 p-1 ${
            !isSameMonth(day, currentMonth)
              ? 'bg-gray-50 text-gray-400'
              : isToday(day)
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white'
          } ${
            isSameMonth(day, currentMonth) &&
            day.getDate() === selectedDate.getDate() &&
            day.getMonth() === selectedDate.getMonth()
              ? 'ring-2 ring-blue-500'
              : ''
          }`}
          onClick={() => onDateClick(cloneDay)}
        >
          <div className="flex justify-between">
            <span className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
              {formattedDate}
            </span>
            {isSameMonth(day, currentMonth) && (
              <div className="flex space-x-1">
                {hasEvents && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
            )}
          </div>
          {hasEvents && (
            <div className="mt-1">
              {[...eventsForDay, ...googleEventsForDay].slice(0, 2).map((event: any) => (
                <div
                  key={event.id}
                  className={`text-xs truncate px-1 py-0.5 rounded mb-1 ${
                    event.color || 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {event.time && <span className="font-semibold">{event.time} · </span>}
                  <span>{event.title || event.summary}</span>
                </div>
              ))}
              {eventsForDay.length + googleEventsForDay.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{eventsForDay.length + googleEventsForDay.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div key={day.toString()} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
      day = addDays(day, 1);
    }
    return <div className="flex-1">{rows}</div>;
  };

  return (
    <div className="flex h-full">
      {/* Calendar Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
          <button
            onClick={() => setShowEventForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      {/* Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <EventList />
      </div>
      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <EventForm onClose={() => setShowEventForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};