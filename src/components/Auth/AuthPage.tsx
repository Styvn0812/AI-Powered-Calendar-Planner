import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  return mode === 'signIn' ? (
    <SignIn onSwitchToSignUp={() => setMode('signUp')} />
  ) : (
    <SignUp onSwitchToSignIn={() => setMode('signIn')} />
  );
};

export default AuthPage; 