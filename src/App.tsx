import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
import { Layout } from './components/Layout';

function App() {
  return (
    <CalendarProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </CalendarProvider>
  );
}

export default App;