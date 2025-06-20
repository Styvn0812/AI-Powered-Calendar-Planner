import React, { useState } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';
import { Layout } from './components/Layout';
import GoogleSignIn from './components/GoogleSignIn';

function App() {
  const [googleUser, setGoogleUser] = useState<any | null>(null);

  if (!googleUser) {
    return <GoogleSignIn onSignIn={setGoogleUser} />;
  }

  return (
    <GoogleCalendarProvider>
      <CalendarProvider>
        <ChatProvider>
          <Layout />
        </ChatProvider>
      </CalendarProvider>
    </GoogleCalendarProvider>
  );
}

export default App;