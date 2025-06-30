import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';
import { Layout } from './components/Layout';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* Main app route (wrap with providers) */}
        <Route path="/app/*" element={
          <GoogleCalendarProvider>
            <CalendarProvider>
              <ChatProvider>
                <Layout />
              </ChatProvider>
            </CalendarProvider>
          </GoogleCalendarProvider>
        } />
        {/* Default route: redirect to sign-in */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  );
}

export default App;