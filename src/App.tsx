import React, { useState } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';
import { Layout } from './components/Layout';
import GoogleSignIn from './components/GoogleSignIn';

function App() {
  const [googleUser, setGoogleUser] = useState<any | null>(null);

  return (
    <GoogleCalendarProvider>
      <CalendarProvider>
        <ChatProvider>
          {/* Google Sign-In always visible at the top */}
          <div className="fixed top-0 left-0 w-full z-50 bg-white/80 flex justify-center py-2 shadow">
            <GoogleSignIn onSignIn={setGoogleUser} />
          </div>
          {/* Main app UI, blurred/disabled if not signed in */}
          <div className={googleUser ? '' : 'pointer-events-none blur-sm select-none opacity-60'} style={{ marginTop: 60 }}>
            <Layout />
          </div>
        </ChatProvider>
      </CalendarProvider>
    </GoogleCalendarProvider>
  );
}

export default App;