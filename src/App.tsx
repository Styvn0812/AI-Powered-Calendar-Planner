import React from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { CalendarProvider } from './context/CalendarContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';

function App() {
  return (
    <GoogleCalendarProvider>
      <CalendarProvider>
        <div className="h-screen bg-gray-50">
          <Calendar />
        </div>
      </CalendarProvider>
    </GoogleCalendarProvider>
  );
}

export default App;