import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { format, isBefore, startOfDay } from 'date-fns';

interface EventFormProps {
  eventId?: string;
  onClose: () => void;
}

export const EventForm = ({
  eventId,
  onClose
}: EventFormProps) => {
  const {
    addEvent,
    updateEvent,
    events,
    selectedDate,
    loading,
    error
  } = useCalendar();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const [dateError, setDateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = format(new Date(), 'yyyy-MM-dd');

  // If editing an existing event, populate the form
  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setTitle(event.title);
        setDate(format(new Date(event.date), 'yyyy-MM-dd'));
        setTime(event.time || '');
        setDescription(event.description || '');
        setColor(event.color || 'bg-blue-500');
      }
    } else {
      // For new events, default to selected date (but ensure it's not in the past)
      const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
      const todayFormatted = format(new Date(), 'yyyy-MM-dd');
      
      if (selectedDateFormatted < todayFormatted) {
        setDate(todayFormatted);
        setDateError('Cannot create events in the past. Date set to today.');
      } else {
        setDate(selectedDateFormatted);
      }
    }
  }, [eventId, events, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (selectedDate < today) {
      setDateError('Cannot create events in the past. Please select today or a future date.');
      setDate(today);
    } else {
      setDateError('');
      setDate(selectedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const selectedDateObj = new Date(date);
    const today = startOfDay(new Date());
    
    if (isBefore(selectedDateObj, today)) {
      setDateError('Cannot create events in the past. Please select today or a future date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        title,
        date: new Date(date),
        time,
        description,
        color
      };
      
      if (eventId) {
        await updateEvent(eventId, eventData);
      } else {
        await addEvent(eventData);
      }
      
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      // Error is already handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = [{
    value: 'bg-blue-500',
    label: 'Blue',
    textColor: 'text-blue-500'
  }, {
    value: 'bg-green-500',
    label: 'Green',
    textColor: 'text-green-500'
  }, {
    value: 'bg-red-500',
    label: 'Red',
    textColor: 'text-red-500'
  }, {
    value: 'bg-yellow-500',
    label: 'Yellow',
    textColor: 'text-yellow-500'
  }, {
    value: 'bg-purple-500',
    label: 'Purple',
    textColor: 'text-purple-500'
  }];

  return (
    <div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {eventId ? 'Edit Event' : 'Add New Event'}
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={handleDateChange}
            min={today}
            required 
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
              dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`} 
          />
          {dateError && (
            <p className="text-red-500 text-sm mt-1">{dateError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time (optional)
          </label>
          <input 
            type="text" 
            value={time} 
            onChange={e => setTime(e.target.value)} 
            placeholder="e.g. 3:30 PM" 
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={3} 
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex space-x-2">
            {colorOptions.map(option => (
              <button 
                key={option.value} 
                type="button" 
                onClick={() => setColor(option.value)} 
                disabled={isSubmitting}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === option.value ? 'border-gray-900' : 'border-transparent'
                } disabled:opacity-50`}
              >
                <div className={`w-full h-full rounded-full ${option.value}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (eventId ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};