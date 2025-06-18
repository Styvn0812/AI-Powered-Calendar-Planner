import React from 'react';
import { Layout } from './components/Layout';
import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
export function App() {
  return <CalendarProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </CalendarProvider>;
}