import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

const SignUp: React.FC = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const result = await signUp.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.href = '/app';
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create your account</h1>
        <p className="text-center text-gray-600 mb-6">Sign up to access your smart calendar</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Sign up
          </button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-indigo-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 