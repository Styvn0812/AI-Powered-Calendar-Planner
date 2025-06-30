import React from 'react';

interface SignInProps {
  onSwitchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">AI Calendar Planner</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to access your smart calendar</p>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition-colors"
          >
            Sign in
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToSignUp} className="text-indigo-600 hover:underline focus:outline-none">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default SignIn; 