import { CalendarProvider } from './context/CalendarContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';
import { ChatProvider } from './context/ChatContext';
import { Layout } from './components/Layout';

function App() {
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