import React, { useState } from 'react';
import { format } from 'date-fns';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { EventForm } from './EventForm';

export const EventList = () => {
  const {
    selectedDate,
    getEventsForDate,
    deleteEvent,
    loading,
    error
  } = useCalendar();
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  
  const events = getEventsForDate(selectedDate);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setDeletingEvent(id);
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error('Error deleting event:', err);
      } finally {
        setDeletingEvent(null);
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No events scheduled for today
        </p>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="p-3 border border-gray-200 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditingEvent(event.id)} 
                    className="text-gray-400 hover:text-gray-600"
                    disabled={deletingEvent === event.id}
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)} 
                    className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                    disabled={deletingEvent === event.id}
                  >
                    {deletingEvent === event.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {event.time && (
                <div className="text-sm text-gray-500 mt-1">{event.time}</div>
              )}
              {event.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <EventForm eventId={editingEvent} onClose={() => setEditingEvent(null)} />
          </div>
        </div>
      )}
    </div>
  );
};