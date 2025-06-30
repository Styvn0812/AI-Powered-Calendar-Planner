import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { CalendarProvider } from './context/CalendarContext';
import { ChatProvider } from './context/ChatContext';
import { GoogleCalendarProvider } from './context/GoogleCalendarContext';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Clerk's prebuilt authentication pages */}
        <Route 
          path="/sign-in" 
          element={<SignIn routing="path" path="/sign-in" />} 
        />
        <Route 
          path="/sign-up" 
          element={<SignUp routing="path" path="/sign-up" />} 
        />
        
        {/* Main app route - only accessible when signed in */}
        <Route path="/app/*" element={
          <SignedIn>
            <GoogleCalendarProvider>
              <CalendarProvider>
                <ChatProvider>
                  <Layout />
                </ChatProvider>
              </CalendarProvider>
            </GoogleCalendarProvider>
          </SignedIn>
        } />
        
        {/* Root route - redirect to sign-in if not authenticated, or to app if authenticated */}
        <Route path="/" element={
          <>
            <SignedIn>
              <Navigate to="/app" replace />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        } />
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  );
}

export default App;