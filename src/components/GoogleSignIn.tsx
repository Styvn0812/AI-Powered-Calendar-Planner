import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// Use 'any' for GoogleUser to avoid TypeScript errors with gapi
const GoogleSignIn: React.FC<{ onSignIn: (user: any) => void }> = ({ onSignIn }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    function start() {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleSignIn = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      setIsSignedIn(true);
      setUser(googleUser);
      onSignIn(googleUser);
    } catch (error) {
      alert('Sign-in failed.');
    }
  };

  if (isSignedIn && user) {
    return (
      <div className="flex flex-col items-center mt-8">
        <p>Signed in as {user.getBasicProfile().getEmail()}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleSignIn; 